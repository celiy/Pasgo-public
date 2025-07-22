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
  const cl = "max-w-[40px] sm:max-w-[80px] md:max-w-[150px] lg:max-w-[200px]";
  const cln = "max-w-[40px] sm:max-w-[100px] md:max-w-[100px] lg:max-w-[160px] break-words"
  
  let itens = props.itens;
  if (!itens) { itens = [] };

  if (props?.tabela === 'ordens') {
    return (<>
      {itens.length <= 0 ? <div className="p-4 text-center bg-card text-muted-foreground">
        Nenhuma ordem de serviço encontrada.
      </div> : 
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs sm:text-sm">
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
                Status
              </div>
            </TableHead>
            <TableHead className="hidden text-xs sm:text-sm sm:inline">
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

                  <TableCell className={`font-medium break-words text-xs sm:text-sm ${cl}`}>
                    {item.descricao}
                  </TableCell>

                  <TableCell className={`break-words text-[0.65rem] leading-3 sm:text-sm  max-w-[40px] sm:max-w-[60px] md:max-w-[100px] lg:max-w-[150px]`}>
                    {item.cliente && item.cliente.nome}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center text-xs sm:text-sm">
                      {item.subtotal}
                    </div>
                  </TableCell>

                  {item.status === "andamento" && 
                    <TableCell>
                      <div className="flex justify-center">
                        <div className={`p-1 text-xs border-2 rounded-lg border-chart-3 w-fit sm:text-sm ${cln}`}>
                          Andamento
                        </div>
                      </div>
                    </TableCell>
                  }
                  {item.status === "aberta" && 
                    <TableCell>
                      <div className="flex justify-center">
                        <div className={`p-1 text-xs border-2 rounded-lg border-chart-1 w-fit sm:text-sm ${cln}`}>
                          Aberta
                        </div>
                      </div>
                    </TableCell>
                  }
                  {item.status === "concluida" && 
                    <TableCell>
                      <div className="flex justify-center">
                        <div className={`p-1 text-xs border-2 rounded-lg border-chart-2 w-fit sm:text-sm ${cln}`}>
                          Concluída
                        </div>
                      </div>
                    </TableCell>
                  }
                  {item.status === "cancelada" && 
                    <TableCell>
                      <div className="flex justify-center">
                        <div className={`p-1 text-xs border-2 rounded-lg border-chart-4 w-fit sm:text-sm ${cln}`}>
                          Cancelada
                        </div>
                      </div>
                    </TableCell>
                  }

                  {item.foiPago === "Sim" ?
                    <TableCell className="hidden text-xs sm:text-sm sm:table-cell">
                      <div className="flex justify-center">
                        <div className='p-1 text-xs border-2 rounded-lg border-chart-2 w-fit sm:text-sm'>
                          Sim
                        </div>
                      </div>
                    </TableCell>
                    :
                    <TableCell className="hidden text-xs sm:text-sm sm:table-cell">
                      <div className="flex justify-center">
                        <div className='p-1 border-2 rounded-lg border-chart-4 w-fit'>
                          Não
                        </div>
                      </div>
                    </TableCell>
                  }

                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Popover>
                        <PopoverTrigger className='p-2 border-2 rounded-lg border-primary/80 w-fit max-w-[30px] md:max-w-[100px] bg-primary/5'>
                          <Ellipsis className='max-w-[10px] md:max-w-[100px]' />
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-1">
                          <AlertDialogComponent tipo="search" itens={
                            {
                              cliente: item.cliente, status: item.status, tipo: item.tipo, tipoServiço: item.tipoServiço,
                              servico: item.servico, funcionario: item.funcionario, desconto: item.desconto, subtotal: item.subtotal,
                              tipoPagamento: item.tipoPagamento, foiPago: item.foiPago, dataEmissao: item.dataEmissao,
                              dataExecucao: item.dataExecucao, dataConclusao: item.dataConclusao, dataPagamento: item.dataPagamento,
                              entregadora: item.entregadora, cep: item.cep, numero: item.numero, complemento: item.complemento,
                              bairro: item.bairro, cidade: item.cidade, materiaisEquipamentos: item.materiaisEquipamentos, lista: item.lista,
                              descricao: item.descricao, valor: item.valor, elemento: "ordem", id: item._id,
                            }
                          } />
                          <AlertDialogComponent tipo="pencil" itens={
                            {
                              cliente: item.cliente, status: item.status, tipo: item.tipo, tipoServiço: item.tipoServiço,
                              servico: item.servico, funcionario: item.funcionario, desconto: item.desconto, subtotal: item.subtotal,
                              tipoPagamento: item.tipoPagamento, foiPago: item.foiPago, dataEmissao: item.dataEmissao,
                              dataExecucao: item.dataExecucao, dataConclusao: item.dataConclusao, dataPagamento: item.dataPagamento,
                              entregadora: item.entregadora, cep: item.cep, numero: item.numero, complemento: item.complemento,
                              bairro: item.bairro, cidade: item.cidade, materiaisEquipamentos: item.materiaisEquipamentos, lista: item.lista,
                              descricao: item.descricao, valor: item.valor, id: item._id, elemento: "ordem"
                            }
                          } />
                          <AlertDialogComponent tipo="circlex"
                            url={"servicos-orcamentos/ordens-servicos/" + item._id}
                            itens={{ id: item._id, nome: item.descricao, elemento: "ordem" }} 
                          />
                        </PopoverContent>
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
