import AlertDialogComponent from '@/components/alert-dialog-component'
import ItemQuery from '@/components/base/item-query'
import PaginationComponent from '@/components/pagination-component'
import TableComponent from '@/components/tables/cliente-fornecedor-table'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Loading from '@/elements/loader'
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { fetchRequest } from '@/hooks/axiosHook'
import ViewHeader from '@/layouts/viewHeader'
import { User } from "lucide-react"
import React, { useEffect } from 'react'

export default function Clientes() {
    const { getData, fetchedData, fetchLoading, fetchError } = fetchRequest('/api/v1/cadastros/clientes');
    const [ pagesCount, setPagesCount ] = React.useState(1);
    const [ clientes, setClientes ]     = React.useState();
    const [ filters, setFilters ]       = React.useState("");
    const [ total, setTotal ]           = React.useState(0);
    
    let latestPage;
    let page;

    const getClientes = async () => {
        await getData(filters);
    };

    useEffect(() => {
        if (filters) {
            getClientes();
        }
    }, [filters]);

    useEffect(() => {
        if (fetchedData && latestPage === page){
            setClientes(fetchedData.data.clientes);
            setPagesCount(Math.ceil(fetchedData.count / 10));
            setTotal(fetchedData.count);
            latestPage = page;
        }
    }, [fetchedData]);

    return (
        <AnimatedLayout> 
            {fetchError &&
                <AlertDialogComponent
                    tipo='warning'
                    title='Erro!'
                    desc={(fetchError.message)}
                    onClose={() => {}}
                />
            }
            
            <div className='m-6 mt-10 ml-0 sm:ml-6'>
                <ViewHeader
                    title="Clientes"
                    total={total}
                    icon={<User />}
                />

                <Separator className='mt-2 mb-4'/>

                <ItemQuery 
                    addLabel="Adicionar cliente"
                    addUrl="cadastrar"
                    
                    setFilters={setFilters}
                    filters={
                        {
                            "Nome": "nome",
                            "Celular": "cel",
                            "Tipo": "tipo"
                        }
                    }
                />

                <Card className="relative">
                    {fetchLoading && <Loading />}

                    <CardContent className='px-2 py-2'>
                        <TableComponent 
                            itens={clientes}
                            elemento={"cliente"}
                        />
                    </CardContent>
                </Card>

                <PaginationComponent pages={pagesCount} />
            </div>
        </AnimatedLayout>
    )
}