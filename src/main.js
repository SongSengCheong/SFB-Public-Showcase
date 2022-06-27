import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

import './assets/tailwind.css'
import './assets/main.css'

import router from './router'
import {routes,routeExists} from './router'

import { createHead } from '@vueuse/head'

const head = createHead()

createApp(App).use(router).use(createPinia()).use(head).mount('#app')

console.log('v1.0 Simple Form Backend')

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  measurementId: import.meta.env.VITE_measurementId
};

const app = initializeApp(firebaseConfig);

import { useUserStore } from './stores/user'

const userStore = useUserStore()

userStore.initAuth()

import { useEntriesStore } from './stores/entries'

const entriesStore = useEntriesStore()

entriesStore.initEntriesStore()



router.beforeEach(async (to, from) => {

  
  let toRoute=routes.find(route=>route.path===to.path)
  
  if (toRoute){
    let toAuthLevel=toRoute.authLevel

    if (toAuthLevel>0){
      let authLevel=await userStore.getAuthLevel()

      if(toAuthLevel==2){
        if(authLevel==1){
          return '/account/setup'
        }
        if(authLevel==0){
          return '/auth/signin'
        }
      }
  
      if (toAuthLevel==1){
        if (authLevel==0){
          return '/auth/signin'
        }
      }

    }
  }


  //redirect
	if (from.query['redirect']) { 
		const redirect = from.query['redirect']
		// prevent infinite loop by check if redirectis the to path
		if (to.path!=redirect && routeExists(redirect)) {
			
			if (redirect=='/account/auth-action') {

				// console.log('redirect to auth action')
				let rtn_path = `${redirect}?`
				
				let keys=Object.keys(from.query)
				let other_keys=keys.filter(key => key!='redirect')

				for (let i=0; i<other_keys.length; i++) {
					rtn_path += `${other_keys[i]}=${from.query[other_keys[i]]}&`
				}

				// console.log('trying to redirect to', rtn_path)

				return rtn_path

			}else{
				return redirect
			}
		}
	}
})


import '@stripe/stripe-js'; //load stripe js script tag
