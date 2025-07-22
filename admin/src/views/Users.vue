<template>
	<Table 
		element="Usuário"
		:columns="columns"
		:fields="fields"
		route="users"
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
					title: "Name",
					key: "name"
				},
        		{
					title: "Email",
					key: "email"
				},
			],

			fields: ["_id", "name", "email"]
		}
	}
})
</script>
