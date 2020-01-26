<template>
	<form @submit.prevent="submitForm">
		<div class="row q-mb-md">
			<q-banner class="bg-grey-3 col">
			  <template v-slot:avatar>
			    <q-icon name="account_circle" color="primary" />
			  </template>
			  {{ tab | capitalize }} to access your Foods anywhere!
			</q-banner>
		</div>
		<div class="row q-mb-md">
			<q-input
				v-model="formData.email"
				label="Email address"
				ref="email"
				:rules="[ val => isValidEmailAddress(val) || 'Please enter a valid email address']"
				lazy-rules
				outlined
				stack-label
				class="col"
			/>
		</div>
		<div class="row q-mb-md">
			<q-input
				v-model="formData.password"
				label="Password"
				ref="password"
				:rules="[ val => val.length >= 6 || 'Please enter at least 6 characters']"
				lazy-rules
				outlined
				type="password"
				stack-label
				class="col"
			/>
		</div>
		<div class="row">
			<q-space />
			<q-btn 
				color="primary" 
				type="submit">
				{{ tab | capitalize }}
			</q-btn>
		</div>
	</form>
</template>

<script>
	import { mapActions } from 'vuex';

	export default {
		props: ['tab'],
		data() {
			return {
				formData: {
					email: '',
					password: ''
				}
			}
		},
		methods: {
			...mapActions('auth',['registerUser','loginUser']),
			isValidEmailAddress(email) {
				var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				    return re.test(String(email).toLowerCase());
			},
			submitForm() {
				this.$refs.email.validate()
				this.$refs.password.validate()
				if (!this.$refs.email.hasError && !this.$refs.password.hasError) {
					if (this.tab == 'login') {
						this.loginUser(this.formData)
					}
					else {
						this.registerUser(this.formData)
					}
				}
			}
		},
		filters: {
			capitalize(value) {
				return value.charAt(0).toUpperCase() + value.slice(1)
			}
		}
	}
</script>