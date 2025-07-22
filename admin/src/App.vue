<template>
	<n-message-provider>
		<n-modal-provider>
			<form v-if="!isLogged"
				class="m-4 sm:m-12 md:m-20"
			>
				<n-card>
					<p 
						v-if="error"
						class="text-red-400"
					> 
						{{ error }}
					</p>

					<p class="mb-1">Login</p>
					<n-input v-model:value="login" />

					<p class="mt-2 mb-1">Password</p>
					<n-input v-model:value="password" class="mb-2"/>

					<n-button @click="loginAdmin">
						Entrar
					</n-button>
				</n-card>
			</form>
			<main v-if="isLogged" class="flex h-full">
				<NavBar />
				<div class="w-[90vw] sm:w-[85vw] md:w-[80vw] lg:w-[80vw] m-auto min-h-[100vh]">
					<RouterView />
				</div>
			</main>
		</n-modal-provider>
	</n-message-provider>
</template>

<script>
import axios from "axios";
import { defineComponent } from 'vue';
import NavBar from './components/NavBar.vue';

export default defineComponent({
	components: {
		NavBar
	},

	data() {
		return {
			isLogged: false,

			login: undefined,
			password: undefined,

			error: undefined
		}
	},

	async mounted() {
		window.apiURL = import.meta.env.DEV ? "http://localhost:3000" : "";

		await axios.get(window.apiURL + "/api/v1/admin/check-login", {
			withCredentials: true
		})
		.then(response => {
			this.isLogged = response.data.status === "success"
		})
		.catch(error => {
			console.log("Not logged in.", error)
			this.error = "Not logged in."
		})
	},

	methods: {
		async loginAdmin() {
			try {
				const response = await axios.post(window.apiURL + "/api/v1/admin/login", {
					login: this.login,
					password: this.password
				}, {
					withCredentials: true
				});

				if (response.data.status === "success") {
					this.isLogged = true;
				}
			} catch (err) {
				this.error = err.response.data.message ? err.response.data.message : err;
			}
		}
	}
})
</script>
