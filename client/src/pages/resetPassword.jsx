import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Toaster } from "@/components/ui/sonner";
import { Loader } from '@/elements/hookLoader';
import AnimatedLayout from '@/hooks/AnimatedLayout';
import { postRequest } from '@/hooks/axiosHook.jsx';
import { ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "sonner";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { postData, postLoading, error, data } = postRequest('/api/v1/auth');
    const navigate = useNavigate();
    const { token } = useParams();

    async function resetPassword() {
        try {
            const response = await postData({ confirmPassword: confirmPassword, password: password }, "/reset-password/" + token);
            
            if (response.status === "success") {
                toast.success("Senha alterada com sucesso!");
                navigate('/dashboard/inicio');
            }
        } catch (err) {
            toast.error(err?.data?.message ?? "Algum erro inesperado aconteceu. Por favor, tente novamente.");
            console.log(err);
        }
    }

    function handlePassword(event) {
        setPassword(event.target.value);
    }
    function handleConfirmPassword(event) {
        setConfirmPassword(event.target.value);
    }

    return (
        <AnimatedLayout>
            <Loader />
            <Toaster richColors position="bottom-center"/>
            <div className='flex items-center justify-center w-full h-[100vh]'>
            <Button className="absolute top-4 left-4" variant='outline' onClick={() => navigate("/", { replace: true })}><ChevronLeft /></Button>
                <Card className="w-[100%] sm:w-[80%] md:w-[50%] lg:w-[40%] my-auto">
                    <CardHeader>
                        <CardTitle>Mudar senha</CardTitle>
                        <CardDescription>Insira a nova senha para continuar.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Label htmlFor="password">Nova senha</Label>
                        <Input type="password" id="password" placeholder="Senha" onChange={handlePassword} />
                        <div className="my-2" />
                        <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                        <Input type="password" id="confirm-password" placeholder="Confirmar nova senha" onChange={handleConfirmPassword} />
                    </CardContent>
                    <CardFooter className="grid grid-cols-2 gap-2 mt-2">
                        <Button className="w-full" onClick={resetPassword} disabled={postLoading}>Mudar</Button>
                    </CardFooter>
                </Card>
            </div>
        </AnimatedLayout>)
}

export default ResetPassword
