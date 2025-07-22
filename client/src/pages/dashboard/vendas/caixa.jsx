import SelectComponent from "@/components/select-component"
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import Helper from '@/elements/helper'
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { fetchRequest, postRequest } from "@/hooks/axiosHook"
import { DMA } from '@/hooks/getDatePTBR'
import { CircleX, ShoppingCart, Upload } from 'lucide-react'
import React from 'react'
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function Caixa() {
    const [produtos, setProdutos] = React.useState([]);
    const [codigo, setCodigo] = React.useState('');
    const [quantidade, setQuantidade] = React.useState(0);
    const [VU, setVU] = React.useState(0);
    const [TR, setTR] = React.useState(0);
    const [subtotal, setSubtotal] = React.useState(0);
    const [pagamento, setPagamento] = React.useState("");
    const { getData, data, loading, error } = fetchRequest('/api/v1/produtos/produtosAPI');
    const { postData, postLoading, postError, postedData } = postRequest('/api/v1/vendas/caixaAPI');
    const [issuesMSG, setIssuesMSG] = React.useState({state: false, msg: ""});

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const lista = [...produtos];
            let resposta = { data: { produto: [] } }

            for (let n = 0; n < lista.length; n++) {
                if (lista[n].codigo === codigo) {
                    resposta.data.produto = lista[n];
                    break;
                }
            }

            if (resposta.data.produto.length < 1) {
                resposta = await getData("/" + codigo);
            }

            if (resposta && resposta.data && resposta.data.produto) {
                const produto = resposta.data.produto;
                const lista = [...produtos];
                setVU(produto.valor);
                let index;

                for (let n = 0; n < lista.length; n++) {
                    if (lista[n].codigo === produto.codigo) {
                        index = n;
                        break;
                    }
                }

                if (typeof index === "number") {
                    if (quantidade > 0) {
                        const quant = lista[index].quantidade;
                        lista[index].quantidade = (quant * 1) + (quantidade * 1);
                        setQuantidade(0);
                    } else {
                        lista[index].quantidade += 1;
                    }
                    setProdutos(lista);
                } else {
                    if (quantidade > 0) {
                        produto.quantidade = quantidade;
                        setQuantidade(0);
                    } else {
                        produto.quantidade = 1;
                    }
                    lista.push(produto);
                    setProdutos(lista);
                }

                let soma = 0;

                for (let n = 0; n < lista.length; n++) {
                    soma += lista[n].valor * lista[n].quantidade;
                }
                
                setSubtotal((soma).toFixed(2));
                setQuantidade(0);
                setCodigo('');
            } else {
                toast.error("Este produto não existe.")
                setQuantidade(0);
                setCodigo('');
            }
        } catch (err) {
            toast.error(err.message);
            console.log(err);
        }
    }

    async function submitCaixa() {
        if (!pagamento) return toast.error("Selecione um método de pagamento!");
        
        let response;

        try {
            response = await postData({ produtos: produtos, pagamento: pagamento });

            if (response.status === "success") {
                toast.success("Venda feia com sucesso.");
                setCodigo('');
                setQuantidade(0);
                setSubtotal(0);
                setProdutos([]);
                setVU(0);
                setTR(0);
                
                if (response.issues && response.issues.length > 0) {
                    let msg = response.issues.join(", ");
                    setIssuesMSG({state: true, msg: "Os produtos: "+msg+" não existem mais no estoque (Quantidade de produtos = 0)."});
                }
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    function handleCodigo(e) {
        setCodigo(e.target.value);
    }

    function handleQuantidade(e) {
        setQuantidade(e.target.value);
    }

    function handlePagamento(value) {
        console.log(value);
        setPagamento(value);
    }

    function deleteProd(index) {
        const lista = [...produtos];
        lista.splice(index, 1);
        setProdutos(lista);

        let soma = 0;
        for (let n = 0; n < lista.length; n++) {
            soma += lista[n].valor * lista[n].quantidade;
        }
        setSubtotal((soma).toFixed(2));
    }

    function handleRecebido(e) {
        const lista = [...produtos];
        let soma = 0;
        for (let n = 0; n < lista.length; n++) {
            soma += lista[n].valor * lista[n].quantidade;
        }

        const troco = e.target.value;

        setTR(troco > soma ? (troco - soma).toFixed(2) : 0);
    }

    const quantRef = React.useRef(null);
    const codRef = React.useRef(null);
    const focusQuant = () => {
        if (quantRef.current) {
            quantRef.current.focus();
        }
    };
    const focusCod = () => {
        if (codRef.current) {
            codRef.current.focus();
        }
    };
    const handleAction = (tipo) => {
        if (tipo === "Quantidade") {
            focusQuant();
        }
        if (tipo === "Codigo") {
            focusCod();
        }

    };

    React.useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'Enter') {
                event.preventDefault();
                submitCaixa();
            }

            if (event.ctrlKey && event.key === 'q') {
                event.preventDefault();
                handleAction("Quantidade");
            }

            if (event.ctrlKey && event.key === 'c') {
                event.preventDefault();
                handleAction("Codigo");
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <AnimatedLayout>
            <div className='m-6 mt-10 ml-0 sm:ml-6'>
                <div className='grid grid-cols-2'>
                    <div className='flex items-center gap-2'>
                        <ShoppingCart/>
                        <h3>Caixa</h3>
                        <Helper type="card" title="Como usar" 
                            desc="Para inserir um produto, insira seu código na área de 'Código de barras' ou escaneie o produto.
                            Produtos escaneados/inseridos sem quantidade são automaticamente adicionados como 1 unidade." 
                        />
                    </div>
                    <div className='justify-self-end'>
                        <DMA />
                    </div>
                </div>

                <Separator className='mt-2 mb-4'/>

                <div className='grid sm:grid-cols-1 md:grid-cols-[1fr_2fr] gap-4'>
                    <section className='grid gap-2'>
                        <Card className='p-3'>
                            <CardTitle>Código de barras</CardTitle>
                            <Separator className='my-3' />
                            <CardContent className='p-0'>
                                <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-[1fr_auto]'>
                                    <Input 
                                        className="border-r-0 rounded-r-none"
                                        onChange={handleCodigo} 
                                        value={codigo} 
                                        ref={codRef}
                                    />

                                    <Button 
                                        type='submit' 
                                        variant='outline'
                                        className="rounded-l-none"
                                    >
                                        <Upload/>
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                        <Card className='p-3'>
                            <CardTitle>Quantidade</CardTitle>
                            <Separator className='my-3' />
                            <CardContent className='p-0'>
                                <Input onChange={handleQuantidade} value={quantidade} ref={quantRef} type='number'></Input>
                            </CardContent>
                        </Card>
                        <Card className='p-3'>
                            <CardTitle>Valor unitário</CardTitle>
                            <Separator className='my-3' />
                            <CardContent className='p-0'>
                                <h3>{VU} R$</h3>
                                <Helper type="text"
                                    desc="Valor unitário do último produto inserido." 
                                />
                            </CardContent>
                        </Card>
                    </section>
                    
                    <section className='grid gap-2'>
                        <Card className='p-3'>
                            <CardTitle>Produtos</CardTitle>
                            <Separator className='my-3' />
                            <CardContent className='relative p-0'>
                                {issuesMSG.state &&
                                <div className="absolute z-10 pointer-events-none bottom-10 right-4 animate-fadeIn">
                                    <div className="flex items-center gap-4 p-3 transition-opacity duration-300 border rounded-md shadow-lg opacity-100 pointer-events-auto bg-sidebar border-destructive max-w-[500px]">
                                        <p>{issuesMSG.msg}</p>
                                        <Button 
                                            className="h-6 p-2 border bg-sidebar text-foreground hover:bg-sidebar-accent border-destructive" 
                                            onClick={() => {setIssuesMSG({state: false, msg: ""})}}
                                        >
                                            Ok
                                        </Button>
                                    </div>
                                </div>}
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Código</TableHead>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>V. Unid.</TableHead>
                                            <TableHead>V. Total</TableHead>
                                            <TableHead className="text-right w-[100px]">Excluir</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {produtos.map((item, index) =>
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                    {item.codigo}
                                                </TableCell>
                                                <TableCell>{item.nome}</TableCell>
                                                <TableCell>{item.valor} R$</TableCell>
                                                <TableCell>{(item.quantidade * item.valor).toFixed(2)} R$</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button onClick={() => deleteProd(index)} variant='ghost' className='w-fit bg-destructive hover:bg-destructive/70' type='button'>
                                                            <CircleX />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>)}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </section>

                    <section className='grid gap-2'>
                        <Card className='p-3'>
                            <CardTitle>Atalhos</CardTitle>
                            <Separator className='my-3' />
                            <CardContent className='grid gap-2 p-0'>
                                <div className="flex">
                                    <Badge variant="outline">ENTER</Badge><p className="px-2.5 py-0.5">Inserir produto</p>
                                </div>
                                <div className="flex">
                                    <Badge variant="outline">CTRL+ENTER</Badge><p className="px-2.5 py-0.5">Finalizar</p>
                                </div>
                                <div className="flex">
                                    <Badge variant="outline">CTRL+Q</Badge><p className="px-2.5 py-0.5">Inserir quantidade</p>
                                </div>
                                <div className="flex">
                                    <Badge variant="outline">CTRL+C</Badge><p className="px-2.5 py-0.5">Inserir código</p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                    
                    <section className='grid grid-cols-2 gap-2'>
                        <Card className='col-span-2 p-3'>
                            <CardTitle>Subtotal</CardTitle>
                            <Separator className='my-3' />
                            <CardContent className='grid grid-cols-[1fr_1fr] p-0'>
                                <h3 className='place-self-start'>{subtotal} R$</h3>
                                <div className='flex gap-2'>
                                    <SelectComponent itens={[
                                        { name: "Dinheiro", value: "Dinheiro" },
                                        { name: "Crédito", value: "Crédito" },
                                        { name: "Débito", value: "Débito" },
                                    ]} onChange={handlePagamento} placeholder="Pagamento" />
                                    <Button 
                                        type="button" 
                                        onClick={submitCaixa} 
                                        disabled={postLoading}
                                    >
                                        Finalizar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className='p-3'>
                            <CardTitle>Recebido</CardTitle>

                            <Separator className='my-3' />

                            <CardContent className='p-0'>
                                <Input onChange={handleRecebido}></Input>
                            </CardContent>
                        </Card>

                        <Card className='p-3'>
                            <CardTitle>Troco</CardTitle>

                            <Separator className='my-3' />
                            
                            <CardContent className='p-0'>
                                <h3>{TR} R$</h3>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </div>
        </AnimatedLayout>
    )
}