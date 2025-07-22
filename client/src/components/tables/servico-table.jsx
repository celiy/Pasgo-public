import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useEffect, useState } from 'react';
import FormatItemDisplay from "../base/format-item-display";
import TableActions from '../base/table-actions';

export default function TableComponent(props) {
    let itens = props.itens;
    if (!itens) { itens = []; }
    let elemento = props.elemento;

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (props?.tabela === 'servicos') {
        return (<>
            {itens.length <= 0 ? <div className="p-4 text-center bg-card text-muted-foreground">
                Nenhum serviço encontrado.
            </div> :
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>
                                <div className="flex justify-center text-xs sm:text-sm">
                                    Valor de custo
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex justify-center text-xs sm:text-sm">
                                    Valor de venda
                                </div>
                            </TableHead>
                            {!isMobile &&
                                <TableHead>
                                    <div className="flex justify-center text-xs sm:text-sm">
                                        Comissão
                                    </div>
                                </TableHead>
                            }
                            <TableHead className="text-right max-w-[30px] md:max-w-[50px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.isArray(itens) ? (
                            itens.map(item =>
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium max-w-[80px] break-words">
                                        {item.nome}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            {item.custo}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            {item.venda}
                                        </div>
                                    </TableCell>
                                    {!isMobile &&
                                        <TableCell>
                                            <div className="flex justify-center">
                                                {item.comissao}
                                            </div>
                                        </TableCell>
                                    }
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <TableActions
                                                title={item?.nome}
                                                item={item}
                                                elemento={elemento}
                                                editUrl="adicionar"
                                                editFields={
                                                    [
                                                        "id", "nome", "custo", "descricao", "venda", "comissao"
                                                    ]
                                                }
                                                deleteUrl={"servicos-orcamentos/servicos/"}
                                            >
                                                {FormatItemDisplay([
                                                    {
                                                        "Custo (R$)": item?.custo,
                                                        "Venda (R$)": item?.venda,
                                                        "Comissão (em %)": item?.comissao
                                                    },
                                                    {
                                                        "Descrição": item?.descricao
                                                    }
                                                ])}
                                            </TableActions>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (<></>)}
                    </TableBody>
                </Table>}
        </>)
    }
}
