import {createRouter, createWebHistory} from 'vue-router'

import Home from './pages/Home.vue'
import Dashboard from './pages/Dashboard.vue'


/**
 * for each route in routes array,
 * add a third field called authLevel
 * 	0: anybody can visit
 * 	1: only unverified users can visit
 * 	2: only verified users can visit
 */
const routes=[
	{
		path:'/',
		component:Home,
		authLevel:0,
		head:{
			title:'Simple Form Backend',
			description:'Simple Form Backend enables you to create working forms without the need for a fully fledged backend.',
			keywords:'HTML, form, backend, service, data collection, forms'
		}

	},
	{
		path:'/dashboard',
		component:Dashboard,
		authLevel:2,
		head:{
			title:'Dashboard - Simple Form Backend',
			description:'View and manage your data here.',
		}
	},
	{
		path:'/auth/signin',
		component:()=>import('./pages/Auth/SignIn.vue'),
		authLevel:0,
		head:{
			title:'Sign In - Simple Form Backend',
			description:'Sign in to your account.',
		}
	},
	{
		path:'/auth/signup',
		component:()=>import('./pages/Auth/SignUp.vue'),
		authLevel:0,
		head:{
			title:'Sign Up - Simple Form Backend',
			description:"Let's get started. Sign up for free. No credit card required.",
		}
	},
	{
		path:'/account/setup',
		component:()=>import('./pages/Account/Setup.vue'),
		authLevel:1,
		head:{
			title:'New User Set Up - Simple Form Backend',
			description:'Set up your new account.',
		}
	},
	{
		path:'/account/wait-setup',
		component:()=>import('./pages/Account/WaitSetup.vue'),
		authLevel:1,
		head:{
			title:'Set Up Successful! - Simple Form Backend',
		}
	},
	{
		path:'/account/auth-action',
		component:()=>import('./pages/Account/AuthAction.vue'),
		authLevel:0,
		head:{
			title:'Simple Form Backend',
		}
	},
	{
		path:'/account',
		component:()=>import('./pages/Account/Index.vue'),
		authLevel:2,
		head:{
			title:'Manage Your Account - Simple Form Backend',
		}
	},
	{
		path:'/account/buy',
		component:()=>import('./pages/Account/Buy.vue'),
		authLevel:2,
		head:{
			title:'Purchase More Credits - Simple Form Backend',
		}
	},
	{
		path:'/docs',
		component:()=>import('./pages/Docs.vue'),
		authLevel:0,
		head:{
			title:'Documentation - Simple Form Backend',
			description:'Learn how to integrate Simple Form Backend to your website.',
			keywords:'HTML, form, backend, service, data collection, forms, learn, javascript, js, integration'
		}
	},
	{
		path:'/account/buy-success',
		component:()=>import('./pages/Account/BuySuccess.vue'),
		authLevel:0,
		head:{
			title:'Purchase Successful! - Simple Form Backend',
		}
	},
	{
		path:'/contact',
		component:()=>import('./pages/Contact.vue'),
		authLevel:0,
		head:{
			title:'Contact Us - Simple Form Backend',
			description:'Ask us anything!',
			keywords:'contact, help, enquiry, inquiry'
		}
	},
	{
		path:'/auth/reset',
		component:()=>import('./pages/Auth/Reset.vue'),
		authLevel:0,
		head:{
			title:'Reset Password - Simple Form Backend',
			description:'Forgot your password? Reset it here.',
			keywords:'password, forget, forgot, reset'
		}
	},
	{
		path:'/terms',
		component:()=>import('./pages/Terms.vue'),
		authLevel:0,
		head:{
			title:'Terms and Conditions - Simple Form Backend',
			description:'Terms and Conditions of Simple Form Backend.',
			keywords:'terms, conditions, privacy, policy'
		}
	},
	{
		path:'/:pathMatch(.*)*',
		component:()=>import('./pages/Error.vue'),
		authLevel:0,
	}
]

const router = createRouter({
  history: createWebHistory(),
  routes, 
	scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
			if (to.hash) {
				return {
					el: to.hash,
					behavior: 'smooth',
				}
			}else{
				return { top: 0 }
			}
    }
  },
})

const routeExists = (path) => {
	if (routes.find(route => route.path === path)) {
		return true
	}else{
		return false
	}
}

const getHead = (path) => {
	let route= routes.find(route => route.path === path)

	if(!route){
		return {
			title:'Error - Simple Form Backend',
			description:'Something went wrong.',
		}
	}

	return route.head
}

export default router

export {routes,routeExists,getHead}