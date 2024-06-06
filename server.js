import app from './SRC/app.js';


const PORT = 3000;

//escutar porta 3000
app.listen(PORT, () => {
    console.log(`Servidor rodando no endereço: http://localhost:${PORT}`)
})  


















// import conexao from './infra/conexao.js'

// const PORT = 3000;

// // fazer conexao

// conexao.connect((erro) => {
//     if (erro) {
//         console.log(erro)
//     } else {
//         console.log('sucesso na conexao!')
//         
//         app.listen(PORT, () => {
//             console.log(`Servidor rodando no endereço http://localhost:${PORT}`);
//         })
//     }
// })
