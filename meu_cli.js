import fs from 'fs';
import path from 'path';

function exibirArquivo(nomeArquivo) {
    fs.readFile(nomeArquivo, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return;
        }
        console.log('Conteúdo do arquivo:');
        console.log(data);
    });
}

function criarArquivo(nomeArquivo, conteudo) {
    fs.writeFile(nomeArquivo, conteudo, 'utf8', (err) => {
        if (err) {
            console.error('Erro ao criar o arquivo:', err);
            return;
        }
        console.log(`Arquivo ${nomeArquivo} criado com sucesso.`);
    });
}

function criarPasta(nomePasta) {
    fs.mkdir(nomePasta, { recursive: true }, (err) => {
        if (err) {
            console.error('Erro ao criar a pasta:', err);
            return;
        }
        console.log(`Pasta ${nomePasta} criada com sucesso.`);
    });
}

function alterarArquivo(nomeArquivo, novoConteudo) {
    fs.writeFile(nomeArquivo, novoConteudo, 'utf8', (err) => {
        if (err) {
            console.error('Erro ao alterar o arquivo:', err);
            return;
        }
        console.log(`Conteúdo do arquivo ${nomeArquivo} alterado com sucesso.`);
    });
}

function removerArquivo(nomeArquivo) {
    fs.lstat(nomeArquivo, (err, stats) => {
        if (err) {
            console.error('Erro ao acessar arquivo ou pasta', err)
            return;
        }

        if (stats.isDirectory()) {
            fs.rm(nomeArquivo, { recursive: true, force: true }, err => {
                if (err) {
                    console.error('Erro ao excluir pasta:', err);
                } else {
                    console.log(`Pasta ${nomeArquivo}, excluida com sucesso!`)
                }
            })
        } else {
            fs.unlink(nomeArquivo, err => {
                if (err) {
                    console.error('Erro ao excluir arquivo.')
                } else {
                    console.log(`Arquivo ${nomeArquivo} excluido com sucesso!`)
                }
            });
        }
    });
}

function moverArquivo(nomeArquivo, destino) {
    fs.rename(nomeArquivo, destino, (err) => {
        if (err) {
            console.error('Erro ao mover o arquivo:', err);
            return;
        }
        console.log(`Arquivo ${nomeArquivo} movido para ${destino} com sucesso.`);

        // Verificar se o arquivo foi realmente movido
        if (fs.existsSync(destino)) {
            console.log(`Arquivo está agora em ${destino}.`);
        } else {
            console.error('Arquivo não encontrado no destino especificado.');
        }
    });
}

// function renomearArquivo(nomeArquivo, novoNome) {
//     fs.rename(nomeArquivo, novoNome, (err) => {
//         if(err) {
//             console.log('Erro ao renomear aruivo:', err)
//             return

//         } else {
//             console.log(`Arquivo ${nomeArquivo} renomeado para ${novoNome} com sucesso!`)
//         }
//     })
// }

function exibirAjuda() {
    console.log('Comandos disponíveis:');
    console.log('node meu_cli.js exibir <nome_arquivo>');
    console.log('node meu_cli.js criar <nome_arquivo> <conteudo>');
    console.log('node meu_cli.js alterar <nome_arquivo> <novo_conteudo>');
    console.log('node meu_cli.js renomear <nome_arquivo> <novo_nome>')
    console.log('node meu_cli.js remover <nome_arquivo>');
    console.log('node meu_cli.js mover <nome_arquivo> <destino> || se for pasta <nome_arquivo> <destino>/<nome_arquivo>');
    console.log('node meu_cli.js criarPasta <nome_pasta>');
    console.log('node meu_cli.js exibircomandos')
}

if (process.argv.length < 4) {
    console.error('Número insuficiente de argumentos.');
    exibirAjuda();
    process.exit(1);
}

const comando = process.argv[2];
const nomeArquivo = process.argv[3];
const argumentosRestantes = process.argv.slice(4);

if (comando === 'exibir') {
    if (fs.existsSync(nomeArquivo)) {
        exibirArquivo(nomeArquivo);
    } else {
        console.error(`O arquivo ${nomeArquivo} não existe.`);
    }
} else if (comando === 'criar') {
    criarArquivo(nomeArquivo, argumentosRestantes.join(' '));
} else if (comando === 'criarPasta') {
    const nomePasta = nomeArquivo;
    criarPasta(nomePasta);
} else if (comando === 'alterar') {
    if (fs.existsSync(nomeArquivo)) {
        alterarArquivo(nomeArquivo, argumentosRestantes.join(' '));
    } else {
        console.error(`O arquivo ${nomeArquivo} não existe.`);
    }
} else if (comando === 'renomear') {
    const novoNome = argumentosRestantes[0];
    if (!novoNome) {
        console.error('Novo nome não especificado.');
        exibirAjuda();
        process.exit(1);
    }
    if (fs.existsSync(nomeArquivo)) {
        moverArquivo(nomeArquivo, novoNome);
    } else {
        console.error(`Erro ao renomear arquivo ${nomeArquivo}`);
        exibirAjuda();
    }
}   else if (comando === 'remover') {
    if (fs.existsSync(nomeArquivo)) {
        removerArquivo(nomeArquivo);
    } else {
        console.error(`O arquivo ${nomeArquivo} não existe.`);
    }
} else if (comando === 'mover') {
    const destino = argumentosRestantes[0];
    if (!destino) {
        console.error('Destino não especificado.');
        exibirAjuda();
        process.exit(1);
    }
    moverArquivo(nomeArquivo, destino);
} else {
    console.error('Comando inválido.');
    exibirAjuda();
} 

if (comando === 'exibircomandos') {
    exibirAjuda()
}
