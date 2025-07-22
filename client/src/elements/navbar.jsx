import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { Github, Linkedin, Mail, Menu, Phone } from "lucide-react";
import React from 'react';
import { Link } from "react-router-dom";
import IsLogged from "./isLogged";
import logo from '/logo.png';
import logo_dark from '/logo_dark.png';

const navigationItens = [
    {
        header: "Pasgo",
        items: [
            { label: "Início", desc: "Página inicial da aplicação.", link: "/" },
            { label: "Começar", desc: "Começar a usar a aplicação.", link: "/auth" },
        ]
    },
    {
        header: "Ajuda",
        items: [
            { label: "FAQ", desc: "Perguntas frequentes e dúvidas comuns.", link: "/ajuda#faq" },
            { label: "Solução de erros", desc: "Solução de erros comuns.", link: "/ajuda#erros" },
            { label: "Suporte", desc: "Suporte para uso geral da aplicação.", link: "/ajuda" },
        ]
    },
    {
        header: "Sobre",
        items: [
            { label: "Pasgo", desc: "Mais sobre a aplicação.", link: "/sobre" },
            { label: "Técnica", desc: "Mais sobre a parte técnica da aplicação.", link: "/sobre#tecnica" },
            { label: "Termos e condições", desc: "Termos e condiões da aplicação.", link: "/termos-e-condicoes" },
            { label: "Créditos", desc: "Apoiadores do projeto e ajudantes", link: "/creditos" },
        ]
    },
    {
        header: "Contato",
        items: [
            { label: "WhattsApp", icon: <Phone />, desc: "", link: "https://api.whatsapp.com/send?phone=5551999329196", type: "external" },
            { label: "Email", icon: <Mail />, desc: "", link: "https://mail.google.com/mail/?view=cm&fs=1&to=sasbrazilian@gmail.com", type: "external" },
            { label: "LinkedIn", icon: <Linkedin />, desc: "", link: "https://www.linkedin.com/in/diogo-carvallho-viegas-a527a5259/", type: "external" },
            { label: "Github", icon: <Github />, desc: "", link: "https://github.com/celiy", type: "external" },
        ]
    },
]
const Navbar = () => {
    const { theme } = useTheme();

    React.useEffect(() => {
        const intersectionCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, 100);
                } else {
                    entry.target.classList.remove('animate');
                }
            });
        };

        const observer = new IntersectionObserver(intersectionCallback, {
            threshold: 0.1
        });

        const topDownItems = document.querySelectorAll('#item-top-down');
        topDownItems.forEach((item) => {
            observer.observe(item);
        }
        );

        return () => {
            topDownItems.forEach((item) => {
                observer.unobserve(item);
            });
        };
    }, []);

    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <nav
            className="fixed top-0 z-[30] w-full py-2 border-b shadow-md border-b-background-tertiary bg-background/50 backdrop-blur-md"
            id="intro-top-down"
        >
            <div className="mx-auto w-[90%] sm:w-[85%] md:w-[80%] grid grid-cols-[3fr_1fr_0.6fr] items-center gap-2" >
                <Link to="/" className="w-fit">
                    {theme === "dark" && <img src={logo_dark} alt="Logo" className="h-8 sm:py-1 sm:h-12 md:h-14" />}
                    {theme === "light" && <img src={logo} alt="Logo" className="h-8 sm:py-1 sm:h-12 md:h-14" />}
                </Link>

                {isMobile ?
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="border-border">
                                <Menu />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-[16rem] backdrop-blur-md bg-card/70" align="start">
                            <DropdownMenuLabel>Menu</DropdownMenuLabel>

                            {navigationItens.map((item, index) => (<>
                                <DropdownMenuGroup>
                                    {item.items.map((subItem, subIndex) => (
                                        <>
                                            {subItem.type === "external" ?
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <a href={subItem.link} target="_blank" rel="noopener noreferrer">
                                                        <div className="flex gap-2">
                                                            {subItem.icon}
                                                            <p>{subItem.label}</p>
                                                        </div>
                                                    </a>
                                                </DropdownMenuItem>
                                                :
                                                <Link to={subItem.link}>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <div className="flex gap-2">
                                                            {subItem.icon}
                                                            <p>{subItem.label}</p>
                                                        </div>
                                                    </DropdownMenuItem>
                                                </Link>
                                            }
                                        </>
                                    ))}
                                </DropdownMenuGroup>

                                {index + 1 < navigationItens?.length && <DropdownMenuSeparator />}
                            </>))}

                        </DropdownMenuContent>
                    </DropdownMenu>

                    :

                    <NavigationMenu className="border rounded-lg bg-background">
                        <NavigationMenuList>
                            {navigationItens.map((item, index) => (
                                <NavigationMenuItem key={index}>
                                    <NavigationMenuTrigger className="p-0 sm:p-2 md:p-4">
                                        {item.header}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent 
                                        className="grid p-4 w-[200px] sm:w-[250px] md:w-[300px] lg:w-[400px] lg:grid-cols-[1fr]"
                                    >
                                        {item.items.map((subItem, subIndex) => (
                                            <>
                                                {subItem.type === "external" ?
                                                    <a href={subItem.link} target="_blank" rel="noopener noreferrer" className="p-4 transition-all rounded hover:bg-accent">
                                                        <NavigationMenuLink key={subIndex}>
                                                            <div>
                                                                <div className="flex gap-2">
                                                                    {subItem.icon}
                                                                    <p>{subItem.label}</p>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {subItem.desc}
                                                                </p>
                                                            </div>
                                                        </NavigationMenuLink>
                                                    </a>
                                                    :
                                                    <Link to={subItem.link} className="p-4 transition-all rounded hover:bg-accent">
                                                        <NavigationMenuLink key={subIndex}>
                                                            <div>
                                                                <div className="flex gap-2">
                                                                    {subItem.icon}
                                                                    <p>{subItem.label}</p>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {subItem.desc}
                                                                </p>
                                                            </div>
                                                        </NavigationMenuLink>
                                                    </Link>}
                                            </>
                                        ))}
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                }

                <IsLogged />
            </div>
        </nav>
    )
}

export default Navbar
