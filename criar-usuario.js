// Arquivo executado uma única vez para cadastrar um operador de teste.
// Depois de criar o usuário, não é necessário executar este arquivo novamente.
 
// Importa a conexão com o banco.
import db from './config/db.js';
 
// Importa o bcrypt para gerar o hash da senha.
import bcrypt from 'bcrypt';
 
// Dados de exemplo para o primeiro acesso ao sistema.
const cpf = '12345678900';
const senha = '123456';
 
// Transforma a senha em um hash com 10 rounds.
const hash = await bcrypt.hash(senha, 10);
 
try {
    // Insere o CPF e o hash na tabela usuarios.
    await db.query(
        'INSERT INTO usuarios (cpf, senha) VALUES ($1, $2)',
        [cpf, hash]
    );
 
    console.log('Usuário criado com sucesso!');
    console.log('CPF de teste: 12345678900');
    console.log('Senha de teste: 123456');
 
} catch (erro) {
    // Informa se ocorreu algum problema, por exemplo CPF já cadastrado.
    console.error('Erro ao criar usuário:', erro);
 
} finally {
    // Fecha a conexão com o banco ao terminar o script.
    await db.end();
}
