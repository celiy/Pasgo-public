<template>
    <nav 
        class="fixed overflow-hidden transition-all duration-300 border z-90 sm:relative bg-gray-600/5 border-black/30 backdrop-blur-[5px] h-full sm:h-auto"
        :class="{ 
            'lg:w-[10rem] md:[8rem] sm:[6rem]': isOpen,
            'w-[0rem]': !isOpen
        }"
    >
        <ul class="flex flex-col gap-2 px-2 py-2 whitespace-nowrap lg:w-[10rem] md:[8rem] sm:[6rem]">
            <div class="flex items-center w-full gap-2">
                <p class="font-bold">
                    Admin
                </p>
                <div class="flex justify-end w-full">
                    <n-button @click="closeNavBar">
                        <n-icon>
                            <CaretBack />
                        </n-icon>
                    </n-button>
                </div>
            </div>
            
            <li 
                v-for="link of links"
                :key="link.value"
                class="w-full"
            >
                <n-button 
                    @click="goToRoute(link.value)"
                    :type="$route.fullPath === link.value ? 'primary' : 'default'"
                    quaternary
                    style="width: -moz-available; display: flex; justify-content: flex-start;"
                >
                    {{ link.label }}
                </n-button>
            </li>
        </ul>
    </nav>
    <div class="fixed overflow-hidden transition-all duration-300 sm:relative z-90"
        :class="{ 
            'w-14': !isOpen,
            'w-0': isOpen
        }"
    >
        <div class="flex mx-2 my-2 w-14 whitespace-nowrap">
            <n-button 
                v-if="!isOpen"
                @click="closeNavBar"
                style="background-color: white;"
            >
                <n-icon>
                    <CaretForward />
                </n-icon>
            </n-button>
        </div>
    </div>
</template>

<script>
import { CaretBack, CaretForward } from "@vicons/ionicons5";
import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		CaretBack,
		CaretForward
	},

	data() {
		return {
			links: [
				{ label: "Home", value: "/" },
				{ label: "Auth", value: "/auth" },
				{ label: "Cadastros", value: "/cadastros" },
				{ label: "Financeiro", value: "/financeiro" },
				{ label: "Produtos", value: "/produtos" },
				{ label: "Serviços", value: "/servicos" },
                { label: "Ordens", value: "/ordens" },
				{ label: "Users", value: "/users" },
				{ label: "Vendas", value: "/vendas" },
                { label: "Use route", value: "/use-route" },
			],

            isOpen: true,
		}
	},

	methods: {
		goToRoute(route) {
			this.$router.push(route);
		},

        closeNavBar() {
            this.isOpen = !this.isOpen;
        }
	}
})
</script>