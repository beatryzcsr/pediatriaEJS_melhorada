// Importa o Express para criar as rotas de clientes.
import express from 'express';
 
// Importa a conexão com o banco de dados.
import db from '../config/db.js';
 
// Importa o middleware que exige login.
import auth from '../middleware/auth.js';
 
// Cria o roteador das rotas de clientes.
const router = express.Router();
 
// GET /clientes: lista os clientes e permite pesquisar pelo nome.
router.get('/', auth, async (req, res) => {
    try {
        // Pega o termo de busca da URL. Se não houver termo, usa texto vazio.
        const busca = req.query.busca || '';
 
        // Busca os clientes e junta cada cliente à sua categoria de grupo.
        const resultado = await db.query(`
            SELECT clientes.*, convenio.categorias
            FROM clientes
            LEFT JOIN convenio
                ON clientes.grupo_id = convenio.id_grupo
            WHERE clientes.nome ILIKE $1
            ORDER BY clientes.nome
        `, [`%${busca}%`]);
 
        // Envia a lista e o termo pesquisado para a página EJS.
        res.render('clientes', {
            clientes: resultado.rows,
            busca
        });
    } catch (erro) {
        console.error('Erro ao listar clientes:', erro);
        res.status(500).send('Erro ao carregar os clientes.');
    }
});
 
// GET /clientes/novo: abre o formulário de cadastro de cliente.
router.get('/novo', auth, async (req, res) => {
    try {
        // Busca os grupos para preencher o menu suspenso do formulário.
        const resultadoGrupos = await db.query(
            'SELECT * FROM convenio ORDER BY categorias'
        );
 
        // Abre o formulário sem cliente selecionado.
        res.render('formulario-cliente', {
            cliente: null,
            grupos: resultadoGrupos.rows
        });
    } catch (erro) {
        console.error('Erro ao carregar formulário:', erro);
        res.status(500).send('Erro ao carregar o formulário.');
    }
});
 
// POST /clientes/salvar: cadastra um novo cliente.
router.post('/salvar', auth, async (req, res) => {
    try {
        // Pega os dados preenchidos no formulário.
        const { CPF, nome, email, telefone, grupo_id } = req.body;
 
        // Insere o cliente. No PostgreSQL, CPF sem aspas foi convertido para cpf.
        await db.query(`
            INSERT INTO clientes (cpf, nome, email, telefone, grupo_id)
            VALUES ($1, $2, $3, $4, $5)
        `, [CPF, nome, email, telefone, grupo_id]);
 
        // Volta para a listagem de clientes.
        res.redirect('/clientes');
    } catch (erro) {
        console.error('Erro ao cadastrar cliente:', erro);
        res.status(500).send('Erro ao cadastrar cliente. Verifique se o CPF já está cadastrado.');
    }
});
 
// GET /clientes/editar/:cpf: busca o cliente e os grupos para editar.
router.get('/editar/:cpf', auth, async (req, res) => {
    try {
        // Busca o cliente pelo CPF recebido na URL.
        const resultadoCliente = await db.query(
            'SELECT * FROM clientes WHERE cpf = $1',
            [req.params.cpf]
        );
 
        // Verifica se o cliente foi encontrado.
        if (resultadoCliente.rows.length === 0) {
            return res.status(404).send('Cliente não encontrado.');
        }
 
        // Busca os grupos para montar o menu suspenso.
        const resultadoGrupos = await db.query(
            'SELECT * FROM convenio ORDER BY categorias'
        );
 
        // Abre o formulário preenchido com o cliente e a lista de grupos.
        res.render('formulario-cliente', {
            cliente: resultadoCliente.rows[0],
            grupos: resultadoGrupos.rows
        });
    } catch (erro) {
        console.error('Erro ao buscar cliente:', erro);
        res.status(500).send('Erro ao buscar cliente.');
    }
});
 
// POST /clientes/editar/:cpf: atualiza os dados de um cliente.
router.post('/editar/:cpf', auth, async (req, res) => {
    try {
        // Pega os campos que podem ser alterados.
        const { nome, email, telefone, grupo_id } = req.body;
 
        // Atualiza o cliente identificado pelo CPF que veio na URL.
        await db.query(`
            UPDATE clientes
            SET nome = $1, email = $2, telefone = $3, grupo_id = $4
            WHERE cpf = $5
        `, [nome, email, telefone, grupo_id, req.params.cpf]);
 
        // Volta para a listagem.
        res.redirect('/clientes');
    } catch (erro) {
        console.error('Erro ao editar cliente:', erro);
        res.status(500).send('Erro ao editar cliente.');
    }
});
 
// POST /clientes/excluir/:cpf: exclui o cliente indicado pelo CPF.
router.post('/excluir/:cpf', auth, async (req, res) => {
    try {
        // Exclui o registro cujo CPF corresponde ao valor da URL.
        await db.query(
            'DELETE FROM clientes WHERE cpf = $1',
            [req.params.cpf]
        );
 
        // Atualiza a listagem depois da exclusão.
        res.redirect('/clientes');
    } catch (erro) {
        console.error('Erro ao excluir cliente:', erro);
        res.status(500).send('Erro ao excluir cliente.');
    }
});
 
// Exporta as rotas para serem utilizadas em server.js.
export default router;
