<template>
	<div class="flex items-center gap-2">
    <h2 class="mt-4 mb-2"> {{ element }} </h2>
  </div>
  
	<n-card style="overflow-y: auto;">
        <div class="grid">
            <div class="grid gap-2 mb-2 md:flex">
                <n-button @click="getItems">
                    <template #icon>
                        <n-icon>
                            <Reload :class="{ 'animate-spin': loading.items }"/>
                        </n-icon>
                    </template>
                    Recarregar
                </n-button>
                
                <n-button @click="invertItemsList">
                    <template #icon>
                        <n-icon>
                            <List/>
                        </n-icon>
                    </template>
                    Inverter ordem
                </n-button>

                <div class="grid items-end w-full gap-2 m-0 md:flex md:ml-6">
                    <n-button @click="() => type = type === 'text' ? 'numeric' : 'text'">
                        {{ type === "text" ? "Texto" : "Numérico" }}
                    </n-button>
                    <n-space 
                        v-if="type === 'numeric'"
                        vertical
                    >
                        <n-select v-model:value="operation" :options="options" />
                    </n-space>

                    <n-input
                        v-model:value="field" 
                        placeholder="Campo"
                        type="text"
                    />

                    <n-input
                        v-model:value="filter" 
                        placeholder="Filtro"
                        type="text"
                    />

                    <n-button @click="getItems">
                        Aplicar
                    </n-button>
                </div>
            </div>
        </div>
        
		<div style="max-height: 60vh; overflow-y: auto;">
            <n-data-table 
                :columns="columns"
                :data="items" 
                :row-props="rowProps"
            />
        </div>

        <div class="flex justify-center w-full mt-2">
            <n-pagination v-model:page="page" :page-count="pageCount" />
        </div>

		<div class="flex justify-end gap-2 mb-2">
			<p class="place-self-center">
				Pular para:
			</p>
			<n-input
				style="width: 6rem;"
				v-model:value="page" 
				placeholder="Página"
				type="numeric"
			/>
		</div>
		
		<n-modal v-model:show="showModal">
			<n-card
				style="width: 600px"
				:title="element"
				:bordered="false"
				size="huge"
				role="dialog"
				aria-modal="true"
			>
				<template #header-extra>
					<n-button @click="() => showModal = false">
						Fechar
					</n-button>
				</template>
				<div>
					<n-input 
						v-if="showAdvanced"
						v-model:value="selectedItem"
						type="textarea"
					/>
                    
					<n-card 
                        v-if="!showAdvanced"
                        style="max-height: 60vh; overflow-y: auto;"
                    >
                        <pre>
                            {{ selectedItem }}
                        </pre>
					</n-card>
				</div>
				<template #footer>
					<div class="flex gap-2">
						<n-button @click="() => showAdvanced = !showAdvanced">
							{{ showAdvanced ? "Visualizar" : "Editar" }}
						</n-button>

						<n-button
							v-if="showAdvanced"
							@click="updateItem"
							:disabled="loading.update"
							type="success"
						>
							Salvar
						</n-button>

						<n-button
							v-if="showAdvanced"
							@click="() => overrideValidators = !overrideValidators"
							ghost
							:type="overrideValidators ? 'warning' : 'primary'"
						>
							Override: {{ overrideValidators ? "True" : "False" }}
						</n-button>
                        
						<n-button
							v-if="showAdvanced"
							@click="deleteItem"
							:disabled="loading.delete"
							type="error"
						>
							Deletar
						</n-button>
					</div>
				</template>
			</n-card>
		</n-modal>
	</n-card>
	
</template>

<script>
import { List, Reload } from "@vicons/ionicons5";
import axios from "axios";
import { useMessage } from 'naive-ui';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    props: {
        element: String,
        columns: Array,
        route: String,
        fields: Array,
    },

	components: {
		List,
        Reload
    },

	data() {
		return {
			items: [],
			itemsRaw: [],
			selectedItem: undefined,
			
			field: undefined,
			filter: undefined,
			type: "text",
			operation: "=",
			options: [
				{
					label: 'Igual',
					value: '='
				},
				{
					label: 'Maior',
					value: '[gt]='
				},
				{
					label: 'Menor',
					value: '[lt]='
				},
				{
					label: 'Maior igual',
					value: '[gte]='
				},
				{
					label: 'Menor igual',
					value: '[lte]='
				},
			],
	  
			showAdvanced: false,
			overrideValidators: false,
			message: useMessage(),

			rowProps: (row) => {
				return {
					style: "cursor: pointer",
					onClick: () => {
						this.showModalFunc(row._id);
					}
				}
			},
			showModal: ref(false),

			loading: { 
				items: false,
				update: false
			},

            page: 1,
            pageCount: 1,
            limit: 50,
		};
	},

	methods: {
		async getItems() {
			try {
				let query = "?page="+this.page+"&";

				if (this.field && this.filter) {
					if (this.type === "text") {
						query = query+this.field+"="+this.filter;
					}
					
					if (this.type === "numeric") {
						query = query+this.field+this.operation+this.filter;
					}
				}
				
				this.loading.items = true;

				const response = await axios.get(window.apiURL + "/api/v1/admin/"+this.route+query, {
					withCredentials: true
				});
				
				const data = response.data.data[this.route];
				this.items = [];

				for (const item of data) {
                    const obj = {};
                    obj[this.fields[0]] = item[this.fields[0]];
                    obj[this.fields[1]] = item[this.fields[1]];
                    obj[this.fields[2]] = item[this.fields[2]];
            
					this.items.push(obj);
					this.itemsRaw.push(item);
				}

				if (this.items?.length >= 10 && (this.page === this.pageCount)) {
					this.pageCount += 1;
				}
				
				if (this.items?.length >= 1 && this.page > this.pageCount) {
					this.pageCount = this.page;
				}
			} catch (err) {
				console.log(err);
				this.message.error(err.response.data.message ? err.response.data.message : err);
			} finally {
				this.loading.items = false;
			}
		},
		
		async updateItem() {
			try {
				this.loading.update = true;
				const data = JSON.parse(this.selectedItem);
				data.override = this.overrideValidators;
				data.credentials = this.$root.credentials;

				const response = await axios.patch(window.apiURL + "/api/v1/admin/"+this.route, data, {
					withCredentials: true
				});

				this.message.success(response.data.status);
			} catch (err) {
				console.log(err);
				this.message.error(err.response.data.message ? err.response.data.message : err);
			} finally {
				this.loading.update = false;
			}
		},

		async deleteItem() {
			try {
				this.loading.delete = true;
				const data = JSON.parse(this.selectedItem);
				
				const response = await axios.delete(window.apiURL + "/api/v1/admin/"+this.route+"/"+data._id, {
					withCredentials: true
				});

				this.message.success(response.data.status);
			} catch (err) {
				console.log(err);
				this.message.error(err.response.data.message ? err.response.data.message : err);
			} finally {
				this.loading.delete = false;
			}
		},

		invertItemsList() {
			this.items.reverse();
		},

		showModalFunc(ID) {
			for (const item of this.itemsRaw) {
				if (item._id === ID) {
					this.selectedItem = JSON.stringify(item, null, "\t");
					return this.showModal = true;
				}
			}

			this.message.error("Item não encontrado.");
		}
	},

	computed: {
        
	},

	watch: {
		page() {
			this.getItems();
		}
	},
	
	mounted() {
		this.getItems();
	}
})
</script>
