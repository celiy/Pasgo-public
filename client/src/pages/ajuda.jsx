import AlertDialogComponent from "@/components/alert-dialog-component";
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
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/elements/hookLoader";
import AnimatedLayout from '@/hooks/AnimatedLayout';
import { postRequest } from "@/hooks/axiosHook";
import { ChevronsUpDown, Mail, Phone } from "lucide-react";
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";

const perguntas = [
    {
        pergunta: "Como a data de pagamento das vendas funciona?",
        resposta: "Quando inserido a data e o status do pagamento (Se foi pago ou não), se for macado como pago então a venda será marcada como paga no dia inserido pelo o usuário. Caso não tenha sido paga então será marcada como pendente. Caso o status de pagamento seja alterado para não pago/foi pago, a data de pagamento da venda será a data atual.",
    },
    {
        pergunta: "Como o sistema de contas funciona?",
        resposta: "Contas atribuídas como conta de cliente/fornecedor/funcionário... tem sua data de vencimento que seguem a mesma lógica que a data de pagamento das vendas. No caso se for uma conta atribuída como própria, ela será destacada na Dashboard.",
    },
    {
        pergunta: "Como o sistema de serviços funciona?",
        resposta: "Serviços podem ser criados e mantidos para reutilização. O usuário cadastra um serviço e ele pode ser reutilizado em várias vendas. Caso seja um serviço 'descartável' ou que não vai ser reutilizado, então o usuário pode inserir um serviço deste tipo que não será salvo na tabela de serviços na aba de criar uma venda.",
    },
    {
        pergunta: "Como excluir minha conta?",
        resposta: "Para excluir sua conta você primeiramente deve estar logado nela para confirmar que é você. Ao estar logado, acesse a aplicação clicando na sua Conta no canto superior direito e depois em 'Entrar'. Após entrar, no menu de navegação da esquerda, clique em 'Conta e configurações', após isso clique em 'Perfil'. Isso irá te levar para o seu perfil, onde você irá clicar no botão 'Avançado', mostrando o botão de excluir sua conta. (Excluir dados da conta).",
    },
]

const erros = [
    {
        erro: "",
        solucao: "",
    },
]

function Ajuda() {
    const { postData, data, postLoading, postError } = postRequest('/api/v1/');

    const location = useLocation();
    const currentFragment = location.hash;
    const [option, setOption] = React.useState();
    const [procura, setProcura] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    React.useEffect(() => {
        setOption(currentFragment);
        setProcura("");
    }, [currentFragment]);

    const handleInputChangePergunta = (event) => {
        setProcura(event.target.value);
    };

    const handleInputChangeErro = (event) => {
        setProcura(event.target.value);
    };

    const handleInputChangeAjuda = (event) => {
        setProcura(event.target.value);
    };

    const handleInputChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const handleInputChangeEmail = (event) => {
        setEmail(event.target.value);
    };

    const send = async () => {
        try {
            let tipo = "";
            if (option === "#faq") tipo = "pergunta";
            else if (option === "#erros") tipo = "erro";
            else tipo = "ajuda";

            const resposta = await postData({ message: procura, type: tipo }, "user/support");

            if (resposta.status == "success") {
                toast.success("Enviado com sucesso! Iremos te retonar o mais breve possível.");
            }
        } catch (err) {
            console.log(err);
        }
    }

    const execute = async () => {
        await send();
    }

    const revertAccountDeletion = async () => {
        try {
            const resposta = await postData({ email: email, password: password }, "user/revert-account-deletion");

            if (resposta.status == "success") {
                toast.success("A sua conta foi restaurada com sucesso! Agora você pode fazer login normalmente.");
            }
        } catch (err) {
            toast.error(err?.data?.message ?? "Erro desconhecido.");
            console.log(err);
        }
    }

    return (
        <AnimatedLayout>
            <Loader />
            {(postError) &&
                <AlertDialogComponent
                    tipo='warning'
                    title='Erro!'
                    desc={(postError?.message) ? postError.message : "Erro desconhecido."}
                    onClose={() => { }} 
                />
            }

            <section className="grid items-center mx-auto mt-24 w-home-responsive">

                {option === "#faq" && <>
                    <header className='grid pt-8 pb-8'>
                        <div className='grid gap-2'>
                            <h1>F.A.Q</h1>
                            <h3 className='text-primary'>Perguntas frequentes</h3>
                            <p className='font-medium leading-6 text-justify'>Aqui você pode encontrar respostas para as perguntas mais comuns, e se ela não existir, apenas a faça uma pergunta. Iremos responder o quanto antes para seu endereço de email.</p>
                        </div>
                    </header>
                    <article className="w-full">
                        <h2>Perguntas e respostas</h2>

                        <div className="grid gap-4 mt-2">
                            {perguntas.map((pergunta) =>
                                <Collapsible className="transition-all border rounded">
                                    <CollapsibleTrigger className="grid w-full grid-cols-[1fr_auto] pt-2 pb-3 pl-4 pr-4 hover:bg-accent">
                                        <p className="place-self-start">{pergunta.pergunta}</p>
                                        <ChevronsUpDown className="place-self-end" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="grid pl-4 pr-4">
                                        <Separator className="place-self-center" />
                                        <div className="pt-2 pb-3 text-justify">
                                            <p>{pergunta.resposta}</p>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            )}
                        </div>

                        <Separator className="my-2 mt-4 place-self-center" />

                        <div className="w-[100%] sm:w-[80%] md:w-[75%] lg:w-[50%] grid gap-2">
                            <h3>Faça uma pergunta</h3>
                            <Textarea onChange={handleInputChangePergunta}></Textarea>
                            <Button className="w-fit" onClick={execute} disabled={postLoading}>Enviar</Button>
                        </div>

                    </article></>}

                {option === "#erros" && <>
                    <header className='grid pt-8 pb-8'>
                        <div className='grid gap-2 place-self-start'>
                            <h1>Solução de erros</h1>
                            <h3 className='text-primary'>Nada aqui por enquanto!</h3>
                            <p className='font-medium leading-6 text-justify'>Reporte seu erro abaixo que iremos te ajudar o mais rápido possível.</p>
                        </div>
                    </header>
                    <article className="w-full">
                        <div className="grid gap-4">
                            {Error.length > 1 && erros.map((erro) =>
                                <Collapsible className="transition-all border rounded">
                                    <CollapsibleTrigger className="grid w-full grid-cols-[1fr_auto] pt-2 pb-3 pl-4 pr-4 hover:bg-accent">
                                        <p className="place-self-start">{erro.erro}</p>
                                        <ChevronsUpDown className="place-self-end" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="grid pl-4 pr-4">
                                        <Separator className="place-self-center" />
                                        <div className="pt-2 pb-3 text-justify">
                                            <p>{erro.solucao}</p>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            )}
                        </div>

                        <Separator className="my-2 mt-4 place-self-center" />

                        <div className="w-[100%] sm:w-[80%] md:w-[75%] lg:w-[50%] grid gap-2">
                            <h3>Reporte um erro</h3>
                            <Textarea onChange={handleInputChangeErro}></Textarea>
                            <Button className="w-fit" onClick={execute} disabled={postLoading}>Enviar</Button>
                        </div>

                    </article></>}

                {!option && <>
                    <header className='grid pt-8'>
                        <div className='grid gap-2 place-self-start'>
                            <h1>Suporte</h1>
                            <h3 className='text-primary'>Entre em contato conosco!</h3>
                            <p className='font-medium leading-6 text-justify'>Escreva sua mensagem e envie a nós que iremos te ajudar o mais rápido possivel.</p>
                        </div>
                        <div className='grid gap-2 mt-6 mb-2 place-self-start'>
                            <h4>Caso queria entrar em contato diretamente, essas são as formas de contato:</h4>
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=sasbrazilian@gmail.com" target="_blank" rel="noopener noreferrer" className='hover:underline'>
                                <div className="flex gap-2">
                                    <Mail />
                                    <p>sasbrazilian@gmail.com</p>
                                </div>
                            </a>
                            <Link to="https://api.whatsapp.com/send?phone=5551999329196" target="_blank" rel="noopener noreferrer" className='hover:underline'>
                                <div className="flex gap-2">
                                    <Phone />
                                    <p><b>WhatsApp:</b> (51) 9 9932-9196</p>
                                </div>
                            </Link>
                        </div>
                        <div className='grid gap-2 mt-6 mb-2 place-self-start'>
                            <h4>Caso queira reverter a exclusão da sua conta:</h4>
                            <AlertDialog >
                                <AlertDialogTrigger className="w-fit">
                                    <Button>Reverter exclusão da conta</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="border-2 border-chart-2">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Reverter exclusão da conta</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Se você deseja reverter a deleção da conta insira o seu email e senha.
                                            <br />
                                            <br />
                                            <Label htmlFor="email">Email</Label>
                                            <Input onChange={handleInputChangeEmail} type="email" id="email" />

                                            <div className="my-2" />

                                            <Label htmlFor="password">Senha</Label>
                                            <Input onChange={handleInputChangePassword} type="password" id="password" />
                                            <br />
                                            <b>Se você deseja reverter a deleção dessa conta clique no botão "Reverter deleção" abaixo, então a deleção será cancelada. Caso não queira fazer isso, apenas clique em "Cancelar".</b>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction 
                                            className="bg-chart-2 hover:bg-chart-2/80 text-background"
                                            onClick={revertAccountDeletion}
                                        >
                                            Reverter deleção
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </header>

                    <Separator className="my-2 mt-4 place-self-center" />

                    <p className="my-2">
                        Com base nos nossas políticas de privacidade, você também pode usar esta página para requisição de revisão, atualização ou exclusão das suas informações pessoais.
                    </p>
                    <div className="w-[100%] sm:w-[80%] md:w-[75%] lg:w-[50%] grid gap-2">
                        <h3>Escreva sua mensagem</h3>
                        <Textarea onChange={handleInputChangeAjuda}></Textarea>
                        <Button className="w-fit" onClick={execute} disabled={postLoading}>Enviar</Button>
                    </div>
                </>}
            </section>
        </AnimatedLayout>
    )
}

export default Ajuda