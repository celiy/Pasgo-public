import AlertDialogComponent from '@/components/alert-dialog-component.jsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Ellipsis } from "lucide-react";

export default function TableComponent(props) {
  const cl = "max-w-[80px] sm:max-w-[100px] md:max-w-[100px] lg:max-w-[160px]";

  let itens = props.itens;
  if (!itens) { itens = [] }
  let elemento = props.elemento;

  if (props?.tabela === 'total-vendas') {
    const soma = itens.vencidos + itens.vencemHoje + itens.aVencer + itens.pago;

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vencidos</TableHead>
            <TableHead>Vencem hoje</TableHead>
            <TableHead>A vencer</TableHead>
            <TableHead>Recebido</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow key={'stats'}>
            <TableCell>{itens.vencidos ?? 0} R$</TableCell>
            <TableCell>{itens.vencemHoje ?? 0} R$</TableCell>
            <TableCell>{itens.aVencer ?? 0} R$</TableCell>
            <TableCell>{itens.pago ?? 0} R$</TableCell>
            <TableCell>{!isNaN(parseFloat(soma).toFixed(2)) ? soma : 0} R$</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }
  
  else if (props?.tabela === 'vendas') {
    return (<>
      {itens.length <= 0 ? <div className="p-4 text-center bg-card text-muted-foreground">
        Nenhuma venda encontrada.
      </div> : 
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden text-xs sm:text-sm sm:table-cell">
              Descrição
            </TableHead>
            <TableHead className="text-xs sm:text-sm">
              Cliente
            </TableHead>
            <TableHead>
              <div className="flex justify-center text-xs sm:text-sm">
                Subtotal
              </div>
            </TableHead>
            <TableHead className="text-xs sm:text-sm">
              <div className="flex justify-center">
                Foi pago
              </div>
            </TableHead>
            <TableHead className="text-right w-[100px] sm:text-sm text-xs">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(itens) ? (
            itens.map(item =>
              <>
                <TableRow key={item.id}>
                  <TableCell className={`hidden sm:table-cell font-medium overflow-hidden text-ellipsis whitespace-nowrap text-xs sm:text-sm  ${cl}`}>
                    {item.descricao}
                  </TableCell>
                  
                  {/* "max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap" */}
                  <TableCell className={`break-words text-[0.65rem] leading-3 sm:text-sm  ${cl}`}>
                    {item.cliente && item.cliente.nome}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center text-xs sm:text-sm">
                      {item.subtotal}
                    </div>
                  </TableCell>

                  {item.foiPago === "Sim" ? 
                  <TableCell>
                    <div className="flex justify-center">
                      <div className='p-1 text-xs border-2 rounded-lg border-chart-2 w-fit sm:text-sm'>
                        Sim
                      </div>
                    </div>
                  </TableCell> 
                  :
                  <TableCell>
                    <div className="flex justify-center">
                      <div className='p-1 border-2 rounded-lg border-chart-4 w-fit'>
                        Não
                      </div>
                    </div>
                  </TableCell>}
                  
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Popover>
                        <PopoverTrigger className='p-2 border-2 rounded-lg border-primary/80 w-fit max-w-[30px] md:max-w-[100px] bg-primary/5'>
                          <Ellipsis className='max-w-[10px] md:max-w-[100px]'/>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-1">
                        <AlertDialogComponent tipo="search" itens={
                          {
                            descricao: item.descricao, tipoPagamento: item.tipoPagamento, dataPagamento: item.dataPagamento,
                            foiPago: item.foiPago, tipo: item.tipo, cliente: item.cliente, subtotal: item.subtotal, listaDigitada: item.listaDigitada,
                            desconto: item.desconto, produto: item.produto, servico: item.servico, funcionario: item.funcionario,
                            entregadora: item.entregadora, cep: item.cep, numero: item.numero, complemento: item.complemento, 
                            bairro: item.bairro, cidade: item.cidade, valor: item.valor, elemento: elemento
                          }
                        } />
                        <AlertDialogComponent tipo="pencil" itens={
                          {
                            descricao: item.descricao, tipoPagamento: item.tipoPagamento, dataPagamento: item.dataPagamento,
                            foiPago: item.foiPago, tipo: item.tipo, cliente: item.cliente, subtotal: item.subtotal,
                            desconto: item.desconto, produto: item.produto, servico: item.servico, funcionario: item.funcionario,
                            entregadora: item.entregadora, cep: item.cep, numero: item.numero, complemento: item.complemento,
                            bairro: item.bairro, cidade: item.cidade, elemento: elemento, id: item._id
                          }
                        } />
                        <AlertDialogComponent tipo="circlex"
                          url={"vendas/vendasAPI/" + item._id}
                          itens={{ id: item._id, nome: item.descricao, elemento: "venda" }} /></PopoverContent>
                      </Popover>
                    </div>
                  </TableCell>
                </TableRow>
              </>
            )) : (<></>)}
        </TableBody>
      </Table>}
    </>)
  }
}
