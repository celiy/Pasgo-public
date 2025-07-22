import { X } from "lucide-react";
import moment from "moment";
import React from "react";
import { Button } from "./ui/button";

const hidden = ["page", "sort", "limit"];

const translated = {
    nome: "Nome",
    cel: "Celular",
    tipo:"Tipo",
    salario: "Salário",
    codigo: "Código",
    quantidade: "Quantidade",
    valor: "Valor unid.",
    custo: "Custo",
    venda: "Valor de venda",
    tipoServiço: "Tipo de serviço",
    funcionario: "Funcionário",
    "funcionario@nome": "Funcionário",
    subtotal: "Subtotal",
    tipoPagamento: "Pagamento",
    foiPago: "Foi pago",
    data: "Data",
    descricao: "Descrição",
    cliente: "Cliente",
    fornecedor: "Fornecedor",
    "cliente@nome": "Cliente",
    dataPagamento: "Data do pagamento",
    dataEmissao: "Data de emissão",
    dataExecucao: "Data de execução",
    dataConclusao: "Data de conclusão",
    entidade: "Entidade",
    pagamento:"Tipo de pagamento",
    quitado: "Quitado",
    propria: "Própria",
    "fornecedor@nome": "Fornecedor",
    vencimento: "Vencimento",
    tipoEntidade: "Tipo: ",
    "entidade@nome": "Entidade"
}

export function FiltersValue(params) {
    const arr = [];
    const hiddenParams = {};

    for (let index = 0; index < params.length; index++) {
        let param = params[index];

        if (hidden.includes(param.split("=")[0])) {
            if (!hiddenParams[param.split("=")[0]]) {
                arr.push(index === 0 ? "?"+param : param);
                hiddenParams[param.split("=")[0]] = true;
            }
        } else {
            arr.push(index === 0 ? "?"+param : param);
        }
    }
    
    // The date is used to return a new value every time because useEffect will not trigger if the value is unchanged
    let finalQuery = arr.join("&");

    if (finalQuery?.length > 0) {
        finalQuery = finalQuery + "#" + new Date().toISOString();
    }
    
    return finalQuery;
}

function translateParams(param) {
    const splitParam = param.split("=");

    if (!hidden.includes(splitParam[0])) {
        const field = translated[splitParam[0]];

        if (!field) {
            if (splitParam[0].includes("[gte]")) {
                const newField = splitParam[0].split("[gte]");

                return translated[newField[0]] + " depois de " + moment(splitParam[1]).format("DD/MM/YYYY");
            }

            if (splitParam[0].includes("[lte]")) {
                const newField = splitParam[0].split("[lte]");

                return translated[newField[0]] + " antes de " + moment(splitParam[1]).format("DD/MM/YYYY");
            }
        }
        
        let newParam = splitParam[1];
        if (newParam) newParam = newParam.split("&")[0];

        if (field?.includes("Tipo:")) return field + " " + translated[newParam];
        return field + " = " + newParam;
    } else {
        return false;
    }
}

export function ActiveFilters(props) {
    const [ routeArray, setRouteArray ] = React.useState([]);

    React.useEffect(() => {
        setRouteArray(props.params);
        
        if (typeof props.filterValue === 'function') {
            props.filterValue(FiltersValue(props.params));
        }
        if (typeof props.filterArray === 'function') {
            props.filterArray(props.params);
        }
    }, [props.params]);

    const updateArray = (array) => {
         if (typeof props.filterArray === 'function') {
            props.filterArray(array);
        }

        if (typeof props.filterValue === 'function') {
            props.filterValue(FiltersValue(array));
        }
    }

    return (
        <div className={`${props.className} w-full mb-4`}>
            <div className="grid grid-cols-2 gap-2 mt-1 sm:grid-cols-3 md:grid-cols-4">
                {routeArray.map((item, index) => {
                    const translatedParam = translateParams(item);

                    if (translatedParam) {
                        return (
                            <Button 
                                variant="outline"
                                className="justify-start h-auto px-2 py-2 hover:bg-destructive"
                                key={item}
                                onClick={() => {
                                    const arr = [...routeArray];
                                    arr.splice(index, 1);
                                    setRouteArray(arr);
                                    updateArray(arr);
                                }}
                            >
                                <div className="max-w-[100%] flex gap-2 truncate text-xs">
                                    <X />
                                    <span className="truncate">{translatedParam}</span>
                                </div>
                            </Button>
                        );
                    }
                })}
            </div>
        </div>
    )
}

