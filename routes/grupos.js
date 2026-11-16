// Importa o Express para criar as rotas de grupos.
import express from 'express';
 
// Importa a conexão com o PostgreSQL.
import db from '../config/db.js';
 
// Importa o middleware que protege as páginas.
import auth from '../middleware/auth.js';
 
// Cria o roteador deste arquivo.
const router = express.Router();
 
// GET /grupos: lista todos os grupos cadastrados.
router.get('/', auth, async (req, res) => {
    try {
        // Busca todos os registros da tabela convenio.
        const resultado = await db.query(
            'SELECT * FROM convenio ORDER BY id_grupo'
        );
 
        // Envia os grupos encontrados para a página grupos.ejs.
        res.render('grupos', {
            grupos: resultado.rows
        });
    } catch (erro) {
        console.error('Erro ao listar grupos:', erro);
        res.status(500).send('Erro ao carregar os grupos.');
    }
});
 
// GET /grupos/novo: abre o formulário vazio para cadastrar um grupo.
router.get('/novo', auth, (req, res) => {
    res.render('formulario-grupo', {
        grupo: null // null indica que ainda não existe um grupo para editar.
    });
});
 
// POST /grupos/salvar: recebe os dados do formulário e cadastra o grupo.
router.post('/salvar', auth, async (req, res) => {
    try {
        // Pega os valores digitados nos campos do formulário.
        const { categorias, descricao } = req.body;
 
        // Insere os dados na tabela convenio.
        // Os parâmetros $1 e $2 recebem os valores de forma segura.
        await db.query(
            'INSERT INTO convenio (categorias, descricao) VALUES ($1, $2)',
            [categorias, descricao]
        );
 
        // Volta para a listagem depois de salvar.
        res.redirect('/grupos');
    } catch (erro) {
        console.error('Erro ao cadastrar grupo:', erro);
        res.status(500).send('Erro ao cadastrar grupo.');
    }
});
 
// GET /grupos/editar/:id: busca um grupo específico para preencher o formulário.
router.get('/editar/:id', auth, async (req, res) => {
    try {
        // req.params.id pega o identificador que veio na URL.
        const resultado = await db.query(
            'SELECT * FROM convenio WHERE id_grupo = $1',
            [req.params.id]
        );
 
        // Se o grupo não existir, informa que ele não foi encontrado.
        if (resultado.rows.length === 0) {
            return res.status(404).send('Grupo não encontrado.');
        }
 
        // Abre o formulário preenchido com os dados do grupo encontrado.
        res.render('formulario-grupo', {
            grupo: resultado.rows[0]
        });
    } catch (erro) {
        console.error('Erro ao buscar grupo:', erro);
        res.status(500).send('Erro ao buscar grupo.');
    }
});
 
// POST /grupos/editar/:id: atualiza os dados de um grupo existente.
router.post('/editar/:id', auth, async (req, res) => {
    try {
        // Pega os novos valores enviados pelo formulário.
        const { categorias, descricao } = req.body;
 
        // Atualiza a categoria e a descrição do grupo indicado na URL.
        await db.query(
            'UPDATE convenio SET categorias = $1, descricao = $2 WHERE id_grupo = $3',
            [categorias, descricao, req.params.id]
        );
 
        // Volta para a listagem.
        res.redirect('/grupos');
    } catch (erro) {
        console.error('Erro ao editar grupo:', erro);
        res.status(500).send('Erro ao editar grupo. Verifique se existem clientes associados.');
    }
});
 
// POST /grupos/excluir/:id: exclui um grupo pelo identificador.
router.post('/excluir/:id', auth, async (req, res) => {
    try {
        // Apaga o grupo cujo id_grupo corresponde ao valor recebido na URL.
        await db.query(
            'DELETE FROM convenio WHERE id_grupo = $1',
            [req.params.id]
        );
 
        // Atualiza a página mostrando a listagem.
        res.redirect('/grupos');
    } catch (erro) {
        // A exclusão pode ser impedida se houver clientes associados ao grupo.
        console.error('Erro ao excluir grupo:', erro);
        res.status(400).send('Não foi possível excluir. Verifique se há clientes associados a este grupo.');
    }
});
 
// Exporta o roteador para ser utilizado em server.js.
export default router;
