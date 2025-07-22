import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from '@/components/ui/separator';
import { deleteRequest } from "@/hooks/axiosHook";
import { CircleX, Eye, ImageIcon, Pencil } from "lucide-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from "./ui/button";

export default function AlertDialogComponent(props) {
    let url = props.url;

    const { deleteData, deleted, deleting, deletionError } = deleteRequest('/api/v1/' + url);

    async function deleteById(element) {
        try {
            await deleteData();

            window.dispatchEvent(new CustomEvent("item-deleted", { detail: element }));

            toast.success(element + " deletado com sucesso!");
        } catch (err) {
            toast.error("Um erro aconteceu ao deletar este item.");
        }
    }

    if (props.content) {
        return (
            <AlertDialog >
                <AlertDialogTrigger>
                    <Button
                        className="rounded-r-none"
                        variant='outline'
                    >
                        <Eye />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="p-0">
                    <AlertDialogHeader
                        style={{ maxHeight: '80vh', overflowY: 'auto' }}
                        className="m-0 overflow-X-auto"
                    >
                        <AlertDialogTitle className="px-6 pt-6 leading-5">
                            {props.title}
                        </AlertDialogTitle>

                        <Separator />

                        <AlertDialogDescription className="px-6 pt-2 text-foreground/80">
                            {props.content}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="px-6 pb-4">
                        <AlertDialogAction
                            className="bg-background outline outline-2 outline-primary text-foreground hover:text-primary-foreground"
                        >
                            Fechar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }


    if (props?.tipo === "warning") {
        const [isOpen, setIsOpen] = useState(true);
        const onClose = () => {
            props.onClose();
            setIsOpen(false);
        };

        return (
            <AlertDialog open={isOpen}>
                <AlertDialogContent className="border-2 border-chart-3">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{props?.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {props?.desc}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            className="bg-chart-3 hover:bg-chart-3/80"
                            onClick={onClose}
                        >
                            Continuar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    if (props?.tipo === "success") {
        const [isOpen, setIsOpen] = useState(true);
        const onClose = () => {
            props.onClose();
            setIsOpen(false);
        };

        return (
            <AlertDialog open={isOpen}>
                <AlertDialogContent className="border-2 border-chart-2">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sucesso!</AlertDialogTitle>
                        <AlertDialogDescription>
                            {props?.desc}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            className="bg-chart-3 hover:bg-chart-3/80"
                            onClick={onClose}
                        >
                            Continuar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    if (props.itens?.elemento === "ordem") {
        if (props.tipo === "search") {
            const [showDiv, setShowDiv] = React.useState({ servico: false, materiaisEquipamentos: false, lista: false })
            const [imagens, setImagens] = React.useState([])

            const translate = {
                aberta: "Aberta",
                cancelada: "Cancelada",
                andamento: "Em andamento",
                concluida: "Concluída"
            }

            const translateTipo = {
                instalacao: "Instalação",
                manutencao: "Manuteção",
                reparo: "Reparo",
            }

            const showMore = (tipo) => {
                const newVar = { ...showDiv };
                if (tipo === "servico") {
                    newVar.servico = !newVar.servico;
                    newVar.materiaisEquipamentos = false;
                    newVar.lista = false;
                } else if (tipo === "materiaisEquipamentos") {
                    newVar.materiaisEquipamentos = !newVar.materiaisEquipamentos;
                    newVar.servico = false;
                    newVar.equipamentos = false;
                } else if (tipo === "lista") {
                    newVar.lista = !newVar.lista;
                    newVar.servico = false;
                    newVar.materiaisEquipamentos = false;
                }

                setShowDiv(newVar);
            }

            useEffect(() => {
                const getImagens = async () => {
                    const resposta = await fetch(import.meta.env.VITE_BACKEND_BASE_URL + '/api/v1/servicos-orcamentos/ordens-servicos/' + props.itens?.id + '/imagens', {
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
            }, [props.itens]);

            return (
                <AlertDialog className="w-[90vw]">
                    <AlertDialogTrigger>
                        <Button 
                            variant='outline'
                            className="rounded-r-none"
                        >
                            <Eye />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent
                        className="p-0 max-w-[90vw] sm:max-w-[90vw] md:max-w-[90vw] lg:max-w-[90vw]"
                    >
                        <AlertDialogHeader style={
                            { maxHeight: '80vh', overflowY: 'auto' }}
                            className="m-0 overflow-X-auto"
                        >
                            <AlertDialogTitle className="px-6 pt-6 leading-5">
                                {props.itens?.descricao}
                            </AlertDialogTitle>
                            <Separator />
                            <AlertDialogDescription className="px-6 pt-2 text-foreground/80">
                                <b>Status: </b>
                                <span
                                    className={`
                                                ${props.itens?.status === "aberta" ? "text-chart-1" : ""}
                                                ${props.itens?.status === "andamento" ? "text-chart-3" : ""}
                                                ${props.itens?.status === "concluida" ? "text-chart-2" : ""}
                                                ${props.itens?.status === "cancelada" ? "text-chart-4" : ""}
                                            `}
                                >
                                    {translate[props.itens?.status]}
                                </span>
                                <br />
                                {props.itens?.tipoServiço && <><b>Tipo de serviço:</b> {translateTipo[props.itens?.tipoServiço]} <br /></>}

                                <Separator className='my-2' />

                                <b>Descrição:</b> {props.itens?.descricao} <br />

                                <Separator className='my-2' />

                                <b>Cliente:</b> {props.itens?.cliente && props.itens?.cliente.nome} <br />
                                {props.itens?.dataExecucao && <><b>Data de execução:</b> {moment(props.itens?.dataExecucao).format('DD/MM/YYYY')} <br /></>}
                                {props.itens?.dataConclusao && <><b>Data de conclusão:</b> {moment(props.itens?.dataConclusao).format('DD/MM/YYYY')} <br /></>}
                                <b>Data do pagamento:</b> {moment(props.itens?.dataPagamento).format('DD/MM/YYYY')} <br />
                                <b>Emissão:</b> {moment(props.itens?.dataEmissao).format('DD/MM/YYYY')} <br />
                                <b>Foi pago:</b> {props.itens?.foiPago} <br />

                                <Separator className='mt-2 mb-3' />

                                {props.itens?.servico && props.itens?.servico.length > 0 && <>
                                    {props.itens?.servico && showDiv.servico && <><div style={
                                        { maxHeight: '150px', overflowY: 'auto' }}
                                        className="p-2 border rounded overflow-X-auto">
                                        <p className="mb-1 border-b"> Serviços: </p>
                                        {props.itens?.servico?.map((servico, index) => (
                                            <div key={index}>
                                                <b>{servico.nome}</b> <br />
                                                &nbsp; <b>Quantidade:</b> {servico.quantidade} <br />
                                                &nbsp; <b>Valor de venda:</b> {servico.venda} <br />
                                                &nbsp; <b>Total:</b> {servico.total} <br />

                                                {props.itens?.servico.length !== index + 1 && <br />}
                                            </div>
                                        ))}
                                    </div></>}
                                    {!showDiv.servico &&
                                        <div className="p-2 border rounded">
                                            Serviços [{props.itens?.servico.length}]
                                        </div>}
                                    <Button variant='link' className='pl-0 text-foreground' onClick={() => showMore('servico')}>
                                        {!showDiv.servico && <p>Mostrar serviços</p>}
                                        {showDiv.servico && <p>Mostrar menos</p>}
                                    </Button>
                                </>}

                                {props.itens?.lista && props.itens?.lista.length > 0 && <>
                                    {props.itens?.lista && showDiv.lista && <><div style={
                                        { maxHeight: '150px', overflowY: 'auto' }}
                                        className="p-2 border rounded overflow-X-auto">
                                        <p className="mb-1 border-b"> Lista: </p>
                                        <div style={{ whiteSpace: 'pre-line', lineHeight: '1.4' }}>
                                            {props.itens?.lista?.replace(/,/g, '\n')}
                                        </div>
                                    </div></>}
                                    {!showDiv.lista &&
                                        <div className="p-2 border rounded">
                                            Lista
                                        </div>}
                                    <Button variant='link' className='pl-0 text-foreground' onClick={() => showMore('lista')}>
                                        {!showDiv.lista && <p>Mostrar lista</p>}
                                        {showDiv.lista && <p>Mostrar menos</p>}
                                    </Button>
                                </>}

                                {props.itens?.materiaisEquipamentos && props.itens?.materiaisEquipamentos.length > 0 && <>
                                    {props.itens?.materiaisEquipamentos && showDiv.materiaisEquipamentos && <><div style={
                                        { maxHeight: '150px', overflowY: 'auto' }}
                                        className="p-2 border rounded overflow-X-auto">
                                        <p className="mb-1 border-b"> Materiais e equipamentos: </p>
                                        <div style={{ whiteSpace: 'pre-line', lineHeight: '1.4' }}>
                                            {props.itens?.materiaisEquipamentos?.replace(/,/g, '\n')}
                                        </div>
                                    </div></>}
                                    {!showDiv.materiaisEquipamentos &&
                                        <div className="p-2 border rounded">
                                            Lista de materiais e equipamentos:
                                        </div>}
                                    <Button variant='link' className='pl-0 text-foreground' onClick={() => showMore('materiaisEquipamentos')}>
                                        {!showDiv.materiaisEquipamentos && <p>Mostrar materiais e equipamentos</p>}
                                        {showDiv.materiaisEquipamentos && <p>Mostrar menos</p>}
                                    </Button>
                                </>}

                                <br />

                                {props.itens?.valor > 0 && <><b>Valor:</b> {props.itens?.valor} R$<br /></>}
                                {props.itens?.desconto > 0 && <><b>Desconto:</b> {props.itens?.desconto}% <br /></>}
                                {props.itens?.tipoPagamento && <><b>Pagamento:</b> {props.itens?.tipoPagamento} <br /></>}
                                {props.itens?.subtotal > 0 && <><b>Subtotal:</b> {props.itens?.subtotal} R$<br /></>}
                                {props.itens?.funcionario && <><b>Funcionário responsável:</b> {props.itens?.funcionario.nome} <br /></>}
                                {
                                    (props.itens?.valor || props.itens?.desconto || props.itens?.tipoPagamento || props.itens?.subtotal || props.itens?.funcionario) &&
                                    <Separator className='my-2' />
                                }

                                {props.itens?.tipo && <><b>Tipo:</b> {props.itens?.tipo} <br /></>}
                                {props.itens?.tipo === 'Internet' && <>
                                    {props.itens?.entregadora && <><b>Entregadora:</b> {props.itens?.entregadora} <br /></>}
                                    {props.itens?.cep && <><b>CEP:</b> {props.itens?.cep} <br /></>}
                                    {props.itens?.numero && <><b>Número:</b> {props.itens?.numero} <br /></>}
                                    {props.itens?.complemento && <><b>Complemento:</b> {props.itens?.complemento} <br /></>}
                                    {props.itens?.bairro && <><b>Bairro:</b> {props.itens?.bairro} <br /></>}
                                    {props.itens?.cidade && <><b>Cidade:</b> {props.itens?.cidade}</>}
                                    <Separator className='my-2' />
                                </>}

                                {imagens && imagens.length > 0 && <>
                                    <div className="flex gap-1 mb-4">
                                        <ImageIcon />
                                        <b><p>
                                            Imagens:
                                        </p></b>
                                    </div>

                                    <div className="flex flex-wrap justify-center w-full gap-4">
                                        {imagens.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img.preview}
                                                alt={img.name}
                                                className="w-full"
                                            />
                                        ))}
                                    </div>
                                </>}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="px-6 pb-4">
                            <AlertDialogAction
                                className="bg-background outline outline-2 outline-primary text-foreground hover:text-primary-foreground"
                            >
                                Continuar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )
        }

        if (props.tipo === "pencil") {
            return (
                <Link
                    to={`/dashboard/ordens-servico/adicionar?update=true&id=${props.itens?.id}&status=${props.itens?.status}&dataExecucao=${props.itens?.dataExecucao}&dataConclusao=${props.itens?.dataConclusao}&descricao=${props.itens?.descricao}&materiaisEquipamentos=${props.itens?.materiaisEquipamentos}&lista=${props.itens?.lista}&foiPago=${props.itens?.foiPago}&valor=${props.itens?.valor}&desconto=${props.itens?.desconto}`}
                >
                    <Button 
                        variant='outline'
                        className="rounded-none"
                    >
                        <Pencil />
                    </Button>
                </Link>
            )
        }
    }

    if (props.itens?.elemento === "venda") {
        if (props.tipo === "search") {
            const [showDiv, setShowDiv] = React.useState({ produto: false, servico: false, lista: false })
            const showMore = (tipo) => {
                const newVar = { ...showDiv };
                if (tipo === "produto") {
                    newVar.produto = !newVar.produto;
                    newVar.servico = false;
                    newVar.lista = false;
                } else if (tipo === "servico") {
                    newVar.servico = !newVar.servico;
                    newVar.produto = false;
                    newVar.lista = false;
                } else if (tipo === "lista") {
                    newVar.lista = !newVar.lista;
                    newVar.produto = false;
                    newVar.servico = false;
                }

                setShowDiv(newVar);
            }

            return (
                <AlertDialog>
                    <AlertDialogTrigger>
                        <Button 
                            variant='outline'
                            className="rounded-r-none"
                        >
                            <Eye />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="p-0">
                        <AlertDialogHeader style={
                            { maxHeight: '80vh', overflowY: 'auto' }}
                            className="m-0 overflow-X-auto"
                        >
                            <AlertDialogTitle className="px-6 pt-6 leading-5">
                                {props.itens?.descricao}
                            </AlertDialogTitle>
                            <Separator />
                            <AlertDialogDescription className="px-6 pt-2 text-foreground/80">
                                <b>Comprador (cliente):</b> {props.itens?.cliente && props.itens?.cliente.nome} <br />
                                <b>Data:</b> {moment(props.itens?.dataPagamento).format('DD/MM/YYYY')} <br />
                                <b>Foi pago:</b> {props.itens?.foiPago} <br />
                                <Separator className='mt-2 mb-3' />

                                {props.itens?.produto && props.itens?.produto.length > 0 && <>
                                    <div className="w-full h-1 " />
                                    {props.itens?.produto && showDiv.produto && <>
                                        <div style={
                                            { maxHeight: '150px', overflowY: 'auto' }}
                                            className="p-2 border rounded overflow-X-auto"
                                        >
                                            <p className="mb-1 border-b"> Produtos: </p>
                                            {props.itens?.produto?.map((produto, index) => (
                                                <div key={index}>
                                                    <b>{produto.nome}</b> <br />
                                                    &nbsp; <b>Quantidade:</b> {produto.quantidade} <br />
                                                    &nbsp; <b>Valor:</b> {produto.valor} <br />
                                                    &nbsp; <b>Total:</b> {produto.total} <br />

                                                    {props.itens?.produto.length !== index + 1 && <br />}
                                                </div>
                                            ))}
                                        </div></>}
                                    {!showDiv.produto &&
                                        <div className="p-2 border rounded">
                                            Produtos [{props.itens?.produto.length}]
                                        </div>}
                                    <Button variant='link' className='pl-0 mb-2 text-foreground' onClick={() => showMore('produto')}>
                                        {!showDiv.produto && <p>Mostrar mais</p>}
                                        {showDiv.produto && <p>Mostrar menos</p>}
                                    </Button>
                                </>}

                                {props.itens?.servico && props.itens?.servico.length > 0 && <>
                                    {props.itens?.servico && showDiv.servico && <><div style={
                                        { maxHeight: '150px', overflowY: 'auto' }}
                                        className="p-2 border rounded overflow-X-auto">
                                        <p className="mb-1 border-b"> Serviços: </p>
                                        {props.itens?.servico?.map((servico, index) => (
                                            <div key={index}>
                                                <b>{servico.nome}</b> <br />
                                                &nbsp; <b>Quantidade:</b> {servico.quantidade} <br />
                                                &nbsp; <b>Valor de venda:</b> {servico.venda} <br />
                                                &nbsp; <b>Total:</b> {servico.total} <br />

                                                {props.itens?.servico.length !== index + 1 && <br />}
                                            </div>
                                        ))}
                                    </div></>}
                                    {!showDiv.servico &&
                                        <div className="p-2 border rounded">
                                            Serviços [{props.itens?.servico.length}]
                                        </div>}
                                    <Button variant='link' className='pl-0 text-foreground' onClick={() => showMore('servico')}>
                                        {!showDiv.servico && <p>Mostrar mais</p>}
                                        {showDiv.servico && <p>Mostrar menos</p>}
                                    </Button>
                                </>}

                                {props.itens?.listaDigitada && props.itens?.listaDigitada.length > 0 && <>
                                    {props.itens?.listaDigitada && showDiv.lista && <><div style={
                                        { maxHeight: '150px', overflowY: 'auto' }}
                                        className="p-2 border rounded overflow-X-auto">
                                        <p className="mb-1 border-b"> Lista: </p>
                                        <div style={{ whiteSpace: 'pre-line', lineHeight: '0.8' }}>
                                            {props.itens?.listaDigitada?.replace(/,/g, '\n')}
                                        </div>
                                    </div></>}
                                    {!showDiv.lista &&
                                        <div className="p-2 border rounded">
                                            Lista
                                        </div>}
                                    <Button variant='link' className='pl-0 text-foreground' onClick={() => showMore('lista')}>
                                        {!showDiv.lista && <p>Mostrar mais</p>}
                                        {showDiv.lista && <p>Mostrar menos</p>}
                                    </Button>
                                </>}

                                <br />

                                <Separator className='my-2' />

                                {props.itens?.valor && <><b>Valor:</b> {props.itens.valor} R$ <br /></>}
                                {props.itens?.desconto && <><b>Desconto:</b> {props.itens.desconto}% <br /></>}
                                {props.itens?.tipoPagamento && <><b>Pagamento:</b> {props.itens.tipoPagamento} <br /></>}
                                {props.itens?.subtotal && <><b>Subtotal:</b> {props.itens.subtotal} R$ <br /></>}
                                {props.itens?.funcionario?.nome && <><b>Funcionário responsável:</b> {props.itens.funcionario.nome} <br /></>}

                                <Separator className='my-2' />

                                {props.itens?.tipo && <><b>Tipo:</b> {props.itens.tipo} <br /></>}
                                {props.itens?.tipo === 'Internet' && <>
                                    {props.itens?.entregadora && <><b>Entregadora:</b> {props.itens.entregadora} <br /></>}
                                    {props.itens?.cep && <><b>CEP:</b> {props.itens.cep} <br /></>}
                                    {props.itens?.numero && <><b>Número:</b> {props.itens.numero} <br /></>}
                                    {props.itens?.complemento && <><b>Complemento:</b> {props.itens.complemento} <br /></>}
                                    {props.itens?.bairro && <><b>Bairro:</b> {props.itens.bairro} <br /></>}
                                    {props.itens?.cidade && <><b>Cidade:</b> {props.itens.cidade}</>}
                                </>}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="px-6 pb-4">
                            <AlertDialogAction
                                className="bg-background outline outline-2 outline-primary text-foreground hover:text-primary-foreground"
                            >
                                Continuar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )
        }
        if (props.tipo === "pencil") {
            return (
                <Link to={`/dashboard/produtos-servicos/adicionar?update=true&id=${props.itens?.id}`}>
                    <Button 
                        variant='outline' 
                        className="rounded-none"
                    >
                        <Pencil />
                    </Button>
                </Link>
            )
        }
    }

    if (props.tipo === "circlex") {
        return (
            <AlertDialog >
                <AlertDialogTrigger>
                    <Button
                        className="rounded-l-none"
                        variant="destructive"
                    >
                        <CircleX />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-2 border-destructive">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar</AlertDialogTitle>
                        <AlertDialogDescription>
                            Deseja deletar este(a) {props.itens?.elemento}? Esta ação é permanente e não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteById(props.itens?.elemento)} className="bg-destructive text-foreground hover:bg-destructive/50">
                            Deletar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }
}