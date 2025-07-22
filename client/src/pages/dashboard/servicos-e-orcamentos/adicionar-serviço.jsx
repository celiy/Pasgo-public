import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from "@/components/ui/textarea"
import Helper from '@/elements/helper'
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { patchRequest, postRequest } from '@/hooks/axiosHook'
import { DMA } from '@/hooks/getDatePTBR'
import { Cog } from "lucide-react"
import React from 'react'
import { useForm } from "react-hook-form"
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from "sonner"

export default function AdicionarServico() {
    const formRef = React.useRef(null);
    const urlParams = new URLSearchParams(location.search);
    const { postData, loading, error, response } = postRequest('/api/v1/servicos-orcamentos/servicos');
    const { patchData, updating, patchedData, patchError } = patchRequest('/api/v1/servicos-orcamentos/servicos');
    const navigate = useNavigate();
    const params = {
        id: urlParams.get('id'),
        nome: urlParams.get('nome'),
        custo: urlParams.get('custo'),
        venda: urlParams.get('venda'),
        comissao: urlParams.get('comissao'),
        desc: urlParams.get('descricao'),
        update: true ? urlParams.get('update') === "true" : false,
    };
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm()
    
    async function cadastro (params) {
        return await postData(params);
    }

    async function update(params) {
        return await patchData(params);
    }   

    const limparFormulario = () => {
        formRef.current.reset();
    };

    const onUpdate = async (data) => { //recebe as informações do form
        try {
            data.id = params.id;

            const resposta = await update(data);

            if (resposta.status == "success"){
                toast.success("Serviço atualizado");
                navigate(-1);
            }
        } catch (err) {
            toast.error(err?.data?.message || err?.message);
            console.log(err);
        }
    }

    const onSubmit = async (data) => { //recebe as informações do form
        try {
            const resposta = await cadastro(data);
            if (resposta.status == "success"){
                toast.success("Serviço criado");
                limparFormulario();
            }
        } catch (err) {
            toast.error(err?.data?.message || err?.message);
            console.log(err);
        }
    }

    return (
        <AnimatedLayout>
            <div className='m-6 mt-10' id='clientes'>
                <div className='grid grid-cols-2' id='clientes-header'>
                    {params.update && 
                        <h3>Editar serviço</h3> 
                        || 
                        <h3>Adicionar serviço</h3>
                    }
                    <div className='justify-self-end'>
                        <DMA />
                    </div>
                </div>

                <Separator className='mt-2 mb-2'/>

                {!params.update && 
                    <Helper type="text"
                        desc="Serviços criados aqui são classificados como serviços rotineiros que podem ser reutilizados em várias vendas (ex: 'Serviço de limpeza', é um serviço que permanece o mesmo e é reutilizado em várias vendas.). Para criação de serviços únicos, use o 'Ordens de serviço'."
                    />
                }

                <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <div className='flex items-center gap-2 mt-4 mb-2'>
                        <Cog />
                        <h4>Informações do serviço</h4>
                        <Helper type="text" desc="* Campos obrigatórios"/>
                    </div>
                    <div className='grid items-start grid-cols-1 gap-4 p-4 mb-6 border border-l-4 border-r-4 rounded sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
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
                            {...register("custo", {required: !params.update})} 
                            label="Valor de custo *"
                            type='number'
                            preventDefault
                            defaultValue={params.custo ? params.custo : ""}
                            error={errors?.custo?.message}
                        />

                        <div>
                            <Input 
                                {...register("venda", {required: !params.update})}
                                label="Valor de venda *"
                                type='number'
                                preventDefault
                                defaultValue={params.venda ? params.venda : ""}
                                error={errors?.venda?.message}
                            />

                            <Helper type="text"
                                desc="Este vai ser o valor usado na hora de usar este serviço em uma venda."
                            />
                        </div>

                        <Input 
                            {...register("comissao")} 
                            label="Comissão (em %)"
                            type='number'
                            preventDefault
                            defaultValue={params.comissao ? params.comissao : ""}
                            error={errors?.comissao?.message}
                        />
                    </div>

                    <div className='col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4'>
                        <Label>Descrição aprofundada</Label>
                        <Textarea  
                            {...register("descricao")} 
                            type='text' 
                            preventDefault
                            defaultValue={params.desc ? params.desc : ""}
                        />
                        {errors.descricao && <div className='mt-2 text-red-500'>{errors.descricao.message}</div>}
                    </div>

                    <div className='flex justify-end gap-2 mt-6'>
                        <Button 
                            type="button"
                            variant='outline' 
                            onClick={() => navigate(-1)}
                        >
                            Voltar
                        </Button>

                        {params.update && <>
                        <Button disabled={isSubmitting} type='submit' onClick={handleSubmit(onUpdate)} className='col-start-4'>
                            {isSubmitting ? "Atualizando..." : "Atualizar"}
                        </Button>
                        </>}
                        {!params.update && <>
                        <Button disabled={isSubmitting} type='submit' onClick={handleSubmit(onSubmit)} className='col-start-4'>
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