<template>
<div class="static-page">
	<h1 class="h1">Credits</h1>
	<div>
		<h2 class="h2">Current Credits</h2>
		<p class="text-lg">{{userStore.credits}}</p>
	</div>
	<form @submit.prevent="redirect2Checkout">
		<h2 class="h2">Buy more credits</h2>
		<div class="flex flex-col">
			<label for="dollar">You will pay</label>
			<span>$<input type="number" name="dollar" id="dollar" v-model.number="dollar" min="5" max="100000" step="1" class="w-24 small-input"> USD</span>
			<h3 class="text-lg" :class="[invalidDollarValue?'text-red-500':'text-gray-800']">{{creditsText}}</h3>
		</div>
		<button type="submit" class="btn">Checkout</button>
	</form>
	
</div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";
import { useUserStore } from "../../stores/user";

export default{
	setup(){
		return{
			userStore:useUserStore()
		}	
	},
	data:()=>({
		stripe:null,
		dollar:5,
	}),
	async mounted(){
		this.stripe=await loadStripe(import.meta.env.VITE_StripeKey)
	},
	methods:{
		async redirect2Checkout(){
			const quantity=Math.floor(this.dollar);

			if (quantity<5){
				alert('The minimum you can pay is $5.');
				return;
			}
			if(quantity>100000){
				alert('The maximum you can pay in one transaction is $100,000.');
				return;
			}

			const checkoutOptions={
				lineItems:[
					{
						price: 'price_1K8YSkGyI9bOqtWgydtlZ97n',
						quantity: quantity,
					},
				],
				successUrl:'https://sfb.sengstech.com/account/buy-success',
				cancelUrl:'https://sfb.sengstech.com/account/buy',
				mode:'payment',
				clientReferenceId:this.userStore.uid,
				customerEmail:this.userStore.email,
			}
			try {
				await this.stripe.redirectToCheckout(checkoutOptions)
			} catch (error) {
				console.error('Error when redirect to checkout', error);
				alert('Something went wrong. Please contact us to help you if the problem persists.')
			}
		}
	},
	computed:{
		creditsText(){
			if (this.dollar<5){
				return 'The minimum you can pay is $5.';
			}

			if(this.dollar>100000){
				return 'The maximum you can pay in one transaction is $100,000.';
			}

			return `For ${this.dollar*100} credits`;
		},
		invalidDollarValue(){
			return this.dollar<5 || this.dollar>100000;
		}
	}
	
}

</script>