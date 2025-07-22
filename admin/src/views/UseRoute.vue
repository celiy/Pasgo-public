<template>
	<n-card style="overflow-y: auto;" class="mt-10">
		<h3>Method</h3>
		<div class="flex gap-2 mb-2">
			<n-button @click="() => setMethod('GET')">
				GET
			</n-button>
			<n-button @click="() => setMethod('POST')">
				POST
			</n-button>
			<n-button @click="() => setMethod('DELETE')">
				DELETE
			</n-button>
		</div>

		<h3>Route</h3>
		<form @submit.prevent="useRoute">
			<p>{{ method }}</p>
			
			<n-input
				v-model:value="route" 
				placeholder="Route"
				type="text"
				class="mt-2 mb-2"
			/>
			
			<n-button 
				class="mr-2"
				@click="useRoute"
				:disabled="loading"
			>
				Aplicar
			</n-button>
			
			{{ loading ? "Carregando..." : "" }}
		</form>

		<h4 class="mt-2">
			Response data:
		</h4>
		<n-card style="overflow-y: auto; max-height: 50vh;" class="mt-2">
			<pre>{{ JSON.stringify(response.data, null, 2) }}</pre>
		</n-card>
	</n-card>
</template>

<script>
import axios from "axios";
import { useMessage } from 'naive-ui';
import { defineComponent } from "vue";
import Table from "../components/Table.vue";

export default defineComponent({
	components: {
		Table
	},

	data() {
		return {
			route: "",
			response: "",
			loading: false,
			method: { GET: true },

			message: useMessage()
		}
	},

	methods: {
		setMethod(method) {
			const obj = {}; 
			obj[method] = true;
			this.method = obj;
		},

		async useRoute() {
			try {
				this.loading = true;

				let response = null;

				if (this.method.GET) {
					response = await axios.get(window.apiURL + "/api/v1/" + this.route, {
						withCredentials: true
					});
				}

				if (this.method.POST) {
					response = await axios.post(window.apiURL + "/api/v1/" + this.route, 
					{},
					{
						withCredentials: true
					});
				}
				
				if (this.method.DELETE) {
					response = await axios.delete(window.apiURL + "/api/v1/" + this.route, 
					{
						withCredentials: true
					});
				}

				this.response = response;

				console.log(response);
			} catch (err) {
				console.log(err);
				this.message.error(err.response?.data?.message ?? err);
			} finally {
				this.loading = false;
			}
		}
	}
})
</script>
