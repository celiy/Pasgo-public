import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import moment from "moment";
import FormatItemDisplay from "../base/format-item-display";
import TableActions from '../base/table-actions';

const translatedEntity = {
	"propria": "Própria",
	"cliente": "Cliente",
	"fornecedor": "Fornecedor",
	"funcionario": "Funcionário"
}

export default function TableComponent(props) {
	const cl = "max-w-[60px] sm:max-w-[100px] md:max-w-[100px] lg:max-w-[160px]";

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

	if (props?.tabela === 'contas') {
		return (<>
			{itens.length <= 0 ? <div className="p-4 text-center bg-card text-muted-foreground">
				Nenhuma conta encontrada.
			</div> :
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-xs sm:text-sm">Nome</TableHead>
							<TableHead>
								<div className="flex justify-center text-xs sm:text-sm">
									Custo
								</div>
							</TableHead>
							<TableHead className="hidden text-xs sm:text-sm sm:table-cell">
								Pagamento
							</TableHead>
							<TableHead className="text-xs sm:text-sm">
								Vencimento
							</TableHead>
							<TableHead>
								<div className="flex justify-center text-xs sm:text-sm">
									Quitado
								</div>
							</TableHead>
							<TableHead className="text-right w-[100px] text-xs sm:text-sm">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.isArray(itens) ? (
							itens.map(item =>
								<>
									<TableRow key={item.id}>
										<TableCell className={`break-words text-xs sm:text-sm ${cl}`}>
											{item.nome}
										</TableCell>
										<TableCell>
											<div className="flex justify-center text-xs sm:text-s">
												{item.custo}
											</div>
										</TableCell>
										<TableCell className={`hidden sm:table-cell overflow-hidden text-ellipsis whitespace-nowrap text-xs sm:text-sm ${cl}`}>
											{item.pagamento}
										</TableCell>
										<TableCell className={`overflow-hidden text-ellipsis whitespace-nowrap text-xs sm:text-sm ${cl}`}>
											{moment(item.vencimento).format('DD/MM/YYYY')}
										</TableCell>
										{item.quitado === "Sim" ?
											<TableCell>
												<div className="flex justify-center">
													<div className='p-1 text-xs border-2 rounded-lg border-chart-2 w-fit sm:text-sm'>Sim</div>
												</div>
											</TableCell>
											:
											<TableCell>
												<div className="flex justify-center">
													<div className='p-1 text-xs border-2 rounded-lg border-chart-4 w-fit sm:text-sm'>Não</div>
												</div>
											</TableCell>}
										<TableCell className="text-right">
											<div className="flex justify-end space-x-2">
												<TableActions
													title={item?.nome}
													item={item}
													elemento={elemento}
													editUrl="adicionar"
													editFields={
														[
															"id", "quitado"
														]
													}
													deleteUrl={"financeiro/contas/"}
												>
													{FormatItemDisplay([
														{
															"Entidade": translatedEntity[item?.tipoEntidade],
															"Nome da entidade": item?.entidade?.nome
														},
														{
															"Valor (R$)": item?.custo,
															"Juros (em %)": item?.juros,
															"Desconto (em %)": item?.desconto,
															"Subtotal (R$)": item?.subtotal,
														},
														{
															"Foi quitado": item?.quitado,
															"Forma de pagamento": item?.pagamento,
															"Data do pagamento": moment(item?.vencimento).format('DD/MM/YYYY')
														},
														{
															"Descrição profunda": item?.descricao
														}
													])}
												</TableActions>
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
