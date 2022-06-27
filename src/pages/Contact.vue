<template>
<div class="static-page">
	<h1 class="h1">
		Contact Us
	</h1>
	<div v-if="step==0">
		<form @submit.prevent="submitContact" class="form" >
			<label for="email">Email</label>
			<input class="full-input" type="email" autocomplete="email" id="email" name="email" v-model.trim="email" required>

			<label for="name">Name</label>
			<input class="full-input" type="text" autocomplete="name" id="name" name="name" v-model.trim="name" required>

			<label for="reason">How can we help you?</label>
			<select class="full-input" id="reason" name="reason" v-model="reason">
				<option value="enquiry">General enquiry</option>
				<option value="help">I need some help</option>
				<option value="payment">Something went wrong with my purchase</option>
			</select>

			<label for="message">Message</label>
			<textarea class="full-input" id="message" name="message" v-model.trim="message" autocomplete="off" required></textarea>

			<br>
			<button type="submit" class="btn" v-if="canSubmit">Submit</button>
			<button disabled class="btn-disabled" v-else>Submit</button>
		</form>
		<h2 class="h2">Or send us an email: <a href="mailto:sengstechnology@gmail.com" class="link">sengstechnology@gmail.com</a></h2>
	</div>
	<div v-else class="form">
		<h2 class="h2">We have recieved your message.</h2>
		<p>We will get back to you as soon as possible.</p>
		
		<br>
		<button @click="resetForm" class="btn">Send Another Message</button>
	</div>
</div>
</template>
<script >
import axios from 'axios';
import { useUserStore } from "../stores/user";

export default{
	setup(){
		return {
			userStore:useUserStore()
		}
	},
	data:()=>({
		email:'',
		name:'',
		reason:'enquiry',
		message:'',
		uid:'',
		step:0,
		isSubmitting:false,
	}),
	async mounted(){
		if (this.$route.query.reason){
			let r=this.$route.query.reason;
			if (['enquiry','help','payment'].includes(r)){
				this.reason=r;
			}
		}

		let authLevel=await this.userStore.getAuthLevel();

		if (authLevel>0){
			this.email=this.userStore.email;
			this.uid=this.userStore.uid;
		}
		if( authLevel==2){
			this.name=this.userStore.displayName;
		}

	},
	methods:{
		submitContact() {
			this.isSubmitting=true;
			let url="https://sfb.sengstech.com/api/submit/9DmYaprAFIc2kjvEzm3Ks2aDPtp1/"
			url+=`SFB-${this.reason}`;
			axios.post(url,{
				email:this.email,
				name:this.name,
				message:this.message,
				uid:this.uid
			}).then(res=>{
				this.step=1;
				this.isSubmitting=false;
			}).catch(err=>{
				this.step=0
				this.isSubmitting=false
				console.error(err)
				alert('There was an error when submitting your message. Please try again later. If the problem persists, please send me an email at sengstechnology@gmail.com.')
			})
		},
		resetForm(){
			this.step=0;
			this.message='';
			this.reason='enquiry';
		}
	},
	computed:{
		canSubmit(){
			return this.email.length>0 && this.name.length>0 && this.message.length>0 && !this.isSubmitting;
		}
	}
}
</script>