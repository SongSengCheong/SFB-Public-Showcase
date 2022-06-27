<template>
<div class="w-full h-screen flex justify-center items-center">
	<AuthForm :isSignIn="formType" @submit-form="signinOrsignup"/>
</div>

</template>

<script>
import { storeToRefs } from 'pinia';
import AuthForm from '../../components/AuthForm.vue';
import router from '../../router';

import { useUserStore } from '../../stores/user';

export default {
	components: {
		AuthForm,
	},
	setup(){
		const store=useUserStore();
		const {hasLoggedIn}=storeToRefs(store);

		return {
			userStore: store,
			hasLoggedIn:hasLoggedIn
		}
	},
	data:()=>({
		formType:true //true for sign in, false for sign up
	}),
	methods: {
		async signinOrsignup(email,password) {
			if (this.formType) {
				let result=await this.userStore.signIn(email,password);
				if (result){
					this.$router.push('/dashboard');
				}
			} else {
				let result=await this.userStore.signUp(email,password);
				if (result){
					this.$router.push('/account/setup')
				}
			}
		}
	}
}
</script>
