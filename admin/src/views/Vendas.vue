<template>
	<Table 
		element="Venda"
		:columns="columns"
		:fields="fields"
		route="vendas"
	/>

	<Table 
		element="Caixa"
		:columns="columns2"
		:fields="fields2"
		route="caixas"
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
					title: "Descrição",
					key: "descricao"
				},
        		{
					title: "Subtotal",
					key: "subtotal"
				},
			],

			fields: ["_id", "descricao", "subtotal"],

			columns2: [
        		{
					title: "ID",
					key: "_id"
				},
        		{
					title: "Pagamento",
					key: "pagamento"
				},
        		{
					title: "Feito em",
					key: "feitoEm"
				},
			],

			fields2: ["_id", "pagamento", "feitoEm"]
		}
	}
})
</script>
