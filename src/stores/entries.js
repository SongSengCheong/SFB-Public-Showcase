import { defineStore } from "pinia";	

import { 
	getFirestore, 
	doc, 
	setDoc, 
	updateDoc,
	orderBy, 
	where,
	limit, 
	collection, 
	query, 
	getDocs, 
	startAfter
} from "firebase/firestore"

import { useUserStore } from "./user";


export const useEntriesStore = defineStore('entries', {
	state:()=>({
		db:null,
		entries:[],
		archived:[],
		lastEntry:null,//last is the snapshot of the last entry
		lastArchived:null,
	}),
	actions: {
		initEntriesStore(){
			this.db = getFirestore();
		},
		async getEntries(n){
			if (!this.uid){
				console.error('Getting Entries Failed!: No user ID. User may not be logged in.')
				return [];
			}

			if (this.entries.length>0){
				return this.entries
			}

			this.entries=[]

			var entriesRef=collection(this.db,`users/${this.uid}/entries`)

			var q = query(entriesRef, where("archived","==",false), orderBy('createdAt', 'desc'), limit(n));

			const querySnapshot = await getDocs(q);
			
			querySnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
				this.entries.push({...doc.data(), id:doc.id});

				this.lastEntry=doc;
			});

			return this.entries;
		},
		async getOlderEntries(n){
			if (!this.uid){
				console.error('Getting Older Entries Failed!: No user ID. User may not be logged in.')

				return [];
			}

			if (!this.lastEntry){
				return [];
			}

			var entriesRef=collection(this.db,`users/${this.uid}/entries`)

			var q = query(entriesRef, where("archived","==",false), orderBy('createdAt', 'desc'), limit(n), startAfter(this.lastEntry));

			const querySnapshot = await getDocs(q);
			
			querySnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
				this.entries.push({...doc.data(), id:doc.id});

				this.lastEntry=doc;
			});

			return this.entries;
		},
		async loadArchivedIfNeeded(n){
			if (!this.uid){
				console.error('Getting Archived Failed!: No user ID. User may not be logged in.')
				return [];
			}

			if(this.archived.length>0){
				return this.archived
			}

			this.archived=[]

			var entriesRef=collection(this.db,`users/${this.uid}/entries`)

			var q = query(entriesRef, where("archived","==",true), orderBy('archivedAt', 'desc'), limit(n));

			const querySnapshot = await getDocs(q);
			
			querySnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
				this.archived.push({...doc.data(), id:doc.id});

				this.lastArchived=doc;
			});

			return this.archived;
		},
		async getOlderArchived(n){
			if (!this.uid){
				console.error('Getting Older Archived Failed!: No user ID. User may not be logged in.')

				return [];
			}

			if (!this.lastArchived){
				return [];
			}

			var entriesRef=collection(this.db,`users/${this.uid}/entries`)

			var q = query(entriesRef, where("archived","==",true), orderBy('archivedAt', 'desc'), limit(n), startAfter(this.lastArchived));

			const querySnapshot = await getDocs(q);
			
			querySnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
				this.archived.push({...doc.data(), id:doc.id});

				this.lastArchived=doc;
			});

			return this.archived;
		},

		/**
		 * @param {String} entryId 
		 * @param {String} type either "read", "replied", or "flagged"
		 * @param {Boolean} new_val
		 */
		async markStatus(entryId,type,new_val){

			if (!entryId){
				console.error('markStatus: No entryId provided.');
				return false
			}

			if (!type){
				console.error('markStatus: No type provided.');
				return false
			}

			const isArchived = this.entryIsArchived(entryId);

			const i=isArchived?this.archived.findIndex(e=>e.id==entryId):this.entries.findIndex(e=>e.id==entryId);

			var old_val=isArchived? this.archived[i][type]:this.entries[i][type];

			if (old_val===new_val){
				// console.log('markStatus: No change in value.');
				return false
			}

			const entryRef=doc(this.db,`users/${this.uid}/entries/${entryId}`);
			
			try {
				await updateDoc(entryRef,{[type]:!!new_val});
			} catch (error) {
				console.error('markStatus: Error when updating Firestore doc',error);
				return false
			}
			
			if (isArchived){
				this.archived[i][type]=!!new_val;
			}else{
				this.entries[i][type]=!!new_val;
			}

			// console.log('markStatus: success',entryId,type,new_val);
			return true
		},

		async markArchive (entryId){
			if (!entryId){
				console.error('markStatus: No entryId provided.');
				return false
			}

			const isArchived=this.entryIsArchived(entryId)
			let theEntry=null;

			if (isArchived){
				theEntry=this.archived.find(e=>e.id===entryId);
			}else{
				theEntry=this.entries.find(e=>e.id===entryId);
			}

			const entryRef=doc(this.db,`users/${this.uid}/entries/${entryId}`);

			try {
				await updateDoc(entryRef,{
					archived:!isArchived,
					archivedAt:new Date()
				});
			} catch (error) {
				console.error('markArchive: Error when updating Firestore doc',error);
				return false
			}
			theEntry.archived=!isArchived;

			if (isArchived){
				this.archived=this.archived.filter(e=>e.id!=entryId);
				this.entries.push(theEntry);
				this.entries.sort((a,b)=>b.createdAt-a.createdAt);
			}else{
				this.entries=this.entries.filter(e=>e.id!=entryId);
				this.archived.push(theEntry);
				this.archived.sort((a,b)=>b.archivedAt-a.archivedAt);
			}

			return true

		},

		entryIsArchived(entryId){
			let i=this.entries.findIndex(e=>e.id===entryId)
			if (i>=0){
				return false
			}else{
				let j=this.archived.findIndex(e=>e.id===entryId)
				if (j>=0){
					return true
				}else{
					console.error('Entry ID Not Found in Entries or Archived:',entryId)
				}
			}

		},

		async saveNotes(entryId,notes){
			if (!entryId){
				console.error('saveNotes: No entryId provided.');
				return false
			}

			const i=this.entries.findIndex(e=>e.id===entryId);

			if (i<0){
				console.error('saveNotes: No entry found with id:',entryId);
				return false
			}

			const entryRef=doc(this.db,`users/${this.uid}/entries/${entryId}`);
			
			try {
				await updateDoc(entryRef,{notes:notes});
			} catch (error) {
				console.error('saveNotes: Error when updating Firestore doc',error);
				return false
			}
			
			this.entries[i].notes=notes;

			// console.log('saveNotes: success',entryId,notes);
			return true
		},
		
		getEntry(entryId){
			if (this.entryIsArchived(entryId)){
				return this.archived.find(e=>e.id===entryId)
			}else{
				return this.entries.find(e=>e.id===entryId)
			}
		},

		flush(){
			this.entries=[];
			this.archived=[];
		}
	},
	getters: {
		uid(){
			const userStore=useUserStore()
			return userStore.uid
		},
		entryWithId(id){
			if (this.entries.length<=0){
				return null
			}
			return this.entries.find(entry=>entry.id===id)
		}
	}
});