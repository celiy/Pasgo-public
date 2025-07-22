<template>
	<Table 
		element="Conta"
		:columns="columns"
		:fields="fields"
		route="contas"
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
					title: "Subtotal",
					key: "subtotal"
				},
			],

			fields: ["_id", "nome", "subtotal"]
		}
	}
})
</script>
