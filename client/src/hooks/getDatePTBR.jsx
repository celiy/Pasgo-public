function ReturnMes(){
    const mes = new Date();
    const meses = {
        1:"Janeiro",
        2:"Fevereiro",
        3:"Março",
        4:"Abril",
        5:"Maio",
        6:"Junho",
        7:"Julho",
        8:"Agosto",
        9:"Setembro",
        10:"Outubro",
        11:"Novembro",
        12:"Dezembro",
    }
    return meses[mes.getMonth()];
}

export const Mes = () => {
    return ReturnMes();
}

//DIA | MES | ANO
export const DMA = () => {
    const newDate = new Date();

    return `${newDate.getDate()}/${newDate.getMonth()+1}/${newDate.getFullYear()}`
}