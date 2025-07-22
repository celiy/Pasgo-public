const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const CustomError = require('./utils/CustomError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
//middlewares para segurança
//helmet: headers de segurança
//sanitize: sanitizar codigo que pode ser lido pelo mongo 
//xss: injeção de codigo html/js
//hpp: limpa a poluição de parametros, ex: sort=price&sort=name -> sort=price,name
const helmet = require('helmet');
const sanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require("cookie-parser");
const globalLogger = require('./utils/globalLogger');
const timeLogger = require('./utils/timeLogger');

//routes
const authRoute = require('./routes/authRouter'); //route para autenticação de usuario
const userRoute = require('./routes/userRoute');
const cadastrosRoute = require('./routes/cadastrosRoute');
const produtosRoute = require('./routes/produtosRoute');
const servicoseorcamentosRoute = require('./routes/servicoseorcamentosRoute');
const vendasRoute = require('./routes/vendasRoute');
const financeiroRoute = require('./routes/financeiroRoute');
const mockRoute = require('./routes/mockRoute');
const adminRoute = require('./routes/adminRouter');
const relatoriosRoute = require('./routes/relatoriosRouter');
const moment = require('moment');

//Rodar schedules
require('./utils/schedules');

let app = express();

app.set('trust proxy', 1);
app.get('/ip', (request, response) => response.send(request.ip));

app.use(helmet());
app.use(cookieParser());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
    
} else if (process.env.NODE_ENV === 'production') {
    const limiter = rateLimit({
        max: 2000,
        windowMs: 30 * 60 * 1000,
        message: 'Você fez muitas requisições ao servidor. Por favor, tente novamente mais tarde.'
    });

    const loginLimiter = rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hora
        max: 12,
        message: 'Você realizou o login muitas vezes. Por favor tente novamente mais tarde.'
    });

    const adminLoginLimiter = rateLimit({
        windowMs: 24 * 60 * 60 * 1000, // 1 day
        max: 3,
        message: 'Você realizou o login muitas vezes. Por favor tente novamente mais tarde.'
    });

    app.use('/api/v1/auth/login', loginLimiter);
    app.use('/api/v1/admin/login', adminLoginLimiter);
    app.use('/api', limiter);
}

//limita algo enviado pelo usuario para 10kb 
app.use(express.json({limit: '10kb'}));

app.use(sanitize());
app.use(xss());

//caso algum paramentro seja inserido tipo ?duration=103, se este paramentro estiver aqui {whitelist: ['duration']}
//ele irá mostrar multiplos resultados, caso não, irá mostrar apenas um
// app.use(hpp({whitelist: ['duration', 'ratings']}));

let corsOptions ={
    origin: ['http://localhost:5172', 'http://localhost:5173', 'http://localhost:5174'], 
    credentials:true
}

if(process.env.NODE_ENV === 'production'){
    corsOptions = {
        origin: [
            'https://pasgo.com.br', 
            'http://100.98.70.86:8080'
        ],
        credentials: true
    }
}

app.use(cors(corsOptions));

//Middleware global para debug
app.use((req, res, next) => {
  const start = process.hrtime();

  if (req.url.includes("admin")) return next();
  if (req.url.includes("check-login")) return next();

  res.on("finish", () => {
    const duration = process.hrtime(start);
    const durationInMs = (duration[0] * 1000 + duration[1] / 1e6).toFixed(2);
    const user = req.user ? `| By: ${req.user._id} - ${req.user.name}` : "";
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const currentDate = moment(new Date()).format('DD/MM/YYYY | HH:mm:ss');

    globalLogger.info(`[${currentDate}] ${req.method} ${req.url} ${res.statusCode} - ${durationInMs} ms ${user} | ${ip}`);
    timeLogger.time(`[${currentDate}] ${req.method} ${req.url} - @${durationInMs}`);
  });

  next();
});

//Isto é usado para retornar a data atual dentro de uma API. Para pegar a data,
//apenas use 'request.requestedAt'
app.use((request, responde, next) => {             
    request.requestedAt = new Date().toISOString();
    next();
}); 

//Isto faz com que os arquivos dentro da pasta 'public' possam ser acessados pelo URL
//ou por outros arquivos tipo um HTML que requisita um CSS ou JS
app.use(express.static('./public'));    

// Servir arquivos estáticos da pasta data
app.use('/data', express.static('./data'));

app.use('/api/v1/cadastros', cadastrosRoute);
app.use('/api/v1/produtos', produtosRoute);
app.use('/api/v1/servicos-orcamentos', servicoseorcamentosRoute);
app.use('/api/v1/vendas', vendasRoute);
app.use('/api/v1/financeiro', financeiroRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/mock', mockRoute);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/relatorios', relatoriosRoute);

//Routing para uma pagina que não existe,
//executa este routing caso o url inserido não exista
app.all('*', (request, response, next) => {
    const err = new CustomError('Page not found: 404. You are in: '+request.url, 404);
    next(err);
});

//middleware para handling de erros globais no projeto
app.use(globalErrorHandler);

//exporta o objeto do app para o server.js
module.exports = app;