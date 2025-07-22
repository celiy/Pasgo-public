<template>
	<Table 
		element="Serviço"
		:columns="columns"
		:fields="fields"
		route="servicos"
	/>
	
</template>

<script>
import { defineComponent } from "vue";
import Table from "./../components/Table.vue";

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
					title: "Nome",
					key: "nome"
				},
        		{
					title: "Custo",
					key: "custo"
				},
			],

			fields: ["_id", "nome", "custo"]
		}
	}
})
</script>
