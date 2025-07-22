import AlertDialogComponent from '@/components/alert-dialog-component.jsx';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from '@/elements/hookLoader.jsx';
import AnimatedLayout from '@/hooks/AnimatedLayout';
import { postRequest } from '@/hooks/axiosHook.jsx';
import { validateCNPJ, validateCPF } from '@/utils/validators.js';
import { ChevronLeft } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link, useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [passwordEmail, setPasswordEmail] = useState("");
    const [registerDocument, setRegisterDocument] = useState("");
    const [alertError, setAlertError] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [registerStep, setRegisterStep] = useState(0);
    const [emailCode, setEmailCode] = useState("");
    const [passMatch, setPassMatch] = useState(false);
    const [checked, setChecked] = useState(false);
    const [checkedTerms, setCheckedTerms] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isCheckOpen, setIsCheckOpen] = useState(false);
    
    const recaptcha = useRef();
    const { postData, postLoading, error, data } = postRequest('/api/v1/');
    const navigate = useNavigate();

    async function login(reEmail, rePassword, authType) {
        try {
            let response;
            
            if (reEmail && rePassword && authType === "register") {
                response = await postData({ email: reEmail, password: rePassword }, "auth/login");
            } else if (email && password && authType === "login") {
                response = await postData({ email: email, password: password, confirmTerms: checkedTerms ?? false }, "auth/login");
            } else {
                return setAlert({ message: "Por favor, insira um email e uma senha.", title: "Erro!", type: "alert" });
            }

            if (response.status === "success") {
                navigate('/dashboard/inicio');
            }
        } catch (err) {
            if (err?.data?.message === "ACCOUNT_DELETED") {
                return setIsOpen(true);
            }

            if (err?.data?.message === "ACCOUNT_INACTIVE") {
                return setIsCheckOpen(true);
            }

            setAlertError({ message: err?.data?.message ?? "Algum erro inesperado aconteceu. Se você tentou realizar o login várias vezes e falhou, por motivos de segurança nós limitamos quantas vezes você pode fazer isso. Então, por favor, tente novamente.", title: "Erro!" });
        }
    }

    async function revertAccountDeletion() {
        try {
            const response = await postData({ email: email, password: password }, "user/revert-account-deletion");

            if (response.status === "success") {
                login("email", "password", "login");
            }
        } catch (err) {
            setAlertError({ message: err?.data?.message ?? "Algum erro inesperado aconteceu. Por favor, tente novamente.", title: "Erro!" });
            console.log(err);
        }
    }

    const onClose = async () => {
        await revertAccountDeletion();
        setIsOpen(false);
    };

    async function register() {
        if (registerDocument.length === 0 || registerEmail.length === 0 || registerPassword.length === 0 || confirmPassword.length === 0 || name.length === 0) {
            return setAlert({ message: "Por favor, insira todos os campos.", title: "Erro!", type: "alert" });
        }

        const userDocument = registerDocument.replace(/\D/g, '');

        if (registerStep === 0) {
            if (userDocument.length !== 11 && userDocument.length !== 14) {
                return setAlert({ message: "Por favor, insira um CPF/CNPJ válido. (CPF: 11 caracteres, CNPJ: 14 caracteres)", title: "Erro!", type: "alert" });
            }
            
            if (userDocument.length === 11 && !validateCPF(userDocument)) {
                return setAlert({ message: "Por favor, insira um CPF válido.", title: "Erro!", type: "alert" });
            }

            if (userDocument.length === 14 && !validateCNPJ(userDocument)) {
                return setAlert({ message: "Por favor, insira um CNPJ válido.", title: "Erro!", type: "alert" });
            }

            const captchaValue = recaptcha.current.getValue();

            if (!captchaValue) {
                return setAlertError({ message: "Por favor, verifique o reCAPTCHA.", title: "Erro!" });
                
            } else {
                try {
                    await postData({ captchaToken: captchaValue }, "auth/verify-captcha");
                } catch (error) {
                    return setAlertError({ message: "Erro na validação do reCAPTCHA. Por favor tente novamente.", title: "Erro!", type: "reload" });
                }
            }
        }
        
        try {
            let type = "codeSent";

            if (registerStep === 1) type = "register";

            const response = await postData({ 
                email: registerEmail, 
                password: registerPassword, 
                name: name, 
                confirmPassword: confirmPassword, 
                emailCode: emailCode, 
                document: userDocument,
                type: type
            }, "auth/signup");

            if (response.status === "success") {
                if (registerStep === 0 || response.type === "codeSent") {
                    setAlert({
                        title: "Alerta!",
                        message: "Um código de verificação foi enviado para o seu email. Por favor, verifique sua caixa de entrada e o insira o código após fechar este alerta.",
                        type: "alert"
                    });

                    setRegisterStep(1);
                } else if (registerStep === 1 && response.type !== "codeSent") {
                    login(registerEmail, registerPassword, "register");
                } else {
                    setAlertError({ message: response.message, title: "Erro ao enviar código de verificação! Por favor, tente novamente." });
                }
            } else {
                setRegisterStep(0);
            }
        } catch (err) {
            if (err?.data?.message === 'INVALID_CODE') {
                setAlert({
                    title: "Erro!",
                    message: "O código de verificação está incorreto.",
                    type: "alert"
                });
            } else if (err?.data?.message === 'EXPIRED') {
                setRegisterStep(0);
                setAlertError({ message: "O código de verificação expirou.", title: "Erro!" });
            } else {
                setRegisterStep(0);
                setAlertError({ message: err?.data?.message ?? "Algum erro inesperado aconteceu.", title: "Erro!" });
            }
        }
    }

    async function resetPasswordRequest() {
        try {
            const response = await postData({ email: passwordEmail }, "auth/forgot-password");

            if (response.status === "success") {
                setAlert({
                    title: "Sucesso",
                    message: "O link de verificação para mudança de senha foi enviado para o seu email. Por favor verifique sua caixa de entrada. Caso não veja nenhum código, verifique a pasta de spam.",
                    type: "success"
                });
            }
        } catch (err) {
            setAlertError({ message: err?.data?.message ?? "Algum erro inesperado aconteceu.", title: "Erro!" });
        }
    }

    function handleEmail(event) {
        setEmail(event.target.value)
    }
    function handlePassword(event) {
        setPassword(event.target.value)
    }

    function handleRegisterEmail(event) {
        setRegisterEmail(event.target.value)
    }

    function handleRegisterPassword(event) {
        setRegisterPassword(event.target.value)
    }
    function handleConfirmPassword(event) {
        setConfirmPassword(event.target.value)
    }
    function handleRegisterName(event) {
        setName(event.target.value)
    }
    function handleRegisterDocument(event) {
        setRegisterDocument(event.target.value)
    }
    function handlePasswordEmail(event) {
        setPasswordEmail(event.target.value)
    }

    function handleEmailCode(event) {
        setEmailCode(event.target.value)
    }

    useEffect(() => {
        if (registerPassword !== confirmPassword) setPassMatch(false);
        else setPassMatch(true);
    }, [registerPassword, confirmPassword]);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await postData({}, "auth/check-login");

                if (response.status === "success") {
                    navigate('/dashboard/inicio')
                }
            } catch (err) {
                console.error('Erro ao verificar login:', err);
            }
        };
        
        checkLogin();
    }, []);

    return (
        <AnimatedLayout>
            <Loader />

            <AlertDialog open={isOpen}>
                <AlertDialogContent className="border-2">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Alerta!</AlertDialogTitle>
                        <AlertDialogDescription>
                            A conta que você está tentando acessar foi marcada como deletada. Porém, a deleção pode ser revertida por estar dentro do prazo de 30 dias desde a confirmação de requisição para deletar os dados da conta.
                            <br />
                            <br />
                            <b>Se você deseja reverter a deleção dessa conta clique no botão "Reverter deleção" abaixo, então a deleção será cancelada e você irá fazer login normalmente. Caso não queira fazer isso, apenas clique em "Cancelar".</b>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-chart-2 hover:bg-chart-2/80"
                            onClick={onClose}
                        >
                            Reverter deleção
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isCheckOpen}>
                <AlertDialogContent className="border-primary">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Antes de prosseguir...</AlertDialogTitle>
                        <AlertDialogDescription>
                            <div className='flex items-start gap-2'>
                                <Checkbox 
                                    checked={checkedTerms}
                                    className='mt-1 rounded border-foreground'
                                    onCheckedChange={(checked) => setCheckedTerms(checked)}
                                />
                                <p className='text-sm'>
                                    <span>Ao efetuar o login novamente, você concorda com os </span>
                                    <Link to="/termos-e-condicoes#termos">
                                    <span className='underline'>Termos de Uso</span>
                                    </Link> <span> e </span>
                                    <Link to="/termos-e-condicoes#privacidade">
                                    <span className='underline'>Política de Privacidade</span>
                                    </Link>
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel 
                            onClick={() => setIsCheckOpen(false)}
                        >
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => login("email", "password", "login")}
                        >
                            Continuar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {(alert) &&
                <AlertDialogComponent
                    tipo='warning'
                    title={alert.title}
                    desc={alert.message}
                    onClose={() => setAlert(false)} 
                />
            }

            {(alertError) &&
                <AlertDialogComponent
                    tipo='warning'
                    title='Erro!'
                    desc={alertError.message}
                    onClose={() => {
                        setAlertError(false);
                        if (alertError.type === "reload") {
                            window.location.reload();
                        }
                    }} 
                />
            }

            {(alertSuccess) &&
                <AlertDialogComponent
                    tipo='success'
                    desc={alertSuccess.message}
                    onClose={() => {
                        setAlertSuccess(false);
                    }} 
                />
            }

            <div className='flex items-center justify-center w-full h-[100vh]'>
                <Button className="absolute top-4 left-4" variant='outline' onClick={() => navigate("/", { replace: true })}><ChevronLeft /></Button>
                <Tabs defaultValue="login" className="w-[100%] sm:w-[80%] md:w-[50%] lg:w-[40%] my-auto">
                    <TabsList>
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Se registrar</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <Card >
                            <CardHeader>
                                <CardTitle>Entrar</CardTitle>
                                <CardDescription>Faça login para continuar.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='flex flex-col gap-1'>
                                    <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input type="email" id="email" placeholder="Email" onChange={handleEmail} />
                                    </div>
                                    <div>
                                    <Label htmlFor="password">Senha</Label>
                                    <Input type="password" id="password" placeholder="Senha" onChange={handlePassword} />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="grid grid-cols-2 gap-2 mt-2">
                                <Button className="w-full" onClick={() => login("email", "password", "login")} disabled={postLoading}>Entrar</Button>
                                <Drawer>
                                    <DrawerTrigger>
                                        <Button variant="ghost" className="w-full underline">Esqueceu sua senha?</Button></DrawerTrigger>
                                    <DrawerContent className="flex items-center justify-center">
                                        <div className="w-[100%] sm:w-[80%] md:w-[50%] lg:w-[40%]">
                                            <DrawerHeader>
                                                <DrawerTitle>Insira seu email</DrawerTitle>
                                                <DrawerDescription>
                                                    <p style={{ lineHeight: '1.3' }} className="mb-2">Insira seu email para receber um link para redefinir sua senha.</p>
                                                    <Label htmlFor="pemail">Email:</Label>
                                                    <Input type="email" id="pemail" placeholder="Email" onChange={handlePasswordEmail} />
                                                </DrawerDescription>
                                            </DrawerHeader>
                                            <DrawerFooter>
                                                <Button onClick={resetPasswordRequest} disabled={postLoading}>Enviar</Button>
                                                <DrawerClose>
                                                    <Button variant="outline" className="w-full">Cancelar</Button>
                                                </DrawerClose>
                                            </DrawerFooter>
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="register">
                        {registerStep === 0 &&
                            <Card>
                                <CardHeader>
                                    <CardTitle>Se registrar</CardTitle>
                                    <CardDescription>Insira suas informações para se registrar.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className='flex flex-col gap-1'>
                                        <div>
                                        <Label htmlFor="nome">Nome completo</Label>
                                        <Input type="name" id="name" placeholder="Nome e sobrenome" onChange={handleRegisterName} />
                                        </div>
                                        <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input type="email" id="email" placeholder="Email" onChange={handleRegisterEmail} />
                                        </div>
                                        <div>
                                        <Label htmlFor="document">CPF/CNPJ</Label>
                                        <Input type="text" id="document" placeholder="CPF/CNPJ" onChange={handleRegisterDocument} />
                                        </div>
                                        <div>
                                        <Label htmlFor="register-password">Senha</Label>
                                        <Input type="password" id="password" placeholder="Senha" onChange={handleRegisterPassword} />
                                        </div>
                                        <div>
                                        <Label htmlFor="password">Confirmar senha</Label>
                                        <Input type="password" id="password" placeholder="Confirmar senha" onChange={handleConfirmPassword} />
                                        </div>
                                    </div>
                                    {!passMatch && <p className="mt-2 text-red-600">As senhas devem ser iguais.</p>}
                                    
                                    <ReCAPTCHA ref={recaptcha} sitekey={import.meta.env.VITE_REACT_APP_SITE_KEY} className="my-4"/>

                                    <div className='flex items-start gap-2'>
                                        <Checkbox 
                                            checked={checked}
                                            className='mt-1 rounded border-foreground'
                                            onCheckedChange={(checked) => setChecked(checked)}
                                        />
                                        <p className='text-sm'>
                                            <span>Ao se registar, você concorda com os </span>
                                            <Link to="/termos-e-condicoes#termos">
                                            <span className='underline'>Termos de Uso</span>
                                            </Link> <span> e </span>
                                            <Link to="/termos-e-condicoes#privacidade">
                                            <span className='underline'>Política de Privacidade</span>
                                            </Link>
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter className="grid grid-cols-2 gap-2">
                                    <Button className="w-full" onClick={register} disabled={postLoading || !passMatch || !checked}>Registrar</Button>
                                </CardFooter>
                            </Card>}
                        {registerStep === 1 &&
                            <Card>
                                <CardHeader>
                                    <CardTitle>Confirmar email</CardTitle>
                                    <CardDescription>
                                        Insira o código enviado para seu endereço de email. Caso o não tenha recebido o código na caixa de entrada, verifique a pasta de spam ou tente novamente. O email pode demorar alguns minutos para chegar. <br /><br />
                                        <b>Se você recebeu vários emails para confirmação do seu email, pegue o código do email que foi enviado mais recentemente.</b>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Label htmlFor="code">Código</Label>
                                    <Input type="text" id="code" placeholder="Código" onChange={handleEmailCode} />
                                    <p className='mt-2'>Caso o código não funcione ou esteja tendo outro erro, recarregue a página e tente novamente.</p>
                                </CardContent>
                                <CardFooter className="grid grid-cols-2 gap-2 mt-2">
                                    <Button className="w-full" onClick={register} disabled={postLoading}>Confirmar</Button>
                                </CardFooter>
                            </Card>}
                    </TabsContent>
                </Tabs>
            </div>
        </AnimatedLayout>)
}

export default AuthPage
