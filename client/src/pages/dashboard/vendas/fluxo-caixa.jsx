import { HorizontalAreaChart } from '@/components/area-chart'
import { CurveChart } from '@/components/curve-chart'
import PaginationComponent from '@/components/pagination-component'
import { ComponentPieChart } from '@/components/pie-chart'
import CaixaTable from '@/components/tables/caixa-table'
import { Button } from '@/components/ui/button'
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from '@/components/ui/separator'
import Helper from '@/elements/helper'
import Loading from '@/elements/loader'
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { fetchRequest } from '@/hooks/axiosHook'
import ViewHeader from '@/layouts/viewHeader'
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon, RefreshCw, ShoppingCart } from "lucide-react"
import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const translateDate = {
    "january": "Janeiro",
    "february": "Fevereiro",
    "march": "Março",
    "april": "Abril",
    "may": "Maio",
    "june": "Junho",
    "july": "Julho",
    "august": "Agosto",
    "september": "Setembro",
    "october": "Outubro",
    "november": "Novembro",
    "december": "Dezembro",
}

export default function FluxoCaixa() {
    const { getData, fetchedData, fetchLoading, error } = fetchRequest('/api/v1/');
    const [ PchartConfig, setPchartConfig ] = React.useState([]);
    const [ pagesCount, setPagesCount ]     = React.useState(1);
    const [ dateFilter, setDateFilter ]     = React.useState("lte");
    const [ PchartData, setPchartData ]     = React.useState([]);
    const [ AchartData, setAchartData ]     = React.useState([]);
    const [ curveData, setCurveData ]       = React.useState([]);
    const [ filtro, setFiltro ]             = React.useState("descricao");
    const [ vendas, setVendas ]             = React.useState([{}]);
    const [ total, setTotal ]               = React.useState(0);
    const [date, setDate]                   = useState(new Date());

    const location        = useLocation();
    const currentFragment = location.hash;

    let latestPage;
    let page;

    moment.locale('pt-BR');
   
    const getVendas = async () => {
        if (!page) {
            page = currentFragment.split("page=")[1];
        }

        if (page) {
            const response = await getData("vendas/caixaAPI");

            if (response.data) {
                if (response.data.cached) {
                    const data = response.data.stats;
                    setCurveData(data.stats.volumeDeVendas);
                    setPchartData(data.stats.formasPopulares);
                    setPchartConfig(data.stats.formasPopularesNome);
                    setAchartData(data.stats.vendasTotal);
                }
            }

            const newDate = new Date(date);
            newDate.setDate(newDate.getDate() + 1);
            const dateOneDayAhead = newDate.toISOString();

            await getData(`vendas/caixaAPI-vendas?page=${page}&feitoEm[${dateFilter}]=${dateOneDayAhead}`);
        }
    };

    const refresh = () => {
        getVendas();
    };

    useEffect(() => {
        page = currentFragment.split("page=")[1];
    }, [currentFragment]);

    useEffect(() => {
        getVendas();
    }, [currentFragment, filtro, dateFilter, date]);

    useEffect(() => {
        if (fetchedData && latestPage === page) {
            if (fetchedData.data.vendasCaixas) {
                const vendas = fetchedData.data.vendasCaixas;
                let total = 0;
                for (let x = 0; x < vendas.length; x++) {
                    const venda = vendas[x].produtos;
                    if (venda) {
                        for (let n = 0; n < venda.length; n++) {
                            total += venda[n].quantidade * venda[n].valor;
                        }
                    }
                    vendas[x].total = total;
                    total = 0;
                }

                setVendas(vendas);
                setPagesCount(Math.ceil(fetchedData.count / 10));
                setTotal(fetchedData.count);
                
                latestPage = page;
            }
        }
    }, [fetchedData]);

    return (
        <AnimatedLayout>
            <div className='m-6 mt-10 ml-0 sm:ml-6'>
                <ViewHeader 
                    title="Fluxo de caixa"
                    total={total}
                    icon={<ShoppingCart />}
                />

                <div className='my-2' />
                
                <Helper type='text' desc='Os dados do fluxo de caixa são atualizados a cada dia que se passa.'/>

                <Separator className='mt-2 mb-4'/>

                <div className='grid gap-4 mb-8'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <CurveChart chartData={curveData} />

                        <ComponentPieChart 
                            PchartData={PchartData} 
                            PchartConfig={PchartConfig} 
                            title="Formas de pagamento populares"
                        />
                    </div>

                    <HorizontalAreaChart data={AchartData} className='col-span-2' />
                </div>

                <div className='flex justify-end mt-8 mb-2'>
                    <Button 
                        variant='outline' 
                        disabled={fetchLoading}
                        onClick={refresh}
                        className="rounded-r-none"
                    >
                        <RefreshCw className={fetchLoading ? 'animate-spin' : ''} />
                    </Button>

                    <Popover className="w-fit" >
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "justify-start text-left font-normal w-fit rounded-l-none",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                {date ? format(date, "PPP") : <span>Selecione uma data</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />

                            <div className='grid w-full mb-2 place-items-center'>
                                <Button 
                                    variant='outline'
                                    onClick={() => setDateFilter(dateFilter === "lte" ? "gte" : "lte")}
                                >
                                    {dateFilter === "lte" && <>Antes</>}
                                    {dateFilter === "gte" && <>Depois</>}
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                
                <div className="relative">
                    {fetchLoading && <Loading />}

                    <CaixaTable 
                        itens={vendas}
                        elemento="Venda do caixa"
                    />
                </div>

                <PaginationComponent pages={pagesCount} />
            </div>
        </AnimatedLayout>
    )
}