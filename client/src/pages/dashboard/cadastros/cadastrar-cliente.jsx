import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from "@/components/ui/textarea"
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { patchRequest, postRequest } from '@/hooks/axiosHook'
import FormSection from '@/layouts/formSection'
import ViewHeader from '@/layouts/viewHeader'
import { MapPin, User } from "lucide-react"
import React, { useRef, useState } from 'react'
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from "sonner"

export default function CadastrarCliente() {
    const { postData, postLoading, postError, postedData } = postRequest('/api/v1/cadastros/clientes');
    const { patchData, patchedData, updating, patchError } = patchRequest('/api/v1/cadastros/clientes');
    const [tipo, setTipo] = useState("FISICA");
    const formRef = useRef(null);
    const navigate = useNavigate();

    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);

    const params = {
        tipo: urlParams.get('tipo'),
        id: urlParams.get('id'),
        nome: urlParams.get('nome'),
        email: urlParams.get('email'),
        cel: urlParams.get('cel'),
        cep: urlParams.get('cep'),
        numero: urlParams.get('numero'),
        complemento: urlParams.get('complemento'),
        bairro: urlParams.get('bairro'),
        cidade: urlParams.get('cidade'),
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

    async function cadastro(params) {
        return await postData(params);
    }

    async function update(params) {
        return await patchData(params);
    }

    const limparFormulario = () => {
        formRef.current.reset();
    }

    const onUpdate = async (data) => {
        try {
            if (params.tipo === "FISICA") {
                data.tipo = "FISICA";
                data.cnpj = null;
                data.razaosocial = null;
                data.responsavel = null;
            } else {
                data.tipo = "JURIDICA";
                data.cpf = null;
                data.rg = null;
            }

            if (data.cpf) data.cpf = data.cpf.replace(/\D/g, '');
            if (data.cpf) data.rg = data.gr.replace(/\D/g, '');
            if (data.cnpj) data.cnpj = data.cnpj.replace(/\D/g, '');

            data.id = params.id;

            const resposta = await update(data);

            if (resposta.status == "success") {
                toast.success("Cliente atualizado");
                navigate(-1);
            }
        } catch (err) {
            toast.error(err?.data?.message || err?.message);
            console.log(err)
        }
    }

    const onSubmit = async (data) => {
        try {
            if (tipo === "FISICA") {
                data.tipo = "FISICA";
                data.cnpj = null;
                data.razaosocial = null;
                data.responsavel = null;
            } else {
                data.tipo = "JURIDICA";
                data.cpf = null;
                data.rg = null;
            }

            const resposta = await cadastro(data);

            if (resposta.status == "success") {
                toast.success("Cliente criado");
                limparFormulario();
            }

        } catch (err) {
            toast.error(err?.data?.message);
            console.log(err)
        }
    }

    return (
        <AnimatedLayout>
            <div className='m-6 mt-10' id='clientes'>
                <ViewHeader
                    title={params.update && "Atualizar cliente" || "Cadastrar cliente"}
                />

                <Separator className='mt-2 mb-4' />

                <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <FormSection
                        title="Informações do cliente"
                        icon={<User />}
                        helper
                    >
                        <div className="form-layout">
                            {!params.update &&
                                <div>
                                    <Label>Tipo *</Label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <Button
                                            variant='outline'
                                            className={`w-full ${tipo === 'FISICA' ? 'border-primary border-2' : ''}`}
                                            type='button'
                                            onClick={() => setTipo('FISICA')}
                                        >
                                            Física
                                        </Button>

                                        <Button
                                            variant='outline'
                                            className={`w-full ${tipo === 'JURIDICA' ? 'border-primary border-2' : ''}`}
                                            type='button'
                                            onClick={() => setTipo('JURIDICA')}
                                        >
                                            Jurídica
                                        </Button>
                                    </div>
                                </div>
                            }

                            <Input
                                label={tipo === 'FISICA' ? "Nome *" : "Nome fantasia *"}
                                {...register("nome", {
                                    required: !params.update,
                                    minLength: {
                                        value: 2,
                                        message: "Nome precisa ter pelo menos 2 caracteres."
                                    }
                                })}
                                type='text'
                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                defaultValue={params.nome ? params.nome : ""}
                                error={errors?.nome?.message}
                            />

                            <Input
                                {...register("email")}
                                label="Email"
                                type='email'
                                autoComplete='email'
                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                defaultValue={params.email ? params.email : ""}
                                error={errors?.email?.message}
                            />

                            <Input
                                {...register("cel")}
                                label="Celular"
                                type='text'
                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                defaultValue={params.cel ? params.cel : ""}
                                error={errors?.cel?.message}
                            />

                            {tipo === 'FISICA' && !params.update && <>
                                <Input
                                    {...register("cpf", {
                                        minLength: { value: 11, message: "CPF precisa ter 11 caracteres." }
                                    })}
                                    label="CPF"
                                    type='text'
                                    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                    error={errors?.cpf?.message}
                                />
                                <Input
                                    {...register("rg")}
                                    label="RG"
                                    type='text'
                                    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                    error={errors?.rg?.message}
                                />
                            </>}

                            {tipo === 'JURIDICA' && !params.update && <>
                                <Input
                                    {...register("cnpj", {
                                        required: "CNPJ é obrigatório",
                                        minLength: { value: 14, message: "CNPJ precisa ter 14 caracteres." }
                                    })}
                                    label="CNPJ"
                                    type='text'
                                    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault() }}
                                    error={errors?.cnpj?.message}
                                />
                                <Input
                                    {...register("razaosocial")}
                                    label="Razão social"
                                    type='text' onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault() }}
                                    error={errors?.razaosocial?.message}
                                />
                                <Input
                                    {...register("responsavel")}
                                    label="Rsponsável"
                                    type='text' onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault() }}
                                    error={errors?.responsavel?.message}
                                />
                            </>}
                        </div>
                    </FormSection>

                    <FormSection
                        title="Endereço do cliente"
                        icon={<MapPin />}
                    >
                        <div className="form-layout">
                            <Input
                                {...register("cep", {
                                    minLength: { value: 8, message: "CEP precisa ter 8 caracteres." }
                                })}
                                label="CEP"
                                type='text'
                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                defaultValue={params.cep ? params.cep : ""}
                                error={errors?.cep?.message}
                            />

                            <Input
                                {...register("numero")}
                                label="Número"
                                type='text'
                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                defaultValue={params.numero ? params.numero : ""}
                                error={errors?.numero?.message}
                            />

                            <Input
                                {...register("complemento")}
                                label="Complemento"
                                type='text'
                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                defaultValue={params.complemento ? params.complemento : ""}
                                error={errors?.complemento?.message}
                            />

                            <Input
                                {...register("bairro")}
                                label="Bairro"
                                type='text'
                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                defaultValue={params.bairro ? params.bairro : ""}
                                error={errors?.bairro?.message}
                            />
                            <Input
                                {...register("cidade")}
                                label="Cidade/UF"
                                type='text'
                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                defaultValue={params.cidade ? params.cidade : ""}
                                error={errors?.cidade?.message}
                            />
                        </div>
                    </FormSection>

                    {!params.update &&
                        <div className='col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4'>
                            <Label>Observações</Label>
                            <Textarea
                                {...register("observacao")}
                                type='text'
                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                            />
                            {errors.observacao && <div className='mt-2 text-red-500'>{errors.observacao.message}</div>}
                        </div>
                    }

                    <div className='flex justify-end gap-2 mt-6'>
                        <Button
                            variant='outline'
                            type='button'
                            onClick={() => navigate(-1)}
                        >
                            Voltar
                        </Button>

                        {params.update && <>
                            <Button
                                disabled={isSubmitting}
                                type='submit'
                                onClick={handleSubmit(onUpdate)}
                                className='col-start-4'>
                                {isSubmitting ? "Atualizando..." : "Atualizar"}
                            </Button>
                        </>}

                        {!params.update && <>
                            <Button
                                disabled={isSubmitting}
                                type='submit'
                                onClick={handleSubmit(onSubmit)}
                                className='col-start-4'>
                                {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                            </Button>
                        </>}
                    </div>
                </form>
            </div>
        </AnimatedLayout>
    )
}