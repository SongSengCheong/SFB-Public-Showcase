<template>
<nav class="flex flex-row justify-between bg-gradient-to-r from-blue-600 to-sky-900 items-center fixed top-0 w-full z-40 h-12 text-white px-3 ">
	<router-link to="/" class="font-mono text-3xl font-bold select-none">
		&lt;<b class="text-orange-500">SFB</b>/&gt;
	</router-link>
	<div class="hidden md:flex flex-row gap-2 h-full items-center justify-center " v-if="userStore.hasLoggedIn">
		<!-- signed in -->
		<router-link to='/dashboard' v-if="$route.path!='/dashboard' && userStore.authLevel==2" class="px-4 py-1 bg-sky-500 rounded-full hover:bg-sky-600">Dashboard</router-link>
		<router-link to="/account/buy" v-if="userStore.credits || userStore.credits==0">{{userStore.credits}} Credits</router-link>
		<div class="text-gray-800 select-none	" v-if="userStore.credits || userStore.credits==0">|</div>
		<button  class="flex items-center" v-if="userStore.displayName" @click="isDesktopMenuOpen=!isDesktopMenuOpen">
			<div>{{userStore.displayName}}</div>
			<ChevronDownIcon class="w-8 h-8" v-if="!isDesktopMenuOpen"/>
			<ChevronUpIcon class="w-8 h-8" v-else/>

			<div class="fixed flex delay-1000 w-fit h-fit right-0 top-12 flex-col items-center" v-if="isDesktopMenuOpen">
				<router-link to="/account" class="bg-sky-800 hover:bg-sky-600 w-full text-center px-4 md:px-8 py-3 transition-all duration-200 ease-in-out">My Account</router-link>
				<router-link to="/account/buy" class="bg-sky-800 hover:bg-sky-600 w-full text-center px-4 md:px-8 py-3 transition-all duration-200 ease-in-out">Buy More Credits</router-link>
				<router-link to="/docs" class="bg-sky-800 hover:bg-sky-600 w-full text-center px-4 md:px-8 py-3 transition-all duration-200 ease-in-out">Documentation</router-link>
				<router-link to="/contact" class="bg-sky-800 hover:bg-sky-600 w-full text-center px-4 md:px-8 py-3 transition-all duration-200 ease-in-out">Contact Us</router-link> 
				<button @click="onSignOut" class="bg-sky-800 rounded-bl-2xl hover:bg-sky-500 w-full text-center px-4 md:px-8 py-3 transition-all duration-200 ease-in-out">Sign Out</button>
			</div>
		</button>


	</div>
	<div v-else class="hidden md:flex flex-row gap-1 md:gap-2 lg:gap-4 h-full items-center justify-center">
		<!-- not signed in -->
		<router-link to="/docs">Documentation</router-link>
		<router-link to="/contact">Contact Us</router-link> 
		<router-link to="/auth/signin">Sign In</router-link>
		<router-link to="/auth/signup">Sign Up</router-link>
	</div>
	<div class="flex md:hidden">
		<!-- mobile burger -->
		<button @click="isMoboleMenuOpen=!isMoboleMenuOpen">
			<MenuIcon class="w-8 h-8 text-white" v-if="!isMoboleMenuOpen"/>
			<XIcon class="w-8 h-8 text-white bg-sky-900" v-else/>
		</button>
	</div>
	<div class="absolute top-12 w-full bg-sky-900 h-fit left-0 flex flex-col md:hidden " v-if="isMoboleMenuOpen">
		<!-- Mobile menu dropdown -->
		<router-link to='/dashboard' v-if="$route.path!='/dashboard' && userStore.authLevel==2" class="bg-amber-500 font-semibold w-full text-center px-4 md:px-8 py-3">Dashboard</router-link>
		<router-link to="/account" class=" w-full text-center px-4 md:px-8 py-3" v-if="userStore.hasLoggedIn">{{userStore.displayName}}</router-link>
		<router-link to="/account/buy" v-if="(userStore.credits || userStore.credits==0) && userStore.hasLoggedIn" class=" w-full text-center px-4 md:px-8 py-3">{{userStore.credits}} Credits</router-link>
		<router-link to="/docs" class=" w-full text-center px-4 md:px-8 py-3">Documentation</router-link>
		<router-link to="/contact" class=" w-full text-center px-4 md:px-8 py-3">Contact Us</router-link> 
		<router-link to="/auth/signin" class=" w-full text-center px-4 md:px-8 py-3" v-if="!userStore.hasLoggedIn">Sign In</router-link>
		<router-link to="/auth/signup" class=" w-full text-center px-4 md:px-8 py-3" v-if="!userStore.hasLoggedIn">Sign Up</router-link>
		<button @click="onSignOut" class=" w-full text-center px-4 md:px-8 py-3" v-if="userStore.hasLoggedIn">Sign Out</button>
	</div>

</nav>
</template>

<script>
import { useUserStore } from '../stores/user';
import { ChevronDownIcon, ChevronUpIcon, MenuIcon, XIcon } from '@heroicons/vue/solid'

export default{
	setup(){
		return {
			userStore: useUserStore()
		}
	},
	data:()=>({
		isMoboleMenuOpen: false,
		isDesktopMenuOpen: false
	}),
	components:{
		ChevronDownIcon,
		MenuIcon,
		ChevronUpIcon,
		XIcon
	},
	methods:{
		onSignOut(){
			this.userStore.signOut();
			this.isMoboleMenuOpen=false;
			this.isDesktopMenuOpen=false;
		}
	},
	watch:{
		$route(){
			this.isMoboleMenuOpen=false;
			this.isDesktopMenuOpen=false;
		}
	}
}

</script>