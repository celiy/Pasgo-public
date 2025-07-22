import SelectSearch from "@/components/select-search"
import { Button } from '@/components/ui/button'
import { Checkbox } from "@/components/ui/checkbox"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from '@/components/ui/separator'
import Helper from '@/elements/helper'
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { fetchRequest, patchRequest, postRequest } from "@/hooks/axiosHook"
import { DMA } from '@/hooks/getDatePTBR'
import { CircleX, HandCoins } from "lucide-react"
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from "react-hook-form"
import { useLocation } from 'react-router-dom'
import { toast } from "sonner"

const tipo_venda = [
    { label: "Presencial", value: "Presencial" },
    { label: "Internet", value: "Internet" },
]

const tipopagamento = [
    { label: "Boleto", value: "Boleto" },
    { label: "Crédito", value: "Crédito" },
    { label: "Débito", value: "Débito" },
    { label: "Dinheiro", value: "Dinheiro" },
    { label: "Cheque", value: "Cheque" },
]

export default function Orcamentos() {
    //#region Declarações
    const formRef = useRef(null);
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const [ checked, setChecked ] = useState(false);
    const [ checkedServ, setCheckedServ ] = useState(false);
    const [clientes, setClientes] = useState([{}]);
    const [funcionarios, setFuncionarios] = useState([{}]);
    const [servicos, setServicos] = useState([{}]);
    const [searchValue, setSearchValue] = useState('');
    const [status, setStatus] = useState('');
    const [tipoServico, setTipoServico] = useState('');
    const { getData, fetchedData, fetching, fetchError } = fetchRequest('/api/v1/');
    const { postData, loading, error, response } = postRequest('/api/v1/servicos-orcamentos/ordens-servicos');
    const { patchData, updating, patchedData, patchError } = patchRequest('/api/v1/servicos-orcamentos/ordens-servicos');
    const [funcionario, setFuncionario] = useState('');
    const [date, setDate] = useState(new Date());
    const [dateExec, setDateExec] = useState(new Date());
    const [dateConc, setDateConc] = useState(new Date());
    const [cliente, setCliente] = useState('');
    const [tipo, setTipo] = useState(null);
    const [servico, setServico] = useState('');
    const [desconto, setDesconto] = useState('');
    const [pagamento, setPagamento] = useState('');
    const [foipago, setFoipago] = useState('');
    const [total, setTotal] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [servQuant, setServQuant] = React.useState(0);
    const [servsOBJS, setSO] = React.useState([]);
    const [tempServ, setTempServ] = useState('');
    const [tempServQuant, setTempServQuant] = useState(0);
    const [tempServCusto, setTempServCusto] = useState('');
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm();
    
    const params = {
        id: urlParams.get('id'),
        update: true ? urlParams.get('update') === "true" : false,
        status: urlParams.get('status'),
        dataExecucao: urlParams.get('dataExecucao') ? new Date(urlParams.get('dataExecucao')) : null,
        dataConclusao: urlParams.get('dataConclusao') ? new Date(urlParams.get('dataConclusao')) : null,
        descricao: urlParams.get('descricao'),
        materiais: urlParams.get('materiais'),
        equipamentos: urlParams.get('equipamentos'),
    };

    const limparFormulario = () => {
        formRef.current.reset();
    };
    
    async function cadastro (params) {
        return await postData(params);
    }
    
    async function update(params) {
        return await patchData(params);
    }   
    
    const handleFuncionarioChange = (value) => {
        setFuncionario(value);
    };
    
    const handleServico = (value) => {
        setServico(value); 
    };
    const handleCliente = (value) => {
        setCliente(value);};
    const handleTipo = (value) => {
        setTipo(value);};
    const handleDesconto = (value) => {
        const newDesconto = value.target.value.toString().replace('.', '');
        if (newDesconto * 1 > 9){
            setDesconto("0."+newDesconto * 1);
        } else {
            setDesconto("0.0"+newDesconto * 1);
        }
    };
    const handlePagamento = (value) => {
        setPagamento(value);};
    const handleFoipago = (value) => {
        setFoipago(value);
    };
    const handleSearchChange = (value, id) => {
        setSearchValue({value: value, id: id});
    };
    const handleTempSNome = (event) => {
        setTempServ(event.target.value);
    };
    const handleTempSQuantidade = (event) => {
        setTempServQuant(event.target.value);
    };
    const handleTempSCusto = (event) => {
        setTempServCusto(event.target.value);
    };
    
    React.useEffect(() => {
        const getFields = async () => {
            if (searchValue.id === "cliente"){
                await getData("cadastros/clientes?limit=5&nome="+searchValue.value);
            } else if (searchValue.id === "servico"){
                await getData("servicos-orcamentos/servicos?limit=5&nome="+searchValue.value);
            } else if (searchValue.id === "funcionario"){
                await getData("cadastros/funcionarios?limit=5&nome="+searchValue.value);
            }
        }
        getFields();
    }, [searchValue]);

    React.useEffect(() => {
        if (fetchedData){
            let newObj = [];
            if (fetchedData.data.clientes){
                const resposta = fetchedData.data.clientes;
                resposta.forEach(cliente => {
                    const obj = { label: cliente.nome, value: { id: cliente._id, nome: cliente.nome }};
                    newObj.push(obj);
                });
                setClientes(newObj);
            } if (fetchedData.data.servicos){
                const resposta = fetchedData.data.servicos;
                resposta.forEach(servico => {
                    const obj = { label: servico.nome, value: {id: servico._id, venda: servico.venda, nome: servico.nome}};
                    newObj.push(obj);
                });
                setServicos(newObj);
            } if (fetchedData.data.funcionarios){
                const resposta = fetchedData.data.funcionarios;
                resposta.forEach(funcionario => {
                    const obj = { label: funcionario.nome, value: { id: funcionario._id, nome: funcionario.nome }};
                    newObj.push(obj);
                });
                setFuncionarios(newObj);
            }
 
        }
    }, [fetchedData]);

    React.useEffect(() => {
        setDateExec(params.dataExecucao);
        setDateConc(params.dataConclusao);
    }, []);

    React.useEffect(() => {
        const getFields = async () => {
            //await getData("cadastros/clientes?limit=5");
            await getData("servicos-orcamentos/servicos?limit=5");
            //await getData("cadastros/funcionarios?limit=5");
        }
        getFields();
    }, []);

    const handleSQ = (value) => {
        setServQuant(value.target.value)
    };
    const deleteServ = (index) => {
        const delArr = [...servsOBJS]
        delArr.splice(index, 1);
        setSO(delArr);
    }

    const addServico = () => {
        if (!servico) {
            toast.warning("Selecione um serviço!");
            return;
        }
        if (servQuant <= 0) {
            toast.warning("Insira uma quantidade!");
            return;
        }
        const newServ = {...servico};
        newServ.total = newServ.venda * servQuant;
        newServ.quantidade = servQuant * 1;
        
        const newServArr = [...servsOBJS, newServ];
        setSO(newServArr);
    };

    const addTempServico = () => {
        try {
            if (!tempServ) {
                toast.warning("Insira um serviço!"); 
            }
            else if (!tempServCusto) {
                toast.warning("Insira o custo do serviço!"); 
            }
            else if (!tempServQuant) {
                toast.warning("Insira a quantidade de serviços!"); 
            } else {
                const newServ = { 
                    id: (Date.now().toString(36) + Math.random().toString(36)).substr(0, 5),
                    nome: tempServ,
                    custo: tempServCusto * 1,
                    quantidade: tempServQuant * 1,
                    total: tempServCusto * tempServQuant
                };
                
                const newServArr = [...servsOBJS, newServ];
                setSO(newServArr);
            }

            setTempServQuant(0);
            setTempServCusto(0);
            setTempServ("");
            
        } catch (err) {
            console.log(err);
        }
        
    };

    useEffect(() => {
        let somaTotal = 0;
        
        if (checkedServ) {
            for (const serv of servsOBJS) {
                somaTotal += serv.total;
            }
        }

        const final = somaTotal + (total*1);
        setSubtotal((final - (final * desconto)).toFixed(2));
    }, [desconto, servsOBJS, total, checkedServ]);

    const onUpdate   = async (data) => {
        try {
            data.foiPago = foipago;
            data.id = params.id;
            data.dataExecucao = dateExec;
            data.dataConclusao = dateConc;
            data.status = status;

            let filteredData = {};
            for (const [key, value] of Object.entries(data)) {
                if (value !== null && value !== undefined && value.length > 0) {
                    filteredData[key] = value;
                }
            }

            const resposta = await update(filteredData);
            if (resposta.status == "success"){
                toast.success("Ordem atualizada");
                setTotal(0);
            }
        } catch (err) {
            toast.error(err.message);
            console.log(err);
        }
    }

    const onSubmit = async (data) => {
        try {
            if (pagamento === 'Boleto') {data.tipoPagamento = 'Boleto';
            } else if (pagamento === 'Crédito') {data.tipoPagamento = 'Crédito';
            } else if (pagamento === 'Débito') {data.tipoPagamento = 'Débito';
            } else if (pagamento === 'Dinheiro') {data.tipoPagamento = 'Dinheiro';
            } else if (pagamento === 'Cheque') {data.tipoPagamento = 'Cheque';}
            data.foiPago = foipago;
            data.dataExecucao = dateExec;
            data.dataConclusao = dateConc;
            data.dataPagamento = date;
            data.cliente = cliente;
            data.funcionario = funcionario;
            checkedServ ? data.servico = servsOBJS : data.servico = [];
            data.tipo = tipo;
            data.subtotal = subtotal;
            data.tipoServiço = tipoServico;
            data.status = status;
            data.valor = total;

            const resposta = await cadastro(data);
            if (resposta.status == "success"){
                toast.success("Ordem criada");
                limparFormulario();
                setDesconto(0);
                setTotal(0);
                setSO([]);
            }
        } catch (err) {
            toast.error(err.message);
            console.log(err);
        }
    }
    //#endregion

    return (
        <AnimatedLayout>
            <div className='m-6 mt-10'>
                <div className='grid grid-cols-2'>
                    <div className='flex gap-2'>
                        <h3>Criar orçamento</h3>
                        <Helper type="card" title="Ajuda"
                            desc="Um orçamento pode ter multiplos seviços atribuídos a ela."
                        />
                    </div>
                    <div className='justify-self-end'>
                        <DMA />
                    </div>
                </div>

                <Separator className='mt-2 mb-4'/>

                <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <div className='flex items-center gap-2 mb-2'>
                        <HandCoins />
                        <h4>Orçamento</h4>
                    </div>
                    <div className='grid items-start grid-cols-1 gap-4 p-4 mb-6 border border-l-4 border-r-4 rounded sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
                        {/* <div>
                            <p>Cliente *</p>
                            <SelectSearch 
                                itens={clientes} 
                                onChange={handleCliente} 
                                onSearchChange={handleSearchChange} 
                                id={'cliente'}
                            />
                        </div>
                        <div>
                            <p>Funcionário responsável</p>
                            <SelectSearch 
                                itens={funcionarios} 
                                onChange={handleFuncionarioChange} 
                                onSearchChange={handleSearchChange} 
                                id={'funcionario'}
                            />
                        </div>
                        <div>
                            <p>Tipo de ordem</p>
                            <SelectSearch 
                                itens={tipo_venda} 
                                onChange={handleTipo} 
                            />
                        </div>
                        <div>
                            <p>Status *</p>
                            <SelectSearch 
                                itens={[
                                    {label: "Aberta", value: "aberta"},
                                    {label: "Em andamento", value: "andamento"},
                                    {label: "Concluída", value: "concluida"},
                                    {label: "Cancelada", value: "cancelada"},
                                ]} 
                                onChange={(value) => setStatus(value)} 
                            />
                        </div>

                        <div>
                            <p>Tipo de serviço</p>
                            <SelectSearch 
                                itens={[
                                    {label: "Instalação", value: "instalacao"},
                                    {label: "Manuteção", value: "manutencao"},
                                    {label: "Reparo", value: "reparo"}
                                ]} 
                                onChange={(value) => setTipoServico(value)} 
                            />
                        </div> */}
                        <div>
                            <Input 
                                label="Desconto %"
                                {...register("desconto")} 
                                type='number' 
                                onChange={handleDesconto}
                                preventDefault
                                error={errors?.desconto?.message}
                            />
                        </div>
                        
                        <div>
                            <Input 
                                label="Valor"
                                type='number' 
                                onChange={(e) => setTotal(e.target.value)}
                                value={total}
                                preventDefault
                                error={errors?.total?.message}
                            />
                        </div>

                        <div>
                            <Input 
                                label="Subtotal"
                                type='number' 
                                disabled={true}
                                value={subtotal}
                                preventDefault
                                error={errors?.subtotal?.message}
                            />
                        </div>

                        {/* <div>
                            <p>Data da execução</p>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                    {dateExec ? format(dateExec, "PPP") : <span>Selecione...</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={dateExec}
                                        onSelect={setDateExec}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <p>Data da conclusão</p>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                    {dateConc ? format(dateConc, "PPP") : <span>Selecione...</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={dateConc}
                                        onSelect={setDateConc}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div>
                            <p>Data do pagamento</p>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                    {date ? format(date, "PPP") : <span>Selecione...</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div> */}
                    </div> 
                    
                    <div className='grid items-start grid-cols-1 gap-4 p-4 mb-6 border border-l-4 border-r-4 rounded sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2'>
                        <div>
                            <div className='flex items-center gap-2'>
                                <Checkbox 
                                    className='rounded border-foreground'
                                    onCheckedChange={(checked) => setCheckedServ(checked)}
                                />
                                <Label>Inserir lista de serviços</Label>
                            </div>
                            {checkedServ && <>
                                <div className="mb-2"/>
                                
                                <Label>Serviço</Label>
                                <SelectSearch 
                                    itens={servicos} 
                                    onChange={handleServico} 
                                    onSearchChange={handleSearchChange} 
                                    id={'servico'}
                                />

                                <div className="mb-2"/>
                                
                                <Label>Quantidade</Label>
                                <Input 
                                    type='number' 
                                    className="mb-2" 
                                    onChange={handleSQ} 
                                    preventDefault
                                />
                                
                                <Button 
                                    variant="outline" 
                                    onClick={addServico} 
                                    type="button" 
                                    className="mb-2 mr-2"
                                >
                                    + Adicionar
                                </Button>
                                
                                <Drawer>
                                    <DrawerTrigger className='flex flex-col items-start gap-2'>
                                        <Button variant="outline" type="button">+ Adicionar serviço único</Button>
                                        <Helper type="text"
                                            desc="Adiciona um serviço único que não fica salvo na base de dados."
                                        />
                                    </DrawerTrigger>
                                    <DrawerContent className="flex items-center justify-center">
                                        <div className="w-[100%] sm:w-[80%] md:w-[50%] lg:w-[40%]">
                                            <DrawerHeader>
                                            <DrawerTitle>Insira o serviço único</DrawerTitle>
                                            <DrawerDescription>
                                                <p style={{lineHeight: '1.3'}} className="mb-2">Este serviço não ficará salvo na base de dados dos serviços.</p>
                                                <Input 
                                                    label="Nome"
                                                    type='text' 
                                                    className="mb-2" 
                                                    onChange={handleTempSNome} 
                                                    preventDefault
                                                />
                                                <Input 
                                                    label="Custo"
                                                    type='number' 
                                                    className="mb-2" 
                                                    onChange={handleTempSCusto} 
                                                    preventDefault
                                                />
                                                <Input 
                                                    label="Quantidade"
                                                    type='number' 
                                                    className="" 
                                                    onChange={handleTempSQuantidade} 
                                                    preventDefault
                                                />
                                            </DrawerDescription>
                                            </DrawerHeader>
                                            <DrawerFooter>
                                            <DrawerClose>
                                                <Button type="button" className="w-full mb-2" onClick={addTempServico}>+ Adicionar</Button>
                                                <Button variant="outline" className="w-full">Cancelar</Button>
                                            </DrawerClose>
                                            </DrawerFooter>
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </>}
                        </div>
                        <div> 
                            {checkedServ && <>
                                <div className='grid grid-cols-[1fr_0.6fr_0.3fr]'>
                                    <Label className='py-2 pl-2 border rounded-tl'>Nome</Label>
                                    <Label className='py-2 pl-2 border'>Valor</Label>
                                    <Label className='py-2 pl-2 border rounded-tr'>Excluir</Label>  
                                </div>
                                {servsOBJS.map((item, index) => (
                                    <div key={index} className='grid grid-cols-[1fr_0.6fr_0.3fr]'>
                                        <p className={`border-x pt-1 pl-2 ${servsOBJS.length === index + 1 ? 'border-b rounded-bl' : ''}`}>{item.nome}</p>
                                        <p className={`border-x pt-1 pl-2 ${servsOBJS.length === index + 1 ? 'border-b' : ''}`}>{item.total} R$</p>
                                        <div className={`border-x ${servsOBJS.length === index + 1 ? 'border-b rounded-br' : ''}`}>
                                            <Button 
                                                onClick={() => deleteServ(index)} 
                                                variant='destructive' 
                                                className='w-full h-full'
                                                type='button'
                                            >
                                                <CircleX/>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </>}
                        </div>
                    </div>
                </form>
            </div>
        </AnimatedLayout>
    )
}