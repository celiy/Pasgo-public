import { useTheme } from "@/components/theme-provider";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";
import { SpecialButton } from "@/components/ui/special-button";
import { InfiniteScroll, ScrollItem } from "@/elements/infinite-scroll";
import AnimatedLayout from '@/hooks/AnimatedLayout';
import { TooltipProvider } from "@radix-ui/react-tooltip";
import {
    ArrowUpDown,
    Banknote,
    Blocks,
    Box,
    Car,
    CircleDollarSign,
    ClipboardList,
    Cog,
    Coins,
    FileCog,
    LayoutDashboard,
    ShoppingCart,
    SquareStack,
    User,
    Users
} from "lucide-react";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import contas from '/contas.png';
import estoque from '/estoque.png';
import lines_dark from '/lines_dark.png';
import lines_light from '/lines_light.png';
import pasgoInicial from '/pasgo_inicial.png';
import vendas from '/vendas.png';

function Pasgo() {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [width, setWidth] = useState(window.innerWidth);
    const isMobile = width < 768;

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    function TextDiv({ title, desc, icon: Icon, color }) {
        return (
            <Card
                className={`${color} backdrop-blur-[3px] hover:backdrop-blur-[6px] hover:bg-card-foreground/20 hover:border-foreground/70 transition-all scale-100 hover:scale-105`}
                style={{ userSelect: 'none' }}
            >
                <CardTitle
                    className="px-6 pt-6 pb-2"
                >
                    <span className="flex gap-2">
                        <Icon />
                        {title}
                    </span>
                </CardTitle>
                <CardContent>
                    {desc}
                </CardContent>
            </Card>
        )
    }

    useEffect(() => {
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

        const leftRightItems = document.querySelectorAll('#item-left-right');
        leftRightItems.forEach((item) => {
            observer.observe(item);
        });

        const rightLeftItems = document.querySelectorAll('#item-right-left');
        rightLeftItems.forEach((item) => {
            observer.observe(item);
        });

        const topDownItems = document.querySelectorAll('#item-top-down');
        topDownItems.forEach((item) => {
            observer.observe(item);
        });

        return () => {
            leftRightItems.forEach((item) => {
                observer.unobserve(item);
            });

            rightLeftItems.forEach((item) => {
                observer.unobserve(item);
            });

            topDownItems.forEach((item) => {
                observer.unobserve(item);
            });
        };
    }, []);

    return (
        <AnimatedLayout>
            {theme === "dark" && <img src={lines_dark} alt="lines" className="elemento-independente opacity-[0.07]" />}
            {theme === "light" && <img src={lines_light} alt="lines" className="elemento-independente opacity-[0.17]" />}

            <div className="overflow-x-hidden">
                <section className="grid items-center mx-auto mt-16 bg-no-repeat bg-cover sm:mt-24 md:mt-32 w-home-responsive gap-14">
                    <header className='grid grid-cols-1 pt-8 mx-auto md:grid-cols-2'>
                        <div className='place-self-center' id='item-left-right'>
                            <h1 style={{letterSpacing: '0.04rem'}}>
                                Pasgo
                            </h1>
                            <h3 className='mb-2 text-primary'>
                                Aplicativo de gestão empresarial
                            </h3>
                            <p className='mb-4 leading-5 text-justify'>
                                Pasgo é um <b> aplicativo web focado em gestão empresarial para micro e pequena empresas.</b> Gerencie o seu negócio de forma simples e eficiente. Tendo controle de estoque, vendas, financeiro, ordens de serviço, caixa, relatórios e muito mais!
                            </p>

                            <SpecialButton />
                        </div>
                        <div className="hidden w-full pl-10 place-self-center md:block" id='item-right-left'>
                            <AspectRatio ratio={16 / 9}>
                                <img
                                    src={pasgoInicial}
                                    alt="Pasgo inicial"
                                    className="object-cover rounded-md"
                                />
                            </AspectRatio>
                        </div>
                    </header>
                </section>
            </div>

            <TooltipProvider delayDuration={0}>
                <div className="flex justify-center w-full mt-2 mb-6 md:mt-10">
                    <div className="w-home-responsive hide-edges">
                        <InfiniteScroll
                            className="pt-12"
                        >
                            <ScrollItem
                                icon={<ShoppingCart/>}
                                description="Vendas"
                            />
                            <ScrollItem
                                icon={<Banknote/>}
                                description="Contas"
                            />
                            <ScrollItem
                                icon={<Box/>}
                                description="Estoque"
                            />
                            <ScrollItem
                                icon={<SquareStack/>}
                                description="Cadastros"
                            />
                            <ScrollItem
                                icon={<User/>}
                                description="Clientes"
                            />
                            <ScrollItem
                                icon={<Car/>}
                                description="Fornecedores"
                            />
                            <ScrollItem
                                icon={<Users/>}
                                description="Funcionários"
                            />
                            <ScrollItem
                                icon={<Coins/>}
                                description="Orçamentos"
                            />
                            <ScrollItem
                                icon={<ClipboardList/>}
                                description="Relatórios"
                            />
                            <ScrollItem
                                icon={<CircleDollarSign/>}
                                description="Vendas"
                            />
                            <ScrollItem
                                icon={<ArrowUpDown/>}
                                description="Fluxo de caixa"
                            />
                            <ScrollItem
                                icon={<FileCog/>}
                                description="Ordens de serviço"
                            />
                            <ScrollItem
                                icon={<Cog/>}
                                description="Serviços"
                            />
                            <ScrollItem
                                icon={<LayoutDashboard/>}
                                description="Dashboard"
                            />
                        </InfiniteScroll>
                    </div>
                </div>
            </TooltipProvider>

            <section className="z-10 grid items-center w-full overflow-x-hidden border-b-0 border-y-2 gap-14 bg-gradient-to-b from-card to-background">
                <article className='grid mx-auto my-12 w-article-responsive'>
                    <div className="flex justify-center w-full mt-2" id='item-left-right'>
                        <h1 className="text-center" style={{letterSpacing: '0.04rem'}}>
                            Gerenciamento sem compromisso.
                        </h1>
                    </div>
                    <div className="grid grid-cols-1 mt-12 md:grid-cols-2" id='item-left-right'>
                        <div className="place-self-start">
                            <span className="flex items-center gap-4 mt-4 mb-2">
                                <h2 className="p-0">
                                    Controle de vendas e caixa
                                </h2>
                                <ShoppingCart />
                            </span>

                            <p className="font-medium leading-6 text-justify">
                                Tenha controle de todas vendas em um único lugar, podendo criar vendas com múltiplos produtos e serviços.
                            </p>

                            <Separator className="my-1 opacity-0" />

                            <p className="mb-4 leading-6 text-justify text-foreground/85">
                                Gerencie suas vendas com facilidade, tendo visualização detalhada de vendas, caixa e fluxo de caixa. Resumo de vendas que foram vencidas, que vencem hoje, que vão vencer e as que foram pagas no mês. Atribua vendas a clientes, tendo controle sobre dívidas, pagamentos e uso de filtros avançados.
                            </p>

                            <Button
                                className="transition-all scale-100 border-2 bg-card hover:scale-110 border-chart-1 hover:bg-chart-1/80 text-foreground"
                                onClick={() => window?.isLoggedIn ? navigate('/dashboard/produtos-servicos#page=1') : navigate('/auth')}
                            >
                                Começe a vender
                            </Button>
                        </div>

                        {!isMobile &&
                            <AspectRatio ratio={16 / 9} className="hidden place-self-center md:block">
                                <img
                                    src={vendas}
                                    alt="Tela de vendas"
                                    className="transition-transform duration-200 hover:scale-125"
                                />
                            </AspectRatio>
                        }
                    </div>

                    <Separator className="my-6 opacity-70 md:my-12" />

                    <div className="grid grid-cols-1 md:grid-cols-2" id='item-right-left'>
                        {!isMobile &&
                            <AspectRatio
                                ratio={16 / 9}
                                className="hidden pr-10 place-self-center md:block"
                            >
                                <img
                                    src={contas}
                                    alt="Tela de contas"
                                    className="transition-transform duration-200 hover:scale-125"
                                />
                            </AspectRatio>
                        }

                        <div className="place-self-start">
                            <span className="flex items-center gap-4 mt-4 mb-2">
                                <h2 className="p-0">
                                    Gerenciamento de contas
                                </h2>
                                <Banknote />
                            </span>

                            <p className="font-medium leading-6 text-justify">
                                Gerencie suas contas com facilidade, crie contas a partir de clientes, fornecedores e funcionários. Tendo toda informação necessária em um único lugar.
                            </p>

                            <Separator className="my-1 opacity-0" />

                            <p className="mb-4 leading-6 text-foreground/85">
                                Visualize suas contas de forma detalhada, com uso de filtros avançados. Aplique juros e decontos, também tendo controle sobre dívidas e pagamentos. Tenha visualização de contas que foram vencidas, que vão vencer hoje, que vão vencer e as que foram pagas no mês.
                            </p>

                            <Button
                                className="transition-all scale-100 border-2 border-chart-2 hover:bg-chart-2/80 text-foreground hover:scale-110 bg-card"
                                onClick={() => window?.isLoggedIn ? navigate('/dashboard/contas#page=1') : navigate('/auth')}
                            >
                                Gerencie suas contas
                            </Button>
                        </div>
                    </div>

                    <Separator className="my-6 opacity-70 md:my-12" />

                    <div className="grid grid-cols-1 md:grid-cols-2" id='item-left-right'>
                        <div className="place-self-start">
                            <span className="flex items-center gap-4 mt-4 mb-2">
                                <h2 className="p-0">
                                    Controle de estoque
                                </h2>
                                <Box />
                            </span>
                            <p className="font-medium leading-6 text-justify">
                                Tenha controle do seu estoque com facilidade, crie produtos e serviços, tendo toda informação necessária em um único lugar.
                            </p>

                            <Separator className="my-1 opacity-0" />

                            <p className="mb-4 leading-6 text-justify text-foreground/85">
                                Gerencie seu estoque, com automação de inserção de produtos no estoque e controle de problemas relacionados a produtos. Tenha visualização de estoque com filtros avançados para pesquisar produtos e visualização de resumos do estoque.
                            </p>

                            <Button
                                className="transition-all scale-100 border-2 border-chart-3 hover:bg-chart-3/80 hover:scale-110 bg-card text-foreground"
                                onClick={() => window?.isLoggedIn ? navigate('/dashboard/produtos#page=1') : navigate('/auth')}
                            >
                                Gerencie seu estoque
                            </Button>
                        </div>

                        {!isMobile &&
                            <AspectRatio
                                ratio={16 / 9}
                                className="hidden pl-10 place-self-center md:block"
                            >
                                <img
                                    src={estoque}
                                    alt="Estoque"
                                    className="transition-transform duration-200 hover:scale-125"
                                />
                            </AspectRatio>
                        }
                    </div>
                </article>
            </section>

            <div className="flex justify-center">
                <Separator className="mb-2 mt-4 w-[92%] sm:w-[90%] md:w-[85%]" />
            </div>

            <section className="z-20 grid items-center w-full mt-12 overflow-x-hidden gap-14">
                <article className='grid mx-auto w-home-responsive z-[20]'>
                    <div id='item-right-left'>
                        <h1 className="mb-1">
                            E muito mais...
                        </h1>
                    </div>

                    <div className="grid justify-start w-full grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3" id='item-right-left'>
                        <TextDiv
                            title="Cadastros"
                            desc="Cadastros de clientes, fornecedores e funcionários sem compromisso."
                            icon={Blocks}
                        />

                        <TextDiv
                            title="Estoque"
                            desc="Controle de estoque de produtos e serviços fácil, rápido e prático."
                            icon={Box}
                            color="bg-primary/10 border-primary/50"
                        />

                        <TextDiv
                            title="Dashboard"
                            desc="Tenha toda informação necessária para gerenciar seu negócio em um único lugar."
                            icon={LayoutDashboard}
                        />

                        <TextDiv
                            title="Vendas"
                            desc="Gerencie suas vendas de forma rápida e fácil, sem complicações."
                            icon={CircleDollarSign}
                            color="bg-chart-2/10 border-chart-2/50"
                        />

                        <TextDiv
                            title="Serviços e orçamentos"
                            desc="Gerenciamento de serviços e ordens de serviço completo, fácil e prático."
                            icon={Coins}
                        />

                        <TextDiv
                            title="Contas"
                            desc="Gerenciamento de contas sem complexidade, tendo resumos para facilitar o gerenciamento."
                            icon={Banknote}
                            color="bg-chart-1/10 border-chart-1/50"
                        />

                        <TextDiv
                            title="Relatórios"
                            desc="Relatórios de vendas, contas e ordens de serviços."
                            icon={ClipboardList}
                        />

                        <TextDiv
                            title="Caixa"
                            desc="Caixa completo estilo caixa de mercado, fácil e simples de usar."
                            icon={ShoppingCart}
                            color="bg-chart-2/10 border-chart-2/50"
                        />

                        <TextDiv
                            title="Fluxo de caixa"
                            desc="Toda informação necessária para gerenciar suas vendas do caixa."
                            icon={ArrowUpDown}
                        />
                    </div>
                </article>

                <div>
                    {theme === "dark" && <img src={lines_dark} alt="lines" className="elemento-independente extra-elemento-independente opacity-[0.07]" />}
                    {theme === "light" && <img src={lines_light} alt="lines" className="elemento-independente extra-elemento-independente opacity-[0.17]" />}   
                </div>

                <article className='z-10 grid w-full mx-auto mb-20 w-home-responsive' id='item-left-right'>
                    <div className="z-10 grid justify-center">
                        <h1 className="z-10 mx-auto mb-4 text-center">
                            Se organize, comece agora!
                        </h1>

                        <div className="flex justify-center">
                            <div>
                                <SpecialButton />
                            </div>
                        </div>
                    </div>
                </article>
            </section>
        </AnimatedLayout>
    )
}

export default Pasgo