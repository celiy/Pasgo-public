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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import AnimatedLayout from '@/hooks/AnimatedLayout';
import { deleteRequest, fetchRequest, patchRequest, postRequest } from "@/hooks/axiosHook";
import { CircleUserRound } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";

const User = () => {
    const { getData, data, loading, error } = fetchRequest("/api/v1/user/info")
    const { patchData, updating, patchedData, patchError } = patchRequest("/api/v1/");
    const { postData, postedData, postLoading, postError } = postRequest("/api/v1/");
    const { deleteData, deleted, deleting, deletionError } = deleteRequest('/api/v1/auth/logout');
    const [userInfo, setUserInfo] = React.useState({});
    const [editType, setEditType] = React.useState("none");
    const [nome, setNome] = React.useState("");
    const [senhaAntiga, setSenhaAntiga] = React.useState("");
    const [senha, setSenha] = React.useState("");
    const [senhaConfirmacao, setSenhaConfirmacao] = React.useState("");
    const [alert, setAlert] = React.useState("");

    const handleNomeChange = (target) => {
        setNome(target.target.value);
    }

    const handleSenhaAntigaChange = (target) => {
        setSenhaAntiga(target.target.value);
    }

    const handleSenhaChange = (target) => {
        setSenha(target.target.value);
    }

    const handleSenhaConfirmacaoChange = (target) => {
        setSenhaConfirmacao(target.target.value);
    }
    
    const getInfo = async () => {
        setNome("");
        setEditType("none");
        const user = await getData();
        setUserInfo(user.data);
    }

    const updateMe = async () => {
        try {
            const response = await patchData({name: nome}, 'user/update-me')

            if (response.status === "success"){
                await getInfo();
                setEditType("none");
                setNome("");
                toast.success("Nome alterado com sucesso")
            }
        } catch (err) {
            toast.error(err.message);
            console.log(err)
        }
    }

    const updateSenha = async () => {
        try {
            const response = await patchData({currentPassword: senhaAntiga, password: senha, confirmPassword: senha}, 'user/update-password')
            
            if (response){
                await getInfo();
                setEditType("none");
                setSenha("");
                setSenhaAntiga("");
                toast.success("Senha mudada com sucesso")
            }
        } catch (err) {
            toast.error(err.message);
            console.log(err)
        }
    }

    const edit = async (params) => {
        setEditType(params);
    }

    const deleteAccount = async () => {
        try {
            const response = await postData({password: senhaConfirmacao}, 'user/delete-account');

            if (response.status === "success"){
                await deleteData();
                
                window.location.reload();
            }
        } catch (err) {
            toast.error(err?.data?.message ?? "Algum erro inesperado aconteceu. Por favor, tente novamente.");
            console.log(err);
        }
    }

    useEffect(() => {
        getInfo();
    }, [])

    return (
    <AnimatedLayout>
        <div className='ml-0 sm:ml-6 m-6 mt-[4rem] flex flex-col items-center'>
            <div>
                <CircleUserRound className="w-[12rem] h-[12rem]"/>
            </div>
            <div>
                <p className="text-2xl font-medium text-center">{userInfo.name} </p>
                <p className="font-medium text-center text-1xl">{userInfo.email} </p>
                <p className="font-medium text-center text-1xl">{userInfo.document?.length === 11 ? "CPF:" : "CNPJ:"} {userInfo.document} </p>
                <Separator className="my-4" />

                {editType === "user" && <>
                    <Label htmlFor="nome">Nome:</Label>
                    <Input onChange={handleNomeChange} id='nome'/>
                    <Button className='mt-2 mr-2' variant='outline' onClick={updateMe} disabled={nome.length < 1}>Salvar</Button>
                    <Button className='mt-2 mr-2' variant='outline' onClick={() => edit("none")}>Cancelar</Button>
                </>}

                {editType === "senha" && <>
                    <Label htmlFor="oldpassword">Senha antiga:</Label>
                    <Input onChange={handleSenhaAntigaChange} type='password' id='oldpassword'/>
                    <Label htmlFor="newpassword">Nova senha:</Label>
                    <Input onChange={handleSenhaChange} type='password' id='newpassword'/>
                    <Button className='mt-2 mr-2' variant='outline' onClick={updateSenha} disabled={senha.length < 1 && senhaAntiga.length < 1}>Mudar</Button>
                    <Button className='mt-2 mr-2' variant='outline' onClick={() => edit("none")}>Cancelar</Button>
                </>}

                {editType === "advanced" && <>
                    <div>
                        <p>Solicitar exclusão dos dados</p>
                        <AlertDialog >
                            <AlertDialogTrigger>
                                <Button variant="destructive">Excluir dados da conta</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="border-2 border-destructive">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Deletar dados da conta</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Deseja mesmo deletar os dados da conta? Esta ação é permanente e não pode ser desfeita. Caso sim, você poderá recuperar seus dados dentro de 30 dias. Para confirmar a exclusão dos dados da sua conta, insira sua senha.
                                        <br />
                                        <b>(Ao excluir a conta, você não poderá recuperar os dados da conta depois de 30 dias, incluindo a conta em si como seu nome, email, CPF/CNPJ, etc.)</b>
                                        <br /><br />
                                        
                                        <Label htmlFor="passwordConfirmation">Senha:</Label>
                                        <Input 
                                            onChange={handleSenhaConfirmacaoChange} 
                                            type='password' 
                                            id='passwordConfirmation'
                                        />
                                        
                                        <div className="mt-2">
                                            <b>Você pode acessar o suporte para recuperar seus dados, ou tentar logar na conta novamente dentro desse período de 30 dias.</b>
                                        </div>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                        className="bg-destructive text-foreground hover:bg-destructive/50" 
                                        onClick={deleteAccount}
                                        disabled={senhaConfirmacao.length < 1}
                                    >
                                        Deletar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    
                    <Button className='mt-8 mr-2' variant='outline' onClick={() => edit("none")}>Voltar</Button>
                </>}

                {userInfo && editType === "none" && <>
                    <p className="font-medium text-1xl">Dados da conta: </p>
                    <p className="text-1xl">• Clientes: {userInfo.clientes} </p>
                    <p className="text-1xl">• Funcionários: {userInfo.funcionarios} </p>
                    <p className="text-1xl">• Fornecedores: {userInfo.fornecedores} </p>
                    <p className="text-1xl">• Produtos: {userInfo.produtos} </p>
                    <p className="text-1xl">• Serviços: {userInfo.servicos} </p>
                    <p className="text-1xl">• Vendas: {userInfo.vendas} </p>
                    <p className="text-1xl">• Vendas do caixa: {userInfo.caixas} </p>
                    <p className="text-1xl">• Ordens de serviço: {userInfo.ordens} </p>
                    <p className="text-1xl">• Contas: {userInfo.vendas} </p>
                    <Separator className="my-4" />
                    <div className="flex flex-col items-center gap-2">
                        <Button variant='outline' onClick={() => edit("senha")}>Mudar senha</Button>
                        <Button variant='outline' onClick={() => edit("user")}>Mudar nome</Button>
                        <Button variant='outline' onClick={() => edit("advanced")}>Avançado</Button>
                    </div>
                </>}
            </div>
        </div>
        </AnimatedLayout>
    )
}

export default User
