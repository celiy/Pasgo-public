import { createMemoryHistory, createRouter } from 'vue-router';

import Auth from "./views/Auth.vue";
import Cadastros from "./views/Cadastros.vue";
import Financeiro from "./views/Financeiro.vue";
import Home from "./views/Home.vue";
import Ordem from "./views/Ordens.vue";
import Produtos from "./views/Produtos.vue";
import Servicos from "./views/Servicos.vue";
import UseRoute from "./views/UseRoute.vue";
import Users from "./views/Users.vue";
import Vendas from "./views/Vendas.vue";

const routes = [
  { path: '/', component: Home },
  { path: '/auth', component: Auth },
  { path: '/cadastros', component: Cadastros },
  { path: '/financeiro', component: Financeiro },
  { path: '/produtos', component: Produtos },
  { path: '/servicos', component: Servicos },
  { path: '/ordens', component: Ordem },
  { path: '/users', component: Users },
  { path: '/vendas', component: Vendas },
  { path: '/use-route', component: UseRoute },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router