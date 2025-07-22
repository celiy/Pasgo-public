<template>
	<h2 class="mt-4 mb-2">Auth logs</h2>
	<n-card>
		<div class="flex gap-2 mb-2">
			<n-button @click="getAdminLogs">
				<template #icon>
					<n-icon>
						<Reload :class="{ 'animate-spin': loading.logs }" />
					</n-icon>
				</template>
				Recarregar
			</n-button>

			<n-button @click="invertAdminLogs">
				<template #icon>
					<n-icon>
						<List />
					</n-icon>
				</template>
				Inverter ordem
			</n-button>
		</div>

		<div style="max-height: 60vh; overflow-y: auto;">
			<n-data-table :columns="columns" :data="logs"/>
		</div>
	</n-card>
</template>

<script>
import { List, Reload } from "@vicons/ionicons5";
import axios from "axios";
import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		List,
		Reload
	},

	data() {
		return {
			logs: [],
			columns: [{
				title: "Logs",
				key: "log"
			}
			],

			loading: {
				logs: false,
			},
		};
	},

	methods: {
		async getAdminLogs() {
			try {
				this.loading.logs = true;

				const response = await axios.get(window.apiURL + "/api/v1/admin/logs/auth", {
					withCredentials: true
				});
				const data = response.data.data.logs;

				this.logs = [];
				for (const log of data) {
					this.logs.push({ key: this.logs.length, log: log.message });
				}

			} catch (err) {
				console.log(err);
			} finally {
				this.loading.logs = false;
			}
		},

		invertAdminLogs() {
			this.logs.reverse();
		},
	},

    async mounted() {
		await this.getAdminLogs();
	},
})
</script>
