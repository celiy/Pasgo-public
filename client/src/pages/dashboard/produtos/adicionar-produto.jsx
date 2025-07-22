import SelectComponent from "@/components/select-component"
import SelectSearch from "@/components/select-search"
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from '@/components/ui/separator'
import { Textarea } from "@/components/ui/textarea"
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { fetchRequest, patchRequest, postRequest } from "@/hooks/axiosHook"
import FormSection, { SectionHeader } from "@/layouts/formSection"
import ViewHeader from "@/layouts/viewHeader"
import { Box } from "lucide-react"
import React, { useRef, useState } from 'react'
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from "sonner"

const tipos = [
    { name: "Alimentos", value: "alimentos" },
    { name: "Bebidas", value: "bebidas" },
    { name: "Cama Mesa e Banho", value: "camamesa" },
    { name: "Diversos", value: "diversos" },
    { name: "Eletrodomésticos", value: "eletrodomesticos" },
    { name: "Eletrônicos", value: "eletronicos" },
    { name: "Informática", value: "informatica" },
    { name: "Móveis e Decoração", value: "moveisdecoracao" },
]

export default function AdicionarProduto() {
    const { postData, loading, error, response } = postRequest('/api/v1/produtos/produtosAPI');
    const { patchData, updating, patchedData, patchError } = patchRequest('/api/v1/produtos/produtosAPI');
    const { getData, fetchedData, fetchLoading, fetchError } = fetchRequest('/api/v1/cadastros/fornecedores');
    const [fornecedores, setFornecedores] = React.useState([{}]);
    const [searchValue, setSearchValue] = useState('');
    const [fornecedor, setFornecedor] = useState('');
    const [tipo, setTipo] = useState('');

    const formRef = useRef(null);
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const navigate = useNavigate();

    const params = {
        id: urlParams.get('id'),
        nome: urlParams.get('nome'),
        quantidade: urlParams.get('quantidade'),
        valor: urlParams.get('valor'),
        tamanho: urlParams.get('tamanho'),
        descricao: urlParams.get('descricao'),
        update: true ? urlParams.get('update') === "true" : false,
        peso: urlParams.get('peso') === 'undefined' ? null : urlParams.get('peso'),
        modelo: urlParams.get('modelo') === 'undefined' ? null : urlParams.get('modelo'),
        localizacao: urlParams.get('localizacao') === 'undefined' ? null : urlParams.get('localizacao'),
        marca: urlParams.get('marca') === 'undefined' ? null : urlParams.get('marca'),
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange'
    });

    async function cadastro(params) {
        return await postData(params);
    }

    async function update(params) {
        return await patchData(params);
    }

    const handleTipoChange = (value) => {
        setTipo(value);
    };
    const handleFornecedorChange = (value) => {
        setFornecedor(value);
    };
    const handleSearchChange = (value) => {
        setSearchValue(value);
    };

    const limparFormulario = () => {
        formRef.current.reset();
    };

    React.useEffect(() => {
        const getFornecedores = async () => {
            if (searchValue && searchValue.length > 0) {
                await getData("?limit=5&nome=" + searchValue);
            } else {
                await getData("?limit=5&sort=nome");
            }
        }
        getFornecedores();
    }, [searchValue]);

    React.useEffect(() => {
        if (fetchedData) {
            const resposta = fetchedData.data.fornecedores;
            let newObj = [];

            if (resposta) {
                resposta.forEach(fornecedor => {
                    const obj = { label: fornecedor.nome, value: { nome: fornecedor.nome, id: fornecedor._id } };
                    newObj.push(obj);
                });
                setFornecedores(newObj);
            }
        }
    }, [fetchedData]);

    const onUpdate = async (data) => {
        try {
            data.id = params.id;
            if (fornecedor) {
                data.fornecedor = fornecedor;
            }

            const resposta = await update(data);

            if (resposta.status == "success") {
                toast.success("Produto atualizado");
                navigate(-1);
            }
        } catch (err) {
            toast.error(err?.data?.message || err?.message);
            console.log(err);
        }
    }

    const onSubmit = async (data) => {
        try {
            data.tipo = tipo;
            data.fornecedor = fornecedor;

            const resposta = await cadastro(data);

            if (resposta.status == "success") {
                toast.success("Produto criado");
                limparFormulario();
            }
        } catch (err) {
            toast.error(err?.data?.message);
            console.log(err);
        }
    }

    return (
        <AnimatedLayout>
            <div className='m-6 mt-10'>
                <ViewHeader
                    title={params.update ? "Editar produto" : "Adicionar produto"}
                />

                <Separator className='mt-2 mb-4' />

                <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <FormSection
                        title="Informações do produto"
                        helper
                        icon={<Box />}
                    >
                        <div className="mb-6 form-layout">
                            <SectionHeader>
                                Dados
                            </SectionHeader>

                            {!params.update && <>
                                <div>
                                    <Input
                                        {...register("codigo", {
                                            minLength: { value: 2, message: "Código precisa ter pelo menos 2 caracteres." }
                                        })}
                                        label="Código"
                                        type='text'
                                        autocomplete='off'
                                        preventDefault
                                        error={errors?.codigo?.message}
                                    />
                                </div>
                            </>}

                            {!params.update && <>
                                <div>
                                    <Label>Tipo *</Label>
                                    <SelectComponent
                                        itens={tipos}
                                        onChange={handleTipoChange}
                                    />
                                </div>
                            </>}

                            <Input
                                {...register("nome", {
                                    required: !params.update,
                                    minLength: { value: 2, message: "Nome precisa ter pelo menos 2 caracteres." }
                                })}
                                label="Nome *"
                                type='text'
                                preventDefault
                                error={errors?.nome?.message}
                                defaultValue={params.nome ? params.nome : ""}
                            />
                        </div>

                        <div className="mb-6 form-layout">
                            <SectionHeader>
                                Outros dados
                            </SectionHeader>

                            <Input
                                {...register("marca")}
                                label="Marca"
                                type='text'
                                preventDefault
                                error={errors?.marca?.message}
                                defaultValue={params.marca ? params.marca : ""}
                            />

                            <Input
                                {...register("modelo")}
                                label="Modelo"
                                type='text'
                                preventDefault
                                error={errors?.modelo?.message}
                                defaultValue={params.modelo ? params.modelo : ""}
                            />
                        </div>

                        <div className="mb-6 form-layout">
                            <SectionHeader>
                                Detalhes
                            </SectionHeader>

                            <Input
                                {...register("peso")}
                                label="Peso"
                                type='text'
                                preventDefault
                                error={errors?.peso?.message}
                                defaultValue={params.peso ? params.peso : ""}
                            />

                            <Input
                                {...register("tamanho")}
                                label="Tamanho"
                                type='text'
                                preventDefault
                                error={errors?.tamanho?.message}
                                placeholder={params.tamanho ? params.tamanho : 'ex: P, M, 30x30cm, 1m²'}
                                defaultValue={params.tamanho ? params.tamanho : ""}
                            />

                            <Input
                                {...register("quantidade")}
                                label="Quantidade *"
                                type='number'
                                preventDefault
                                error={errors?.quantidade?.message}
                                defaultValue={params.quantidade ? params.quantidade : ""}
                            />

                            <Input
                                {...register("valor", { required: !params.update, })}
                                label="Valor unitário *"
                                type='number'
                                preventDefault
                                error={errors?.valor?.message}
                                defaultValue={params.valor ? params.valor : ""}
                            />
                        </div>

                        <div className="form-layout">
                            <SectionHeader>
                                Extra
                            </SectionHeader>

                            <Input
                                {...register("localizacao")}
                                label="Localização no estoque"
                                type='text'
                                preventDefault
                                error={errors?.localizacao?.message}
                                defaultValue={params.localizacao ? params.localizacao : ""}
                            />

                            {!params.update && <>
                                <Input
                                    {...register("cor")}
                                    label="Cor"
                                    type='text'
                                    preventDefault
                                    error={errors?.cor?.message}
                                />

                                <Input
                                    {...register("genero")}
                                    label="Gênero"
                                    type='text'
                                    preventDefault
                                    error={errors?.genero?.message}
                                    placeholder={params.genero}
                                />
                            </>}

                            <div>
                                <Label>Fornecedor</Label>
                                <SelectSearch
                                    itens={fornecedores}
                                    onChange={handleFornecedorChange}
                                    onSearchChange={handleSearchChange}
                                />
                            </div>
                        </div>
                    </FormSection>

                    <div className='col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4'>
                        <Label>Descrição aprofundada</Label>
                        <Textarea
                            {...register("descricao")}
                            type='text'
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                            defaultValue={params.descricao ? params.descricao : ""}
                        />
                        {errors.descricao &&
                            <div className='mt-2 text-red-500'>
                                {errors.descricao.message}
                            </div>
                        }
                    </div>

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
                                type='submit'
                                onClick={handleSubmit(onUpdate)}
                                className='col-start-4'
                            >
                                {isSubmitting ? "Atualizando..." : "Atualizar"}
                            </Button>
                        }

                        {!params.update &&
                            <Button
                                disabled={isSubmitting}
                                type='submit'
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