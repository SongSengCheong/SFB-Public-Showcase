<template>
<div class="min-h-screen relative pb-32 w-full">
	<div class="h-screen md:h-fit md:py-20 lg:py-24 xl:py-28 2xl:py-32 w-full bg-gradient-to-br from-blue-600 via-sky-500 to-sky-800 flex justify-center items-center">
		<div class="text-center">
			<h1 class="mainTitle mb-16">Unlimited Forms</h1>
			<h1 class="mainTitle mb-16">Pay As You Go</h1>
			<h2 class="subTitle mb-24">No Subscription</h2>
			<div class="flex justify-center items-center gap-10 flex-col md:flex-row">
				<router-link :to="startedPath" class="bg-amber-500 hover:bg-amber-400 py-2 px-4 xl:py-4 xl:px-8 2xl:py-6 2xl:px-12 btn-txt rounded-xl shadow-2xl hover:shadow-amber-300 anime">Get Started</router-link>
				<router-link to="/docs" class="bg-lime-500 hover:bg-lime-400 py-2 px-4 xl:py-4 xl:px-8 2xl:py-6 2xl:px-12 btn-txt rounded-xl shadow-2xl hover:shadow-lime-300 anime">Learn More</router-link>
			</div>
		</div>
	</div>
	<div class="py-20 px-5 text-center ">
		<h1 class="text-5xl font-semibold text-stone-700 mb-10">You Don’t Need to Build a Fully Fledged Backend Just for a Form</h1>
		<p class="text-2xl text-gray-600 mb-10">Focus on your frontend. Use either form action or Javascript to integrate Simple Form Backend to your project.</p>
		<router-link to="/docs" class="bg-sky-500 hover:bg-sky-400 py-2 px-4 text-white select-none text-xl md:text-2xl lg:text-3xl rounded-xl shadow-2xl hover:shadow-sky-300 anime">Learn How to Integrate</router-link>
	</div>
	<div class="px-10 md:px-20 pb-20">
		<div class="bg-slate-600 text-white text-center py-10">
			<h1 class="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-5">We Don’t Believe In Subscription</h1>
			<h2 class="text-xl md:text-2xl lg:text-3xl mb-5">Pricing Is Simple</h2>
			<p class="text-2xl md:text-3xl lg:text-4xl xl:text-6xl 2xl:text-8xl font-extralight mb-5">$1 = 100 Credits</p>
			<p class="text-2xl md:text-3xl lg:text-4xl xl:text-6xl 2xl:text-8xl font-extralight">1 Credit = 1 Submission</p>
		</div>
	</div>
	
	<footer class="h-32 pt-4 lg:pt-8 pb-3 bg-slate-800 absolute bottom-0 w-full text-white flex flex-col justify-between items-center">
		<div class="w-full px-4 max-w-screen-sm lg:max-w-screen-md grid grid-cols-2 lg:grid-cols-4 text-center">
			<router-link to="/contact">Contact Us</router-link>
			<router-link to="/docs">Documentation</router-link>
			<router-link to="/auth/reset">Reset Password</router-link>
			<router-link to="/terms">Terms</router-link>
		</div>
		<p class="text-center mt-2">Copyright © {{new Date().getFullYear()}} <a href="https://sengstech.com/" target="_blank">SENG'S TECHNOLOGY</a></p>
	</footer>
	<div>
		
	</div>
</div>
</template>

<style scoped>
.mainTitle{
	@apply text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold text-white select-none
}

.subTitle{
	@apply text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-semibold text-white select-none
}

.btn-txt{
	@apply text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-white select-none
}

.anime{
	@apply transition-all duration-300 ease-in-out
}

</style>

<script>
import { useUserStore } from '../stores/user'
export default {
		name: 'Home',

		setup:()=>({
			userStore:useUserStore()
		}),
		computed:{
			startedPath(){
				if (this.userStore.hasLoggedIn){
					return '/dashboard';
				}else{
					return '/auth/signup';
				}
			}
		}
}
</script>
