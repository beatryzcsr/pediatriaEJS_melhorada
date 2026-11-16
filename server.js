// Importa o Express, usado para criar o servidor e organizar as rotas.
import express from 'express';
 
// Importa o express-session, que mantém o usuário conectado entre páginas.
import session from 'express-session';
 
// Importa os arquivos que contêm as rotas de cada parte do sistema.
import loginRoutes from './routes/login.js';
import gruposRoutes from './routes/grupos.js';
import clientesRoutes from './routes/clientes.js';
 
// Cria a aplicação do servidor.
const app = express();
 
// Define que as páginas serão montadas usando arquivos EJS.
app.set('view engine', 'ejs');
 
// Permite que o servidor receba os dados enviados pelos formulários HTML.
app.use(express.urlencoded({ extended: true }));
 
// Permite acessar arquivos estáticos, como o CSS, que ficam na pasta public.
app.use(express.static('public'));
 
// Configura as sessões usadas para identificar quem está conectado.
app.use(session({
    // Chave usada para proteger a sessão. Em um projeto real, use uma chave secreta.
    secret: 'clinica123',
    // Não salva novamente a sessão se nada mudou.
    resave: false,
    // Não cria uma sessão vazia antes de o usuário fazer algo.
    saveUninitialized: false
}));
 
// Quando alguém acessar a página inicial, envia para o login.
app.get('/', (req, res) => {
    res.redirect('/login');
});
 
// Registra as rotas de login
app.use('/', loginRoutes);
 
// Todas as rotas de grupos começam com /grupos.
app.use('/grupos', gruposRoutes);
 
// Todas as rotas de clientes começam com /clientes.
app.use('/clientes', clientesRoutes);
 
// Inicia o servidor na porta 3000.
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
