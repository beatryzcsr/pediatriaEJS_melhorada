# Clínica Pequenos Passos

## 1. Descrição

Sistema de gerenciamento de clientes e convênios da Clínica Pequenos Passos, desenvolvido utilizando Node.js, Express, EJS e PostgreSQL.

## 2. Funcionalidades

- Login e autenticação de usuários.
- Cadastro de clientes.
- Consulta e pesquisa de clientes.
- Edição e exclusão de clientes.
- Cadastro de convênios.
- Consulta, edição e exclusão de convênios.
- Associação de clientes aos convênios cadastrados.

## 3. Tecnologias utilizadas

- Node.js
- Express
- EJS
- PostgreSQL
- pg
- bcrypt
- express-session
- HTML e CSS

## 4. Organização dos arquivos

- `server.js`: inicialização do servidor.
- `config/db.js`: conexão com o banco de dados.
- `middleware/auth.js`: autenticação.
- `routes/`: rotas de login, clientes e convênios.
- `views/`: páginas e formulários do sistema.
- `public/style.css`: estilos visuais.
- `criar-usuario.js`: criação do usuário inicial.

## 5. Como executar

1. Instalar as dependências:

   `npm install express ejs pg bcrypt express-session`

2. Configurar o acesso ao PostgreSQL no arquivo `config/db.js`, informando o nome do banco, usuário e senha.

3. Criar as tabelas necessárias no banco de dados.

4. Executar o arquivo de criação do usuário inicial:

   `node criar-usuario.js`

5. Iniciar o servidor:

   `npm start`

6. Acessar o sistema pelo navegador:

   `http://localhost:3000/login`

## 6. Banco de dados

O sistema utiliza PostgreSQL para armazenar os dados dos usuários, clientes e convênios.

As tabelas principais são:

- `usuarios`
- `clientes`
- `convenio`
