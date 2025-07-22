import SelectComponent from "@/components/select-component"
import SelectSearch from "@/components/select-search"
import { Button } from '@/components/ui/button'
import { Calendar } from "@/components/ui/calendar"
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from '@/components/ui/separator'
import { Textarea } from "@/components/ui/textarea"
import Helper from '@/elements/helper'
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { fetchRequest, patchRequest, postRequest } from "@/hooks/axiosHook"
import { DMA } from '@/hooks/getDatePTBR'
import FormSection, { SectionHeader } from "@/layouts/formSection"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon, CircleDollarSign, CircleX, MapPin } from "lucide-react"
import moment from "moment"
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useForm } from "react-hook-form"
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
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

export default function AdicionarVenda() {
    //#region Declarações
    const formRef = useRef(null);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const location = useLocation();
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(location.search);
    const [checked, setChecked] = useState(false);
    const [checkedServ, setCheckedServ] = useState(false);
    const [checkedProd, setCheckedProd] = useState(false);
    const [clientes, setClientes] = useState([{}]);
    const [funcionarios, setFuncionarios] = useState([{}]);
    const [produtos, setProdutos] = useState([{}]);
    const [servicos, setServicos] = useState([{}]);
    const [searchValue, setSearchValue] = useState('');
    const [page, setPage] = useState(1);
    const { getData, fetchedData, fetching, fetchError } = fetchRequest('/api/v1/');
    const { postData, loading, error, response } = postRequest('/api/v1/vendas/vendasAPI');
    const { patchData, updating, patchedData, patchError } = patchRequest('/api/v1/vendas/vendasAPI');
    const [funcionario, setFuncionario] = useState('');
    const [date, setDate] = useState(new Date());
    const [cliente, setCliente] = useState('');
    const [tipo, setTipo] = useState(null);
    const [servico, setServico] = useState('');
    const [produto, setProduto] = useState('');
    const [valor, setValor] = useState(0);
    const [desconto, setDesconto] = useState('');
    const [pagamento, setPagamento] = useState('');
    const [foipago, setFoipago] = useState('');
    const [subtotal, setSubtotal] = useState(0);
    const [prodQuant, setProdQuant] = React.useState(0);
    const [servQuant, setServQuant] = React.useState(0);
    const [servsOBJS, setSO] = React.useState([]);
    const [prodsOBJS, setPO] = React.useState([]);
    const [tempServ, setTempServ] = useState('');
    const [tempServQuant, setTempServQuant] = useState(0);
    const [tempServCusto, setTempServCusto] = useState('');
    const [issuesMSG, setIssuesMSG] = useState("");
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm();

    const params = {
        id: urlParams.get('id'),
        update: true ? urlParams.get('update') === "true" : false,
    };

    const limparFormulario = () => {
        formRef.current.reset();
    };

    async function cadastro(params) {
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
    const handleProduto = (value) => {
        setProduto(value);
    };
    const handleCliente = (value) => {
        setCliente(value);
    };
    const handleTipo = (value) => {
        setTipo(value);
    };
    const handleDesconto = (value) => {
        const newDesconto = value.target.value.toString().replace('.', '');
        if (newDesconto * 1 > 9) {
            setDesconto("0." + newDesconto * 1);
        } else {
            setDesconto("0.0" + newDesconto * 1);
        }
    };
    const handlePagamento = (value) => {
        setPagamento(value);
    };
    const handleFoipago = (value) => {
        setFoipago(value);
    };
    const handleSearchChange = (value, id) => {
        setSearchValue({ value: value, id: id });
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
            if (searchValue.id === "cliente") {
                await getData("cadastros/clientes?limit=5&nome=" + searchValue.value);
            } else if (searchValue.id === "servico") {
                await getData("servicos-orcamentos/servicos?limit=5&nome=" + searchValue.value);
            } else if (searchValue.id === "produto") {
                await getData("produtos/produtosAPI?limit=5&nome=" + searchValue.value);
            } else if (searchValue.id === "funcionario") {
                await getData("cadastros/funcionarios?limit=5&nome=" + searchValue.value);
            }
        }
        getFields();
    }, [searchValue]);

    React.useEffect(() => {
        if (fetchedData) {
            let newObj = [];
            if (fetchedData.data.clientes) {
                const resposta = fetchedData.data.clientes;
                resposta.forEach(cliente => {
                    const obj = { label: cliente.nome, value: { id: cliente._id, nome: cliente.nome } };
                    newObj.push(obj);
                });
                setClientes(newObj);
            } if (fetchedData.data.servicos) {
                const resposta = fetchedData.data.servicos;
                resposta.forEach(servico => {
                    const obj = { label: servico.nome, value: { id: servico._id, venda: servico.venda, nome: servico.nome } };
                    newObj.push(obj);
                });
                setServicos(newObj);
            } if (fetchedData.data.produtos) {
                const resposta = fetchedData.data.produtos;
                resposta.forEach(produto => {
                    const obj = { label: produto.nome, value: { id: produto._id, valor: produto.valor, nome: produto.nome } };
                    newObj.push(obj);
                });
                setProdutos(newObj);
            } if (fetchedData.data.funcionarios) {
                const resposta = fetchedData.data.funcionarios;
                resposta.forEach(funcionario => {
                    const obj = { label: funcionario.nome, value: { id: funcionario._id, nome: funcionario.nome } };
                    newObj.push(obj);
                });
                setFuncionarios(newObj);
            }

        }
    }, [fetchedData]);

    React.useEffect(() => {
        const getFields = async () => {
            await getData("cadastros/clientes?limit=5");
            await getData("servicos-orcamentos/servicos?limit=5");
            await getData("produtos/produtosAPI?limit=5");
            await getData("cadastros/funcionarios?limit=5");
        }
        getFields();
    }, []);

    const handleSQ = (value) => {
        setServQuant(value.target.value)
    };
    const handlePQ = (value) => {
        setProdQuant(value.target.value)
    };
    const deleteServ = (index) => {
        const delArr = [...servsOBJS]
        delArr.splice(index, 1);
        setSO(delArr);
    }
    const deleteProd = (index) => {
        const delArr = [...prodsOBJS]
        delArr.splice(index, 1);
        setPO(delArr);
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
        const newServ = { ...servico };
        newServ.total = newServ.venda * servQuant;
        newServ.quantidade = servQuant * 1;

        const newServArr = [...servsOBJS, newServ];
        setSO(newServArr);
    };
    const addProduto = () => {
        if (!produto) {
            toast.warning("Selecione um produto!");
            return;
        }
        if (prodQuant <= 0) {
            toast.warning("Insira uma quantidade!");
            return;
        }
        const newProd = { ...produto };
        newProd.total = newProd.valor * prodQuant;
        newProd.quantidade = prodQuant * 1;

        const newProdArr = [...prodsOBJS, newProd];
        setPO(newProdArr);
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
        if (checkedProd) {
            for (const prod of prodsOBJS) {
                somaTotal += prod.total;
            }
        }

        const final = somaTotal + (valor * 1);
        setSubtotal((final - (final * desconto)).toFixed(2));
    }, [desconto, servsOBJS, prodsOBJS, checkedProd, checkedServ, valor]);

    const onUpdate = async (data) => {
        try {
            data.foiPago = foipago;
            data.id = params.id;
            let filteredData = {};
            for (const [key, value] of Object.entries(data)) {
                if (value !== null && value !== undefined && value.length > 0) {
                    filteredData[key] = value;
                }
            }

            const resposta = await update(filteredData);
            if (resposta.status == "success") {
                toast.success("Venda atualizada");
                navigate(-1);
            }
        } catch (err) {
            toast.error(err?.data?.message || err?.message);
            console.log(err);
        }
    }

    const onSubmit = async (data) => {
        try {
            if (pagamento === 'Boleto') {
                data.tipoPagamento = 'Boleto';
            } else if (pagamento === 'Crédito') {
                data.tipoPagamento = 'Crédito';
            } else if (pagamento === 'Débito') {
                data.tipoPagamento = 'Débito';
            } else if (pagamento === 'Dinheiro') {
                data.tipoPagamento = 'Dinheiro';
            } else if (pagamento === 'Cheque') { data.tipoPagamento = 'Cheque'; }
            if (!checked) { data.listaDigitada = "" }
            data.foiPago = foipago;
            data.dataPagamento = date;
            data.cliente = cliente;
            data.funcionario = funcionario;
            checkedServ ? data.servico = servsOBJS : data.servico = [];
            checkedProd ? data.produto = prodsOBJS : data.produto = [];
            data.tipo = tipo;
            data.subtotal = subtotal;

            if (!data.descricao || (data.descricao && data.descricao.length < 3 && cliente.nome)) {
                data.descricao = `Venda para ${cliente.nome} em ${format(new Date(data.dataPagamento), 'dd MM yyyy')}`
            }

            const resposta = await cadastro(data);

            if (resposta.status == "success") {
                toast.success("Venda criada");
                limparFormulario();
                setSO([]);
                setPO([]);
                setDesconto(0);
                if (resposta.issues && resposta.issues.length > 0) {
                    let msg = resposta.issues.join(", ");
                    toast.warning("Os produtos: " + msg + " não existem mais no estoque (Quantidade de produtos = 0).");
                }
            }
        } catch (err) {
            toast.error(err?.data?.message || err?.message);
            console.log(err);
        }
    }
    //#endregion

    return (
        <AnimatedLayout>
            <div className='m-6 mt-10'>
                <div className='grid grid-cols-2'>
                    <div className='flex gap-2'>
                        {params.update && <h3>Editar venda</h3> || <h3>Adicionar venda</h3>}
                        <Helper type="card" title="Ajuda"
                            desc="Uma venda pode ter multiplos seviços e produtos atribuídos a ela."
                        />
                    </div>
                    <div className='justify-self-end'>
                        <DMA />
                    </div>
                </div>

                <Separator className='mt-2 mb-4' />

                <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <FormSection
                        title="Informações da venda"
                        icon={<CircleDollarSign />}
                        helper
                    >
                        {!params.update && <>
                            <div className="mb-6 form-layout">
                                <SectionHeader>
                                    Dados básicos
                                </SectionHeader>
                                <div>
                                    <Label>Cliente *</Label>
                                    <SelectSearch
                                        itens={clientes}
                                        onChange={handleCliente}
                                        onSearchChange={handleSearchChange}
                                        id={'cliente'}
                                    />
                                </div>
                                <div>
                                    <Label>Funcionário responsável</Label>
                                    <SelectSearch
                                        itens={funcionarios}
                                        onChange={handleFuncionarioChange}
                                        onSearchChange={handleSearchChange}
                                        id={'funcionario'}
                                    />
                                </div>
                                <div>
                                    <Label>Tipo de venda</Label>
                                    <SelectSearch
                                        itens={tipo_venda}
                                        onChange={handleTipo}
                                    />
                                </div>
                            </div>
                            <div className="mb-6 form-layout">
                                <SectionHeader>
                                    Dados do pagamento
                                </SectionHeader>

                                <div>
                                    <Input
                                        {...register("valor")}
                                        label="Valor"
                                        type='number'
                                        onChange={(e) => setValor(e.target.value)}
                                        preventDefault
                                        error={errors?.valor?.message}
                                    />
                                </div>
                                <div>
                                    <Input
                                        {...register("desconto")}
                                        label="Desconto %"
                                        type='number'
                                        onChange={handleDesconto}
                                        preventDefault
                                        error={errors?.desconto?.message}
                                    />
                                </div>
                                <div>
                                    <Label>Tipo de pagamento</Label>
                                    <SelectSearch
                                        itens={tipopagamento}
                                        onChange={handlePagamento}
                                        onSearchChange={handleSearchChange}
                                    />
                                </div>
                            </div>
                        </>}

                        <div className={`form-layout ${!params.update ? "mb-6" : ""}`}>
                            <SectionHeader>
                                Status
                            </SectionHeader>
                            <div>
                                <Label>Foi pago *</Label>
                                <SelectComponent itens={[
                                    { name: "Sim", value: "Sim" },
                                    { name: "Não", value: "Não" },
                                ]} onChange={handleFoipago} />
                                {params.update &&
                                    <p>Ao alterar o campo "Foi pago" para "Sim", a data de pagamento
                                        será alterada para a data atual.</p>
                                }
                            </div>
                        </div>

                        {!params.update && <>
                            <div className="form-layout">
                                <SectionHeader>
                                    Outros
                                </SectionHeader>
                                <div>
                                    <Input
                                        label="Subtotal"
                                        type='number'
                                        disabled={true}
                                        value={subtotal}
                                    />
                                </div>

                                <div key="nl-data">
                                    <Label>Data do pagamento</Label>
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
                                                {date ? moment(date).format("DD/MM/YYYY") : <span>Selecione uma data</span>}
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
                                </div>
                            </div>
                        </>}
                    </FormSection>

                    {!params.update && <>
                        <div className='grid items-start grid-cols-1 gap-4 p-4 mb-6 border border-l-4 border-r-4 rounded sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2'>
                            <div>
                                <div className='flex items-center gap-2'>
                                    <Checkbox
                                        className='rounded border-foreground'
                                        onCheckedChange={(checked) => setCheckedServ(checked)}
                                    />
                                    <Label>Inserir lista de serviços para venda</Label>
                                </div>
                                {checkedServ && <>
                                    <div className="mb-2" />
                                    <Label>Serviço</Label>
                                    <SelectSearch
                                        itens={servicos}
                                        onChange={handleServico}
                                        onSearchChange={handleSearchChange}
                                        id={'servico'}
                                        className="mb-2"
                                    />

                                    <div className="mb-2" />

                                    <Input
                                        label="Quantidade"
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
                                            <Button
                                                variant="outline"
                                                type="button"
                                            >
                                                + Adicionar serviço único
                                            </Button>

                                            <Helper type="text"
                                                desc="Adiciona um serviço único que não fica salvo na base de dados."
                                            />
                                        </DrawerTrigger>
                                        <DrawerContent className="flex items-center justify-center">
                                            <div className="w-[100%] sm:w-[80%] md:w-[50%] lg:w-[40%]">
                                                <DrawerHeader>
                                                    <DrawerTitle>Insira o serviço único</DrawerTitle>
                                                    <DrawerDescription>
                                                        <p style={{ lineHeight: '1.3' }} className="mb-2">Este serviço não ficará salvo na base de dados dos serviços.</p>
                                                        <p>Nome:</p>
                                                        <Input type='text' className="mb-2" onChange={handleTempSNome}
                                                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} />
                                                        <p>Custo:</p>
                                                        <Input type='number' className="mb-2" onChange={handleTempSCusto}
                                                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} />
                                                        <p>Quantidade:</p>
                                                        <Input type='number' className="" onChange={handleTempSQuantidade}
                                                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} />
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
                                            <p className={`border-x pl-2 pt-1 ${servsOBJS.length === index + 1 ? 'border-b rounded-bl' : ''}`}>{item.nome}</p>
                                            <p className={`border-x pl-2 pt-1 ${servsOBJS.length === index + 1 ? 'border-b' : ''}`}>{item.total} R$</p>
                                            <div className={`border-x ${servsOBJS.length === index + 1 ? 'border-b rounded-br' : ''}`}>
                                                <Button
                                                    onClick={() => deleteServ(index)}
                                                    variant='destructive'
                                                    className='w-full h-full'
                                                    type='button'
                                                >
                                                    <CircleX />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </>}
                            </div>
                        </div>

                        <div className='grid items-start grid-cols-1 gap-4 p-4 mb-6 border border-l-4 border-r-4 rounded sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2'>
                            <div>
                                <div className='flex items-center gap-2'>
                                    <Checkbox
                                        className='rounded border-foreground'
                                        onCheckedChange={(checked) => setCheckedProd(checked)}
                                    />
                                    <Label>Inserir lista de produtos para venda</Label>
                                </div>

                                {checkedProd && <>
                                    <div className="mb-2" />

                                    <Label>Produto</Label>
                                    <SelectSearch
                                        itens={produtos}
                                        onChange={handleProduto}
                                        onSearchChange={handleSearchChange}
                                        id={'produto'}
                                    />

                                    <div className="mb-2" />

                                    <Input
                                        label="Quantidade"
                                        type='number'
                                        className="mb-2"
                                        onChange={handlePQ}
                                        preventDefault
                                    />

                                    <Button
                                        variant="outline"
                                        onClick={addProduto}
                                        type="button"
                                    >
                                        + Adicionar produto
                                    </Button>
                                </>}
                            </div>

                            <div>
                                {checkedProd && <>
                                    <div className='grid grid-cols-[1fr_0.6fr_0.3fr]'>
                                        <Label className='py-2 pl-2 border rounded-tl'>Nome</Label>
                                        <Label className='py-2 pl-2 border'>Valor</Label>
                                        <Label className='py-2 pl-2 border rounded-tr'>Excluir</Label>
                                    </div>
                                    {prodsOBJS.map((item, index) => (
                                        <div key={index} className='grid grid-cols-[1fr_0.6fr_0.3fr]'>
                                            <p className={`border-x pt-1 pl-2 ${prodsOBJS.length === index + 1 ? 'border-b rounded-bl' : ''}`}>{item.nome}</p>
                                            <p className={`border-x pt-1 pl-2 ${prodsOBJS.length === index + 1 ? 'border-b' : ''}`}>{item.total} R$</p>
                                            <div className={`border-x ${prodsOBJS.length === index + 1 ? 'border-b rounded-br' : ''}`}>
                                                <Button
                                                    onClick={() => deleteProd(index)}
                                                    variant='destructive'
                                                    className='w-full h-full'
                                                    type='button'
                                                >
                                                    <CircleX />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </>}
                            </div>
                        </div>
                    </>}

                    {tipo === 'Internet' && <>
                        <div className='flex items-center gap-2 mb-2'>
                            <MapPin />
                            <h4>Endereço de entrega</h4>
                        </div>
                        <div className='grid items-start grid-cols-1 col-span-1 gap-4 p-4 mb-8 border border-l-4 border-r-4 rounded sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:col-span-2 md:col-span-3 lg:col-span-4'>
                            <div>
                                <Input {...register("entregadora")} label="Entregadora" type='text' preventDefault></Input>
                                {errors.entregadora && <div className='mt-2 text-red-500'>{errors.entregadora.message}</div>}
                            </div>
                            <div>
                                <Input {...register("cep", {
                                    minLength: { value: 8, message: "CEP precisa ter 8 caracteres." }
                                }
                                )} label="CEP" type='text' preventDefault></Input>
                                {errors.cep && <div className='mt-2 text-red-500'>{errors.cep.message}</div>}
                            </div>
                            <div>
                                <Input {...register("numero")} label="Número" type='text' preventDefault></Input>
                                {errors.numero && <div className='mt-2 text-red-500'>{errors.numero.message}</div>}
                            </div>
                            <div>
                                <Input {...register("complemento")} label="Complemento" type='text' preventDefault></Input>
                                {errors.complemento && <div className='mt-2 text-red-500'>{errors.complemento.message}</div>}
                            </div>
                            <div>
                                <Input {...register("bairro")} label="Bairro" type='text' preventDefault></Input>
                                {errors.bairro && <div className='mt-2 text-red-500'>{errors.bairro.message}</div>}
                            </div>
                            <div>
                                <Input {...register("cidade")} label="Cidade/UF" type='text' preventDefault></Input>
                                {errors.cidade && <div className='mt-2 text-red-500'>{errors.cidade.message}</div>}
                            </div>
                        </div>
                    </>}

                    {!params.update && <>
                        <div className='mb-2'>
                            <div className='flex items-center gap-2'>
                                <Checkbox
                                    className='rounded border-foreground'
                                    onCheckedChange={(checked) => setChecked(checked)}
                                />
                                <p>Inserir lista digitada de itens</p>
                            </div>
                            {checked && <>
                                <Textarea {...register("listaDigitada")} type='text'></Textarea>
                                {errors.listaDigitada && <div className='mt-2 text-red-500'>{errors.listaDigitada.message}</div>}
                                <Helper type="text"
                                    desc="Para quebra de linha na visualização desta lista, insira uma ',' a cada item inserido."
                                />
                            </>}
                        </div>

                        <div className='col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4'>
                            <p>Descrição</p>
                            <Textarea  {...register("descricao")} type='text' onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}></Textarea>
                            {errors.descricao && <div className='mt-2 text-red-500'>{errors.descricao.message}</div>}
                        </div>
                    </>}
                    <div className='flex justify-end gap-2 mt-6'>
                        <Button
                            type="button"
                            variant='outline'
                            onClick={() => navigate(-1)}
                        >
                            Voltar
                        </Button>

                        {params.update && <>
                            <Button disabled={isSubmitting} type='button' onClick={handleSubmit(onUpdate)} className='col-start-4'>
                                {isSubmitting ? "Atualizando..." : "Atualizar"}
                            </Button>
                        </>}
                        {!params.update && <>
                            <Button disabled={isSubmitting} type='button' onClick={handleSubmit(onSubmit)} className='col-start-4'>
                                {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                            </Button>
                        </>}
                    </div>
                </form>
            </div>
            <Outlet />
        </AnimatedLayout>
    )
}