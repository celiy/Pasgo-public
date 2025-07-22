const mongoose = require('mongoose');
//objeto do schema e model para inserir itens da database
const Cliente = require('../models/clientesModel');
const Funcionario = require('../models/funcionariosModel');
const Fornecedor = require('../models/fornecedoresModel');
const Produto = require('../models/produtosModel');
const Venda = require('../models/vendasModel');
const Conta = require('../models/contasModel');
const Caixa = require('../models/caixaModel');
const Servico = require('../models/servicosModel');
const User = require('../models/userModel');
//Features reusaveis
const ApiFeatures = require('../utils/ApiFeatures');
//Middleware para router ('/highest-rated') que retorna os filmes com maior ratings
//Ele só modifica o query antes do getAllMovies

const CustomError = require('../utils/CustomError');

//Função que quando dada uma função de um controller, pega o erro da função, sem o uso de try catch dentro
//para usar o handling de erros globais
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const moment = require('moment');
moment.locale('pt-br');

const names = ['Diogo', 'Fernando', 'Guilherme', 'Abel', 'Ademir', 'Adriana', 'Alana', 'Alessandra', 'Alex', 'Alexandre', 'Aline', 'Alisson', 'Ana', 'Andre', 'Andrea', 'Andressa', 'Andresson', 'Angela', 'Antonio', 'Ariana', 'Ariel', 'Arthur', 'Beatriz', 'Bianca', 'Bruna', 'Bruno', 'Camila', 'Carla', 'Carlos', 'Cassiano', 'Caua', 'Cecilia', 'Celso', 'Cesar', 'Charles', 'Cristiano', 'Cristina', 'Dafne', 'Danilo', 'Daniela', 'Davi', 'Deborah', 'Denise', 'Diana', 'Dilson', 'Douglas', 'Eduardo', 'Eliana', 'Elis', 'Elizabete', 'Eloisa', 'Enzo', 'Eric', 'Erika', 'Evandro', 'Fagner', 'Fabiana', 'Fabio', 'Felipe', 'Fernanda', 'Filipe', 'Flavio', 'Gabriel', 'Gabriela', 'Geraldo', 'Gerson', 'Giovana', 'Gisele', 'Glaucia', 'Gloria', 'Graciela', 'Guilherme', 'Gustavo', 'Helena', 'Henrique', 'Hugo', 'Igor', 'Ingrid', 'Ione', 'Ivan', 'Ivana', 'Ivete', 'Ivo', 'Ivone', 'Jacqueline', 'Jairo', 'Janaina', 'Janete', 'Jeferson', 'Jenifer', 'Jessica', 'Joana', 'Joao', 'Jonas', 'Jorge', 'Jose', 'Julia', 'Juliana', 'Juliano', 'Julio', 'Karina', 'Katherine', 'Kelvin', 'Keyla', 'Larissa', 'Lauro', 'Leticia',]
const surnames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson", "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes", "Price", "Alvarez", "Castillo", "Sanders", "Patel"];
const complementos = ["Casa", "Apartamento", "Mansão", "Hotel"];
const cities = ["New York", "Tokyo", "London", "Paris", "São Paulo", "Mumbai", "Berlin", "Sydney", "Toronto", "Cairo", "Moscow", "Madrid", "Rio de Janeiro", "Amsterdam", "Singapore", "Mexico City", "Bangkok", "Seoul", "Dubai", "Vancouver"];
const neighborhoods = ["Manhattan", "Brooklyn", "Copacabana", "Shibuya", "Notting Hill", "Le Marais", "Vila Madalena", "Bandra", "Kreuzberg", "Bondi", "Kensington", "Zamalek"];
const tipos = ["alimentos", "bebidas", "camamesa", "diversos", "eletronicos", "informatica"];
const cores = ["Vermelho", "Azul", "Amarelo"];
const pagamentos = ["dinheiro", "debito", "credito"];

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateRandomDate() {
    const now = moment();
    const eightMonthsAgo = moment().subtract(8, 'months');
    const differenceMs = now.valueOf() - eightMonthsAgo.valueOf();
    const randomMs = Math.floor(Math.random() * differenceMs);
    const randomDate = moment(eightMonthsAgo).add(randomMs, 'milliseconds');
    return randomDate.toDate();
}

exports.generateMock = asyncErrorHandler(async (request, response, next) => {
    if (process.env.CREATE_MOCK === "false") {
        return next(new CustomError('Não autorizado', 401));
    }

    //Gerar usuários (300)
    let users = [];
    for (let i = 0; i < 300; i++) {
        const firstName = getRandomItem(names);
        const lastName = getRandomItem(surnames);
        const email = `${firstName}.${lastName}@gmail.com`;
        const existingUser = users.find(user => user.email === email);
        const cpf = Math.floor(Math.random() * 90000000000 + 10000000000).toString();
        if (!existingUser) {
            users.push({
                name: `${firstName} ${lastName} PASGODATAMOCK`,
                email: email,
                password: '12345678',
                confirmPassword: '12345678',
                document: cpf,
                clientes: 50,
                fornecedores: 15,
                funcionarios: 10,
                produtos: 200,
                servicos: 60,
                vendas: 80,
                caixas: 200,
                contas: 30,
            });
        }
    }
    const createdUsers = await User.insertMany(users, { ordered: false });
    usersIds = createdUsers.map(user => user._id);

    for (const id of usersIds) {
        //Criar os clientes (50)
        const clientes = [];
        for (let c = 0; c < 50; c++) {
            const firstName = getRandomItem(names);
            const lastName = getRandomItem(surnames);
            const cliente = {
                tipo: "FISICA",
                nome: `${firstName} ${lastName} PASGODATAMOCK`,
                email: `${firstName}.${lastName}@gmail.com`,
                cel: Math.floor(Math.random() * 90000000 + 10000000).toString(),
                cpf: Math.floor(Math.random() * 90000000000 + 10000000000).toString(),
                rg: Math.floor(Math.random() * 90000000000 + 10000000000).toString(),
                cep: Math.floor(Math.random() * 90000000 + 10000000).toString(),
                numero: Math.floor(Math.random() * 900 + 100).toString(),
                complemento: complementos[Math.floor(Math.random() * complementos.length)],
                bairro: neighborhoods[Math.floor(Math.random() * neighborhoods.length)],
                cidade: cities[Math.floor(Math.random() * cities.length)],
                observacao: "MOCK Observacao MOCK Observacao MOCK Observacao MOCKMOCK Observacao MOCK Observacao MOCK Observacao MOCK",
                criadoPor: id
            };
            clientes.push(cliente);
        }
        const clienteFora = await Cliente.insertMany(clientes);
        ////

        //Criar os fornecedores (15)
        let fornecedores = [];
        for (let fo = 0; fo < 15; fo++) {
            const firstName = getRandomItem(names);
            const lastName = getRandomItem(surnames);
            const fornecedor = {
                tipo: "FISICA",
                nome: `${firstName} ${lastName} PASGODATAMOCK`,
                email: `${firstName}.${lastName}@gmail.com`,
                cel: Math.floor(Math.random() * 90000000 + 10000000).toString(),
                cpf: Math.floor(Math.random() * 90000000000 + 10000000000).toString(),
                rg: Math.floor(Math.random() * 90000000000 + 10000000000).toString(),
                cep: Math.floor(Math.random() * 90000000 + 10000000).toString(),
                numero: Math.floor(Math.random() * 900 + 100).toString(),
                complemento: complementos[Math.floor(Math.random() * complementos.length)],
                bairro: neighborhoods[Math.floor(Math.random() * neighborhoods.length)],
                cidade: cities[Math.floor(Math.random() * cities.length)],
                observacao: "MOCK Observacao MOCK Observacao MOCK Observacao MOCK MOCK Observacao MOCK Observacao MOCK Observacao MOCK",
                criadoPor: id
            };
            fornecedores.push(fornecedor);
        }
        const fornecedorFora = await Fornecedor.insertMany(fornecedores);
        ////

        //Criar funcionarios para o usuario (10)
        let funcionarios = [];
        for (let f = 0; f < 10; f++) {
            const firstName = getRandomItem(names);
            const lastName = getRandomItem(surnames);
            const funcionario = {
                nome: `${firstName} ${lastName} PASGODATAMOCK`,
                email: `${firstName}.${lastName}@gmail.com`,
                cel: Math.floor(Math.random() * 90000000 + 10000000).toString(),
                cpf: Math.floor(Math.random() * 90000000000 + 10000000000).toString(),
                rg: Math.floor(Math.random() * 90000000000 + 10000000000).toString(),
                salario: Math.floor(Math.random() * 900 + 100).toString(),
                cep: Math.floor(Math.random() * 90000000 + 10000000).toString(),
                numero: Math.floor(Math.random() * 900 + 100).toString(),
                complemento: complementos[Math.floor(Math.random() * complementos.length)],
                bairro: neighborhoods[Math.floor(Math.random() * neighborhoods.length)],
                cidade: cities[Math.floor(Math.random() * cities.length)],
                observacao: "MOCK Observacao MOCK Observacao MOCK Observacao MOCK MOCK Observacao MOCK Observacao MOCK Observacao MOCK",
                criadoPor: id
            };
            funcionarios.push(funcionario);
        }
        const funcionarioFora = await Funcionario.insertMany(funcionarios);
        ////

        //Criar os produtos (200)
        let produtos = [];
        for (let p = 0; p < 200; p++) {
            const randomFornecedor = getRandomItem(fornecedorFora);
            const firstName = getRandomItem(names);
            const produto = {
                codigo: Math.floor(Math.random() * 90000000 + 10000000).toString(),
                tipo: tipos[Math.floor(Math.random() * tipos.length)],
                nome: "PRODUTO " + firstName + " PASGODATAMOCK",
                cor: cores[Math.floor(Math.random() * cores.length)],
                genero: "GENERO F OU M",
                tamanho: "TAMANHO MOCK GERADO AUTO MOCK",
                valor: Math.floor(Math.random() * 900 + 100).toString(),
                quantidade: Math.floor(Math.random() * 900 + 100).toString(),
                fornecedor: { id: randomFornecedor._id, nome: randomFornecedor.nome },
                descricao: "MOCK Observacao MOCK Observacao MOCK Observacao MOCK MOCK Observacao MOCK Observacao MOCK Observacao MOCK",
                criadoPor: id
            };
            produtos.push(produto);
        }
        const produtoFora = await Produto.insertMany(produtos);
        ////

        //Criar os serviços (60)
        let servicos = [];
        for (let s = 0; s < 60; s++) {
            const firstName = getRandomItem(names);
            const servico = {
                nome: "SERVICO " + firstName + " PASGODATAMOCK",
                custo: Math.floor(Math.random() * 900 + 100).toString(),
                venda: Math.floor(Math.random() * 900 + 100).toString(),
                comissao: Math.floor(Math.random() * 90 + 10).toString(),
                descricao: "MOCK Observacao MOCK Observacao MOCK Observacao MOCK MOCK Observacao MOCK Observacao MOCK Observacao MOCK",
                criadoPor: id
            };
            servicos.push(servico);
        }
        const servicoFora = await Servico.insertMany(servicos);
        ////

        //Criar vendas (80)
        let vendas = [];
        for (let v = 0; v < 80; v++) {
            const randomCliente = getRandomItem(clienteFora);
            const randomFuncionario = getRandomItem(funcionarioFora);
            const randomProdutos = [];
            const randomServicos = [];
            for (let i = 0; i < 10; i++) {
                const prod = getRandomItem(produtoFora);
                const serv = getRandomItem(servicoFora);
                randomProdutos.push({ id: prod._id, nome: prod.nome, quantidade: Math.floor(Math.random() * 900 + 100).toString(), valor: prod.valor, total: Math.floor(Math.random() * 900 + 100).toString() });
                randomServicos.push({ id: serv._id, nome: serv.nome, quantidade: Math.floor(Math.random() * 900 + 100).toString(), venda: serv.venda, total: Math.floor(Math.random() * 900 + 100).toString() });
            }
            const venda = {
                cliente: { id: randomCliente._id, nome: randomCliente.nome },
                produto: randomProdutos,
                servico: randomServicos,
                funcionario: { id: randomFuncionario._id, nome: randomFuncionario.nome },
                desconto: Math.floor(Math.random() * 90 + 10).toString(),
                subtotal: Math.floor(Math.random() * 900 + 100).toString(),
                tipoPagamento: "Dinheiro",
                foiPago: Math.random() < 0.5 ? "Sim" : "Não",
                dataPagamento: generateRandomDate(),
                entregadora: "ENTREGADORA",
                cep: Math.floor(Math.random() * 90000000 + 10000000).toString(),
                numero: Math.floor(Math.random() * 900 + 100).toString(),
                complemento: complementos[Math.floor(Math.random() * complementos.length)],
                bairro: neighborhoods[Math.floor(Math.random() * neighborhoods.length)],
                cidade: cities[Math.floor(Math.random() * cities.length)],
                descricao: "PASGODATAMOCK MOCK Observacao MOCK Observacao MOCK MOCK Observacao MOCK Observacao MOCK Observacao MOCK",
                criadoPor: id
            };
            vendas.push(venda);
        }
        await Venda.insertMany(vendas);
        ////

        //Criar vendas do caixa (200)
        const caixas = [];
        for (let v = 0; v < 200; v++) {
            const randomProdutos = [];
            for (let i = 0; i < 10; i++) {
                const prod = getRandomItem(produtoFora);
                randomProdutos.push({ codigo: prod.codigo, nome: prod.nome, quantidade: Math.floor(Math.random() * 900 + 100).toString(), valor: prod.valor });
            }
            const caixa = {
                produtos: randomProdutos,
                pagamento: getRandomItem(pagamentos) + " PASGODATAMOCK",
                feitoEm: generateRandomDate(),
                criadoPor: id
            };
            caixas.push(caixa);
        }
        await Caixa.insertMany(caixas);
        ////

        //Criar contas (30)
        const contas = [];
        for (let v = 0; v < 30; v++) {
            const firstName = getRandomItem(names);
            const randomCliente = getRandomItem(clienteFora);
            const conta = {
                nome: "CONTA " + firstName + " PASGODATAMOCK",
                tipoEntidade: "cliente",
                entidade: { id: randomCliente._id, nome: randomCliente.nome },
                desconto: Math.floor(Math.random() * 90 + 10).toString(),
                custo: Math.floor(Math.random() * 900 + 100).toString(),
                juros: Math.floor(Math.random() * 90 + 10).toString(),
                desconto: Math.floor(Math.random() * 90 + 10).toString(),
                subtotal: Math.floor(Math.random() * 900 + 100).toString(),
                pagamento: "Dinheiro",
                quitado: Math.random() < 0.5 ? "Sim" : "Não",
                vencimento: generateRandomDate(),
                descricao: "MOCK Observacao MOCK Observacao MOCK Observacao MOCK MOCK Observacao MOCK Observacao MOCK Observacao MOCK",
                criadoPor: id
            };
            contas.push(conta);
        }
        await Conta.insertMany(contas);
        ////
    }

    response.status(200).json({
        status: 'success',
    });
});

exports.deleteMock = asyncErrorHandler(async (request, response, next) => {
    if (process.env.CREATE_MOCK === "false") {
        return next(new CustomError('Não autorizado', 401));
    }

    await User.deleteMany({ name: /PASGODATAMOCK/ });
    await Cliente.deleteMany({ nome: /PASGODATAMOCK/ });
    await Fornecedor.deleteMany({ nome: /PASGODATAMOCK/ });
    await Funcionario.deleteMany({ nome: /PASGODATAMOCK/ });
    await Produto.deleteMany({ nome: /PASGODATAMOCK/ });
    await Servico.deleteMany({ nome: /PASGODATAMOCK/ });
    await Venda.deleteMany({ descricao: /PASGODATAMOCK/ });
    await Caixa.deleteMany({ pagamento: /PASGODATAMOCK/ });
    await Conta.deleteMany({ nome: /PASGODATAMOCK/ });

    response.status(200).json({
        status: 'success',
    });
});