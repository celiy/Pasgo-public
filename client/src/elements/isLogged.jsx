import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { deleteRequest, postRequest } from "@/hooks/axiosHook";
import { ExternalLink, User } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function IsLogged() {
    const navigate = useNavigate();
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const { postData, loading, error, data } = postRequest('/api/v1/auth');
    const { deleteData, deleted, deleting, deletionError } = deleteRequest('/api/v1/auth/logout');

    async function logout() {
        try {
            await deleteData();
            
            return window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await postData({}, "/check-login");
                
                if (response.status === "success") {
                    setisLoggedIn(true);
                    window.isLoggedIn = true;
                }
            } catch (err) {
                console.error('Erro ao verificar login:', err);
                setisLoggedIn(false);
            }
        };

        checkLogin();
    }, []);

    return (
        <>
            {!isLoggedIn && 
                <Link to={'/auth'}>
                    <Button
                        variant="outline"
                        className="w-full h-full border rounded-lg border-border text-md bg-background"
                    >
                        <ExternalLink />
                        <span className="hidden sm:block">
                            Acessar
                        </span>
                    </Button>
                </Link>
            || 
            <DropdownMenu>
                <DropdownMenuTrigger className="flex justify-center gap-1 p-2 transition-all border rounded-lg hover:bg-sidebar-accent bg-background">
                    {!isLoggedIn && <ExternalLink />}
                    {isLoggedIn && <User />}
                    <div className="hidden sm:block">
                        {isLoggedIn && <>Conta</>}
                        {!isLoggedIn && <>Acessar</>}
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {!isLoggedIn && <>
                        <Link to={'/auth'}>
                            <DropdownMenuItem>Acessar</DropdownMenuItem>
                        </Link>
                    </>}
                    {isLoggedIn && <>
                        <Link to={'/dashboard/inicio'}>
                            <DropdownMenuItem>Entrar</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
                    </>}
                </DropdownMenuContent>
            </DropdownMenu>
            }
        </>
    )
}

export default IsLogged