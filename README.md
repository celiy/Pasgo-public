
![Logo](https://i.imgur.com/1w9uKql.png)
---

# Pasgo

Pasgo é uma aplicação web para gerenciamento de micro e pequenas empresas. Tem como o objetivo de ser uma alternativa para outras aplicações da área de programas para gestão de empresas (ERP).

[**Site oficial do Pasgo**](https://pasgo.com.br) [(https://pasgo.com.br](https://pasgo.com.br))


## Funcionalidades

- Dashboard;
- Cadastros de clientes, fornecedores e funcionários;
- Gerenciamento de estoque;
- Gerenciamento de serviços, ordens de serviços e orçamentos;
- Gerenciamento de vendas, caixa e fluxo de caixa;
- Gerenciamento financeiro de contas;
- Relatórios de vendas e contas;
- Páginas para suporte ao usuário;
- UI moderna e iterativa;
- Temas escuro e claro;
- Painel Admin com gerenciamento completo do sistema, acesso a logs, uso de rotas e monitoramento do funcionamento do sistema.


## Screenshots

![Homepage](https://i.imgur.com/SgqzC0F.png)
####
![Dashboard](https://i.imgur.com/umGyGVK.png)
####
![Sales](https://i.imgur.com/eyBKZtx.png)
####
![Creating a sale](https://i.imgur.com/mlc5yDt.png)


## Rodando localmente

**Requisitos:**
- NodeJS 20 ou superior
- MongoDB community 8.0.11
- Sistema operacional Windows 10 / 11 ou Linux *(Refêrencia: Ubuntu 22)*
- Opicional: Docker

**Instalação:**

1. Na pasta do projeto:

#### Para o front-end
```bash
cd client
npm install
```

#### Para o back-end
```bash
cd server
npm install
```

#### Para o painel admin (opicional)
```bash
cd admin
npm install
```
####

2. Crie os arquivos ```.env``` para o **client** e **server:**

#### .env do client
Variáveis de ambiente para serem preenchidas:

`VITE_REACT_APP_SITE_KEY`

#### Segue abaixo de como preencher elas corretamente:

Para o ```.env``` do client, você deverá criar uma chave para o site com o reCAPTCHA V2 do Google (Isso é apenas necessário se você desejar criar uma conta nova, se o data mock existir, então não é necessário fazer esse passo para utilizar as funcionalidades).

Guia para começar: https://developers-google-com.translate.goog/recaptcha/intro?_x_tr_sl=en&_x_tr_tl=pt&_x_tr_hl=pt&_x_tr_pto=tc

Na hora de inserir um site para o reCAPTCHA V2, certifique que está fazendo para um site que roda localmente, no caso o front-end roda localmente no IP com porta de: ```127.0.0.1:5173```.

Esta chave de site deve ser inserida no campo ```VITE_REACT_APP_SITE_KEY```

**.env finalizado:**
```
VITE_REACT_APP_SITE_KEY='APP_SITE_KEY DO GOOGLE RECAPTCHA V2 AQUI'
VITE_BACKEND_BASE_URL='http://localhost:3000'
```
---
#### .env do server
Variáveis de ambiente para serem preenchidas:

`SITE_SECRET`

`EMAIL_PASSWORD`

`EMAIL_USER`

`DB_PASSWORD`

`SECRET_STRING`

#### Segue abaixo de como preencher elas corretamente:

Para o ```.env``` do server, você deverá criar uma chave secreta de site para o reCAPTCHA V2 do Google (Isso é apenas necessário se você desejar criar uma conta nova, se o data mock existir, então não é necessário fazer esse passo para utilizar as funcionalidades). E também um Email da Google para confirmação de conta por Email.

Guia para começar com o reCAPTCHA: https://developers-google-com.translate.goog/recaptcha/intro?_x_tr_sl=en&_x_tr_tl=pt&_x_tr_hl=pt&_x_tr_pto=tc

Na hora de inserir um site para o reCAPTCHA V2, certifique que está fazendo para um site que roda localmente, no caso o front-end roda localmente no IP com porta de: ```127.0.0.1:5173```.

Esta chave secreta de site deve ser inserida no campo ```SITE_SECRET```

---
####

Guia para pegar seu Email e senha para ser usado com o Nodemailer: https://www.youtube.com/watch?v=cqdAS49RthQ

Nesta guia a parte importante está em **0:50**, que é ensinado como gerar sua senha que será usado pelo o Nodemailer.

Esta senha gerada deve ser inserida no ```EMAIL_PASSWORD```

O Email usado para gerar esta senha será inserido no ```EMAIL_USER```

---
####

Você deverá criar uma senha para poder acessar o MongoDB (Caso tenha colocado alguma senha no MongoDB).

Neste caso o projeto usa DirectJs para se conectar, então essa parte não é necessária.

Sua senha para o MongoDB deve ser inserida no ```DB_PASSWORD```

---
####

Você deverá criar uma string secreta para encripitação.

Insira sua string secreta no ```SECRET_STRING```

**.env finalizado:**
```
NODE_ENV=development
PORT=3000
CONN_STR=mongodb://127.0.0.1:27017/pasgo
DB_USER=direct_js
DB_PASSWORD=SUA SENHA AQUI
SECRET_STRING=SUA SECRET STRING AQUI
LOGIN_EXPIRES=2592000000
EMAIL_USER=SEU EMAIL USER AQUI
EMAIL_PASSWORD=SEU EMAIL PASSWORD AQUI
SITE_SECRET=SEU SITE_SECRET AQUI

ADMIN_LOGIN='admin'
ADMIN_PASSWORD='admin'

CREATE_MOCK=true
```
####

3. Instale MongoDB community e rode-o localmente.

Como rodar MongoDB no Docker: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-community-with-docker/

**Se certifique que o MongoDB está rodando localmente com o IP e porta de:** ```mongodb://127.0.0.1:27017``` 

####

4. Rodando o projeto.

####

Na pasta do projeto:


#### Para o front-end
```bash
cd client
npm run dev
```

O terminal após rodar esse comando irá lhe fornecer o local que o site está sendo hospedado (Neste caso ele irá rodar em `127.0.0.1:5173`).

#### Para o back-end
```bash
cd server
npm run dev
```

#### Para o painel admin (opicional)
```bash
cd admin
npm run dev
```

O terminal após rodar esse comando irá lhe fornecer o local que o site está sendo hospedado (Neste caso ele irá rodar em `127.0.0.1:5174` ou `127.0.0.1:5172`).

####

5. Rodar o mock (Opicional).

####

O mock pode ser usado para gerar dados mock para facilitar no desenvolvimento e ter um exemplo de como seria uma conta com informações já preenchidas.

Para isso você deve acessar a rota http://localhost:3000/api/v1/mock/create do back-end. A maneira mais fácil de fazer isto é rodando o painel admin como instruido a cima, acessando-o e inserindo as credenciais de login que estão nos campos `ADMIN_LOGIN` e `ADMIN_PASSWORD` situadas no `.env` do back-end.

Após isso basta usar a nav-bar da esquerda e acessar o "Use route". Dentro dele, para criar o mock usando a roda do backend end, basta selecionar o metódo POST, inserir a rota `mock/create` e clicar "Aplicar". Após alguns segundos ou minutos dependendo do seu computador, o mock irá ser criado com sucesso.

*Nota: Você não precisa inserir uma senha para fazer login caso esteja com o campo `CREATE_MOCK` no `.env` do server como `=true`. Pois você pode usar uma conta gerada pelo o mock para poder acessar a aplicação.*
## Contribuindo

Contribuições são sempre bem-vindas!

No momento não existe nenhuma regra de contribuição, mas até lá, você é livre para contribuir do jeito que quiser.


## Stack utilizada

**Front-end:** React, Vue, TailwindCSS

**Back-end:** NodeJS, Express, Mongoose

**Banco de dados:** MongoDB com Docker


## Feedback

Caso tenha algum feedback, por favor me contate por este endereço de email: sasbrazilian@gmail.com


## Autores

- [@celiy](https://github.com/celiy) Programação / Design / UI / UX / Imagens / Repositório
- [@Leon (Matt DF)](https://github.com/Mdf-leon) Deploy da aplicação
- [@Zuza](https://github.com/Zuzawerewolf/) Deploy da aplicação / Assistência com as funcionalidades
- [@Rafael](https://github.com/rafascripts)  Assistência com a estruturação do código e otimizações


## Licença

[MIT](https://choosealicense.com/licenses/mit/)

