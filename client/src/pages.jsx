import NotFound from './pages/404page.jsx';
import About from './pages/about.jsx';
import AcceptDevice from './pages/acceptDevice';
import Ajuda from "./pages/ajuda";
import AuthPage from './pages/authPage';
import Credits from "./pages/credits";
import CadastrarCliente from './pages/dashboard/cadastros/cadastrar-cliente';
import CadastrarFornecedor from './pages/dashboard/cadastros/cadastrar-fornecedor';
import CadastrarFuncionario from './pages/dashboard/cadastros/cadastrar-funcionário';
import Clientes from './pages/dashboard/cadastros/clientes.jsx';
import Fornecedores from './pages/dashboard/cadastros/fornecedores.jsx';
import Funcionarios from './pages/dashboard/cadastros/funcionarios.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx';
import AdicionarConta from './pages/dashboard/Financeiro/adicionar-conta';
import Contas from './pages/dashboard/Financeiro/gerenciar-contas';
import Home from './pages/dashboard/home.jsx';
import AdicionarProduto from './pages/dashboard/produtos/adicionar-produto';
import Estoque from "./pages/dashboard/produtos/estoque";
import Produtos from './pages/dashboard/produtos/gerenciar-produtos';
import RelatoriosContas from './pages/dashboard/relatorios/contas.jsx';
import RelatoriosVendas from './pages/dashboard/relatorios/vendas.jsx';
import AdicionarOrdem from "./pages/dashboard/servicos-e-orcamentos/adicionar-ordem";
import AdicionarServico from './pages/dashboard/servicos-e-orcamentos/adicionar-serviço';
import Servicos from './pages/dashboard/servicos-e-orcamentos/gerenciar-serviços';
import Orcamentos from "./pages/dashboard/servicos-e-orcamentos/orcamentos";
import Ordens from "./pages/dashboard/servicos-e-orcamentos/ordem-servico";
import User from './pages/dashboard/user/user';
import AdicionarVenda from './pages/dashboard/vendas/adicionar-venda';
import Caixa from "./pages/dashboard/vendas/caixa";
import FluxoCaixa from "./pages/dashboard/vendas/fluxo-caixa";
import ProdutosEServicos from './pages/dashboard/vendas/gerenciar-vendas';
import ResetPassword from "./pages/resetPassword";
import Start from './pages/start.jsx';
import TermsAndConditions from "./pages/terms-conditions";
import Test from "./pages/test";

export default function Pages() {
    return [
        {
            path: '/',
            element: <Start />,
            errorElement: <NotFound />,
            children: [
                {
                    path: 'ajuda',
                    element: <Ajuda />,
                },
                {
                    path: 'sobre',
                    element: <About />,
                },
                {
                    path: 'termos-e-condicoes',
                    element: <TermsAndConditions />,
                },
                {
                    path: 'creditos',
                    element: <Credits />,
                },
            ]
        },
        {
            path: '/test',
            element: <Test />
        },
        {
            path: '/auth',
            element: <AuthPage />
        },
        {
            path: '/reset-password/:token',
            element: <ResetPassword />
        },
        {
            path: '/accept-new-device/:ip',
            element: <AcceptDevice />
        },
        {
            path: '/dashboard',
            element: <Home />,
            children: [
                {
                    path: 'inicio',
                    element: <Dashboard />
                },
                {
                    path: 'clientes',
                    element: <Clientes />,
                },
                {
                    path: 'clientes/cadastrar',
                    element: <CadastrarCliente />
                },
                {
                    path: 'fornecedores',
                    element: <Fornecedores />
                },
                {
                    path: 'fornecedores/cadastrar',
                    element: <CadastrarFornecedor />
                },
                {
                    path: 'funcionarios',
                    element: <Funcionarios />
                },
                {
                    path: 'funcionarios/cadastrar',
                    element: <CadastrarFuncionario />
                },
                {
                    path: 'produtos',
                    element: <Produtos />
                },
                {
                    path: 'produtos/adicionar',
                    element: <AdicionarProduto />
                },
                {
                    path: 'estoque',
                    element: <Estoque />
                },
                {
                    path: 'servicos',
                    element: <Servicos />
                },
                {
                    path: 'ordens-servico',
                    element: <Ordens />
                },
                {
                    path: 'orçamentos',
                    element: <Orcamentos />
                },
                {
                    path: 'ordens-servico/adicionar',
                    element: <AdicionarOrdem />
                },
                {
                    path: 'servicos/adicionar',
                    element: <AdicionarServico />
                },
                {
                    path: 'produtos-servicos',
                    element: <ProdutosEServicos />
                },
                {
                    path: 'produtos-servicos/adicionar',
                    element: <AdicionarVenda />
                },
                {
                    path: 'caixa',
                    element: <Caixa />
                },
                {
                    path: 'fluxo-caixa',
                    element: <FluxoCaixa />
                },
                {
                    path: 'contas',
                    element: <Contas />
                },
                {
                    path: 'contas/adicionar',
                    element: <AdicionarConta />
                },
                {
                    path: 'perfil',
                    element: <User />
                },
                {
                    path: 'relatorios-vendas',
                    element: <RelatoriosVendas />
                },
                {
                    path: 'relatorios-contas',
                    element: <RelatoriosContas />
                },
            ]
        },
    ];
}