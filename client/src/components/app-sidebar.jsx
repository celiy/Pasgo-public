import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";
import FeedBack from "@/elements/feedback.jsx";
import { deleteRequest } from "@/hooks/axiosHook.jsx";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@radix-ui/react-collapsible";
import { Banknote, CircleDollarSign, ClipboardList, Coins, LayoutDashboard, PackageIcon, SquareStack } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { ModeToggle } from './mode-toggle.jsx';
import { Button } from "./ui/button";

export function AppSidebar() {
  const { deleteData, deleted, deleting, deletionError } = deleteRequest('/api/v1/auth/logout');
  const navigate = useNavigate();

  async function logout() {
    await deleteData();
    navigate('/');
  }

  const cadastros = [
    { to: 'clientes#page=1', label: 'Clientes' },
    { to: 'funcionarios#page=1', label: 'Funcionários' },
    { to: 'fornecedores#page=1', label: 'Fornecedores' }
  ]

  const produtos = [
    { to: 'produtos#page=1', label: 'Gerenciar Produtos' },
    { to: 'estoque', label: 'Estoque' },
  ]

  const servicosOrcamentos = [
    { to: 'servicos#page=1', label: 'Gerenciar Serviços' },
    { to: 'ordens-servico#page=1', label: 'Ordens de serviço'},
    { to: 'orçamentos', label: 'Orçamentos'},
  ]

  const vendas = [
    { to: 'produtos-servicos#page=1', label: 'Gerenciar Vendas' },
    { to: 'caixa', label: 'Caixa' },
    { to: 'fluxo-caixa#page=1', label: 'Fluxo de caixa' },
  ]

  const contas = [
    { to: 'contas#page=1', label: 'Gerenciar Contas' },
  ]

  const relatorios = [
    { to: 'relatorios-vendas', label: 'Vendas' },
    { to: 'relatorios-contas', label: 'Contas' },
  ]

  return (
    <>
      <Sidebar className="shadow-md">
        <div>
          <SidebarGroupLabel>
            
            <Link key={"inicial"} to={"/"} className="ml-1 hover:text-foreground">
              <div className="flex items-center mt-2">
                <span className="mt-[0.2rem]">Pasgo</span>
              </div>
            </Link>
          </SidebarGroupLabel>
        </div>

        <DropdownMenuLabel className='flex items-center w-full pl-4'>
          <div className="mr-4">Início</div> 
          <div className="flex justify-end w-full mr-2">
            <FeedBack />
          </div>
        </DropdownMenuLabel>

        <SidebarContent>
          <SidebarGroup>
            {/* DASHBOARD */}
            <SidebarMenuItem key={"Home"}>
              <SidebarMenuButton asChild>
                <Link key={"inicio"} to={'inicio'}>
                  <LayoutDashboard />
                  <span>{"Dashboard"}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* CADASTROS */}
            <SidebarMenuItem key={"Cadastros"}>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <SquareStack />
                      Cadastros
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {cadastros.map(({ to, label }) => (
                        <SidebarMenuSubItem key={to}>
                          <Link to={to}>
                            <SidebarMenuSubButton>
                              <span>{label}</span>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenuItem>

            {/* PRODUTOS */}
            <SidebarMenuItem key={"Produtos"}>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <PackageIcon />
                      Produtos
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {produtos.map(({ to, label }) => (
                        <SidebarMenuSubItem key={to}>
                          <Link to={to}>
                            <SidebarMenuSubButton>
                              <span>{label}</span>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenuItem>

            {/* SERVICOS E ORCAMENTOS */}
            <SidebarMenuItem key={"Serviços e orçamentos"}>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Coins />
                      Serviços e Orçamentos
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {servicosOrcamentos.map(({ to, label }) => (
                        <SidebarMenuSubItem key={to}>
                          <Link to={to}>
                            <SidebarMenuSubButton>
                              <span>{label}</span>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenuItem>

            {/* VENDAS */}
            <SidebarMenuItem key={"Vendas"}>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <CircleDollarSign />
                      Vendas
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {vendas.map(({ to, label }) => (
                        <SidebarMenuSubItem key={to}>
                          <Link to={to}>
                            <SidebarMenuSubButton>
                              <span>{label}</span>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenuItem>

            {/* FINANCEIRO */}
            <SidebarMenuItem key={"Financeiro"}>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Banknote />
                      Financeiro
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {contas.map(({ to, label }) => (
                        <SidebarMenuSubItem key={to}>
                          <Link to={to}>
                            <SidebarMenuSubButton>
                              <span>{label}</span>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenuItem>
          
        
            {/* RELATÓRIOS */}
            <SidebarMenuItem key={"Relatórios"}>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <ClipboardList />
                      Relatórios
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {relatorios.map(({ to, label }) => (
                        <SidebarMenuSubItem key={to}>
                          <Link to={to}>
                            <SidebarMenuSubButton>
                              <span>{label}</span>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenuItem>
            
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>

          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenu>
                <DropdownMenuTrigger className='w-full'>
                  <SidebarMenuButton>
                    Conta e configurações
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">

                  <Link to='/dashboard/perfil'>
                    <Button variant='ghost' className='flex items-center justify-start w-full'>
                      Perfil
                    </Button>
                  </Link>

                  <Button onClick={logout} variant='ghost' className='flex items-center justify-start w-full'>
                    Sair
                  </Button>

                  <Separator className='my-2' />

                  <ModeToggle className='m-2' />

                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}

