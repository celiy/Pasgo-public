import ItemQuery from '@/components/base/item-query'
import PaginationComponent from '@/components/pagination-component'
import TableComponent from '@/components/tables/venda-table'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Helper from '@/elements/helper'
import Loading from '@/elements/loader'
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { fetchRequest } from '@/hooks/axiosHook'
import ViewHeader from '@/layouts/viewHeader'
import { CircleDollarSign } from "lucide-react"
import React, { useEffect } from 'react'

export default function ProdutosEServicos() {
    const { getData, data, updating, error } = fetchRequest('/api/v1/vendas/vendasAPI');
    const [ pagesCount, setPagesCount ]     = React.useState(1);
    const [ vendaStats, setVendaStats ]     = React.useState();
    const [ filters, setFilters ]           = React.useState("");
    const [ vendas, setVendas ]            = React.useState();
    const [ total, setTotal ]               = React.useState(0);

    const getVendas = async () => {
        const response = await getData(filters);

        if (response.data.vendas) {
            setVendas(response.data.vendas);
            setPagesCount(Math.ceil(response.count / 10));
            setTotal(response.count);
        }
    };

    useEffect(() => {
        if (filters) {
            getVendas();
        }
    }, [filters]);

    useEffect(() => {
        const getVendasStats = async () => {
            const res = await getData("-stats");

            if (res.data.vendaStats) {
                setVendaStats(res.data.vendaStats);
            }
        };
        
        getVendasStats();
    }, []);

    return (
        <AnimatedLayout>
            <div className='m-6 mt-10 ml-0 sm:ml-6'>
                <ViewHeader 
                    title="Vendas"
                    total={total}
                    icon={<CircleDollarSign />}
                />

                <Separator className='mt-2 mb-4'/>

                <ItemQuery 
                    addLabel="Fazer venda"
                    addUrl="adicionar"
                    
                    setFilters={setFilters}
                    filters={
                        {
                            "Cliente": "cliente@nome",
                            "Funcionário": "funcionario@nome",
                            "Subtotal": "subtotal",
                            "Pagamento": "tipoPagamento",
                            "Foi pago": {
                                key: "foiPago",
                                type: "bool",
                                options: ["Sim", "Não"]
                            },
                            "Data de pagamento": {
                                key: "dataPagamento",
                                type: "date",
                            },
                            "Descrição": "descricao"
                        }
                    }
                />

                <Helper type='text' desc='O resumo de vendas contém apenas as vendas com data de pagamaneto para este mês. Os dados são atualizados a cada 1 hora.'/>

                <div className='my-2'/>

                <TableComponent 
                    itens={vendaStats} 
                    tabela={'total-vendas'} 
                />
                
                <div className='my-6'/>

                <Card className="relative">
                    {updating && <Loading />}

                    <CardContent className='px-2 py-2'>
                        <TableComponent 
                            itens={vendas} 
                            tabela={'vendas'} 
                            elemento={'venda'}
                        />
                    </CardContent>
                </Card>

                <PaginationComponent pages={pagesCount} />
            </div>
        </AnimatedLayout>
    )
}