import ItemQuery from '@/components/base/item-query'
import PaginationComponent from '@/components/pagination-component'
import TableComponent from '@/components/tables/servico-table'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Loading from '@/elements/loader'
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { fetchRequest } from '@/hooks/axiosHook'
import ViewHeader from '@/layouts/viewHeader'
import { Cog } from "lucide-react"
import React, { useEffect } from 'react'

export default function Servicos() {
    const { getData, fetchedData, fetchLoading, error } = fetchRequest('/api/v1/servicos-orcamentos/servicos');
    const [ pagesCount, setPagesCount ] = React.useState(1);
    const [ servicos, setServicos ]     = React.useState();
    const [ filters, setFilters ]       = React.useState("");
    const [ total, setTotal ]           = React.useState(0);

    let page;
    let latestPage;

    const getServicos = async () => {
        await getData(filters);
    };

    useEffect(() => {
        if (filters) {
            getServicos();
        }
    }, [filters]);

    useEffect(() => {
        if (fetchedData && latestPage === page){
            setServicos(fetchedData.data.servicos);
            setPagesCount(Math.ceil(fetchedData.count / 10));
            setTotal(fetchedData.count);

            latestPage = page;
        }
    }, [fetchedData]);

    return (
        <AnimatedLayout>
            <div className='m-6 mt-10 ml-0 sm:ml-6'>
                <ViewHeader 
                    title="Serviços"
                    total={total}
                    icon={<Cog />}
                />

                <Separator className='mt-2 mb-4'/>

                <ItemQuery 
                    addLabel="Adicionar serviço"
                    addUrl="adicionar"
                    
                    setFilters={setFilters}
                    filters={
                        {
                            "Nome": "nome",
                            "Custo": "custo",
                            "Valor de venda": "venda"
                        }
                    }
                />

                <Card className="relative">
                    {fetchLoading && <Loading />}

                    <CardContent className='px-2 py-2'>
                        <TableComponent 
                        itens={servicos} 
                        tabela={'servicos'} 
                        elemento={'Serviço'}/>
                    </CardContent>
                </Card>
                
                <PaginationComponent pages={pagesCount} />
            </div>
        </AnimatedLayout>
    )
}