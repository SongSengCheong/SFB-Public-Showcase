import { defineStore } from "pinia";

import { 
	getAuth, 
	onAuthStateChanged, 
	signInWithEmailAndPassword, 
	createUserWithEmailAndPassword, 
	signOut, 
	updateProfile, 
	sendEmailVerification ,
	applyActionCode,
	sendPasswordResetEmail,
	confirmPasswordReset
} from "firebase/auth";

import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"

import router from "../router";

import { useEntriesStore } from "./entries";

export const useUserStore = defineStore('user', {
	state:()=>({
		auth:null,
		db:null,
		user:null,
		hasSetUser:false,
		userPayment:null,
		hasJustVerifiedEmail:false,
	}),
	actions:{
		initAuth(){
			this.auth=getAuth()
			this.db=getFirestore()
			onAuthStateChanged(this.auth,this.setUser);
		},
		async setUser(user){
			this.hasSetUser=true
			if (user)	{
				// console.log('setting user to',user);
				this.user=user;

				if (!this.user.emailVerified || !this.user.providerData[0].displayName){

					return false
				}

				const paymentRef = doc(this.db, 'payments', user.uid)
				const paymentSnap = await getDoc(paymentRef);
				
				if (paymentSnap.exists()) {
					this.userPayment = paymentSnap.data();
				} else {
					// console.log('no payment found for user', user.uid);
					this.userPayment = null;
					return false
				}

				return true

			}else{
				// console.log('setting user to null')
				this.user=null;
				this.userPayment=null;

				// flush entries store
				const entriesStore = useEntriesStore();
				entriesStore.flush();

			}
		},
		
		async signIn(email, password){
			try {
				await signInWithEmailAndPassword(this.auth,email,password)
				return true
			} catch (error) {
				console.error('Code',error.code,"Message",error.message);
				alert(`Error! Sign in failed because: ${error.message}`)
				return false

			}
		},
		async signUp(email,password){
			try {
				await createUserWithEmailAndPassword(this.auth,email,password)
				return true
			} catch (error) {
				console.error('Code',error.code,"Message",error.message);
				alert(`Error! Sign up failed because: ${error.message}`)
				return false

			}
		},
		async signOut(){
			try {
				router.push('/')
				return await signOut(this.auth)
			} catch (error) {
				console.error(error.code,error.message);
				alert(`Error! Sign out failed because: ${error.message}`)
				return false
			}
		},
		async setUpUser(name,org){
			// console.log('setting up user',name,org)
			try {
				//save name and org in auth
				await updateProfile(this.auth.currentUser,{
					displayName:name
				})

				// console.log('profile updated with name',name)

				await setDoc(doc(this.db, "users", this.uid), {
					uid:this.uid,
					name:name,
					org:org,
					email:this.email
				});

				// console.log('user doc was created')

				await sendEmailVerification(this.auth.currentUser)

				// console.log('email verification sent')

				this.userData={
					uid:this.uid,
					name:name,
					org:org,
				}

				// console.log('local user data set')

				router.push('/account/wait-setup')

				// console.log('redirecting to wait-setup page')

			} catch (error) {
				console.error(error.code,error.message);
			}
		},

		async verifyEmail(code){
			try {
				await applyActionCode(this.auth,code)
				this.auth=getAuth()
				this.user=this.auth.currentUser
				this.hasJustVerifiedEmail=true
				return true
			} catch (error) {
				console.error('Code',error.code,"Message",error.message);
				alert(`Error! Verification failed because: ${error.message}`)
				return false
			}
		},

		async sendResetEmail(email){
			try {
				await sendPasswordResetEmail(this.auth,email)
				return true
			} catch (error) {
				console.error('Code',error.code,"Message",error.message);
				alert(`Error! Send reset password email failed because: ${error.message}`)
				return false
			}
		},

		async resetPassword(code,password){
			try{
				await confirmPasswordReset(this.auth,code,password)
				return true
			}catch(error){
				console.error('Code',error.code,"Message",error.message);
				alert(`Error! Reset password failed because: ${error.message}`)
				return false
			}
		},

		async getAuthLevel(){
			let totalTime=0;

			function tryAgain(time) {
				return new Promise(resolve => {
					setTimeout(() => {
						totalTime+=time;
						resolve('resolved');
					}, time);
				});
			}

			while(!this.hasSetUser){
				await tryAgain(50)
			}
			// if(totalTime>0){
			// 	console.log('user is set after',totalTime,'ms')
			// }
			return this.authLevel

		}
	},
	getters:{
		hasLoggedIn(){
			return this.user!=null;
		},
		uid(){
			return this.hasLoggedIn?this.user.uid:null;
		},
		email(){
			return this.hasLoggedIn?this.user.email:null;
		},
		displayName(){
			return this.hasLoggedIn?this.user.providerData[0].displayName:null;
		},
		credits(){
			return this.userPayment?this.userPayment.credits:'';
		},
		authLevel(){
			// 0: not logged in
			// 1: logged in but unverified
			// 2: email verified
			
			if (!this.hasLoggedIn) return 0;
			if (!this.user.emailVerified && !this.hasJustVerifiedEmail) return 1;
			if (this.hasLoggedIn) return 2;

			console.error('Unknown authLevel')
			return -1;
		}


	}
});