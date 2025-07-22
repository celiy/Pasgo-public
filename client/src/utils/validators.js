export function validateCPF(strCPF) {
    if (strCPF.length !== 11) return false;

    let Soma = 0;
    let Resto;
    if (strCPF == "00000000000") return false;

    for (let i = 1; i <= 9; i++) {
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    }
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (let i = 1; i <= 10; i++) {
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    }
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return false;
    return true;
}

export function validateCNPJ(cnpj) {
    if (cnpj.length !== 14) return false;

    const b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const c = String(cnpj).replace(/[^\d]/g, '');

    if (c.length !== 14)
        return false;

    if (/0{14}/.test(c))
        return false;

    let n = 0;
    for (let i = 0; i < 12; i++) {
        n += c[i] * b[i + 1];
    }
    if (c[12] != (((n %= 11) < 2) ? 0 : 11 - n))
        return false;

    n = 0;
    for (let i = 0; i <= 12; i++) {
        n += c[i] * b[i];
    }
    if (c[13] != (((n %= 11) < 2) ? 0 : 11 - n))
        return false;

    return true;
}