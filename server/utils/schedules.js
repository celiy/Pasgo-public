const cron = require("node-cron");
const User = require('../models/userModel');
const Cliente = require('../models/clientesModel');
const Funcionario = require('../models/funcionariosModel');
const Fornecedor = require('../models/fornecedoresModel');
const Produto = require('../models/produtosModel');
const Venda = require('../models/vendasModel');
const Conta = require('../models/contasModel');
const Caixa = require('../models/caixaModel');
const Servico = require('../models/servicosModel');
const Ordem = require('../models/ordemServicoModel');
const sendEmail = require('./email');
const moment = require('moment');

const processUserData = async() => {
    try {
        const start = new Date();
        console.log("Running processUserData at: ", start);

        const users = await User.find();

        for (const user of users) {
            if ((user.contas > 0 && (user.contasStatsDashboard?.lastModified && !user.contasStatsDashboard?.current) || !user.contasStatsDashboard?.stats) || (user.contas && user.contasStatsDashboard?.lastModified && user.contasStatsDashboard?.current && moment(user.contasStatsDashboard.lastModified).isAfter(moment(user.contasStatsDashboard.current)))) {
                const hoje = moment();
                const stats = await Conta.find({ 
                    criadoPor: user._id,
                    vencimento: {
                        $gte: moment().startOf('month'),
                        $lte: moment().endOf('month')
                    }
                }, { subtotal: 1, quitado: 1, vencimento: 1, tipoEntidade: 1 });

                let contaStatsDashboard = {
                    aVencerProprio: 0,
                    pagoProprioHoje: 0,
                    pagoProprioMes: 0,
                    aVencerMes: 0,
                    pagoMes: 0,
                };

                stats.forEach(conta => {
                    if (conta.vencimento) {
                        const dataPag = moment(conta.vencimento);

                        //Pago proprio hoje
                        if (dataPag.isSame(hoje, 'day') && conta.quitado === "Sim" && conta.tipoEntidade === "propria") {
                            contaStatsDashboard.pagoProprioHoje = parseFloat((contaStatsDashboard.pagoProprioHoje + conta.subtotal).toFixed(2))
                        } //A vencer proprio
                        if (dataPag.isSameOrAfter(hoje, 'day') && conta.quitado === "Não" && conta.tipoEntidade === "propria") {
                            contaStatsDashboard.aVencerProprio = parseFloat((contaStatsDashboard.aVencerProprio + conta.subtotal).toFixed(2))
                        }
                        //Pago próprio no mês
                        if (dataPag.isSame(hoje, 'month') && conta.quitado === "Sim" && conta.tipoEntidade === "propria") {
                            contaStatsDashboard.pagoProprioMes = parseFloat((contaStatsDashboard.pagoProprioMes + conta.subtotal).toFixed(2))
                        }
                        //A vencer no mês
                        if (dataPag.isSame(hoje, 'month') && conta.quitado === "Não" && conta.tipoEntidade !== "propria") {
                            contaStatsDashboard.aVencerMes = parseFloat((contaStatsDashboard.aVencerMes + conta.subtotal).toFixed(2))
                        }
                        //Pago mês
                        if (dataPag.isSame(hoje, 'month') && conta.quitado === "Sim" && conta.tipoEntidade !== "propria") {
                            contaStatsDashboard.pagoMes = parseFloat((contaStatsDashboard.pagoMes + conta.subtotal).toFixed(2))
                        }
                    }
                });

                const varDate = new Date();

                const userStats = {
                    current: varDate,
                    stats: contaStatsDashboard,
                }

                user.contasStatsDashboard = userStats;
                
                await User.findByIdAndUpdate(user._id, user, { new: true, runValidators: true });
            }

            if ((user.caixas > 0 && (user.caixaStats?.lastModified && !user.caixaStats?.current) || !user.caixaStats?.stats) || (user.caixas && user.caixaStats?.lastModified && user.caixaStats?.current && moment(user.caixaStats.lastModified).isAfter(moment(user.caixaStats.current)))) {
                const dataTresMesesAtras = moment().subtract(3, 'months');
                const caixas = await Caixa.find({ 
                    criadoPor: user._id, 
                    feitoEm: { $gte: dataTresMesesAtras }
                });

                // Volume de vendas (últimos 3 meses)
                let volumeDeVendas = [];
                let vendas_por_mes = {};
                const dataDoisMesesAtras = moment().subtract(2, 'months');
                const startOfMonth = moment(dataDoisMesesAtras).startOf('month');

                for (let x = 0; x < 3; x++) {
                    const month = moment(startOfMonth).add(x, 'months').format('MMMM');
                    vendas_por_mes[month.toLowerCase()] = 0;
                }

                for (const caixa of caixas) {
                    const month = moment(caixa.feitoEm).format('MMMM');
                    if (vendas_por_mes[month.toLowerCase()] !== undefined) {
                        vendas_por_mes[month.toLowerCase()] += 1;
                    }
                }

                for (const [mes, quantidade] of Object.entries(vendas_por_mes)) {
                    volumeDeVendas.push({ month: mes, vendas: quantidade });
                }

                // Formas de pagamento (mês atual)
                let formasPopulares = [];
                let formasPopularesNome = { 1: {}, 2: {}, 3: {} };
                let pagamentos = {};

                for (const caixa of caixas) {
                    if (moment(caixa.feitoEm).isSame(new Date(), 'month')) {
                        if (pagamentos[caixa.pagamento]) {
                            pagamentos[caixa.pagamento] += 1;
                        } else {
                            pagamentos[caixa.pagamento] = 1;
                        }
                    }
                }

                let count = 1;
                for (const [formaPagamento, quantidade] of Object.entries(pagamentos)) {
                    formasPopulares.push({ 
                        id: count.toString(), 
                        itens: quantidade, 
                        fill: `hsl(var(--chart-${count}))` 
                    });
                    formasPopularesNome[count] = { 
                        label: formaPagamento, 
                        color: `hsl(var(--chart-${count}))` 
                    };
                    count++;
                }

                // Vendas totais por dia
                const vendasTotal = [];
                const vendasData = {};

                for (const caixa of caixas) {
                    const date = moment(caixa.feitoEm).format('YYYY-MM-DD');
                    let total = 0;

                    for (const produto of caixa.produtos) {
                        total += produto.quantidade * produto.valor;
                    }

                    if (vendasData[date]) {
                        vendasData[date] += total;
                    } else {
                        vendasData[date] = total;
                    }
                }

                for (const [data, valor] of Object.entries(vendasData)) {
                    vendasTotal.push({ date: data, desktop: valor });
                }

                vendasTotal.sort((a, b) => moment(a.date).diff(moment(b.date)));

                const varDate = new Date();
                
                const caixaStats = {
                    current: varDate,
                    stats: {
                        volumeDeVendas,
                        formasPopulares,
                        formasPopularesNome,
                        vendasTotal
                    }
                }; 

                await User.findByIdAndUpdate(
                    user._id, 
                    { $set: { caixaStats: caixaStats } },
                    { new: true, runValidators: false }
                );
            }

            if ((user.vendas > 0 && (user.vendaStatsDashboardFinal?.lastModified && !user.vendaStatsDashboardFinal?.current) || !user.vendaStatsDashboardFinal?.stats) || (user.vendas && user.vendaStatsDashboardFinal?.lastModified && user.vendaStatsDashboardFinal?.current && moment(user.vendaStatsDashboardFinal.lastModified).isAfter(moment(user.vendaStatsDashboardFinal.current)))) { //.add(3, 'minutes')
                const sixMonthsAgo = moment().subtract(6, 'months').startOf('month');
                const stats = await Venda.find(
                    { 
                        criadoPor: user._id,
                        dataPagamento: { $gte: sixMonthsAgo.toDate() }
                    },
                    { subtotal: 1, foiPago: 1, dataPagamento: 1, produto: 1 }
                );

                const hoje = moment();
                const lastSixMonths = [];
                const currentDate = new Date();

                for (let i = 0; i < 6; i++) {
                    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                    lastSixMonths.push(monthDate.toLocaleString('default', { month: 'long' }));
                }

                let vendaStatsDashboard = lastSixMonths.reduce((obj, month) => {
                    obj[month] = 0;
                    return obj;
                }, {});

                let produtoIds = [];
                stats.forEach(venda => {
                    if (venda.produto) {
                        venda.produto.forEach(p => {
                            produtoIds.push(p.id);
                        });
                    }
                });

                const produtos = await Produto.find(
                    { criadoPor: user._id, _id: { $in: produtoIds } }, 
                    { tipo: 1 }
                );

                const produtoMap = {};
                produtos.forEach(p => {
                    produtoMap[p._id.toString()] = p;
                });

                let maisVendidos = {}

                stats.forEach(venda => {
                    if (venda.dataPagamento) {
                        const dataPagamento = moment(venda.dataPagamento);
                        const dataPag = dataPagamento.clone().startOf('month');
                        const dataPagHr = dataPagamento.clone().startOf('day');
                        const nomeMes = dataPag.format('MMMM');

                        if (venda.foiPago === "Sim" && dataPag && lastSixMonths.includes(nomeMes)) {
                            vendaStatsDashboard[nomeMes] = (vendaStatsDashboard[nomeMes] || 0) + 1;
                        }

                        if (venda.foiPago === "Sim" && dataPagHr.isSame(hoje, 'month') && dataPagHr.isSame(hoje, 'year')) {
                            if (venda.produto) {
                                for (let n = 0; n < venda.produto.length; n++) {
                                    const produto = venda.produto[n];
                                    const produtoInfo = produtoMap[produto.id.toString()];
                                    if (produtoInfo) {
                                        let produtoTipo = "Desconhecido";
                                        switch (produtoInfo.tipo) {
                                            case "alimentos":
                                                produtoTipo = "Alimentos"; break;
                                            case "bebidas":
                                                produtoTipo = "Bebidas"; break;
                                            case "camamesa":
                                                produtoTipo = "Cama Mesa e Banho"; break;
                                            case "diversos":
                                                produtoTipo = "Diversos"; break;
                                            case "eletrodomesticos":
                                                produtoTipo = "Eletrodomésticos"; break;
                                            case "eletronicos":
                                                produtoTipo = "Eletrônicos"; break;
                                            case "informatica":
                                                produtoTipo = "Informática"; break;
                                            case "moveisdecoracao":
                                                produtoTipo = "Móveis e Decoração"; break;
                                        }

                                        if (!maisVendidos[produtoTipo]) maisVendidos[produtoTipo] = 0;
                                        maisVendidos[produtoTipo] += produto.quantidade;
                                    }
                                }
                            }
                        }
                    }
                });

                const vendaStatsDashboardFinal = {};
                const maisVendidosSorted = Object.entries(maisVendidos).sort(([,a],[,b]) => b-a).slice(0, 5);
                vendaStatsDashboardFinal.maisVendidos = Object.fromEntries(maisVendidosSorted);
                vendaStatsDashboardFinal.vendasMeses = vendaStatsDashboard;

                const userStats = {
                    current: new Date(),
                    stats: vendaStatsDashboardFinal
                };

                await User.findByIdAndUpdate(
                    user._id,
                    { $set: { vendaStatsDashboardFinal: userStats } },
                    { new: true, runValidators: false }
                );
            }
        }

        const timeTaken = new Date() - start;
        console.log("Done running processUserData at: ", new Date(), " - Time taken: ", timeTaken, "ms");
    } catch (error) {
        console.log(error);
    }
}

const checkUsersAccountStatus = async(type) => {
    try {
        const start = new Date();
        console.log("Running checkUsersAccountStatus at: ", start);

        const users = await User.find({ toBeDeleted: true });

        if (users?.length > 0) {
            for (const user of users) {
                const thirtyDaysAfterDeletion = moment(user.deletedAt).add(30, 'days');
                const currentDate = moment();

                if (currentDate.isAfter(thirtyDaysAfterDeletion) && type === 'daily') {
                    await User.findByIdAndDelete(user._id);
                    await Cliente.deleteMany({ criadoPor: user._id });
                    await Fornecedor.deleteMany({ criadoPor: user._id });
                    await Funcionario.deleteMany({ criadoPor: user._id });
                    await Produto.deleteMany({ criadoPor: user._id });
                    await Servico.deleteMany({ criadoPor: user._id });
                    await Venda.deleteMany({ criadoPor: user._id });
                    await Caixa.deleteMany({ criadoPor: user._id });
                    await Conta.deleteMany({ criadoPor: user._id });
                    await Ordem.deleteMany({ criadoPor: user._id });

                    console.log("Usuário de ID " + user._id + " foi deletado por requisição.");

                    await sendEmail({
                        email: user.email,
                        subject: 'Exclusão de conta.',
                        message: `Olá ${user.name}, sua conta foi excluída após os 30 dias da sua confirmação para exclusão dos dados. \n Isso significa que todos os dados que você criou foram excluídos do sistema conforme solicitado. \n Se você deseja voltar a usar a aplicação, poderá se registrar novamente com o mesmo email.`
                    });
                } else if (currentDate.isBefore(thirtyDaysAfterDeletion) && type === 'weekly') {
                    await sendEmail({
                        email: user.email,
                        subject: 'Notificação de exclusão de conta.',
                        message: `Olá ${user.name}, sua conta está marcada para ser excluída no dia ${thirtyDaysAfterDeletion.format('DD/MM/YYYY')}. Faltam ${thirtyDaysAfterDeletion.diff(currentDate, 'days')} dias para a exclusão definitiva dos seus dados. \n Isso significa que todos os dados que você criou serão excluídos do sistema conforme solicitado. \n\n Caso deseja reverter a exclusão, acesse nossa página de suporte ou tente fazer login com sua conta novamente.`
                    });
                }  
            }
        }

        const timeTaken = new Date() - start;
        console.log("Done running checkUsersAccountStatus at: ", new Date(), " - Time taken: ", timeTaken, "ms");
    } catch (error) {
        console.log(error);
    }
}

const checkUserInactivity = async(type) => {
    try {
        const start = new Date();
        console.log("Running checkUserInactivity at: ", start);

        const users = await User.find();

        for (const user of users) {
            const lastLogin = moment(user.lastLogin);
            const currentDate = moment();
            const oneYear = moment(lastLogin).add(1, 'year');
            const yearAndNinetyDays = moment(lastLogin).add(1, 'year').add(90, 'days');

            // Verifica se passou 1 ano e 90 dias desde o último login
            if (currentDate.isAfter(yearAndNinetyDays) && type === 'daily') {
                await User.findByIdAndDelete(user._id);
                await Cliente.deleteMany({ criadoPor: user._id });
                await Fornecedor.deleteMany({ criadoPor: user._id });
                await Funcionario.deleteMany({ criadoPor: user._id });
                await Produto.deleteMany({ criadoPor: user._id });
                await Servico.deleteMany({ criadoPor: user._id });
                await Venda.deleteMany({ criadoPor: user._id });
                await Caixa.deleteMany({ criadoPor: user._id });
                await Conta.deleteMany({ criadoPor: user._id });
                await Ordem.deleteMany({ criadoPor: user._id });

                console.log("Usuário de ID " + user._id + " foi deletado por inatividade.");

                return await sendEmail({
                    email: user.email,
                    subject: 'Exclusão de conta após inatividade.',
                    message: `Olá ${user.name}, após vários avisos, notamos que sua conta estava inativa há mais de 1 ano e 90 dias. Então sua conta foi deletada automaticamente e não poderá ser recuperada.`
                });
            }
            
            // Verifica se passou 1 ano desde o último login
            if (currentDate.isAfter(oneYear) && !user.lastLoginAlert && type === 'daily') {
                user.lastLoginAlert = true;
                await User.findByIdAndUpdate(user._id, user, { new: true, runValidators: true });

                await sendEmail({
                    email: user.email,
                    subject: 'Alerta de inatividade.',
                    message: `Olá ${user.name}, notamos que sua conta está inativa há mais de 1 ano. Por favor, faça login para manter sua conta ativa. \n\n Caso não faça login em 90 dias, sua conta será excluída automaticamente.`
                });
            } else if (currentDate.isAfter(oneYear) && type === 'weekly') {
                await sendEmail({
                    email: user.email,
                    subject: 'Alerta de inatividade.',
                    message: `Olá ${user.name}, notamos que sua conta está inativa há mais de 1 ano. Por favor, faça login novamente para manter sua conta ativa. \n\n Sua conta será excluída em ${moment(yearAndNinetyDays).diff(currentDate, 'days')} dias caso não faça login novamente.`
                });
            }
        }

        const timeTaken = new Date() - start;
        console.log("Done running checkUserInactivity at: ", new Date(), " - Time taken: ", timeTaken, "ms");
    } catch (error) {
        console.log(error);
    }
}

// 0 0 * * * -> Roda à meia noite
cron.schedule("0 0 * * *", async () => {
    await processUserData();
});

// 0 3 * * * -> Roda às 3 da manhã
cron.schedule("0 3 * * *", async () => {
    await checkUsersAccountStatus('daily');
});

// 0 4 * * * -> Roda às 4 da manhã
cron.schedule("0 4 * * *", async () => {
    await checkUserInactivity('daily');
});

// 0 0 * * 0 -> Roda a meia noite de domingo
cron.schedule("0 0 * * 0", async () => {
    await checkUsersAccountStatus('weekly');
    await checkUserInactivity('weekly');
});