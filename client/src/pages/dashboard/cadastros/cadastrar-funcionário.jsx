import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from "@/components/ui/textarea"
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { patchRequest, postRequest } from '@/hooks/axiosHook'
import FormSection from '@/layouts/formSection'
import ViewHeader from '@/layouts/viewHeader'
import { MapPin, SquareUser } from "lucide-react"
import React from 'react'
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from "sonner"

export default function CadastrarFuncionario() {
    const { postData, loading, error, response } = postRequest('/api/v1/cadastros/funcionarios');
    const { patchData, updating, patchedData, patchError } = patchRequest('/api/v1/cadastros/funcionarios');
    const navigate = useNavigate();

    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);

    const formRef = React.useRef(null);

    const params = {
        id: urlParams.get('id'),
        nome: urlParams.get('nome'),
        email: urlParams.get('email'),
        cel: urlParams.get('cel'),
        salario: urlParams.get('salario'),
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
    };

    const onUpdate = async (data) => {
        try {
            if (data.cpf) data.cpf = data.cpf.replace(/\D/g, '');
            if (data.cpf) data.rg = data.gr.replace(/\D/g, '');

            data.id = params.id;

            const resposta = await update(data);

            if (resposta.status == "success") {
                toast.success("Funcionário atualizado");
                navigate(-1);
            }
        } catch (err) {
            toast.error(err?.data?.message || err?.message);
            console.log(err);
        }
    }

    const onSubmit = async (data) => {
        try {
            if (data.cpf) data.cpf = data.cpf.replace(/\D/g, '');
            if (data.cpf) data.rg = data.gr.replace(/\D/g, '');
            data.salario = data.salario * 1

            const resposta = await cadastro(data);

            if (resposta.status == "success") {
                toast.success("Funcionário criado");
                limparFormulario();
            }
        } catch (err) {
            toast.error(err?.data?.message);
            console.log(err);
        }
    }

    return (
        <AnimatedLayout>
            <div className='m-6 mt-10' id='clientes'>
                <ViewHeader
                    title={params.update && "Atualizar funcionário" || "Cadastrar funcionário"}
                />

                <Separator className='mt-2 mb-4' />

                <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <FormSection
                        title="Informações do funcionário"
                        icon={<SquareUser />}
                        helper
                    >
                        <div className="form-layout">
                            <Input
                                {...register("nome", {
                                    required: !params.update,
                                    minLength: { value: 2, message: "Nome precisa ter pelo menos 2 caracteres." }
                                })}
                                label="Nome *"
                                type='text'
                                preventDefault
                                defaultValue={params.nome ? params.nome : ""}
                                error={errors?.nome?.message}
                            />

                            <Input
                                {...register("email")}
                                label="Email"
                                type='email'
                                autoComplete='email'
                                preventDefault
                                defaultValue={params.email ? params.email : ""}
                                error={errors?.email?.message}
                            />

                            <Input
                                {...register("cel")}
                                label="Celular"
                                type='text'
                                preventDefault
                                defaultValue={params.cel ? params.cel : ""}
                                error={errors?.cel?.message}
                            />

                            {!params.update && <>
                                <Input
                                    {...register("cpf", {
                                        minLength: { value: 11, message: "CPF precisa ter 11 caracteres." }
                                    })}
                                    label="CPF"
                                    type='text'
                                    preventDefault
                                    error={errors?.cpf?.message}
                                />

                                <Input
                                    {...register("rg")}
                                    label="RG"
                                    type='text'
                                    preventDefault
                                    error={errors?.rg?.message}
                                />
                            </>}

                            <Input
                                {...register("salario")}
                                label="Salário"
                                type='number'
                                preventDefault
                                defaultValue={params.salario ? params.salario : ""}
                                error={errors?.salario?.message}
                            />
                        </div>
                    </FormSection>

                    <FormSection
                        title="Endereço do funcionário"
                        icon={<MapPin />}
                    >
                        <div className="form-layout">
                            <Input
                                {...register("cep", {
                                    minLength: { value: 8, message: "CEP precisa ter 8 caracteres." }
                                })}
                                label="CEP"
                                type='text'
                                preventDefault
                                defaultValue={params.cep ? params.cep : ""}
                                error={errors?.cep?.message}
                            />

                            <Input
                                {...register("numero")}
                                label="Número"
                                type='text'
                                preventDefault
                                defaultValue={params.numero ? params.numero : ""}
                                error={errors?.numero?.message}
                            />

                            <Input
                                {...register("complemento")}
                                label="Complemento"
                                type='text'
                                preventDefault
                                defaultValue={params.complemento ? params.complemento : ""}
                                error={errors?.complemento?.message}
                            />

                            <Input
                                {...register("bairro")}
                                label="Bairro"
                                type='text'
                                preventDefault
                                defaultValue={params.bairro ? params.bairro : ""}
                                error={errors?.bairro?.message}
                            />

                            <Input
                                {...register("cidade")}
                                label="Cidade/UF"
                                type='text'
                                preventDefault
                                defaultValue={params.cidade ? params.cidade : ""}
                                error={errors?.cidade?.message}
                            />
                        </div>
                    </FormSection>

                    {!params.update && <>
                        <div className='col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4'>
                            <Label>
                                Observações
                            </Label>
                            <Textarea
                                {...register("observacao")}
                                type='text'
                                preventDefault
                            />
                            {errors.observacao &&
                                <div className='mt-2 text-red-500'>
                                    {errors.observacao.message}
                                </div>
                            }
                        </div>
                    </>}

                    <div className='flex justify-end gap-2 mt-6'>
                        <Link to='/dashboard/funcionarios#page=1' className='col-start-3'>
                            <Button
                                variant='outline'
                                className='w-full'
                                type='button'
                            >
                                Voltar
                            </Button>
                        </Link>

                        {params.update && <>
                            <Button
                                disabled={isSubmitting}
                                type='button'
                                onClick={handleSubmit(onUpdate)}
                            >
                                {isSubmitting ? "Atualizando..." : "Atualizar"}
                            </Button>
                        </>}

                        {!params.update && <>
                            <Button
                                disabled={isSubmitting}
                                type='button'
                                onClick={handleSubmit(onSubmit)}
                            >
                                {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                            </Button>
                        </>}
                    </div>
                </form>
            </div>
        </AnimatedLayout>
    )
}