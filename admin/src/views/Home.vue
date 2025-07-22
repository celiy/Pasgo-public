<template>
	<h2 class="mt-4 mb-2">Logs</h2>
	<n-card>
		<div class="flex gap-2 mb-2">
			<n-button @click="getAdminLogs">
				<template #icon>
					<n-icon>
						<Reload :class="{ 'animate-spin': loading.logs }"/>
					</n-icon>
				</template>
				Recarregar
			</n-button>
			
			<n-button @click="invertAdminLogs">
				<template #icon>
					<n-icon>
						<List/>
					</n-icon>
				</template>
				Inverter ordem
			</n-button>
		</div>
		
		<div style="max-height: 60vh; overflow-y: auto;">
			<n-data-table :columns="columns" :data="logs" />
		</div>
	</n-card>

	<h2 class="mt-4 mb-2">Response times</h2>
	<n-card>
		<div class="grid gap-2 mb-2 md:flex">
			<n-button @click="getAdminTimeLogs">
				<template #icon>
					<n-icon>
						<Reload :class="{ 'animate-spin': loading.timeLogs }" />
					</n-icon>
				</template>
				Recarregar
			</n-button>
			
			<n-button @click="invertAdminTimeLogs">
				<template #icon>
					<n-icon>
						<List />
					</n-icon>
				</template>
				Inverter ordem
			</n-button>

			<n-input 
				v-model:value="time.min" 
				type="numeric" 
				placeholder="Tempo minimo"
				class="m-0 md:ml-8"
			/>
			<n-input 
				v-model:value="time.max" 
				type="numeric" 
				placeholder="Tempo maximo"
			/>
			<n-button @click="getAdminTimeLogs">
				Aplicar
			</n-button>
		</div>
		
		<div style="max-height: 60vh; overflow-y: auto;">
			<n-data-table :columns="timeColumns" :data="timeLogs" />
		</div>
	</n-card>

	<h2 class="mt-4 mb-2">Error logs</h2>
	<n-card>
		<div class="grid gap-2 mb-2 md:flex">
			<n-button @click="getAdminErrorLogs">
				<template #icon>
					<n-icon>
						<Reload :class="{ 'animate-spin': loading.errorLogs }" />
					</n-icon>
				</template>
				Recarregar
			</n-button>
			
			<n-button @click="invertAdminErrorLogs">
				<template #icon>
					<n-icon>
						<List />
					</n-icon>
				</template>
				Inverter ordem
			</n-button>
		</div>
		
		<div style="max-height: 60vh; overflow-y: auto;">
			<n-data-table :columns="errorColumns" :data="errorLogs" />
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

			timeLogs: [],
			timeColumns: [{
					title: "Logs",
					key: "log"
				}
			],

			errorLogs: [],
			errorColumns: [{
					title: "Logs",
					key: "log"
				}
			],

			loading: { 
				logs: false,
				timeLogs: false,
				errorLogs: false,
			},
			time: {
				min: undefined,
				max: undefined
			}
		};
	},

	methods: {
		async getAdminLogs() {
			try {
				this.loading.logs = true;

				const response = await axios.get(window.apiURL + "/api/v1/admin/logs/globals", {
					withCredentials: true
				});
				const data = response.data.data.logs;

				this.logs = [];
				for (const log of data) {
					this.logs.push({key: this.logs.length, log: log.message});
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

		async getAdminTimeLogs() {
			try {
				this.loading.timeLogs = true;
				this.timeLogs = [];

				const response = await axios.get(window.apiURL + "/api/v1/admin/logs/response-times", {
					withCredentials: true
				});
				
				const data = response.data.data.logs;
				
				for (const log of data) {
					let time = log.message.split("@")[1] * 1;

					if (this.time.min || this.time.max) {
						if (this.time.min && time < this.time.min) {
							continue;
						} else if (this.time.max && time > this.time.max) {
							continue;
						} else {
							this.timeLogs.push({key: this.timeLogs.length, log: log.message});
						}
					} else {
						this.timeLogs.push({key: this.timeLogs.length, log: log.message.split("@").join("")});
					}
				}
				
			} catch (err) {
				console.log(err);
			} finally {
				this.loading.timeLogs = false;
			}
		},

		invertAdminTimeLogs() {
			this.timeLogs.reverse();
		},

		async getAdminErrorLogs() {
			try {
				this.loading.errorLogs = true;
				this.errorLogs = [];

				const response = await axios.get(import.meta.env.AMBIENT === "DEV" ? import.meta.env.BACKEND_URL : "" + "/api/v1/admin/logs/errors", {
					withCredentials: true
				});
				
				const data = response.data.data.logs;
				
				for (const log of data) {
					this.errorLogs.push({key: this.errorLogs.length, log: log.message});
				}
				
			} catch (err) {
				console.log(err);
			} finally {
				this.loading.errorLogs = false;
			}
		},

		invertAdminErrorLogs() {
			this.errorLogs.reverse();
		}
	},
	
	async mounted() {
		await this.getAdminLogs();
		await this.getAdminTimeLogs();
		await this.getAdminErrorLogs();
	},

})
</script>
