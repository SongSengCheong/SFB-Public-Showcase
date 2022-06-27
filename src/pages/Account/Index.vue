<template>
<div class="static-page">

	<div v-if="userStore.hasLoggedIn" class="flex flex-col gap-5">
		<h1 class="h1">
			Account
		</h1>
		<div>
			<h2 class="h2">
				Project ID:
			</h2>
			<div>
				<p :class="[showId?'blur-none select-all':'blur-sm select-none']" class="mb-1">
					{{userStore.uid}}
				</p>
				<button @click="showId=!showId" :class="[showId?'btn':'btn-danger']">{{showId?'Hide':'Reveal'}}</button>
			</div>
		</div>
		<!-- <p>
			Please keep your project ID somewhat safe and secure. At least do not share it with the public.
		</p>
		<p>
			Please contact us if you think you need a new project ID.
		</p> -->
		<div>
			<h2 class="h2">
				Credits
			</h2>
			<p class="mb-2">
				{{userStore.credits}}
			</p> 
			<div>
				<router-link to="/account/buy" class="btn">Buy more credits</router-link>	
			</div>
		</div>
	</div>
	<div v-else>
		<h2>
			You must sign in to view this page.
		</h2> 
		<router-link :to="`/auth/signin?redirect=${$route.path}`">Sign In</router-link>
	</div>

</div>

</template>


<script setup>
import {ref} from 'vue'
import { useUserStore } from "../../stores/user";
let userStore=useUserStore();

let showId=ref(false);

</script>