
import express from 'express';
import db from '../config/db.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Abre a página de login.
router.get('/login', (req, res) => {
    res.render('login');
});

// Recebe o CPF e a senha digitados.
router.post('/login', async (req, res) => {
    try {
        const { cpf, senha } = req.body;

        // Procura o usuário pelo CPF.
        const resultado = await db.query(
            'SELECT * FROM usuarios WHERE cpf = $1',
            [cpf]
        );

        // Verifica se o usuário existe.
        if (resultado.rows.length === 0) {
            return res.status(401).send('Usuário não encontrado.');
        }

        const usuario = resultado.rows[0];

        // Compara a senha digitada com a senha salva no banco.
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).send('Senha incorreta.');
        }

        // Salva o usuário na sessão.
        req.session.usuario = usuario;

        // Direciona para a página de clientes.
        res.redirect('/clientes');

    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao realizar login.');
    }
});

// Encerra a sessão.
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

export default router;
