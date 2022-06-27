<template>
<div class="static-page">
	<h1 class="h1">Setting up Your Account</h1>
	<form @submit.prevent="submitInfo" class="flex flex-col">
		<div>
			<label for="name">Your Name</label>
			<input class="full-input" type="text" autocomplete="name" id="name" name="name" v-model="fullName">
		</div>
		<div>
			<label for="orgName">Organisation (Optional)</label>
			<input class="full-input" type="text" autocomplete="organization" id="orgName" name="orgName" v-model="orgName">
		</div>
		<div>
			<h2 class="h2">Please Confirm Your Email Address</h2>
			<h3 class="text-lg font-semibold">{{userStore.email}}</h3>
		</div>
		<div>
			<h2 class="h2">If your email is correct, please click the button below to verify your email.</h2>
			<button class="btn" v-if="fullName.length>0">Save and Verify My Email</button>
			<button class="btn-disabled" disabled v-else>Save and Verify My Email</button>
		</div>
	
	</form>

</div>
</template>

<script>
import { useUserStore } from "../../stores/user";

export default {
	setup(){
		return {
			userStore:useUserStore()
		}
	},
	data:()=>({
		fullName:'',
		orgName:'',
	}),
	methods: {
		async submitInfo() {
			// console.log('Setup Page: Submitting Info');
			await this.userStore.setUpUser(this.fullName, this.orgName);
		}
	}
}
</script>