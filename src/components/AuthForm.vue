<template>
<form class="form w-full max-w-screen-sm" @submit.prevent="onSubmit" novalidate>
	<h2 class="text-gray-900 text-lg font-medium title-font mb-5">{{isSignInForm?'Sign In':'Sign Up'}}</h2>
	<div class="relative mb-4">
		<label for="email">Email</label>
		<input class="full-input" v-model="email" type="email" id="email" name="email" @focus="clearEmailWarnings"  autocomplete="email">
		<p v-if="!signUpSpecials.emailHasAt" class="text-red-500">Invalid Email Address</p>

	</div>
	<div class="relative mb-4">
		<label for="password">Password</label>
		<p v-if="!isSignIn && password.length>0" :class="[passwordStrength=='Too weak'?'text-red-500':'']">{{passwordStrength}}</p>
		<input class="full-input" v-model="password" type="password" id="password" name="password" @focus="clearPasswordWarnings" :autocomplete="isSignInForm?'current-password':'new-password'">
		<p v-if="!signUpSpecials.passwordIsLongEnough" class="text-red-500">Your password cannot be "Too weak".</p>
		
	</div>
	<div class="relative mb-4" v-if="!isSignInForm">
		<label for="cpassword">Confirm your password</label>
		<input class="full-input" v-model="signUpSpecials.confirmPassword" type="password" id="cpassword" name="cpassword" @focus="clearPasswordWarnings" autocomplete="new-password">
		<p v-if="!signUpSpecials.passwordIsSame" class="text-red-500">These passwords aren't the same!</p>
	</div>
	<p v-if="!isSignInForm" class="mb-2">By signing up, you agree to our <router-link to="/terms" class="link">Terms and Conditions</router-link></p>
	<button type="submit" class="btn">{{isSignInForm?"Sign In":"Sign Up"}}</button>

	<p class="text-xs text-gray-500 mt-3" v-if="isSignInForm">Don't have an account? <router-link to="/auth/signup" class="link">Sign Up Here</router-link></p>
	<p class="text-xs text-gray-500 mt-3" v-if="isSignInForm"><router-link to="/auth/reset" class="link">Reset Password</router-link></p>
	<p class="text-xs text-gray-500 mt-3" v-if="!isSignInForm">Already have an account? <router-link to="/auth/signin" class="link">Sign In Here</router-link></p>
</form>
</template>

<script>
import { passwordStrength } from 'check-password-strength'

export default {
	name: 'AuthForm',
	props:{
		isSignIn: {
			type: Boolean,
			required: true
		}
	},
	data:()=>({
		email: '',
		password: '',
		signUpSpecials:{
			confirmPassword: '',
			passwordIsSame: true,
			emailHasAt:true,
			passwordIsLongEnough:true,
		}
	}),
	methods:{
		onSubmit(){
			if (this.canSubmit()){
				this.$emit('submit-form', this.email, this.password);
			}
		},
		canSubmit(){
			if (this.isSignInForm){
				return true;
			}

			this.signUpSpecials.passwordIsSame = this.password == this.signUpSpecials.confirmPassword;
			this.signUpSpecials.emailHasAt = this.email.includes('@');
			this.signUpSpecials.passwordIsLongEnough = this.passwordStrength!="Too weak";

			return this.signUpSpecials.passwordIsSame && this.signUpSpecials.emailHasAt && this.signUpSpecials.passwordIsLongEnough;
		},
		clearEmailWarnings(){
			this.signUpSpecials.emailHasAt = true;
		},
		clearPasswordWarnings(){
			this.signUpSpecials.passwordIsLongEnough = true;
			this.signUpSpecials.passwordIsSame = true;
		}
	},
	computed:{
		isSignInForm(){
			return this.isSignIn;
		},
		passwordStrength(){
			return passwordStrength(this.password).value;
		}
	}
}
</script>