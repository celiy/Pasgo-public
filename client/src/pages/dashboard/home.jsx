import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Loader } from "@/elements/hookLoader";
import { postRequest } from "@/hooks/axiosHook";
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

function Home() {
    const { postData, postLoading, postError, postedData } = postRequest('/api/v1/auth');
    const navigate = useNavigate();

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await postData({}, "/check-login");

                if (!response.status === "success") {
                    navigate('/auth');
                }
            } catch (err) {
                console.error('Erro ao verificar login: ', err);
                navigate('/auth');
            }
        };

        checkLogin();
    }, []);

    const location = useLocation();
    if (location.pathname === "/dashboard" || location.pathname === "/dashboard/") {
        return <Navigate to='/dashboard/inicio' />
    }

    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <main>
                    <SidebarTrigger />
                </main>
                <Loader />
                <Toaster richColors position="bottom-center" />
                <Outlet />
            </SidebarProvider>
        </>
    );
}

export default Home
