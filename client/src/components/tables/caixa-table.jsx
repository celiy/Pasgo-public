import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import moment from "moment"
import React from 'react'
import TableActions from '../base/table-actions'
import { ScrollArea } from '../ui/scroll-area'

export default function CaixaTable(props) {
    let vendas = props?.itens ? props?.itens : [];
    let elemento = props.elemento;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">
                        N. de produtos
                    </TableHead>
                    <TableHead>
                        Pagamento
                    </TableHead>
                    <TableHead>
                        Total
                    </TableHead>
                    <TableHead>
                        Feito em
                    </TableHead>
                    <TableHead className="text-right">
                        Ações
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.isArray(vendas) && vendas.length > 0 && vendas[0] && Object.keys(vendas[0]).length > 0 && vendas[0]
                    && vendas.map(item =>
                        <TableRow>
                            <TableCell className="font-medium">{item.produtos && item.produtos.length}</TableCell>
                            <TableCell>{item.pagamento}</TableCell>
                            <TableCell>{item.total} R$</TableCell>
                            <TableCell>{moment(item.feitoEm).format('DD/MM/YYYY - HH:mm')}</TableCell>
                            <TableCell className="text-right">
                                <TableActions 
                                    title={`Venda do caixa feito em ${moment(item.feitoEm).format('DD/MM/YYYY - HH:mm')}`}
                                    item={item}
                                    elemento={elemento}
                                    deleteUrl="vendas/caixaAPI/"
                                >
                                    <ScrollArea className="h-[200px] rounded-md border p-4">
                                        {item?.produtos?.map(produto => (
                                            <div className="grid mb-2 border-b">
                                                <h4>{produto.nome}</h4>
                                                <p>Quantidade: {produto.quantidade}</p>
                                                <p>Valor: {produto.valor}</p>
                                                <p>Total: {produto.valor * produto.quantidade}</p>
                                            </div>
                                        ))}
                                    </ScrollArea>
                                </TableActions>
                            </TableCell>
                        </TableRow>
                    )}
            </TableBody>
        </Table>
    )
}