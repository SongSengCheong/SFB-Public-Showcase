<template>
<div v-if="isActionValid" class="static-page">
	<!-- Verify Email -->
	<div class="flex flex-col" v-if="mode=='verifyEmail'">
		<h1 class="h1">Email Verification</h1>
		<div v-if="userStore.hasLoggedIn">
			<div v-if="!actionSuccess">
				<button class="btn" @click="executeAuthActions">Click Me To Verify Your Email</button>
			</div>
			<div v-if="actionSuccess">
				<h2 class="h2">Your email has been verified</h2>
				<router-link to="/dashboard" class="btn">Go to Dashboard</router-link>
			</div>
		</div>
		<!-- User not logged in -->
		<div v-else>
			<h2>You must sign in first</h2>
			<router-link :to="`/auth/signin?redirect=${$route.fullPath.replace('?mode=','&mode=')}`">Sign In</router-link>
		</div>
	</div>
	<!-- Reset Password -->
	<div v-if="mode=='resetPassword'">
		<form @submit.prevent="executeAuthActions" class="form" v-if="!actionSuccess">
			<div class="mb-2">
				<label for="newPassword">New Password</label>
				<p v-if="newPassword.length>0" :class="[passwordStrength=='Too weak'?'text-red-500':'']">{{passwordStrength}}</p>
				<input type="password" id="newPassword" name="newPassword" v-model="newPassword" autocomplete="new-password" class="full-input"/>
			</div>
			
			<button class="btn" type="submit" v-if="passwordStrength!='Too weak'">Reset Password</button>
			<button class="btn-disabled" disabled v-else>Reset Password</button>
		</form>
		<div v-if="actionSuccess">
				<h2 class="h2">We have reset your password</h2>
				<router-link to="/auth/signin" class="btn">Sign In</router-link>
		</div>
	</div>
</div>
<div v-else class="static-page">
	<h1 class="h1">Something is Wrong!</h1>
	<p>No mode or no oobcode.</p>
</div>
</template>

<script>
import { useUserStore } from '../../stores/user'
import { passwordStrength } from 'check-password-strength'

export default {
	setup() {
		return {
			userStore: useUserStore()
		}
	},
	data:() => ({
		actionSuccess: false,
		newPassword:'',
	}),
	computed:{
		queries(){
			if (this.$route.hasOwnProperty('query')) {
				return this.$route.query
			}else{
				return null
			}
		},
		mode(){
			if (this.queries){
				if (this.queries.hasOwnProperty('mode')){
					return this.queries.mode
				}
			}

			return null
		},
		oobCode(){
			if (this.queries){
				if (this.queries.hasOwnProperty('oobCode')){
					return this.queries.oobCode
				}
			}
			return null
		},
		isActionValid(){
			return this.mode && this.oobCode
		},
		passwordStrength(){
			return passwordStrength(this.newPassword).value
		}
	},
	methods:{
		async executeAuthActions(){
			let mode=this.mode
			if (!mode){
				console.error('No mode provided')
				return false
			}

			try {
				if (mode === 'verifyEmail'){


					if (!this.userStore.hasLoggedIn){
						console.error('User must be logged in to verify email')
						alert('Please sign in first')
						return false
					}

					let result=await this.userStore.verifyEmail(this.oobCode)
					this.actionSuccess=!!result
					return !!result
				}
				if (mode === 'resetPassword'){
					let result=await this.userStore.resetPassword(this.oobCode,this.newPassword)
					this.actionSuccess=!!result
					return !!result
				}

				console.error('Error: unknown mode',mode)
				return false

			} catch (error) {
				console.error('Error when executing auth actions', error)
				return false
			}
		},
	},

}
</script>
