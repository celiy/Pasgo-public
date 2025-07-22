import { useTheme } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator.jsx";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '/logo.png';
import logo_dark from '/logo_dark.png';

function Footer() {
    const { theme } = useTheme();

    return (
        <footer className="w-full my-auto mt-12 border-t-2 bg-sidebar">
            <div className='grid grid-cols-1 gap-4 py-8 mx-auto sm:grid-cols-2 md:grid-cols-4 w-home-responsive'>
                <div className='w-full place-self-start'>
                    {theme === "dark" && <img src={logo_dark} alt="Logo" className="px-16 py-4 sm:p-4 sm:py-4" />}
                    {theme === "light" && <img src={logo} alt="Logo" className="px-16 py-4 sm:p-4 sm:py-4" />}
                    <Separator className="block md:hidden" />
                </div>
                <div className='grid w-full gap-2 place-self-start'>
                    <Link to="/" className='hover:underline'><p>Início</p></Link>
                    <Link to="/ajuda#faq" className='hover:underline'><p>FAQ</p></Link>
                    <Link to="/ajuda#erros" className='hover:underline'><p>Solução de erros</p></Link>
                    <Link to="/ajuda" className='hover:underline'><p>Suporte</p></Link>
                    <Separator className="block md:hidden" />
                </div>
                <div className='grid w-full gap-2 place-self-start'>
                    <Link to="/sobre" className='hover:underline'><p>Sobre</p></Link>
                    <Link to="/sobre#tecnica" className='hover:underline'><p>Técnica</p></Link>
                    <Link to="/termos-e-condicoes#termos" className='hover:underline'><p>Termos e condições</p></Link>
                    <Link to="/termos-e-condicoes#privacidade" className='hover:underline'><p>Política de privacidade</p></Link>
                    <Link to="/creditos" className='hover:underline'><p>Créditos</p></Link>
                    <Separator className="block md:hidden" />
                </div>
                <div className='grid w-full gap-2 place-self-start'>
                    <p><b>Contatos</b></p>
                    <Link to="https://github.com/celiy" target="_blank" rel="noopener noreferrer" className='hover:underline'>
                        <div className="flex gap-2">
                            <Github />
                            <p>Github</p>
                        </div>
                    </Link>
                    <Link to="https://www.linkedin.com/in/diogo-carvallho-viegas-a527a5259/" target="_blank" rel="noopener noreferrer" className='hover:underline'>
                        <div className="flex gap-2">
                            <Linkedin />
                            <p>LinkedIn</p>
                        </div>
                    </Link>
                    <Link to="https://mail.google.com/mail/?view=cm&fs=1&to=sasbrazilian@gmail.com" target="_blank" rel="noopener noreferrer" className='hover:underline'>
                        <div className="flex gap-2">
                            <Mail />
                            <p>sasbrazilian@gmail.com</p>
                        </div>
                    </Link>
                    <Link to="https://api.whatsapp.com/send?phone=5551999329196" target="_blank" rel="noopener noreferrer" className='hover:underline'>
                        <div className="flex gap-2">
                            <Phone />
                            <p>WhatsApp</p>
                        </div>
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer