import mysql from 'mysql'

const conexao = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'fanuchy98',
    database: 'api_fake'
})

conexao.connect()

export default conexao
