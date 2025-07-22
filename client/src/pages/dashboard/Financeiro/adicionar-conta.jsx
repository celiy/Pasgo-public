import AlertDialogComponent from '@/components/alert-dialog-component.jsx'
import SelectComponent from "@/components/select-component"
import SelectSearch from "@/components/select-search"
import { Button } from '@/components/ui/button'
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from '@/components/ui/separator'
import { Textarea } from "@/components/ui/textarea"
import Helper from '@/elements/helper'
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { fetchRequest, patchRequest, postRequest } from '@/hooks/axiosHook'
import FormSection, { SectionHeader } from "@/layouts/formSection"
import ViewHeader from '@/layouts/viewHeader'
import { cn } from "@/lib/utils"
import { Banknote, Calendar as CalendarIcon } from "lucide-react"
import moment from "moment"
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from "sonner"

const entidades = [
    { label: "Cliente", value: "cliente" },
    { label: "Fornecedor", value: "fornecedor" },
    { label: "Funcionário", value: "funcionario" },
    { label: "Própria", value: "propria" },
]

const tipopagamento = [
    { label: "Boleto", value: "Boleto" },
    { label: "Crédito", value: "Crédito" },
    { label: "Débito", value: "Débito" },
    { label: "Dinheiro", value: "Dinheiro" },
    { label: "Cheque", value: "Cheque" },
]

export default function AdicionarConta() {
    //#region Declarações
    const { postData, loading, error, response } = postRequest('/api/v1/financeiro/contas');
    const { patchData, updating, patchedData, patchError } = patchRequest('/api/v1/financeiro/contas');
    const { getData, fetchedData, fetchLoading, fetchError } = fetchRequest('/api/v1/');
    const [fornecedores, setFornecedores] = useState([{}]);
    const [funcionarios, setFuncionarios] = useState([{}]);
    const [funcionario, setFuncionario] = useState({});
    const [searchValue, setSearchValue] = useState('');
    const [foiquitado, setFoiquitado] = useState('');
    const [fornecedor, setFornecedor] = useState({});
    const [pagamento, setPagamento] = useState('');
    const [desconto, setDesconto] = useState('');
    const [entidade, setEntidade] = useState('');
    const [clientes, setClientes] = useState([{}]);
    const [subtotal, setSubtotal] = useState(0);
    const [cliente, setCliente] = useState({});
    const [custo, setCusto] = useState('');
    const [juros, setJuros] = useState('');
    const [date, setDate] = useState(new Date());

    const formRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);

    const params = {
        id: urlParams.get('id'),
        quitado: urlParams.get('quitado'),
        update: true ? urlParams.get('update') === "true" : false,
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange'
    });

    const limparFormulario = () => {
        formRef.current.reset();
    };

    async function cadastro(params) {
        return await postData(params);
    }

    async function update(params) {
        return await patchData(params);
    }

    function setFormDate(var_date) {
        setDate(var_date);
    }

    useEffect(() => {
        if (desconto <= 0.0) {
            setSubtotal(s => s = custo);
        }
        if (desconto > 0.0 && juros <= 0.0) {
            setSubtotal(s => s = custo - (custo * desconto).toFixed(2));
        }
        if (desconto > 0.0 && juros > 0.0) {
            setSubtotal(s => s = ((custo - (custo * desconto)) * juros).toFixed(2));
        }
        if (desconto <= 0.0 && juros > 0.0) {
            setSubtotal(s => s = (custo * juros).toFixed(2));
        }
    }, [custo, juros, desconto]);

    const handleEntidade = (value) => {
        setEntidade(value);
    };
    const handleCliente = (value) => {
        setCliente(value);
    };
    const handleFornecedor = (value) => {
        setFornecedor(value);
    };
    const handleFuncionario = (value) => {
        setFuncionario(value);
    };
    const handleQuitado = (value) => {
        setFoiquitado(value);
    };
    const handleCusto = (value) => {
        setCusto(value.target.value * 1);
    };
    const handleDesconto = (value) => {
        if (value.target.value * 1 > 9) {
            setDesconto("0." + value.target.value * 1);
        } else {
            setDesconto("0.0" + value.target.value * 1);
        }
    };

    const handleJuros = (value) => {
        if (value.target.value * 1 > 9 && value.target.value * 1 < 99) {
            setJuros("1." + value.target.value * 1);
        } else if (value.target.value * 1 < 9) {
            setJuros("1.0" + value.target.value * 1);
        } else {
            setJuros(2.0);
        }
    };

    const handlePagamento = (value) => {
        setPagamento(value);
    };

    const handleSearchChange = (value, id) => {
        setSearchValue({ value: value, id: id });
    };

    React.useEffect(() => {
        const getFields = async () => {
            if (searchValue.id === "cliente") {
                await getData("cadastros/clientes?limit=5&nome=" + searchValue.value);
            } else if (searchValue.id === "fornecedor") {
                await getData("cadastros/fornecedores?limit=5&nome=" + searchValue.value);
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
                    const obj = { label: cliente.nome, value: { nome: cliente.nome, id: cliente._id } };
                    newObj.push(obj);
                });
                setClientes(newObj);
            } if (fetchedData.data.fornecedores) {
                const resposta = fetchedData.data.fornecedores;
                resposta.forEach(fornecedor => {
                    const obj = { label: fornecedor.nome, value: { nome: fornecedor.nome, id: fornecedor._id } };
                    newObj.push(obj);
                });
                setFornecedores(newObj);
            } if (fetchedData.data.funcionarios) {
                const resposta = fetchedData.data.funcionarios;
                resposta.forEach(funcionario => {
                    const obj = { label: funcionario.nome, value: { nome: funcionario.nome, id: funcionario._id } };
                    newObj.push(obj);
                });
                setFuncionarios(newObj);
            }
        }
    }, [fetchedData]);

    React.useEffect(() => {
        const getFields = async () => {
            await getData("cadastros/clientes?limit=5");
            await getData("cadastros/fornecedores?limit=5");
            await getData("cadastros/funcionarios?limit=5");
        }
        getFields();
    }, []);

    const onSubmit = async (data) => {
        try {
            data.pagamento = pagamento;
            data.tipoEntidade = entidade;
            if (entidade === 'cliente') {
                data.entidade = cliente;
            } else if (entidade === 'fornecedor') {
                data.entidade = fornecedor;
            } else if (entidade === 'funcionario') {
                data.entidade = funcionario;
            } else if (entidade === 'propria') {
                data.entidade = 'Própria';
            }

            data.quitado = foiquitado;
            data.vencimento = date;
            data.subtotal = subtotal;

            const resposta = await cadastro(data);

            if (resposta.status == "success") {
                toast.success("Conta criada");
                setSubtotal(0);
                limparFormulario();
            }
        } catch (err) {
            toast.error(err?.data?.message);
            console.log(err);
        }
    }

    const onUpdate = async (data) => {
        try {
            data.quitado = foiquitado;
            data.id = params.id;
            let filteredData = {};

            for (const [key, value] of Object.entries(data)) {
                if (value !== null && value !== undefined && value.length > 0) {
                    filteredData[key] = value;
                }
            }

            const resposta = await update(filteredData);

            if (resposta.status == "success") {
                toast.success("Conta atualizada");
                navigate(-1);
            }
        } catch (err) {
            toast.error(err?.data?.message || err?.message);
            console.log(err);
        }
    }
    //#endregion

    return (
        <AnimatedLayout>
            {errors.root &&
                <AlertDialogComponent
                    tipo='warning'
                    title='Erro!'
                    desc={errors.root.message}
                    onClose={() => setError('root', null)}
                />
            }

            <div className='m-6 mt-10' id='clientes'>
                <ViewHeader
                    title={params.update ? "Editar conta" : "Adicionar conta"}
                />

                <Separator className='mt-2 mb-4' />

                <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <FormSection
                        title="Informações da conta"
                        helper
                        icon={<Banknote />}
                    >
                        {!params.update && <>
                            <div className="mb-6 form-layout">
                                <SectionHeader>
                                    Dados básicos
                                </SectionHeader>

                                <Input
                                    {...register("nome", {
                                        required: !params.update,
                                        minLength: { value: 2, message: "Descrição precisa ter pelo menos 2 caracteres." }
                                    })}
                                    label="Nome *"
                                    type='text'
                                    preventDefault
                                    error={errors?.nome?.message}
                                />

                                <div>
                                    <Label>Entidade *</Label>
                                    <SelectSearch
                                        itens={entidades}
                                        onChange={handleEntidade}
                                    />

                                    <Helper
                                        type="text"
                                        desc="Que tipo de entidade (cliente, fornecedor, etc...) vai pagar a conta."
                                    />
                                </div>

                                {entidade === 'cliente' &&
                                    <div>
                                        <Label>Cliente</Label>
                                        <SelectSearch
                                            itens={clientes}
                                            onChange={handleCliente}
                                            id={'cliente'}
                                            onSearchChange={handleSearchChange}
                                        />
                                    </div>
                                }

                                {entidade === 'fornecedor' &&
                                    <div>
                                        <Label>Fornecedor</Label>
                                        <SelectSearch
                                            itens={fornecedores}
                                            onChange={handleFornecedor}
                                            id={'fornecedor'}
                                            onSearchChange={handleSearchChange}
                                        />
                                    </div>
                                }

                                {entidade === 'funcionario' &&
                                    <div>
                                        <Label>Funcionário</Label>
                                        <SelectSearch
                                            itens={funcionarios}
                                            onChange={handleFuncionario}
                                            id={'funcionario'}
                                            onSearchChange={handleSearchChange}
                                        />
                                    </div>
                                }
                            </div>

                            <div className="mb-6 form-layout">
                                <SectionHeader>
                                    Valores
                                </SectionHeader>
                                <Input
                                    {...register("custo")}
                                    label="Valor bruto *"
                                    type='number'
                                    onChange={handleCusto}
                                    preventDefault
                                    error={errors?.custo?.message}
                                />

                                <Input
                                    {...register("juros", {
                                        max: { value: 99, message: "Juros máximo de 99%" }
                                    })}
                                    label="Juros %"
                                    type='number'
                                    onChange={handleJuros}
                                    preventDefault
                                    error={errors?.juros?.message}
                                />

                                <Input
                                    {...register("desconto", {
                                        max: { value: 99, message: "Desconto máximo de 99%" }
                                    })}
                                    label="Desconto %"
                                    type='number'
                                    onChange={handleDesconto}
                                    preventDefault
                                    error={errors?.desconto?.message}
                                />

                                <div>
                                    <Label>Forma de pagamento</Label>
                                    <SelectSearch
                                        itens={tipopagamento}
                                        onChange={handlePagamento}
                                    />
                                </div>
                            </div>
                        </>}

                        <div className={`form-layout ${!params.update ? "mb-6" : ""}`}>
                            <SectionHeader>
                                Status
                            </SectionHeader>
                            <div>
                                <Label>Pagamento quitado *</Label>
                                <SelectComponent
                                    itens={[
                                        { name: "Sim", value: "Sim" },
                                        { name: "Não", value: "Não" },
                                    ]}
                                    onChange={handleQuitado}
                                />
                                {params.update &&
                                    <p>
                                        Ao alterar o campo "Quitado" para "Sim", a data de pagamento
                                        será alterada para a data atual.
                                    </p>
                                }
                            </div>
                        </div>

                        {!params.update && <>
                            <div className="form-layout">
                                <SectionHeader>
                                    Outros
                                </SectionHeader>
                                
                                <Input
                                    label="Subtotal"
                                    type='number'
                                    disabled={true}
                                    value={subtotal}
                                    preventDefault
                                />

                                <div>
                                    <Label>Vencimento</Label>
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

                    {!params.update &&
                        <div className='col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4'>
                            <Label>Descrição aprofundada</Label>
                            <Textarea
                                {...register("descricao")}
                                type='text'
                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                            />

                            {errors.descricao &&
                                <div className='mt-2 text-red-500'>
                                    {errors.descricao.message}
                                </div>
                            }
                        </div>
                    }

                    <div className='flex justify-end gap-2 mt-6'>
                        <Button
                            variant='outline'
                            type="button"
                            onClick={() => navigate(-1)}
                        >
                            Voltar
                        </Button>

                        {params.update &&
                            <Button
                                disabled={isSubmitting}
                                type='button'
                                onClick={handleSubmit(onUpdate)}
                                className='col-start-4'
                            >
                                {isSubmitting ? "Atualizando..." : "Atualizar"}
                            </Button>
                        }

                        {!params.update &&
                            <Button
                                disabled={isSubmitting}
                                type='button'
                                onClick={handleSubmit(onSubmit)}
                                className='col-start-4'
                            >
                                {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                            </Button>
                        }
                    </div>
                </form>
            </div>
        </AnimatedLayout>
    )
}