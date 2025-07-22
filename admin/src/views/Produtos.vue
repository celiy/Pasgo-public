<template>
	<Table 
		element="Produto"
		:columns="columns"
		:fields="fields"
		route="produtos"
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
					title: "Tipo",
					key: "tipo"
				},
			],

			fields: ["_id", "nome", "tipo"]
		}
	}
})
</script>
