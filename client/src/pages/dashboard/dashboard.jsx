import { HorizontalAreaChart } from '@/components/area-chart'
import { ComponentBarChart } from '@/components/bar-chart.jsx'
import HoverCard from '@/components/hover-card-component'
import { ComponentPieChart } from '@/components/pie-chart'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Helper from '@/elements/helper'
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { fetchRequest, postRequest } from '@/hooks/axiosHook'
import { DMA } from '@/hooks/getDatePTBR'
import { RefreshCw } from "lucide-react"
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
    const [contaStats, setContaStats] = React.useState('');
    const [vendaStats, setVendaStats] = React.useState('');
    const [PchartData, setPchartData] = React.useState([]);
    const [PchartConfig, setPchartConfig] = React.useState([]);
    const [BchartData, setBchartData] = React.useState([]);
    const [BchartConfig, setBchartConfig] = React.useState({desktop: {label: "Vendas",color: "hsl(var(--chart-3))",},});
    const { getData, data, fetchLoading, error } = fetchRequest('/api/v1/');
    const { postData, postLoading, postError, response } = postRequest('/api/v1/vendas/caixaAPI/update-stats');
    const [isRefreshed, setIsRefreshed] = React.useState(false);
    const [AchartData, setAchartData] = React.useState([]);

    const refresh = () => {
        setIsRefreshed(isRefreshed ? false : true);
    };

    useEffect(() => {
        if (vendaStats && vendaStats.maisVendidos) {
            let vendasMes = [];
            let vendasMesConfig = {};
            let count = 1;
            for (const [key, value] of Object.entries(vendaStats.maisVendidos)) {
                vendasMes.push({ id: count.toString(), itens: value * 1, fill: `hsl(var(--chart-${count}))` });
                vendasMesConfig[count] = { label: key, color: `hsl(var(--chart-${count}))` };
                count++;
            }
            setPchartData(vendasMes);
            setPchartConfig(vendasMesConfig);
        }
        if (vendaStats && vendaStats.vendasMeses) {
            let meses = []
            for (const [key, value] of Object.entries(vendaStats.vendasMeses).reverse()) {
                meses.push({month: key.charAt(0).toUpperCase() + key.slice(1), vendas: value})
            }
            setBchartData(meses)
        }
    }, [vendaStats]);

    const getDashboardStats = async () => {
        const [contas, vendas, caixas] = await Promise.all([
            getData("financeiro/contas-stats-dashboard"),
            getData("vendas/vendasAPI-stats-dashboard"),
            getData("vendas/caixaAPI")
        ]);
        if (contas?.data?.contaStatsDashboard) {
            setContaStats(contas.data.contaStatsDashboard);
        }
        if (vendas?.data?.vendaStatsDashboardFinal) {
            setVendaStats(vendas.data.vendaStatsDashboardFinal);
        }
        if (caixas?.data) {
            if (caixas?.data?.cached) {
                const data = caixas?.data?.stats;
                setAchartData(data.stats.vendasTotal);
            }
        } else {
            const data = caixas?.data?.stats;

            //Volume de vendas
            let volumeDeVendas = [];
            let vendas = {};
            const dataDoisMesesAtras = moment().subtract(2, 'months');
            const startOfMonth = moment(dataDoisMesesAtras).startOf('month');

            for (let x = 0; x < 3; x++) {
                const month = moment(startOfMonth).add(x, 'months').format('MMMM');
                vendas[translateDate[month.toLowerCase()]] = 0;
            }

            for (let x = 0; x < data.length; x++) {
                const venda = data[x];
                const month = moment(venda.feitoEm).format('MMMM');
                if (vendas[translateDate[month.toLowerCase()]] !== undefined) {
                    vendas[translateDate[month.toLowerCase()]] += 1;
                }
            }
            const objs = Object.entries(vendas);
            for (let n = 0; n < objs.length; n++) {
                volumeDeVendas.push({ month: objs[n][0], vendas: objs[n][1] });
            }
            setCurveData(volumeDeVendas);
            //

            //Formas de pagamento
            let formasPopulares = [];
            let formasPopularesNome = { 1: {}, 2: {}, 3: {} };
            let pagamentos = {};

            for (let x = 0; x < data.length; x++) {
                const venda = data[x];
                if (moment(venda.feitoEm).isSame(new Date(), 'month')) {
                    if (pagamentos[venda.pagamento]) {
                        pagamentos[venda.pagamento] += 1;
                    } else {
                        pagamentos[venda.pagamento] = 1;
                    }
                }
            }

            let count = 1;
            for (const [key, value] of Object.entries(pagamentos)) {
                formasPopulares.push({ id: count + "", itens: value, fill: "hsl(var(--chart-" + count + "))" });
                formasPopularesNome[count] = { label: key, color: "hsl(var(--chart-" + count + "))" };
                count++;
            }
            setPchartData(formasPopulares);
            setPchartConfig(formasPopularesNome);
            //

            //Total
            const vendasTotal = [];
            const vendasData = {};

            for (let x = 0; x < data.length; x++) {
                const venda = data[x];
                const date = new Date(venda.feitoEm);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const dateString = `${year}-${month}-${day}`;

                let total = 0;

                for (let i = 0; i < venda.produtos.length; i++) {
                    total += venda.produtos[i].quantidade * venda.produtos[i].valor
                }

                if (vendasData[dateString]) {
                    vendasData[dateString] += total;
                } else {
                    vendasData[dateString] = total;
                }
            }

            for (const [key, value] of Object.entries(vendasData)) {
                vendasTotal.push({ date: key, desktop: value });
            }
            vendasTotal.sort((a, b) => new Date(b.date) - new Date(a.date));
            setAchartData(vendasTotal);
            //

            try {
                await postData({
                    stats:
                    {
                        volumeDeVendas: volumeDeVendas,
                        formasPopulares: formasPopulares,
                        formasPopularesNome: formasPopularesNome,
                        vendasTotal: vendasTotal
                    }
                });
            } catch (err) {
                toast.error("Ocorreu um erro ao salvar as informações.")
            }
        }
    };
    
    useEffect(() => {
        getDashboardStats();
    }, [isRefreshed]);

    return (
        <AnimatedLayout>
            <div className='mt-10 ml-0 mr-6 md:ml-6'>
                <div className='flex justify-between'>
                    <div className='flex items-center'>
                        <h3>Dashboard</h3>
                        <Button 
                            variant='outline' 
                            disabled={fetchLoading} 
                            onClick={refresh} 
                            className='mx-2'
                        >
                            <RefreshCw className={fetchLoading ? 'animate-spin' : ''}/>
                        </Button>
                    </div>
                    <div className='flex items-center justify-end gap-2'>
                        <DMA />
                    </div>
                </div>

                <Separator className='mt-2 mb-4'/>

                <div className='grid gap-4'>
                    <Helper type='text' desc='Os dados do dashboard são atualizados a cada dia que se passa.'/>
                    
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
                        <div 
                            className={`grid p-6 border-2 rounded-lg bg-card shadow-sm 
                                ${contaStats.pagoProprioHoje > 0 ? 'border-chart-2' : 'border-chart-2/50'}`}
                        >
                            <h4>Pago hoje (Própria)</h4>
                            <h2>R$ {contaStats.pagoProprioHoje || 0}</h2>
                            <Link to='/dashboard/contas/'>
                                <HoverCard 
                                    name='Ver contas' 
                                    desc='Ir para a página de contas' 
                                    className='mt-1' 
                                />
                            </Link>
                        </div>

                        <div className={`grid p-6 border-2 rounded-lg bg-card shadow-sm 
                            ${contaStats.aVencerProprio > 0 ? 'border-chart-3' : 'border-chart-3/50'}`}
                        >
                            <h4>A pagar (Própria)</h4>
                            <h2>R$ {contaStats.aVencerProprio || 0}</h2>
                            <Link to='/dashboard/contas/'>
                                <HoverCard 
                                    name='Ver contas' 
                                    desc='Ir para a página de contas' className='mt-1' 
                                />
                            </Link>
                        </div>
                        <div 
                            className={`col-span-1 p-6 border-2 rounded-lg sm:col-span-2 md:col-span-2 lg:col-span-2 bg-card shadow-sm
                                ${isNaN(contaStats.pagoProprioMes + contaStats.aVencerMes + contaStats.pagoMes) ? 'border-chart-1/50' : 'border-chart-1'}`}
                        >
                            <div className='grid grid-cols-2'>
                                <h4>Contas do mês</h4>
                                <HoverCard name='ⓘ' 
                                desc='Este card mostra as contas que foram pagas hoje, as que vão vencer este mês e
                                as contas pagas este mês.' 
                                className='w-3 border-b-0 justify-self-end' />
                            </div>
                            <div className='grid grid-cols-1 mt-1 sm:grid-cols-2'>
                                <div>
                                    <p><b>Pago:</b> R$ {contaStats.pagoProprioMes || 0}</p>
                                    <p><b>A receber:</b> R$ {contaStats.aVencerMes || 0}</p>
                                </div>
                                <div>
                                    <p><b>Recebido:</b> R$ {contaStats.pagoMes || 0}</p>
                                    <p><b>Total:</b> R$ {isNaN(contaStats.pagoProprioMes + contaStats.aVencerMes + contaStats.pagoMes) ? 0 : (contaStats.pagoProprioMes + contaStats.aVencerMes + contaStats.pagoMes).toFixed(2)}</p>
                                </div>
                            </div>
                            <Link to='/dashboard/contas/'>
                                <HoverCard 
                                    name='Ver contas' 
                                    desc='Ir para a página de contas' 
                                    className='mt-1' 
                                />
                            </Link>
                        </div>
                    </div>
                    <div className='grid justify-center grid-cols-1 gap-4 mb-8 md:grid-cols-1 lg:grid-cols-2'>
                        <ComponentBarChart BchartData={BchartData} BchartConfig={BchartConfig} />
                        <ComponentPieChart PchartData={PchartData} PchartConfig={PchartConfig} />
                        <div className='lg:col-span-2'>
                            <HorizontalAreaChart data={AchartData}  />
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedLayout>
    )
}