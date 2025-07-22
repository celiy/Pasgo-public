import SelectComponent from "@/components/select-component"
import SelectSearch from "@/components/select-search"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from '@/components/ui/separator'
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import Helper from '@/elements/helper'
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { fetchRequest, patchRequest, postRequest } from "@/hooks/axiosHook"
import { DMA } from '@/hooks/getDatePTBR'
import FormSection, { SectionHeader } from "@/layouts/formSection"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon, CircleX, FileCog, Image, ImagePlus, MapPin } from "lucide-react"
import moment from "moment"
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from 'react-router-dom'
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

export default function AdicionarOrdem() {
    //#region Declarações
    const { getData, fetchedData, fetchLoading, fetchError } = fetchRequest('/api/v1/');
    const { postData, loading, error, response } = postRequest('/api/v1/servicos-orcamentos/ordens-servicos');
    const { patchData, updating, patchedData, patchError } = patchRequest('/api/v1/servicos-orcamentos/ordens-servicos');
    const [tempServQuant, setTempServQuant] = useState(0);
    const [tempServCusto, setTempServCusto] = useState('');
    const [funcionarios, setFuncionarios] = useState([{}]);
    const [checkedServ, setCheckedServ] = useState(false);
    const [tipoServico, setTipoServico] = useState('');
    const [funcionario, setFuncionario] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [pagamento, setPagamento] = useState('');
    const [servQuant, setServQuant] = useState(0);
    const [clientes, setClientes] = useState([{}]);
    const [servicos, setServicos] = useState([{}]);
    const [dateExec, setDateExec] = useState(new Date());
    const [dateConc, setDateConc] = useState(new Date());
    const [desconto, setDesconto] = useState('');
    const [subtotal, setSubtotal] = useState(0);
    const [tempServ, setTempServ] = useState('');
    const [checked, setChecked] = useState(false);
    const [cliente, setCliente] = useState('');
    const [servico, setServico] = useState('');
    const [foipago, setFoipago] = useState('');
    const [imagens, setImagens] = useState([]);
    const [imagem, setImagem] = useState(null);
    const [status, setStatus] = useState('');
    const [servsOBJS, setSO] = useState([]);
    const [total, setTotal] = useState(0);
    const [date, setDate] = useState(new Date());
    const [tipo, setTipo] = useState(null);

    // Limpar URLs de preview quando o componente for desmontado
    useEffect(() => {
        return () => {
            imagens.forEach(img => {
                if (img.preview) {
                    URL.revokeObjectURL(img.preview);
                }
            });
        };
    }, [imagens]);

    const formRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(location.search);

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
        dataExecucao: urlParams.get('dataExecucao') ? (isNaN(new Date(urlParams.get('dataExecucao'))) ? null : new Date(urlParams.get('dataExecucao'))) : null,
        dataConclusao: urlParams.get('dataConclusao') ? (isNaN(new Date(urlParams.get('dataConclusao'))) ? null : new Date(urlParams.get('dataConclusao'))) : null,
        descricao: urlParams.get('descricao'),
        materiaisEquipamentos: urlParams.get('materiaisEquipamentos'),
        lista: urlParams.get('lista'),
        foiPago: urlParams.get('foiPago'),
        valor: urlParams.get('valor'),
        desconto: urlParams.get('desconto'),
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
    const handleCliente = (value) => {
        setCliente(value);
    };
    const handleTipo = (value) => {
        setTipo(value);
    };
    const deleteImagem = (index) => {
        const newImagens = [...imagens];
        newImagens.splice(index, 1);
        setImagens(newImagens);
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
        setDateExec(params.dataExecucao);
        setDateConc(params.dataConclusao);
    }, []);

    React.useEffect(() => {
        const getFields = async () => {
            await getData("cadastros/clientes?limit=5");
            await getData("servicos-orcamentos/servicos?limit=5");
            await getData("cadastros/funcionarios?limit=5");
        }

        getFields();
    }, []);

    React.useEffect(() => {
        if (params.update) {
            setStatus(params.status);
            setFoipago(params.foiPago);

            const getImagens = async () => {
                const resposta = await fetch(import.meta.env.VITE_BACKEND_BASE_URL + '/api/v1/servicos-orcamentos/ordens-servicos/' + params.id + '/imagens', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                });

                const result = await resposta.json();

                if (result.status === "success") {
                    // Converter as imagens base64 para objetos de preview
                    const imagensProcessadas = result.data.imagens.map(img => ({
                        name: img.nome,
                        preview: `data:image/jpeg;base64,${img.data}`,
                        isExisting: true // Marca como imagem existente
                    }));

                    setImagens(imagensProcessadas);
                }
            }

            getImagens();
        } else {
            setImagens([]);
        }
    }, [params.update]);

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
        const newServ = { ...servico };
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

        const final = somaTotal + (total * 1);
        setSubtotal((final - (final * desconto)).toFixed(2));
    }, [desconto, servsOBJS, total, checkedServ]);

    const onUpdate = async (data) => {
        try {
            const formData = new FormData();

            let formatedMatEquip = [];
            let formatedLista = [];

            if (data.materiaisEquipamentos) {
                const listSplit = data.materiaisEquipamentos.split("\n");

                for (let fragment of listSplit) {
                    if (fragment.trim().length > 0) {
                        if (fragment.endsWith(",")) formatedMatEquip.push(fragment);
                        else formatedMatEquip.push(fragment + ",");
                    }
                }

                data.materiaisEquipamentos = formatedMatEquip.join("");
            }

            if (data.lista) {
                const listSplit = data.lista.split("\n");

                for (let fragment of listSplit) {
                    if (fragment.trim().length > 0) {
                        if (fragment.endsWith(",")) formatedLista.push(fragment);
                        else formatedLista.push(fragment + ",");
                    }
                }

                data.lista = formatedLista.join("");
            }

            let dadosJSON = {
                foiPago: foipago || "",
                id: params.id || "",
                dataExecucao: dateExec ? dateExec.toISOString() : new Date().toISOString(),
                dataConclusao: dateConc ? dateConc.toISOString() : new Date().toISOString(),
                status: status || "",
                imagensExistentes: imagens
                    .filter(img => img.isExisting)
                    .map(img => img.name)
            }

            dadosJSON = {
                ...data,
                ...dadosJSON
            };

            formData.append('dados', JSON.stringify(dadosJSON));

            // Adicionar apenas novas imagens
            imagens
                .filter(img => !img.isExisting && img.file)
                .forEach(img => {
                    formData.append('imagens', img.file);
                });

            const resposta = await fetch(import.meta.env.VITE_BACKEND_BASE_URL + '/api/v1/servicos-orcamentos/ordens-servicos', {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: formData
            });

            const result = await resposta.json();

            if (result.status === "success") {
                toast.success("Ordem atualizada");
                navigate(-1);
                return;
            }

            toast.error(result.message);
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

            let formatedMatEquip = [];
            let formatedLista = [];

            if (data.materiaisEquipamentos) {
                const listSplit = data.materiaisEquipamentos.split("\n");

                for (let fragment of listSplit) {
                    if (fragment.trim().length > 0) {
                        if (fragment.endsWith(",")) formatedMatEquip.push(fragment);
                        else formatedMatEquip.push(fragment + ",");
                    }
                }

                data.materiaisEquipamentos = formatedMatEquip.join("");
            }

            if (data.lista) {
                const listSplit = data.lista.split("\n");

                for (let fragment of listSplit) {
                    if (fragment.trim().length > 0) {
                        if (fragment.endsWith(",")) formatedLista.push(fragment);
                        else formatedLista.push(fragment + ",");
                    }
                }

                data.lista = formatedLista.join("");
            }

            // Criar FormData para enviar arquivos
            const formData = new FormData();

            // Preparar dados JSON
            const dadosJSON = {
                cliente: cliente || {},
                funcionario: funcionario || {},
                servico: checkedServ && servsOBJS.length > 0 ? servsOBJS : [],
                foiPago: foipago || '',
                dataExecucao: dateExec ? dateExec.toISOString() : null,
                dataConclusao: dateConc ? dateConc.toISOString() : null,
                dataPagamento: date ? date.toISOString() : null,
                tipo: tipo || '',
                subtotal: subtotal || 0,
                tipoServiço: tipoServico || '',
                status: status || '',
                valor: total || 0,
                tipoPagamento: data.tipoPagamento || '',
                descricao: data.descricao || '',
                materiaisEquipamentos: data.materiaisEquipamentos || '',
                lista: data.lista || ''
            };

            // Adicionar dados JSON ao FormData
            formData.append('dados', JSON.stringify(dadosJSON));

            // Adicionar imagens
            imagens.forEach((img, index) => {
                if (img && img.file) {
                    formData.append(`imagens`, img.file);
                }
            });

            const resposta = await fetch(import.meta.env.VITE_BACKEND_BASE_URL + '/api/v1/servicos-orcamentos/ordens-servicos', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: formData
            });

            const result = await resposta.json();

            if (result.status === "success") {
                toast.success("Ordem criada");
                limparFormulario();
                setDesconto(0);
                setTotal(0);
                setSO([]);
                setImagens([]);
                return;
            }

            toast.error(result.message);
        } catch (err) {
            toast.error(err.message || "Erro ao criar ordem");
            console.error("Erro completo:", err);
        }
    }
    //#endregion

    return (
        <AnimatedLayout>
            <div className='m-6 mt-10'>
                <div className='grid items-center grid-cols-2'>
                    <div className='flex items-center gap-2'>
                        {params.update && <h3>Editar ordem</h3> || <h3>Adicionar ordem</h3>}
                        <Helper type="card" title="Ajuda"
                            desc="Uma ordem pode ter multiplos seviços atribuídos a ela."
                        />
                    </div>
                    <div className='justify-self-end'>
                        <DMA />
                    </div>
                </div>

                <Separator className='mt-2 mb-4' />

                <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <FormSection
                        title="Informações da ordem"
                        helper
                        icon={<FileCog />}
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
                                    <Label>Tipo de ordem</Label>
                                    <SelectSearch
                                        itens={tipo_venda}
                                        onChange={handleTipo}
                                    />
                                </div>
                            </div>
                        </>}

                        <div className="mb-6 form-layout">
                            <SectionHeader>
                                Status da ordem
                            </SectionHeader>

                            <div>
                                <Label>Status {!params.update && "*"}</Label>
                                <SelectSearch
                                    itens={[
                                        { label: "Aberta", value: "aberta" },
                                        { label: "Em andamento", value: "andamento" },
                                        { label: "Concluída", value: "concluida" },
                                        { label: "Cancelada", value: "cancelada" },
                                    ]}
                                    onChange={(value) => setStatus(value)}
                                    required
                                />
                            </div>

                            {!params.update && <>
                                <div>
                                    <Label>Tipo de serviço</Label>
                                    <SelectSearch
                                        itens={[
                                            { label: "Instalação", value: "instalacao" },
                                            { label: "Manuteção", value: "manutencao" },
                                            { label: "Reparo", value: "reparo" }
                                        ]}
                                        onChange={(value) => setTipoServico(value)}
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
                            </>}

                            <div>
                                <Label>Foi pago {!params.update && "*"}</Label>
                                <SelectComponent itens={[
                                    { name: "Sim", value: "Sim" },
                                    { name: "Não", value: "Não" },
                                ]} onChange={handleFoipago} />

                                {params.update &&
                                    <div className="mt-1">
                                        <Helper type="text"
                                            desc="Ao alterar o campo 'Foi pago' para 'Sim', a data de pagamento será alterada para a data atual."
                                        />
                                    </div>
                                }
                            </div>
                        </div>

                        {!params.update &&
                            <div
                                className="mb-6 form-layout"
                            >
                                <SectionHeader>
                                    Valores
                                </SectionHeader>

                                <Input
                                    label="Desconto %"
                                    {...register("desconto")}
                                    type='number'
                                    onChange={handleDesconto}
                                    preventDefault
                                    error={errors?.desconto?.message}
                                />

                                <div className="grid gap-2">
                                    <Input
                                        label="Valor"
                                        type='number'
                                        onChange={(e) => setTotal(e.target.value)}
                                        value={total}
                                        onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                    />

                                    <Helper
                                        type="text"
                                        desc="Esse campo agrega o valor inserido ao subtotal."
                                    />
                                </div>

                                <Input
                                    label="Subtotal"
                                    type='number'
                                    disabled={true}
                                    value={subtotal}
                                    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                />
                            </div>
                        }

                        <div
                            className="mb-6 form-layout"
                        >
                            <SectionHeader>
                                Cronogramas
                            </SectionHeader>

                            <div>
                                <Label>Data da execução</Label>
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
                                            {dateExec ? moment(dateExec).format("DD/MM/YYYY") : <span>Selecione uma data</span>}
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
                                <Label>Data da conclusão</Label>
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
                                            {dateConc ? moment(dateConc).format("DD/MM/YYYY") : <span>Selecione uma data</span>}
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

                            {!params.update && <>
                                <div>
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
                            </>}
                        </div>

                        <div key="nl-imagem">
                            <SectionHeader className="mb-2">
                                Imagens
                            </SectionHeader>

                            <Input
                                label="Selecionar imagem"
                                type="file"
                                required
                                accept=".png, .jpg, .jpeg"
                                onChange={(e) => {
                                    setImagem(e.target.files);
                                }}
                                className="w-full md:w-fit"
                            />

                            <Helper type="text"
                                desc={<span className="flex items-center gap-2 mt-2">1. Envie sua imagem.</span>}
                            />

                            <div className="grid w-full gap-2 mt-2 mb-2 justify-items-start sm:flex">
                                <div className="flex gap-2">
                                    <AlertDialog >
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                type="button"
                                            >
                                                <Image />
                                                {imagens.length}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent
                                            className="max-w-[90vw] sm:max-w-[90vw] md:max-w-[90vw] lg:max-w-[90vw]"
                                        >
                                            <AlertDialogHeader >
                                                <AlertDialogTitle>Imagens</AlertDialogTitle>
                                            </AlertDialogHeader>
                                            <ScrollArea className="h-[60vh] w-full">
                                                <div className="flex flex-wrap justify-center w-full gap-4">
                                                    {imagens.map((img, index) => (
                                                        <div className="relative">
                                                            <Button
                                                                variant="destructive"
                                                                type="button"
                                                                className="absolute z-10 shadow-lg top-2 right-2"
                                                                onClick={() => deleteImagem(index)}
                                                            >
                                                                <CircleX /> Excluir
                                                            </Button>
                                                            <img
                                                                key={index}
                                                                src={img.preview}
                                                                alt={img.name}
                                                                className="w-full"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                            <AlertDialogFooter>
                                                <AlertDialogAction>Fechar</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                className="flex gap-2"
                                                variant="outline"
                                                type="button"
                                                onClick={() => {
                                                    if (imagem) {
                                                        const files = Array.from(imagem);
                                                        const processedFiles = files.map(file => ({
                                                            file: file,
                                                            name: file.name,
                                                            size: file.size,
                                                            type: file.type,
                                                            preview: URL.createObjectURL(file)
                                                        }));
                                                        setImagens([...imagens, ...processedFiles]);
                                                        setImagem(null);
                                                        toast.success("Imagem adicionada.");
                                                    }
                                                }}>
                                                <ImagePlus />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Adicionar imagem
                                        </TooltipContent>
                                    </Tooltip>
                                </div>

                                <Helper type="card" title="Como adicionar imagens?"
                                    desc="Para adicionar imagens, selecione a imagem no seu dispositivo e clique no botão 'Adicionar imagem' (Ícone de imagem com sinal de +). E para visualizar as imagens, clique no botão 'Imagens' (Ícone de imagem com número do lado)."
                                />
                            </div>

                            <Helper type="text"
                                desc={<span className="flex items-center gap-2">2. Clique no <ImagePlus /> para adicionar a imagem.</span>}
                            />
                        </div>
                    </FormSection>

                    {!params.update && <>
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
                                    <div className="mb-2" />

                                    <Label>Serviço</Label>
                                    <SelectSearch
                                        itens={servicos}
                                        onChange={handleServico}
                                        onSearchChange={handleSearchChange}
                                        id={'servico'}
                                    />

                                    <div className="mb-2" />

                                    <Input
                                        label="Quantidade"
                                        type='number'
                                        className="mb-2"
                                        onChange={handleSQ}
                                        preventDefault
                                        error={errors?.quantidade?.message}
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
                                            <Button variant="outline" type="button">
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
                                                        <Label>Nome:</Label>
                                                        <Input type='text' className="mb-2" onChange={handleTempSNome}
                                                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} />
                                                        <Label>Custo:</Label>
                                                        <Input type='number' className="mb-2" onChange={handleTempSCusto}
                                                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} />
                                                        <Label>Quantidade:</Label>
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
                                    <div className='grid grid-cols-[1fr_0.6fr_0.4fr]'>
                                        <Label className='py-2 pl-2 border rounded-tl'>Nome</Label>
                                        <Label className='py-2 pl-2 border'>Valor</Label>
                                        <Label className='py-2 pl-2 border rounded-tr'>Excluir</Label>
                                    </div>

                                    {servsOBJS.map((item, index) => (
                                        <div key={index} className='grid grid-cols-[1fr_0.6fr_0.4fr]'>
                                            <p className={`border-x pt-1 pl-2 ${servsOBJS.length === index + 1 ? 'border-b rounded-bl' : ''}`}>{item.nome}</p>
                                            <p className={`border-x pt-1 pl-2 ${servsOBJS.length === index + 1 ? 'border-b' : ''}`}>{item.total} R$</p>
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
                    </>}

                    {tipo === 'Internet' && <>
                        <div className='flex items-center gap-2 mb-2'>
                            <MapPin />
                            <h4>Endereço de entrega</h4>
                        </div>
                        <div className='grid items-start grid-cols-1 col-span-1 gap-4 p-4 mb-8 border border-l-4 border-r-4 rounded sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:col-span-2 md:col-span-3 lg:col-span-4'>
                            <div>
                                <Label>Entregadora</Label>
                                <Input {...register("entregadora")} type='text' onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}></Input>
                                {errors.entregadora && <div className='mt-2 text-red-500'>{errors.entregadora.message}</div>}
                            </div>
                            <div>
                                <Label>CEP</Label>
                                <Input {...register("cep", {
                                    minLength: { value: 8, message: "CEP precisa ter 8 caracteres." }
                                }
                                )} type='text' onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}></Input>
                                {errors.cep && <div className='mt-2 text-red-500'>{errors.cep.message}</div>}
                            </div>
                            <div>
                                <Label>Número</Label>
                                <Input {...register("numero")} type='text' onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}></Input>
                                {errors.numero && <div className='mt-2 text-red-500'>{errors.numero.message}</div>}
                            </div>
                            <div>
                                <Label>Complemento</Label>
                                <Input {...register("complemento")} type='text' onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}></Input>
                                {errors.complemento && <div className='mt-2 text-red-500'>{errors.complemento.message}</div>}
                            </div>
                            <div>
                                <Label>Bairro</Label>
                                <Input {...register("bairro")} type='text' onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}></Input>
                                {errors.bairro && <div className='mt-2 text-red-500'>{errors.bairro.message}</div>}
                            </div>
                            <div>
                                <Label>Cidade/UF</Label>
                                <Input {...register("cidade")} type='text' onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}></Input>
                                {errors.cidade && <div className='mt-2 text-red-500'>{errors.cidade.message}</div>}
                            </div>
                        </div>
                    </>}

                    <div className='col-span-1 mb-4 sm:col-span-2 md:col-span-3 lg:col-span-4'>
                        <Label>Lista do que foi feito</Label>
                        <Textarea
                            defaultValue={params.lista ? params.lista.split(",").join(",\n") : ""}
                            {...register("lista")}
                            type='text'
                        />
                        {errors.lista && <div className='mt-2 text-red-500'>{errors.lista.message}</div>}
                        <Helper type="text"
                            desc="Insira uma , (vírgula) a cada item inserido."
                        />
                    </div>
                    <div className='col-span-1 mb-4 sm:col-span-2 md:col-span-3 lg:col-span-4'>
                        <Label>Materiais e equipamentos</Label>
                        <Textarea
                            defaultValue={params.materiaisEquipamentos ? params.materiaisEquipamentos.split(",").join(",\n") : ""}
                            {...register("materiaisEquipamentos")}
                            type='text'
                        />
                        {errors.materiaisEquipamentos && <div className='mt-2 text-red-500'>{errors.materiaisEquipamentos.message}</div>}
                        <Helper type="text"
                            desc="Insira uma , (vírgula) a cada item inserido."
                        />
                    </div>
                    <div className='col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4'>
                        <Label>Descrição *</Label>
                        <Textarea
                            {...register("descricao", { required: !params.update })}
                            defaultValue={params.descricao ? params.descricao : ""}
                            type='text'
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                        />
                        {errors.descricao && <div className='mt-2 text-red-500'>{errors.descricao.message}</div>}
                    </div>

                    <div className='flex justify-end gap-2 mt-6'>
                        <Button
                            variant='outline'
                            type='button'
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
        </AnimatedLayout>
    )
}