import ItemQuery from '@/components/base/item-query'
import PaginationComponent from '@/components/pagination-component'
import TableComponent from '@/components/tables/produto-table'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Loading from '@/elements/loader'
import AnimatedLayout from '@/hooks/AnimatedLayout'
import { fetchRequest } from '@/hooks/axiosHook'
import ViewHeader from '@/layouts/viewHeader'
import { Box } from "lucide-react"
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function Produtos() {
    const { getData, fetchedData, fetchLoading, fetchError } = fetchRequest('/api/v1/produtos/produtosAPI');
    const [ pagesCount, setPagesCount ]   = React.useState(1);
    const [ filtersArr, setFiltersArr ]   = React.useState([]);
    const [ produtos, setProdutos ]       = React.useState();
    const [ filters, setFilters ]         = React.useState("");
    const [ procura, setProcura ]          = React.useState("");
    const [ filtro, setFiltro ]           = React.useState("nome");

    const location        = useLocation();
    const currentFragment = location.hash;

    let latestPage;
    let page;

    const translate = {
        codigo: "Código",
        nome: "Nome",
        tipo:"Tipo",
        quantidade: "Quantidade",
        valor: "Valor unid."
    }

    const getFilters = (type) => {
        let fields = [...filtersArr];

        if (!page){
            page = currentFragment.split("page=")[1];

            const i = fields.findIndex(f => f.startsWith("page="));
            if (i >= 0) fields[i] = "page="+page;
            if (!fields.includes("page="+page)) fields.push("page="+page);
        }

        if (type !== "page") {
            // Remove todos os filtros do tipo filtro=valor
            fields = fields.filter(f => !f.startsWith(filtro + "="));

            if (type === "unique" && procura.length > 0) {
                fields.splice(1);
                fields.push(filtro + "=" + procura);
            } else if (type === "unique" && procura.length === 0) {
                fields.splice(1);
            }

            if (procura.length > 0) {
                if (!fields.includes(filtro + "=" + procura)) fields.push(filtro + "=" + procura);
                const sortIndex = fields.findIndex(f => f === "sort=" + filtro);
                const procuraIndex = fields.findIndex(f => f === filtro + "=" + procura);

                if (sortIndex >= 0 && procuraIndex >= 0) {
                    fields.splice(sortIndex, 1);
                }
            } else {
                fields = fields.filter(f => !f.startsWith(filtro + "="));
                if (!fields.includes("sort=" + filtro)) fields.push("sort=" + filtro);
            }
        }

        setFiltersArr(fields);
    };

    const refresh = (type) => {
        getFilters(type);
    };

    const getProdutos = async () => {
        await getData(filters);
    };

    const handleInputChange = (event) => {
        setProcura(event.target.value);
    };

    useEffect(() => {
        if (filters) {
            getProdutos();
        }
    }, [filters]);

    useEffect(() => {
        getFilters("page");
    }, [currentFragment]);

    useEffect(() => {
        if (fetchedData && latestPage === page){
            setProdutos(fetchedData.data.produtos);
            setPagesCount(Math.ceil(fetchedData.count / 10));
            latestPage = page;
        }
    }, [fetchedData]);

    return (
        <AnimatedLayout>
            <div className='m-6 mt-10 ml-0 sm:ml-6'>
                <ViewHeader 
                    title="Produtos"
                    icon={<Box />}
                />

                <Separator className='mt-2 mb-4'/>

                <ItemQuery 
                    addLabel="Adicionar produto"
                    addUrl="adicionar"
                    
                    setFilters={setFilters}
                    filters={
                        {
                            "Nome": "nome",
                            "Código": "codigo",
                            "Tipo": "tipo",
                            "Quantidade": "quantidade",
                            "Valor": "valor"
                        }
                    }
                />

                <Card className="relative">
                    {fetchLoading && <Loading />}

                    <CardContent className='px-2 py-2'>
                        <TableComponent 
                            itens={produtos} 
                            tabela={'produtos'} 
                            elemento={'produto'}
                        />
                    </CardContent>
                </Card>

                <PaginationComponent pages={pagesCount} />
            </div>
        </AnimatedLayout>
    )
}