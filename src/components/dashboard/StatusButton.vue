<template>
<button @click="handleClick" class="px-2 md:px-3 lg:px-5 xl:px-7 py-3 bg-gray-200 border-black">{{buttonText}}</button>
</template>

<script>
import { useEntriesStore } from "../../stores/entries"

export default {
	setup(){
		return {
			entriesStore: useEntriesStore()
		}
	},
	props: {
		status:{
			type:Boolean,
			required: true
		},
		type:{
			type:String,
			required: true
		},
		eId:{
			type:String,
			required: true
		}
	},
	computed:{
		buttonText(){
			if(!this.type){
				return '';
			}
			if (this.type == 'read') {
				return 'Read'
			}
			if (this.type == 'replied') {
				return 'Replied'
			}
			if (this.type == 'flagged') {
				return 'Flag'
			}
			if (this.type == 'archived') {
				return 'Archive'
			}
		},
	},
	methods:{
		async handleClick(){
			if (this.type!='archived') {
				return await this.entriesStore.markStatus(this.eId,this.type,!this.status)
			}else{
				return await this.entriesStore.markArchive(this.eId)
			}
		},
	}
}
</script>