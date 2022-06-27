<template>
<div class="h-full min-w-fit">
	<div v-if="!entry" class="flex justify-center items-center h-full">
		<h2>
			Click on an entry to view it
		</h2>
	</div>
	<div v-else>

		<div class="flex flex-row gap-2 justify-between my-2">
			<h1 class="w-fit bg-gray-300 rounded-xl px-3 py-2">{{entry.topic}}</h1>
			<h2>{{createdDateAndTime(entry.createdAt).time}}</h2>
			<h2>{{createdDateAndTime(entry.createdAt).date}}</h2>
		</div>

		<div class="flex justify-center items-center my-2">
			<!-- status buttons -->
			<StatusButton :class="[read?'bg-read text-white':'text-read']" class=" font-semibold rounded-l-3xl hover:bg-sky-200 hover:text-black duration-150 ease-in-out"  :status="read" type="read" :eId="entryId"/>
			<StatusButton :class="[replied?'bg-replied text-white':'text-replied']" class="font-semibold hover:bg-lime-200 hover:text-black duration-150 ease-in-out" :status="replied" type="replied" :eId="entryId"/>
			<StatusButton :class="[flagged?'bg-flagged text-white':'text-flagged']" class="font-semibold hover:bg-rose-200 hover:text-black duration-150 ease-in-out" :status="flagged" type="flagged" :eId="entryId"/>
			<StatusButton :class="[archived?'bg-archived text-white':'text-archived']" class="font-semibold rounded-r-3xl hover:bg-amber-200 hover:text-black duration-150 ease-in-out" :status="archived" type="archived" :eId="entryId"/>

		</div>

		<hr>
		<div class="flex-col flex gap-2 my-2">
			<div v-for="k in Object.keys(entryData).sort()" :key="k">
				<h2 class="h2">{{k}}</h2>
				<div v-html="entryData[k].replace(new RegExp('\r?\n','g'), '<br>')"></div>
			</div>
		</div>

		<hr>
		<div class="flex flex-col mt-2">
			<label for="notes">Notes</label>
			<textarea name="notes" id="notes" cols="30" rows="10" class="full-input" v-model="notes"></textarea>
			<div class="flex justify-end items-center pt-2 gap-2">
				<button class="btn-disabled" disabled v-if="notes==entry.notes">Cancel</button>
				<button class="btn-danger" @click="cancelNotes" v-else>Cancel</button>

				<button class="btn-disabled" disabled v-if="notes==entry.notes">Save</button>
				<button class="btn" @click="saveNotes" v-else>Save</button>
			</div>
		</div>
	</div>
</div>
</template>

<script>

import StatusButton from './StatusButton.vue'

import { useEntriesStore } from '../../stores/entries'

/**
 * @todo: add an delete button
 * 
 * @todo: implement the 0 credits message retrieval (low priority)
 */

export default {
	setup(){
		return {
			entriesStore: useEntriesStore()
		}
	},
	components:{
		StatusButton,
	},
	props: {
		entry: {
			type: Object,
		}
	},
	data:()=>({
		notes: '',
	}),
	watch:{
		entryId(){
			if (this.entryId){
				this.notes = this.entry.notes
			}else{
				this.notes = ''
			}
		},
	},
	methods:{
		createdDateAndTime(createdAt){
			let sec=createdAt.seconds
			let nano=createdAt.nanoseconds
			let date=new Date(sec*1000+nano/1000000)
			return {
				date: date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
				time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
			}
		},
		saveNotes(){
			this.entriesStore.saveNotes(this.entryId, this.notes)
		},
		cancelNotes(){
			this.notes = this.entry.notes
		},
	},
	computed:{
		entryData(){
			if (!this.entryId){
				return null
			}
			return this.entry.data
		},
		entryId(){
			if (this.entry && this.entry.id) {
				return this.entry.id
			}
			return ''
		},
		read(){
			if (!this.entryId){
				return false
			}
			return !!this.entry.read
		},
		replied(){
			if (!this.entryId){
				return false
			}
			return !!this.entry.replied
		},
		flagged(){
			if (!this.entryId){
				return false
			}
			return !!this.entry.flagged
		},
		archived(){
			if (!this.entryId){
				return false
			}
			return !!this.entry.archived
		},
	},
}


</script>