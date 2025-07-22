import ItemQuery from '@/components/base/item-query'
import PaginationComponent from '@/components/pagination-component'
import TableComponent from '@/components/tables/ordem-table'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Loading from '@/elements/loader'
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { fetchRequest } from '@/hooks/axiosHook'
import ViewHeader from '@/layouts/viewHeader'
import { FileCog } from "lucide-react"
import React, { useEffect } from 'react'

export default function Ordens() {
    const { getData, data, fetchLoading, error } = fetchRequest('/api/v1/servicos-orcamentos/ordens-servicos/');
    const [ pagesCount, setPagesCount ]     = React.useState(1);
    const [ filters, setFilters ]           = React.useState("");
    const [ ordens, setOrdens ]             = React.useState();
    const [ total, setTotal ]               = React.useState(0);

    const getServicos = async () => {
        const response = await getData(filters);

        if (response.data.ordens) {
            setOrdens(response.data.ordens);
            setPagesCount(Math.ceil(response.count / 10));
            setTotal(response.count);
        }
    };

    useEffect(() => {
        if (filters) {
            getServicos();
        }
    }, [filters]);
    
    return (
        <AnimatedLayout>
            <div className='m-6 mt-10 ml-0 sm:ml-6'>
                <ViewHeader 
                    title="Ordens de serviço"
                    total={total}
                    icon={<FileCog />}
                />

                <Separator className='mt-2 mb-4'/>

                <ItemQuery 
                    addLabel="Adicionar ordem"
                    addUrl="adicionar"
                    
                    setFilters={setFilters}
                    filters={
                        {
                            "Cliente": "cliente@nome",
                            "Tipo de serviço": "tipoServiço",
                            "Funcionário": "funcionario@nome",
                            "Subtotal": "subtotal",
                            "Pagamento": "tipoPagamento",
                            "Foi pago": {
                                key: "foiPago",
                                type: "bool",
                                options: ["Sim", "Não"]
                            },
                            "Data de emissão": {
                                key: "dataEmissao",
                                type: "date",
                            },
                             "Data da execução": {
                                key: "dataExecucao",
                                type: "date",
                            },
                             "Data de conclusão": {
                                key: "dataConclusao",
                                type: "date",
                            },
                             "Data do pagamento": {
                                key: "dataPagamento",
                                type: "date",
                            },
                            "Descrição": "descricao"
                        }
                    }
                />

                <Card className="relative">
                    {fetchLoading && <Loading />}

                    <CardContent className='px-2 py-2'>
                        <TableComponent 
                            itens={ordens} 
                            tabela={'ordens'}
                        />
                    </CardContent>
                </Card>
                
                <PaginationComponent pages={pagesCount} />
            </div>
        </AnimatedLayout>
    )
}