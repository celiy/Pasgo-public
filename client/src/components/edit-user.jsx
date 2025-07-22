import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Separator } from '@/components/ui/separator';
import { fetchRequest, patchRequest } from "@/hooks/axiosHook";
import { } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

export default function EditUserComponent() {
    const { getData, data, loading, error } = fetchRequest("/api/v1/user/info")
    const { patchData, updating, patchedData, patchError } = patchRequest("127.0.0.1:8000/api/v1/");
    const [userInfo, setUserInfo] = React.useState({});
    const [editType, setEditType] = React.useState("none");
    const [nome, setNome] = React.useState("");
    const [senhaAntiga, setSenhaAntiga] = React.useState("");
    const [senha, setSenha] = React.useState("");

    const handleNomeChange = (target) => {
        setNome(target.target.value);
    }

    const handleSenhaAntigaChange = (target) => {
        setSenhaAntiga(target.target.value);
    }

    const handleSenhaChange = (target) => {
        setSenha(target.target.value);
    }
    
    const getInfo = async () => {
        setNome("");
        setEditType("none");
        const user = await getData();
        setUserInfo(user.data);
    }

    const updateMe = async () => {
        const response = await patchData({name: nome}, 'user/update-me');
        
        if (response.status === "success"){
            await getInfo();
            setEditType("none");
            setNome("");
            toast.success("Nome alterado com sucesso!");
        }
    }

    const updateSenha = async () => {
        const response = await patchData({currentPassword: senhaAntiga, password: senha, confirmPassword: senha}, 'user/update-password');
        
        if (response){
            await getInfo();
            setEditType("none");
            setSenha("");
            setSenhaAntiga("");
            toast.success("Senha mudada com sucesso!");
        }
    }

    const edit = async (params) => {
        setEditType(params);
    }

    return (
        <AlertDialog className='w-full'>
            <AlertDialogTrigger className='w-full'>
                <Button variant='ghost' className='flex items-center justify-start w-full' onClick={getInfo}>Usuário</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{userInfo && <>{userInfo.name}</>}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {editType === "user" && <>
                        <p>Nome:</p>
                        <Input onChange={handleNomeChange} id='nome'/>
                        <Button className='mt-2 mr-2' variant='outline' onClick={updateMe} disabled={nome.length < 1}>Salvar</Button>
                        <Button className='mt-2 mr-2' variant='outline' onClick={() => edit("none")}>Cancelar</Button>
                        </>}

                        {editType === "senha" && <>
                        <p>Senha antiga:</p>
                        <Input onChange={handleSenhaAntigaChange} type='password' id='oldpassword'/>
                        <p>Nova senha:</p>
                        <Input onChange={handleSenhaChange} type='password' id='newpassword'/>
                        <Button className='mt-2 mr-2' variant='outline' onClick={updateSenha} disabled={senha.length < 1 && senhaAntiga.length < 1}>Mudar</Button>
                        <Button className='mt-2 mr-2' variant='outline' onClick={() => edit("none")}>Cancelar</Button>
                        </>}

                        {userInfo && editType === "none" && <>
                        Email: {userInfo.email} <br/>
                        
                        <Separator className='my-2'/>

                        Clientes: {userInfo.clientes} <br/>
                        Funcionários: {userInfo.funcionarios} <br/>
                        Fornecedores: {userInfo.fornecedores} <br/>
                        Produtos: {userInfo.produtos} <br/>
                        Serviços: {userInfo.servicos} <br/>
                        Vendas: {userInfo.vendas} <br/>
                        Contas: {userInfo.vendas} <br/>

                        <Separator className='my-2'/>

                        <Button 
                            className='mt-1 mr-2' 
                            variant='outline' 
                            onClick={() => edit("senha")}
                        >
                            Mudar senha
                        </Button>
                        
                        <Button 
                            variant='outline' 
                            onClick={() => edit("user")}
                        >
                            Editar
                        </Button>
                        </>}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction>Continuar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}