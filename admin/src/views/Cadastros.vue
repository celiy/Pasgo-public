<template>
	<Table 
		element="Clientes"
		:columns="columns"
		:fields="fields"
		route="clientes"
	/>

  <Table 
		element="Fornecedores"
		:columns="columns"
		:fields="fields"
		route="fornecedores"
	/>

  <Table 
		element="Funcionários"
		:columns="columns"
		:fields="fields"
		route="funcionarios"
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
					title: "Email",
					key: "email"
				},
			],

			fields: ["_id", "nome", "email"]
		}
	}
})
</script>
