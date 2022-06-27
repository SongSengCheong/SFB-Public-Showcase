<template>
<div class="h-screen w-full">
	<div v-if="userStore.hasLoggedIn" class="h-full w-full fixed top-0 z-0 pt-12">
		<!-- actual dashboard -->

		<div class="flex flex-row h-full w-full">

			<div class="w-56 md:w-64 lg:w-80 xl:w-96 min-w-fit flex flex-col overflow-y-auto shrink-0	">
				<!-- left -->
				<div class="flex text-center">
					<button :class="[mode=='active'?'text-sky-500 font-semibold':'']" @click="mode='active'" class=" mx-1  my-1 px-2 lg:px-3 xl:px-4 py-3 hover:text-sky-700">Active</button>
					<button :class="[mode=='active'?'':'text-amber-500 font-semibold']" @click="archivedClicked" class=" mx-1  my-1 px-2 lg:px-3 xl:px-4 py-3 hover:text-amber-700">Archived</button>
				</div>
				<hr>
				<div v-if="currentEntries.length==0" class="px-2">
					<p>You don't have any entires yet.</p>
					<router-link to="/docs" class="link">Learn How to Use</router-link>
				</div>
				<div v-for="entry in currentEntries" :key="entry.id" class="w-full flex flex-row bg-white hover:bg-gray-100 duration-150 ease-in-out" :class="[entry.id==openedId?'bg-gray-200':'']">
					<div class="w-2 bg-read" v-if="!entry.read">
						<!-- read bar -->
					</div>
					<button @click="openEntry(entry.id)" class="w-full px-3 py-2 flex-grow">
						<div class="flex flex-col text-left w-full">
							<h2 :class="[entry.read?'':'text-read font-bold']" class="w-fit bg-gray-200 rounded-xl px-2">
								{{entry.topic}}
							</h2>
							<div class="flex flex-row justify-between text-center items-center w-full">
								<div>
									{{createdDateAndTime(entry.createdAt).date}}
								</div>
								<div>
									{{createdDateAndTime(entry.createdAt).time}} 
								</div>
							</div>
						</div>
					</button>
					<div class="w-2 bg-replied" v-if="entry.replied">
						<!-- replied bar -->
					</div>
					<div class="w-2 bg-flagged" v-if="entry.flagged">
						<!-- flagged bar -->
					</div>
				</div>

				<button @click="getOlderEntries" class="btn mt-2">Load More Entries</button>
			</div>

			<div class="bg-gray-100 px-2 md:px-3 lg:px-4 flex-grow pt-2 overflow-y-auto">
				<!-- right -->
				<EntryView :entry="openedEntry" />
			</div>

		</div>


	</div>


	<div v-if="!userStore.hasLoggedIn" class="h-full w-full fixed top-0 z-0 pt-28">
		<h2>You must sign in first</h2>
		<router-link :to="`/auth/signin?redirect=${$route.path}`">Sign In</router-link>
	</div>

</div>
</template>

<script>
import { useUserStore } from "../stores/user";
import { useEntriesStore } from "../stores/entries";

import EntryView from "../components/dashboard/EntryView.vue";

export default {
	setup(){
		return{
			userStore: useUserStore(),
			entriesStore: useEntriesStore()
		}
	},
	data:()=>({
		openedId:'',
		mode:'active',
	}),
	components:{
		EntryView
	},
	methods:{
		async getEntries(){
			return await this.entriesStore.getEntries(15);
		},
		async getOlderEntries(){
			if (this.mode=="active"){
				return await this.entriesStore.getOlderEntries(10);
			}
			else{
				return await this.entriesStore.getOlderArchived(10);
			}
		},
		async openEntry(id){
			this.openedId = id;
			return await this.entriesStore.markStatus(id, 'read', true);
		},
		createdDateAndTime(createdAt){
			let sec=createdAt.seconds
			let nano=createdAt.nanoseconds
			let date=new Date(sec*1000+nano/1000000)
			return {
				date: date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
				time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit'})
			}
		},
		async archivedClicked(){
			this.mode='archived'
			return await this.entriesStore.loadArchivedIfNeeded(15)
		},
	},
	async mounted(){
		if (!this.hasLoggedIn){
			return false
		}else{
			await this.getEntries();
		}
		
	},
	computed:{
		hasLoggedIn(){
			return this.userStore.hasLoggedIn;
		},
		openedEntry(){
			if (!this.openedId){
				// console.log('no opened entry id')
				return null
			}

			return this.entriesStore.getEntry(this.openedId)
		},
		currentEntries(){
			if (this.mode==='active'){
				return this.entriesStore.entries
			}else{
				return this.entriesStore.archived
			}
		}
	},
	watch:{
		hasLoggedIn( newVal ){
			if (newVal){
				this.getEntries();
			}
		}
	}
}

</script>