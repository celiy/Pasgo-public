<template>
	<Table 
		element="Ordens se serviço"
		:columns="columns"
		:fields="fields"
		route="ordens"
	/>
	
</template>

<script>
import { defineComponent } from "vue";
import Table from "../components/Table.vue";

export default defineComponent({
	components: {
		Table
	},

	data() {
		return {
			columns: [
        		{
					title: "ID",
					key: "_id"
				},
        		{
					title: "Descrição",
					key: "descricao"
				},
        		{
					title: "Data de emissão",
					key: "dataEmissao"
				},
			],

			fields: ["_id", "descricao", "dataEmissao"]
		}
	}
})
</script>
