import ItemQuery from '@/components/base/item-query'
import PaginationComponent from '@/components/pagination-component'
import TableComponent from '@/components/tables/conta-table'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Helper from '@/elements/helper'
import Loading from '@/elements/loader'
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { fetchRequest } from '@/hooks/axiosHook'
import ViewHeader from '@/layouts/viewHeader'
import { Banknote } from "lucide-react"
import React, { useEffect } from 'react'

export default function Contas() {
    const { getData, fetchedData, fetchLoading, fetchError } = fetchRequest('/api/v1/financeiro/contas');
    const [ totalContas, setTotalContas ]                 = React.useState([{}]);
    const [ pagesCount, setPagesCount ]                   = React.useState(1);
    const [ filters, setFilters ]                         = React.useState("");
    const [ contas, setContas ]                           = React.useState();
    const [ total, setTotal ]                             = React.useState(0);

    const getContas = async () => {
        const response = await getData(filters);
        
        if (response.data) {
            setContas(response.data.contas);
            setPagesCount(Math.ceil(response.count / 10));
            setTotal(response.count);
        }
    };

    useEffect(() => {
        if (filters) {
            getContas();
        }
    }, [filters]);
    
    useEffect(() => {
        const getVendasStats = async () => {
            const res = await getData("-stats");
            
            if (res.data.contaStats) {
                setTotalContas(res.data.contaStats);
            }
        };

        getVendasStats();
    }, []);

    return (
        <AnimatedLayout>
            <div className='m-6 mt-10 ml-0 sm:ml-6'>
                <ViewHeader 
                    title={"Contas"}
                    total={total}
                    icon={<Banknote />}
                />

                <Separator className='mt-2 mb-4'/>

                <ItemQuery 
                    addLabel="Adicionar conta"
                    addUrl="adicionar"
                    
                    setFilters={setFilters}
                    filters={
                        {
                            "Cliente": "tipoEntidade=cliente&entidade@nome",
                            "Funcionário": "tipoEntidade=funcionario&entidade@nome",
                            "Fornecedor": "tipoEntidade=fornecedor&entidade@nome",
                            "Própria": {
                                key: "tipoEntidade",
                                type: "customValue",
                                customValue: "propria"
                            },
                            "Quitado": {
                                key: "quitado",
                                type: "bool",
                                options: ["Sim", "Não"]
                            },
                            "Data de pagamento": {
                                key: "vencimento",
                                type: "date",
                            },
                            "Tipo de pagamento": "pagamento",
                            "Nome": "nome"
                        }
                    }
                />

                <Helper type='text' desc='O resumo de contas contém apenas as contas com data de pagamaneto para este mês. Os dados são atualizados a cada 1 hora.'/>

                <div className='my-2'/>

                <TableComponent itens={totalContas} tabela={'total-vendas'} />

                <div className='my-6'/>

                <Card className="relative">
                    {fetchLoading && <Loading />}

                    <CardContent className='px-2 py-2'>
                        <TableComponent 
                            itens={contas} 
                            tabela={'contas'} 
                            elemento={'conta'}
                        />
                    </CardContent>
                </Card>
                
                <PaginationComponent pages={pagesCount} />
            </div>
        </AnimatedLayout>
    )
}