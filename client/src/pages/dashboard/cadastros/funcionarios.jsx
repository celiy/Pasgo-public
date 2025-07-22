import AlertDialogComponent from '@/components/alert-dialog-component'
import ItemQuery from '@/components/base/item-query'
import PaginationComponent from '@/components/pagination-component'
import TableComponent from '@/components/tables/funcionario-table'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Loading from '@/elements/loader'
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { fetchRequest } from '@/hooks/axiosHook'
import ViewHeader from '@/layouts/viewHeader'
import { Users } from "lucide-react"
import React, { useEffect } from 'react'

export default function Funcionarios() {
    const { getData, fetchedData, fetchLoading, fetchError } = fetchRequest('/api/v1/cadastros/funcionarios');
    const [ funcionarios, setFuncionarios ] = React.useState();
    const [ pagesCount, setPagesCount ]     = React.useState(1);
    const [ filters, setFilters ]           = React.useState("");
    const [ total, setTotal ]               = React.useState(0);

    let latestPage;
    let page;

    const getFuncionarios = async () => {
        await getData(filters);
    };

    useEffect(() => {
        if (filters) {
            getFuncionarios();
        }
    }, [filters]);
    
    useEffect(() => {
        if (fetchedData && latestPage === page){
            setFuncionarios(fetchedData.data.funcionarios);
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
                    title={"Funcionarios"}
                    total={total}
                    icon={<Users />}
                />

                <Separator className='mt-2 mb-4'/>

                <ItemQuery 
                    addLabel="Adicionar funcionário"
                    addUrl="cadastrar"
                    
                    setFilters={setFilters}
                    filters={
                        {
                            "Nome": "nome",
                            "Celular": "cel",
                            "Salário": "salario"
                        }
                    }
                />

                <Card className="relative">
                    {fetchLoading && <Loading />}

                    <CardContent className='px-2 py-2'>
                        <TableComponent 
                            itens={funcionarios} 
                            tabela={'funcionarios'} 
                            elemento={'Funcionário'}
                        />
                    </CardContent>
                </Card>
                
                <PaginationComponent pages={pagesCount} />
            </div>
        </AnimatedLayout>
    )
}