// Importa o pacote pg, que permite conectar o Node.js ao PostgreSQL.
import pg from 'pg';
 
// Extrai a classe Pool do pacote pg.
// Pool gerencia as conexões usadas para executar consultas no banco.
const { Pool } = pg;
 
// Cria a conexão com o banco de dados PostgreSQL.
const db = new Pool({
    user: 'postgres',          // Usuário do PostgreSQL.
    host: 'localhost',         // Endereço do servidor do banco.
    database: 'pediatria',     // Nome do banco.
    password: 'senai',         // Senha do PostgreSQL.
    port: 5432                 // Porta padrão do PostgreSQL.
});
 
// Exporta a conexão para que outros arquivos possam consultar o banco.
export default db;
