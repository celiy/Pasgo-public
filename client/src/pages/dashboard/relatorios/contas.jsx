import SelectSearch from "@/components/select-search"
import { Button } from '@/components/ui/button'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from '@/components/ui/separator'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { fetchRequest } from '@/hooks/axiosHook'
import ViewHeader from '@/layouts/viewHeader'
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Banknote, Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import moment from 'moment'
import React, { useEffect } from 'react'
import { toast } from "sonner"

export default function RelatoriosContas() {
    const { getData, data, updating, error } = fetchRequest('/api/v1/');
    const [ fornecedores, setFornecedores ]               = React.useState([{}]);
    const [ funcionarios, setFuncionarios ]               = React.useState([{}]);
    const [ funcionario, setFuncionario ]                 = React.useState('');
    const [ searchValue, setSearchValue ]                 = React.useState([{}]);
    const [ fornecedor, setFornecedor ]                   = React.useState([{}]);
    const [ relatorio, setRelatorio ]                     = React.useState(null);
    const [ clientes, setClientes ]                       = React.useState([{}]);
    const [ cliente, setCliente ]                         = React.useState("");
    const [ filtro, setFiltro ]                           = React.useState("");
    const [ date1, setDate1 ]                             = React.useState(null);
    const [ date2, setDate2 ]                             = React.useState(null);
    
    const handleSearchChange = (value, id) => {
        setSearchValue({value: value, id: id});
    };

    const handleFonrecedorChange = (value) => {
        setFornecedor(value);
    };

    const handleFuncionarioChange = (value) => {
        setFuncionario(value);
    };

    const handleClienteChange = (value) => {
        setCliente(value);
    };

    const checkDateFilters = () => {
        if (!date1) {
            toast.error("Selecione uma data inicial!");
            return false;
        }

        if (!date2) {
            toast.error("Selecione uma data final!");
            return false;
        }

        return true;
    }

    const handleApplyFilters = async () => {
        if (!checkDateFilters()) {
            return;
        }

        const newDate1 = new Date(date1).toISOString();
        const newDate2 = new Date(date2).toISOString();

        if (filtro === "Por cliente") {
            if (!cliente) {
                toast.error("Selecione um cliente!");
                return;
            }

            try {
                const response = await getData("relatorios/contas?limit=1000&tipoEntidade=cliente&entidade@id="+cliente+"&vencimento[gte]="+newDate1+"&vencimento[lte]="+newDate2);

                const relatorio = response?.data?.relatorio;
                const naoPagas = [];
                const pagas = [];
                let sumSubtoal = {
                    pagas: 0,
                    naoPagas: 0
                }

                for (const item of relatorio) {
                    let detailed = {};

                    detailed.subtotal = item.subtotal;
                    detailed.vencimento = item.vencimento;
                    detailed.pagamento = item.pagamento;
                    
                    if (item.quitado === "Sim") {
                        sumSubtoal.pagas += item.subtotal;
                        pagas.push(detailed);
                    }

                    if (item.quitado === "Não") {
                        sumSubtoal.naoPagas += item.subtotal;
                        naoPagas.push(detailed);
                    }
                }

                const newRelatorio = {
                    cliente: clientes.find(c => c.value === cliente)?.label,
                    dataInicial: newDate1,
                    dataFinal: newDate2,
                    dados: {
                        pagas: pagas,
                        naoPagas: naoPagas,
                        sumSubtoal
                    }
                }
                
                setRelatorio(newRelatorio);
            } catch (error) {
                console.log(error);
            }
        } else if (filtro === "Por funcionário") {
            if (!funcionario) {
                toast.error("Selecione um funcionário!");
                return;
            }

            try {
                const response = await getData("relatorios/contas?limit=1000&tipoEntidade=funcionario&entidade@id="+funcionario+"&vencimento[gte]="+newDate1+"&vencimento[lte]="+newDate2);

                const relatorio = response?.data?.relatorio;
                const naoPagas = [];
                const pagas = [];
                let sumSubtoal = {
                    pagas: 0,
                    naoPagas: 0
                }

                for (const item of relatorio) {
                    let detailed = {};

                    detailed.subtotal = item.subtotal;
                    detailed.vencimento = item.vencimento;
                    detailed.pagamento = item.pagamento;

                    if (item.quitado === "Sim") {
                        sumSubtoal.pagas += item.subtotal;
                        pagas.push(detailed);
                    }

                    if (item.quitado === "Não") {
                        sumSubtoal.naoPagas += item.subtotal;
                        naoPagas.push(detailed);
                    }
                }
                
                const newRelatorio = {
                    funcionario: funcionarios.find(f => f.value === funcionario)?.label,
                    dataInicial: newDate1,
                    dataFinal: newDate2,
                    dados: {
                        pagas: pagas,
                        naoPagas: naoPagas,
                        sumSubtoal
                    }
                }
                
                setRelatorio(newRelatorio);
            } catch (error) {
                console.log(error);
            }
        } else if (filtro === "Por fornecedor") {
            if (!fornecedor) {
                toast.error("Selecione um fornecedor!");
                return;
            }

            try {
                const response = await getData("relatorios/contas?limit=1000&tipoEntidade=fornecedor&entidade@id="+fornecedor+"&vencimento[gte]="+newDate1+"&vencimento[lte]="+newDate2);

                const relatorio = response?.data?.relatorio;
                const naoPagas = [];
                const pagas = [];
                let sumSubtoal = {
                    pagas: 0,
                    naoPagas: 0
                }

                for (const item of relatorio) {
                    let detailed = {};

                    detailed.subtotal = item.subtotal;
                    detailed.vencimento = item.vencimento;
                    detailed.pagamento = item.pagamento;

                    if (item.quitado === "Sim") {
                        sumSubtoal.pagas += item.subtotal;
                        pagas.push(detailed);
                    }

                    if (item.quitado === "Não") {
                        sumSubtoal.naoPagas += item.subtotal;
                        naoPagas.push(detailed);
                    }
                }
                
                const newRelatorio = {
                    fornecedor: fornecedores.find(f => f.value === fornecedor)?.label,
                    dataInicial: newDate1,
                    dataFinal: newDate2,
                    dados: {
                        pagas: pagas,
                        naoPagas: naoPagas,
                        sumSubtoal
                    }
                }
                
                setRelatorio(newRelatorio);
            } catch (error) {
                console.log(error);
            }
        } else if (filtro === "Própria") {
            try {
                const response = await getData("relatorios/contas?limit=1000&tipoEntidade=propria&vencimento[gte]="+newDate1+"&vencimento[lte]="+newDate2);

                const relatorio = response?.data?.relatorio;
                const naoPagas = [];
                const pagas = [];
                let sumSubtoal = {
                    pagas: 0,
                    naoPagas: 0
                }

                for (const item of relatorio) {
                    let detailed = {};

                    detailed.subtotal = item.subtotal;
                    detailed.vencimento = item.vencimento;
                    detailed.pagamento = item.pagamento;

                    if (item.quitado === "Sim") {
                        sumSubtoal.pagas += item.subtotal;
                        pagas.push(detailed);
                    }

                    if (item.quitado === "Não") {
                        sumSubtoal.naoPagas += item.subtotal;
                        naoPagas.push(detailed);
                    }
                }
                
                const newRelatorio = {
                    dataInicial: newDate1,
                    dataFinal: newDate2,
                    dados: {
                        pagas: pagas,
                        naoPagas: naoPagas,
                        sumSubtoal
                    }
                }

                console.log(newRelatorio)
                
                setRelatorio(newRelatorio);
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                const response = await getData("relatorios/contas?limit=1000&vencimento[gte]="+newDate1+"&vencimento[lte]="+newDate2);

                const relatorio = response?.data?.relatorio;
                const naoPagas = [];
                const pagas = [];
                let sumSubtoal = {
                    pagas: 0,
                    naoPagas: 0
                }

                for (const item of relatorio) {
                    let detailed = {};

                    detailed.subtotal = item.subtotal;
                    detailed.vencimento = item.vencimento;
                    detailed.pagamento = item.pagamento;
                    
                    if (item.quitado === "Sim") {
                        sumSubtoal.pagas += item.subtotal;
                        pagas.push(detailed);
                    }

                    if (item.quitado === "Não") {
                        sumSubtoal.naoPagas += item.subtotal;
                        naoPagas.push(detailed);
                    }
                }

                const newRelatorio = {
                    data: true,
                    dataInicial: newDate1,
                    dataFinal: newDate2,
                    dados: {
                        pagas: pagas,
                        naoPagas: naoPagas,
                        sumSubtoal
                    }
                }
                
                setRelatorio(newRelatorio);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const getDados = async () => {
        let response = [];

        if (searchValue.id === "funcionario") {
            if (searchValue.value?.length > 0) {
                response = await getData("cadastros/funcionarios?nome="+searchValue.value+"&limit=5");
            } else {
                response = await getData("cadastros/funcionarios?limit=5");
            }
        } else if (searchValue.id === "cliente") {
            if (searchValue.value.length > 0) {
                response = await getData("cadastros/clientes?nome="+searchValue.value+"&limit=5");
            } else {
                response = await getData("cadastros/clientes?limit=5");
            }
        } else if (searchValue.id === "fornecedor") {
            if (searchValue.value.length > 0) {
                response = await getData("cadastros/fornecedores?nome="+searchValue.value+"&limit=5");
            } else {
                response = await getData("cadastros/fornecedores?limit=5");
            }
        }
        
        if (response.data?.funcionarios){
            const resposta = response.data.funcionarios;
            const newObj = [];
            
            resposta.forEach(funcionario => {
                const obj = { label: funcionario.nome, value: funcionario._id };
                newObj.push(obj);
            });

            setFuncionarios(newObj);
        }

        if (response.data?.clientes){
            const resposta = response.data.clientes;
            const newObj = [];

            resposta.forEach(cliente => {
                const obj = { label: cliente.nome, value: cliente._id };
                newObj.push(obj);
            });

            setClientes(newObj);
        }

        if (response.data?.fornecedores){
            const resposta = response.data.fornecedores;
            const newObj = [];

            resposta.forEach(fornecedor => {
                const obj = { label: fornecedor.nome, value: fornecedor._id };
                newObj.push(obj);
            });

            setFornecedores(newObj);
        }
    }
    
    useEffect(() => {
        getDados();
    }, [searchValue]);

    useEffect(() => {
        const getVendasStats = async () => {
            if (filtro === "Por cliente") {
                const res2 = await getData("cadastros/clientes?limit=5");

                if (res2.data.clientes){
                    const resposta = res2.data.clientes;
                    const newObj = [];
                    
                    resposta.forEach(cliente => {
                        const obj = { label: cliente.nome, value: cliente._id };
                        newObj.push(obj);
                    });
    
                    setClientes(newObj);
                }
            }
            
            if (filtro === "Por funcionário") {
                const res3 = await getData("cadastros/funcionarios?limit=5");

                if (res3.data.funcionarios){
                    const resposta = res3.data.funcionarios;
                    const newObj = [];
                    
                    resposta.forEach(funcionario => {
                        const obj = { label: funcionario.nome, value: funcionario._id };
                        newObj.push(obj);
                    });

                    setFuncionarios(newObj);
                }
            }

            if (filtro === "Por fornecedor") {
                const res3 = await getData("cadastros/fornecedores?limit=5");

                if (res3.data.fornecedores){
                    const resposta = res3.data.fornecedores;
                    const newObj = [];
                    
                    resposta.forEach(fornecedor => {
                        const obj = { label: fornecedor.nome, value: fornecedor._id };
                        newObj.push(obj);
                    });

                    setFornecedores(newObj);
                }
            }
        };
        
        getVendasStats();
    }, [filtro]);

    return (
        <AnimatedLayout>
            <div className='m-6 mt-10 ml-0 sm:ml-6'>
                <ViewHeader 
                    title="Relatório de contas"
                    icon={<Banknote />}
                />

                <Separator className='mt-2 mb-4'/>

                <div className='grid grid-cols-1 gap-4 mb-2 lg:grid-cols-2 md:gap-0'>
                    <div className="mr-0 mb -2 lg:mb-0 lg:mr-2">
                        <h4>Tipos de relatório</h4>
                        <p className='mb-2'>
                            <b>Por cliente:</b> <span className='text-foreground/80'>Contas pagas/serem pagas por um cliente.</span> <br/>
                            <b>Por funcionário:</b> <span className='text-foreground/80'>Contas pagas/serem pagas por um funcionário.</span> <br/>
                            <b>Por fornecedor:</b> <span className='text-foreground/80'>Contas pagas/serem pagas por um fornecedor.</span> <br/>
                            <b>Própria:</b> <span className='text-foreground/80'>Contas pagas/serem pagas por você.</span> <br/>
                            <b>Por data:</b> <span className='text-foreground/80'>Resumo de contas por data.</span>
                        </p>
                        
                        <div className='grid items-end justify-start lg:grid-cols-[auto_1fr] gap-2 mt-4'>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button 
                                        variant="outline"
                                    >
                                        <ChevronDown />
                                        Tipo
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuRadioGroup value={filtro} onValueChange={setFiltro}>
                                    <DropdownMenuRadioItem value="Por cliente">Por cliente</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Por funcionário">Por funcionário</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Por fornecedor">Por fornecedor</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Própria">Própria</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Por data">Por data</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {filtro === "Por cliente" &&
                                <SelectSearch 
                                    itens={clientes} 
                                    onChange={handleClienteChange} 
                                    onSearchChange={handleSearchChange} 
                                    id={'cliente'} 
                                />
                            }

                            {filtro === "Por funcionário" &&  
                                <SelectSearch 
                                    itens={funcionarios} 
                                    onChange={handleFuncionarioChange} 
                                    onSearchChange={handleSearchChange} 
                                    id={'funcionario'} 
                                />
                            }

                            {filtro === "Por fornecedor" &&  
                                <SelectSearch 
                                    itens={fornecedores} 
                                    onChange={handleFonrecedorChange} 
                                    onSearchChange={handleSearchChange} 
                                    id={'fornecedor'} 
                                />
                            }

                            {(filtro === "Por data" || filtro === "Por cliente" || filtro === "Por funcionário" || filtro === "Por fornecedor" || filtro === "Própria") &&
                                <div className='flex items-center justify-start col-span-2 gap-2 overflow-x-auto'>
                                    <div>
                                        <p>Data inicial</p>
                                        <Popover className="rounded-r-none">
                                            <PopoverTrigger asChild className="rounded-r-none">
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "justify-start text-left font-normal rounded-r-none",
                                                        !date1 && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                                    {date1 ? format(date1, "PPP") : <span>Selecione uma data</span>}
                                                </Button>
                                            </PopoverTrigger>

                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={date1}
                                                    onSelect={setDate1}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    
                                    <div>
                                        <p>Data final</p>
                                        <Popover className="rounded-r-none">
                                            <PopoverTrigger asChild className="rounded-r-none">
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "justify-start text-left font-normal rounded-r-none",
                                                        !date2 && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                                    {date2 ? format(date2, "PPP") : <span>Selecione uma data</span>}
                                                </Button>
                                            </PopoverTrigger>

                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={date2}
                                                    onSelect={setDate2}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            }
                        </div>
                        
                        {(filtro === "Por data" || filtro === "Por cliente" || filtro === "Por funcionário" || filtro === "Por fornecedor" || filtro === "Própria") && 
                            <Button
                                className="mt-2"
                                onClick={handleApplyFilters}
                            >
                                Aplicar filtros
                            </Button>
                        }
                    </div>
                    
                    <div className="mt-2 ml-0 lg:mt-0 lg:ml-2">
                        <h4>Fazer relatório de contas</h4>
                        <p>
                            Para começar, selecione que tipo de relatório você deseja fazer. <br />
                            Após isso, clique em "Aplicar filtros" que iremos pegar os dados que correspondem com os filtros e gerar um relatório a partir disso.
                        </p>
                    </div>
                </div>
                
                {(filtro === "Por data" || filtro === "Por cliente" || filtro === "Por funcionário" || filtro === "Por fornecedor" || filtro === "Própria") && <>
                    <Separator className='mt-6 mb-2'/>
                    
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-0'>
                        <div>
                            <h4>Filtros aplicados:</h4>
                            <p>
                                {filtro === "Por cliente" && 
                                    <><b>Cliente:</b> {clientes.find(c => c.value === cliente)?.label} <br/>
                                </>}
                                {filtro === "Por funcionário" && 
                                    <><b>Funcionário:</b> {funcionarios.find(f => f.value === funcionario)?.label} <br/>
                                </>}
                                {filtro === "Por fornecedor" && 
                                    <><b>Fornecedor:</b> {fornecedores.find(f => f.value === fornecedor)?.label} <br/>
                                </>}
                                {filtro === "Própria" && 
                                    <><b>Conta própria</b><br/>
                                </>}
                                {(filtro === "Por data" || filtro === "Por cliente" || filtro === "Por funcionário" || filtro === "Por fornecedor" || filtro === "Própria") && 
                                    <><b>Data:</b> {date1 ? moment(date1).format("DD/MM/YYYY") : ""} - {date2 ? moment(date2).format("DD/MM/YYYY") : ""} <br/>
                                </>}
                            </p>
                        </div>
                    </div>
                </>}

                <Separator className='mt-2 mb-4'/>

                <div>
                    <div id="relatorio-clientes">
                        {relatorio && relatorio.cliente && <>
                            <Card className='p-4'>
                                <CardTitle>Relatório do cliente {clientes.find(c => c.value === cliente)?.label}</CardTitle>
                                <Separator className='my-3' />
                                <CardContent className='p-0'>
                                    <b>Data inicial:</b> {moment(relatorio.dataInicial).format("DD/MM/YYYY")} <br />
                                    <b>Data final:</b> {moment(relatorio.dataFinal).format("DD/MM/YYYY")}

                                    <Separator className='my-3' />

                                    {relatorio.dados?.pagas?.length > 0 && <>
                                        <div className="p-2 pl-3 rounded-tl rounded-tr bg-chart-2/60">
                                            <h4>
                                                Pagas {relatorio.dados?.pagas?.length} {relatorio.dados?.sumSubtoal?.pagas && ` | Total em R$: ${relatorio.dados?.sumSubtoal?.pagas}`}
                                            </h4>
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Subtotal</TableHead>
                                                    <TableHead>Tipo pagamento</TableHead>
                                                    <TableHead>Data</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {Array.isArray(relatorio.dados?.pagas) ? (
                                                    relatorio.dados?.pagas.map(item =><>
                                                        <TableRow>
                                                            <TableCell className="font-medium max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {item.subtotal}
                                                            </TableCell>
                                                            <TableCell className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {item.pagamento}
                                                            </TableCell>
                                                            <TableCell>
                                                                {moment(item.vencimento).format("DD/MM/YYYY")}
                                                            </TableCell>
                                                        </TableRow>
                                                    </>)) : 
                                                (<></>)}
                                            </TableBody>
                                        </Table>
                                    </>}
                                    
                                    {relatorio.dados?.pagas?.length > 0 && relatorio.dados?.naoPagas?.length > 0 &&
                                        <Separator className='my-3' />
                                    }
                                    
                                    {relatorio.dados?.naoPagas?.length > 0 && <>
                                        <div className="p-2 pl-3 rounded-tl rounded-tr bg-chart-4/60">
                                            <h4>
                                                Não pagas {relatorio.dados?.naoPagas?.length} {relatorio.dados?.sumSubtoal?.naoPagas && ` | Total em R$: ${relatorio.dados?.sumSubtoal?.naoPagas}`}
                                            </h4>
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Subtotal</TableHead>
                                                    <TableHead>Tipo pagamento</TableHead>
                                                    <TableHead>Data</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {Array.isArray(relatorio.dados?.naoPagas) ? (
                                                    relatorio.dados?.naoPagas.map(item =><>
                                                        <TableRow>
                                                            <TableCell className="font-medium max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {item.subtotal}
                                                            </TableCell>
                                                            <TableCell className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {item.dataPagamento}
                                                            </TableCell>
                                                            <TableCell>
                                                                {moment(item.vencimento).format("DD/MM/YYYY")}
                                                            </TableCell>
                                                        </TableRow>
                                                    </>)) : 
                                                (<></>)}
                                            </TableBody>
                                        </Table>
                                    </>}
                                </CardContent>
                            </Card>
                        </>}
                    </div>
                    
                    <div id="relatorio-funcionario">
                        {relatorio && relatorio.funcionario && <>
                            <Card className='p-4'>
                                <CardTitle>Relatório do funcionário {funcionarios.find(f => f.value === funcionario)?.label}</CardTitle>
                                <Separator className='my-3' />
                                <CardContent className='p-0'>
                                    <b>Data inicial:</b> {moment(relatorio.dataInicial).format("DD/MM/YYYY")} <br />
                                    <b>Data final:</b> {moment(relatorio.dataFinal).format("DD/MM/YYYY")}

                                    <Separator className='my-3' />

                                    {relatorio.dados?.pagas?.length > 0 && <>
                                        <div className="p-2 pl-3 rounded-tl rounded-tr bg-chart-2/60">
                                            <h4>
                                                Pagas {relatorio.dados?.pagas?.length} {relatorio.dados?.sumSubtoal?.pagas && ` | Total em R$: ${relatorio.dados?.sumSubtoal?.pagas}`}
                                            </h4>
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Subtotal</TableHead>
                                                    <TableHead>Tipo pagamento</TableHead>
                                                    <TableHead>Data</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {Array.isArray(relatorio.dados?.pagas) ? (
                                                    relatorio.dados?.pagas.map(item =><>
                                                        <TableRow>
                                                            <TableCell className="font-medium max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {item.subtotal}
                                                            </TableCell>
                                                            <TableCell className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {item.pagamento}
                                                            </TableCell>
                                                            <TableCell>
                                                                {moment(item.vencimento).format("DD/MM/YYYY")}
                                                            </TableCell>
                                                        </TableRow>
                                                    </>)) : 
                                                (<></>)}
                                            </TableBody>
                                        </Table>
                                    </>}
                                    
                                    {relatorio.dados?.pagas?.length > 0 && relatorio.dados?.naoPagas?.length > 0 &&
                                        <Separator className='my-3' />
                                    }
                                    
                                    {relatorio.dados?.naoPagas?.length > 0 && <>
                                        <div className="p-2 pl-3 rounded-tl rounded-tr bg-chart-4/60">
                                            <h4>
                                                Não pagas {relatorio.dados?.naoPagas?.length} {relatorio.dados?.sumSubtoal?.naoPagas && ` | Total em R$: ${relatorio.dados?.sumSubtoal?.naoPagas}`}
                                            </h4>
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Subtotal</TableHead>
                                                    <TableHead>Tipo pagamento</TableHead>
                                                    <TableHead>Data</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {Array.isArray(relatorio.dados?.naoPagas) ? (
                                                    relatorio.dados?.naoPagas.map(item =><>
                                                        <TableRow>
                                                            <TableCell className="font-medium max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {item.subtotal}
                                                            </TableCell>
                                                            <TableCell className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {item.dataPagamento}
                                                            </TableCell>
                                                            <TableCell>
                                                                {moment(item.vencimento).format("DD/MM/YYYY")}
                                                            </TableCell>
                                                        </TableRow>
                                                    </>)) : 
                                                (<></>)}
                                            </TableBody>
                                        </Table>
                                    </>}
                                </CardContent>
                            </Card>
                        </>}
                    </div>

                    <div id="relatorio-fornecedor">
                        {relatorio && relatorio.fornecedor && <>
                            <Card className='p-4'>
                                <CardTitle>Relatório do fornecedor {fornecedores.find(f => f.value === fornecedor)?.label}</CardTitle>
                                <Separator className='my-3' />
                                <CardContent className='p-0'>
                                    <b>Data inicial:</b> {moment(relatorio.dataInicial).format("DD/MM/YYYY")} <br />
                                    <b>Data final:</b> {moment(relatorio.dataFinal).format("DD/MM/YYYY")}

                                    <Separator className='my-3' />

                                    {relatorio.dados?.pagas?.length > 0 && <>
                                        <div className="p-2 pl-3 rounded-tl rounded-tr bg-chart-2/60">
                                            <h4>
                                                Pagas {relatorio.dados?.pagas?.length} {relatorio.dados?.sumSubtoal?.pagas && ` | Total em R$: ${relatorio.dados?.sumSubtoal?.pagas}`}
                                            </h4>
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Subtotal</TableHead>
                                                    <TableHead>Tipo pagamento</TableHead>
                                                    <TableHead>Data</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {Array.isArray(relatorio.dados?.pagas) ? (
                                                    relatorio.dados?.pagas.map(item =><>
                                                        <TableRow>
                                                            <TableCell className="font-medium max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {item.subtotal}
                                                            </TableCell>
                                                            <TableCell className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {item.pagamento}
                                                            </TableCell>
                                                            <TableCell>
                                                                {moment(item.vencimento).format("DD/MM/YYYY")}
                                                            </TableCell>
                                                        </TableRow>
                                                    </>)) : 
                                                (<></>)}
                                            </TableBody>
                                        </Table>
                                    </>}
                                    
                                    {relatorio.dados?.pagas?.length > 0 && relatorio.dados?.naoPagas?.length > 0 &&
                                        <Separator className='my-3' />
                                    }
                                    
                                    {relatorio.dados?.naoPagas?.length > 0 && <>
                                        <div className="p-2 pl-3 rounded-tl rounded-tr bg-chart-4/60">
                                            <h4>
                                                Não pagas {relatorio.dados?.naoPagas?.length} {relatorio.dados?.sumSubtoal?.naoPagas && ` | Total em R$: ${relatorio.dados?.sumSubtoal?.naoPagas}`}
                                            </h4>
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Subtotal</TableHead>
                                                    <TableHead>Tipo pagamento</TableHead>
                                                    <TableHead>Data</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {Array.isArray(relatorio.dados?.naoPagas) ? (
                                                    relatorio.dados?.naoPagas.map(item =><>
                                                        <TableRow>
                                                            <TableCell className="font-medium max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {item.subtotal}
                                                            </TableCell>
                                                            <TableCell className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {item.dataPagamento}
                                                            </TableCell>
                                                            <TableCell>
                                                                {moment(item.vencimento).format("DD/MM/YYYY")}
                                                            </TableCell>
                                                        </TableRow>
                                                    </>)) : 
                                                (<></>)}
                                            </TableBody>
                                        </Table>
                                    </>}
                                </CardContent>
                            </Card>
                        </>}
                    </div>

                    <div id="relatorio-data-proria">
                        {relatorio && (relatorio.data || filtro === "Própria") && <>
                            <Card className='p-4'>
                                {filtro === "Própria" && <>
                                    <CardTitle>Relatório de contas próprias</CardTitle>
                                </>}

                                {filtro !== "Própria" && <>
                                    <CardTitle>Relatório por data</CardTitle>
                                </>}
                               
                                <Separator className='my-3' />
                                
                                <CardContent className='p-0'>
                                    <b>Data inicial:</b> {moment(relatorio.dataInicial).format("DD/MM/YYYY")} <br />
                                    <b>Data final:</b> {moment(relatorio.dataFinal).format("DD/MM/YYYY")}

                                    <Separator className='my-3' />

                                    {relatorio.dados?.pagas?.length > 0 && <>
                                        <div className="p-2 pl-3 rounded-tl rounded-tr bg-chart-2/60">
                                            <h4>
                                                Pagas {relatorio.dados?.pagas?.length} {relatorio.dados?.sumSubtoal?.pagas && ` | Total em R$: ${relatorio.dados?.sumSubtoal?.pagas}`}
                                            </h4>
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Subtotal</TableHead>
                                                    <TableHead>Tipo pagamento</TableHead>
                                                    <TableHead>Data</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {Array.isArray(relatorio.dados?.pagas) ? (
                                                    relatorio.dados?.pagas.map(item =><>
                                                        <TableRow>
                                                            <TableCell className="font-medium max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {item.subtotal}
                                                            </TableCell>
                                                            <TableCell className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {item.pagamento}
                                                            </TableCell>
                                                            <TableCell>
                                                                {moment(item.vencimento).format("DD/MM/YYYY")}
                                                            </TableCell>
                                                        </TableRow>
                                                    </>)) : 
                                                (<></>)}
                                            </TableBody>
                                        </Table>
                                    </>}
                                    
                                    {relatorio.dados?.pagas?.length > 0 && relatorio.dados?.naoPagas?.length > 0 &&
                                        <Separator className='my-3' />
                                    }
                                    
                                    {relatorio.dados?.naoPagas?.length > 0 && <>
                                        <div className="p-2 pl-3 rounded-tl rounded-tr bg-chart-4/60">
                                            <h4>
                                                Não pagas {relatorio.dados?.naoPagas?.length} {relatorio.dados?.sumSubtoal?.naoPagas && ` | Total em R$: ${relatorio.dados?.sumSubtoal?.naoPagas}`}
                                            </h4>
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Subtotal</TableHead>
                                                    <TableHead>Tipo pagamento</TableHead>
                                                    <TableHead>Data</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {Array.isArray(relatorio.dados?.naoPagas) ? (
                                                    relatorio.dados?.naoPagas.map(item =><>
                                                        <TableRow>
                                                            <TableCell className="font-medium max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {item.subtotal}
                                                            </TableCell>
                                                            <TableCell className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {item.pagamento}
                                                            </TableCell>
                                                            <TableCell>
                                                                {moment(item.vencimento).format("DD/MM/YYYY")}
                                                            </TableCell>
                                                        </TableRow>
                                                    </>)) : 
                                                (<></>)}
                                            </TableBody>
                                        </Table>
                                    </>}
                                </CardContent>
                            </Card>
                        </>}
                    </div>
                    
                </div>
            </div>
        </AnimatedLayout>
    )
}