<template>
<div class="static-page">
	<form @submit.prevent="sendResetEmail" class="form" v-if="!hasSentEmail">
		<h1 class="h1">Reset Password</h1>
		<div class="mb-2">
			<label for="email">Email</label>
			<input class="full-input" type="email" autocomplete="email" id="email" name="email" v-model="email">
		</div>
		<button class="btn" type="submit">Reset Password</button>
	</form>
	<div v-if="hasSentEmail">
		<h1 class="h1">Resetting Your Password</h1>
		<p>We have sent you an email with a link to reset your password.</p>
	</div>
</div>
</template>
<script setup>
import { useUserStore } from '../../stores/user'

import {ref} from 'vue'

const userStore=useUserStore()
const email=ref('')
const hasSentEmail=ref(false)

async function sendResetEmail() {
	let result =await userStore.sendResetEmail(email.value)
	hasSentEmail.value=true
}
</script>