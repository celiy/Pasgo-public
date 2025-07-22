import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import FormatItemDisplay from "../base/format-item-display";
import TableActions from '../base/table-actions';

export default function TableComponent(props) {
	let itens = props.itens;
	if (!itens) { itens = [] }
	let elemento = props.elemento;

	if (props?.tabela === 'funcionarios') {
		return (<>
			{itens.length <= 0 ? <div className="p-4 text-center bg-card text-muted-foreground">
				Nenhum funcionário encontrado.
			</div> :
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>
								Nome
							</TableHead>
							<TableHead>
								Celular
							</TableHead>
							<TableHead>
								Salário
							</TableHead>
							<TableHead className="text-right w-[100px]">
								Ações
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.isArray(itens) ? (
							itens.map(item =><>
								<TableRow key={item.id}>
									<TableCell className="font-medium max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
										{item.nome}
									</TableCell>
									<TableCell className='max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap'>
										{item.cel}
									</TableCell>
									<TableCell>
										{item.salario} R$
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end space-x-2">
											<TableActions
												title={item?.nome}
												item={item}
												elemento={elemento}
												editUrl="cadastrar"
												editFields={
													[
														"tipo", "id", "nome", "cel", "email", "cep", "numero", "complemento",
														"bairro", "cidade", "salario"
													]
												}
												deleteUrl={"cadastros/funcionarios/"}
											>
												{FormatItemDisplay([
													{
														"Salário": item?.salario,
														"Número de celular": item?.cel,
														"Email": item?.email,
														"CPF": item?.cpf,
														"RG": item?.rg
													},
													{
														"CEP": item?.cep,
														"Número": item?.numero,
														"Complemento": item?.complemento,
														"Bairro": item?.bairro,
														"Cidade/UF": item?.cidade
													},
													{
														"Observação": item?.observacao
													}
												])}
											</TableActions>
										</div>
									</TableCell>
								</TableRow>
							</>)) : (<></>)}
					</TableBody>
				</Table>}
		</>)
	}
}
