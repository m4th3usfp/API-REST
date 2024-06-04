import express from 'express';

import cors from 'cors';

import conexao from '../infra/conexao.js';

const app = express();

app.use(cors());

// Indicar paa o express ler o body com o JSON;
app.use(express.json())


// retornar o objeto por id;
function buscarSelecaoporId(id) {
    return selecoes.filter(pessoa => pessoa._id == _id)
}

// pegar posição ou index do elemento no array por id;
function buscarIndexSelecao(id) {
    return selecoes.findIndex(pessoa => pessoa.id == _id)
}

// post (create) no endpoint /selecoes;
app.post('/pessoa', (req, res) => {
    const pessoa = req.body;
    
    // Adicionar o _id gerado ao objeto pessoa
    // pessoa._id = _id;

    // Inserir a pessoa no banco de dados, incluindo o _id
    const sql = `INSERT INTO pessoa SET ?`;
    conexao.query(sql, pessoa, (erro, resultado) => {
        if (erro) {
            console.log(erro);
            res.status(400).json({ "erro": erro });
        } else {
            // Retornar o _id gerado e os dados da pessoa
            const _id = resultado.insertId;
            res.status(201).json({ "_id": _id, ...pessoa });
            console.log(_id)
        }
    });
    
    console.log('A rota POST /pessoa foi acessada !'); 
});
            






// get (read) de todas as listas do JSON;
app.get('/pessoa', (req, res) => {
    //res.status(200).send(selecoes)
    // const sql = "SELECT * FROM selecoes;"
    const sql = "SELECT * FROM pessoa;"
    conexao.query(sql, (erro, resultado) => {
        if(erro) {
            console.log(erro)
            res.status(404).json({ "erro": erro })
        } else {
            res.status(200).json(resultado)
        }
    })
    console.log('A rota GET /pessoa foi acessada !')
    
})

// get (read) do endpoint /selecoes + id; 
app.get('/pessoa/:id', (req, res) => {
    //res.json(buscarSelecaoporId(req.params.id))
    const id = req.params.id
    const sql = "SELECT * FROM pessoa WHERE _id=?;"
    conexao.query(sql, id, (erro, resultado) => {
        const linha = resultado[0]
        if(erro) {
            console.log(erro)
            res.status(404).json({ "erro": erro })
        } else {
            res.status(200).json(linha)
        }
    })
    console.log('A rota GET /pessoa/:id foi acessada !')
})

// delete (delete) do endpoint /selecoes + id; 
app.delete('/pessoa/:id', (req, res) => {
    // let index = buscarIndexSelecao(req.params.id)
    // selecoes.splice(index, 1)
    // res.send(`selecao com id ${req.params.id} excluida com sucesso !`)
    const id = req.params.id
    const sql = "DELETE FROM pessoa WHERE _id=?;"
    conexao.query(sql, id, (erro, resultado) => {
        
        if(erro) {
            console.log(erro)
            res.status(404).json({ "erro": erro })
        } else {
            res.status(200).json(resultado)
        }
    })
    console.log('A rota DELETE /pessoa/:id foi acessada !')
})

// put (update) do endpoint /selecoes + id;
app.put('/pessoa/:id', (req, res) => {
    // let  index = buscarIndexSelecao(req.params.id)
    // selecoes[index].selecao = req.body.selecao
    // selecoes[index].grupo = req.body.grupo
    // res.json(selecoes)
    const id = req.params.id
    const pessoa = req.body
    const sql = "UPDATE pessoa SET ? WHERE _id=?;" 
    conexao.query(sql, [pessoa, id], (erro, resultado) => {
        
        if(erro) {
            console.log(erro)
            res.status(400).json({ "erro": erro })
        } else {
            res.status(200).json(resultado)
        }
    })
    console.log('A rota PUT /pessoa/:id foi acessada !') 
})

export default app









// get (read) rota padrao ou raiz (root) localhost:3000;
// app.get('/', (req, res)=> {
//     res.send('Curso de Node JS ')
//     console.log('Rota / foi acessada 1')
// });



// mock giria para esconder dados; 
// const selecoes = [
//     {id: 1, selecao: 'Brasil', grupo: 'G'},
//     {id: 2, selecao: 'Suiça', grupo: 'G'},
//     {id: 3, selecao: 'Camarões', grupo: 'G'},
//     {id: 4, selecao: 'Sérvia', grupo: 'G'},
    
// ]

// buscando o nome do pais pelo endpoint /selecoes, mas nesse caso tratando "selecoes" 
// como variavel de parametro "/:selecoes", Ex: localhost:3000/brasil 
// function buscarSelecaoporNome(nome) {
//     return selecoes.find(value => value.selecao.toLowerCase() === nome.toLowerCase());
// }


// app.get('/:selecoes', (req, res) => {
//     const selecao = buscarSelecaoporNome(req.params.selecoes);
//     if (selecao) {
//         res.json(selecao);
//     } else {
//         res.status(404).send('Seleção não encontrada');
//     }
// });
