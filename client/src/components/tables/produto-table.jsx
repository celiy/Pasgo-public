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

function getProductType(type) {
	const types = {
		"bebibas": "Bebibas",
		"camamesa": "Cama mesa e banho",
		"bebidas": "Bebidas",
		"alimentos": "Alimentos",
		"diversos": "Diversos",
		"eletrodomesticos": "Eletrodomésticos",
		"eletronicos": "Eletrônicos",
		"informatica": "Informática",
		"moveisdecoracao": "Móveis e Decoração",
	}

	return types[type];
}

export default function TableComponent(props) {
	let itens = props.itens;
	if (!itens) { itens = [] };
	let elemento = props.elemento;

	if (props?.tabela === 'produtos') {
		return (<>
			{itens.length <= 0 ? <div className="p-4 text-center bg-card text-muted-foreground">
				Nenhum produto encontrado.
			</div> :
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>
								Nome
							</TableHead>
							<TableHead>
								Tipo
							</TableHead>
							<TableHead>
								<div className="flex justify-center overflow-hidden font-medium xs:text-xs text-ellipsis whitespace-nowrap">
									Quantidade
								</div>
							</TableHead>
							<TableHead className="hidden sm:inline">
								<div className="flex justify-center">
									Valor unid.
								</div>
							</TableHead>
							<TableHead className="text-right max-w-[30px] md:max-w-[50px]">
								Ações
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.isArray(itens) ? (
							itens.map(item =>
								<TableRow key={item.id}>
									<TableCell className="font-medium max-w-[80px] sm:max-w-[80px] md:max-w-[150px] break-words">
										{item.nome}
									</TableCell>
									<TableCell className="max-w-[50px] sm:max-w-[80px] md:max-w-[150px] break-words">
										{getProductType(item?.tipo)}
									</TableCell>
									<TableCell>
										<div className="flex justify-center">
											{item.quantidade}
										</div>
									</TableCell>
									<TableCell className="hidden sm:table-cell">
										<div className="flex justify-center">
											{item.valor}
										</div>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end space-x-2">
											<TableActions
												title={item?.nome}
												item={item}
												elemento={elemento}
												editUrl="adicionar"
												editFields={
													[
														"id", "nome", "quantidade", "valor", "tamanho",
														"descricao", "marca", "modelo", "peso", "localizacao"
													]
												}
												deleteUrl={"produtos/produtosAPI/"}
											>
												{FormatItemDisplay([
													{
														"Código _BIG_": item?.codigo,
														"Tipo": getProductType(item?.tipo),
													},
													{
														"Quantidade": item?.quantidade,
														"Valor unitário (R$)": item?.valor,
														"Genêro": item?.genero,
														"Tamanho": item?.tamanho,
														"Peso": item?.peso,
														"Localização no estoque": item?.localizacao,
														"Fornecedor": item?.fornecedor?.nome
													},
													{
														"Marca": item?.marca,
														"Modelo": item?.modelo
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