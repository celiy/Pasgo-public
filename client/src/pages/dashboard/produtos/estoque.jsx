import SelectSearch from '@/components/select-search'
import TableComponent from '@/components/tables/produto-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import Helper from '@/elements/helper'
import Loading from '@/elements/loader'
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { fetchRequest, patchRequest } from '@/hooks/axiosHook'
import ViewHeader from '@/layouts/viewHeader'
import { Box, RefreshCw } from "lucide-react"
import React, { useEffect } from 'react'
import { useForm } from "react-hook-form"
import { useLocation } from 'react-router-dom'
import { toast } from "sonner"

export default function Estoque() {
    const { getData, fetchedData, fetchLoading, fetchError } = fetchRequest('/api/v1/produtos/produtosAPI');
    const { patchData, updating, patchedData, patchError } = patchRequest('/api/v1/produtos/produtosAPI');
    const [ quantidadeSemEstoque, setQuantidadeSemEstoque ] = React.useState(0);
    const [ quantidadeTotal, setQuantidadeTotal ]           = React.useState(0);
    const [ produtosArr, setProdutosArr ]                   = React.useState([]);
    const [ searchValue, setSearchValue ]                   = React.useState('');
    const [ quantidade, setQuantidade ]                     = React.useState(1);
    const [ produtoID, setProdutoID]                        = React.useState('');
    const [ produtos, setProdutos ]                         = React.useState();
    const [ codigo, setCodigo ]                             = React.useState('');

    const location        = useLocation();
    const currentFragment = location.hash;

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm();

    const handleSearchChange = (value, id) => {
        setSearchValue({value: value, id: id});
    };
   
    const getProdutos = async () => {
        const response = await getData("?limit=100&quantidade=0");

        if (response && response.data) {
            setQuantidadeTotal(response.count);
            let semEstoque = 0;
            const prods = [];

            response.data.produtos.forEach(produto => {
                if (produto.quantidade <= 0) {
                    semEstoque++;
                    prods.push(produto);
                }
            });
            
            setProdutos(prods);
            setQuantidadeSemEstoque(semEstoque);
        }
    };
    
    useEffect(() => {
        getProdutos();
    }, []);

     useEffect(() => {
        const getFields = async () => {
            if (searchValue.id === "produto"){
                const response = await getData("?limit=5&nome="+searchValue.value);

                if (response.data?.produtos){ 
                    const resposta = response.data.produtos;
                    const newObj = [];
                    
                    resposta.forEach(produto => {
                        const obj = { 
                            label: produto.nome,
                            value: {id: produto._id, valor: produto.valor, nome: produto.nome}
                        };
                        newObj.push(obj);
                    });

                    setProdutosArr(newObj);
                }
            } 
        }
        
        getFields();
    }, [searchValue]);

    const onSubmit = async (data) => {
        if (codigo.length < 1 && produtoID.length < 1){
            toast.error('Insira o código do produto!');
            return;
        }

        if (quantidade < 1){
            toast.error('Insira o código do produto!');
            return;
        }

        try {
            if (codigo.length > 1) {
                await patchData({quantidade: quantidade }, "/"+codigo);
            } else if (produtoID.length > 1) {
                await patchData({quantidade: quantidade, id: produtoID });
            }

            setCodigo('');
            setProdutoID('');
            setQuantidade(1);
            toast.success("Produto atualizado com sucesso!");
        } catch (error) {
            if (error.status === "not found") {
                toast.error('Produto com este código não encontrado.')
                return;
            } else {
                toast.error(error.message);
            }
        }
    }

    return (
        <AnimatedLayout>
            <div className='m-6 mt-10 ml-0 sm:ml-6' id='produtos'>
                <ViewHeader 
                    title="Estoque"
                    icon={<Box />}
                />

                <Separator className='mt-2 mb-4'/>
                
                <div className='grid grid-cols-1 gap-4 mb-4 md:grid-cols-2'>
                    <Card className='p-4 md:col-span-2'>
                        <div className='flex items-center w-full gap-2'>
                            <CardTitle>
                                Adicionar no estoque
                            </CardTitle>

                            <Helper 
                                type="card" 
                                title="O que isso faz?" 
                                desc="Ao inserir um código de um produto existente 
                                e pressionar 'Enter', o produto com o código inserido será atualizado com a nova quantidade." 
                            />

                            <div className="flex justify-end">
                                <Helper 
                                    type="card" 
                                    title="Ajuda" 
                                    desc="Aqui você consegue acessar e ver informações sobre seu estoque, 
                                    tais como a quantidade de itens cadastrados e itens com problemas."
                                />
                            </div>
                        </div>

                        <Separator className='my-4'/>

                        <CardContent className='p-0'>
                            <form className='grid' onSubmit={handleSubmit(onSubmit)}>
                                <div className='grid sm:grid-cols-[1fr_0.1fr_1fr] gap-2 md:gap-4'>
                                    <div>
                                        <p className='mb-2'>Insira o código do produto</p>
                                        <Input 
                                            value={codigo} 
                                            placeholder='Código do produto'
                                            className='mb-1' 
                                            onChange={(e) => {setCodigo(e.target.value)}}
                                        />
                                        
                                        <Helper 
                                            type="text"
                                            desc="Se um código for inserido, ele irá ser usado para atualizar o produto invés
                                            de usar o seletor de produto por nome." 
                                        />
                                    </div>

                                    <p className='place-self-center'>
                                        ou...
                                    </p>
                                    
                                    <div>
                                        <p className='mb-2'>
                                            Insira o nome do produto
                                        </p>
                                        <SelectSearch 
                                            itens={produtosArr} 
                                            onChange={(v) => setProdutoID(v.id)}
                                            onSearchChange={handleSearchChange} 
                                            id={'produto'}
                                        />
                                    </div>
                                </div>

                                <p className='mt-2 mb-2'>
                                    Quantidade
                                </p>
                                <Input 
                                    type='number'
                                    value={quantidade} 
                                    onChange={(e) => {setQuantidade(e.target.value)}}>
                                </Input>
                                
                                <div className='flex items-center gap-2 mt-2'>
                                    <Button variant='outline' type='submit' className='w-fit'>Atualizar</Button>
                                    <Helper type="text"
                                        desc="Você pode usar um escaner para atualizar a quantidade do produto automaticamente."
                                    />
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className='p-4'>
                        <CardTitle>
                            Quantidade total de produtos
                        </CardTitle>

                        <Separator className='my-4'/>

                        <CardContent className='p-0'>
                            <h4>{quantidadeTotal}</h4>
                        </CardContent>
                    </Card>

                    <Card className='p-4'>
                        <CardTitle>
                           Quantidade de produtos sem estoque
                        </CardTitle>

                        <Separator className='my-4'/>

                        <CardContent className='p-0'>
                            <h4>{quantidadeSemEstoque}</h4>
                        </CardContent>
                    </Card>
                </div>

                <Card className='relative p-4'>
                    {fetchLoading && <Loading />}

                    <CardTitle>
                        Produtos sem estoque
                        <Button 
                            className="mx-2"
                            variant='outline' 
                            disabled={fetchLoading} 
                            onClick={getProdutos}
                        >
                            <RefreshCw className={fetchLoading ? 'animate-spin' : ''}/>
                        </Button>
                    </CardTitle>

                    <Separator className='my-4'/>

                    <CardContent className='p-0'>
                        <TableComponent 
                            itens={produtos} 
                            tabela={'produtos'} 
                            elemento={'produto'}
                        />
                    </CardContent>
                </Card> 
            </div>
        </AnimatedLayout>
    )
}