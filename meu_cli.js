import fs, { Stats } from 'fs';
import path from 'path';

function exibirlistadecomando() {
    console.log('Comandos disponíveis:')
    console.log('node meu_cli2.js help')
    console.log('node meu_cli2.js exibir <nome arquivo>')
    console.log('node meu_cli2.js criar <nome_arquivo> "conteúdo"')
    console.log('node meu_cli2.js alterar <nome_arquivo> "novo_conteudo"')
    console.log('node meu_cli2.js renomear <nome_arquivo> <novo_nome>')
    console.log('node meu_cli2.js remover <nome_arquivo>')
    console.log('node meu_cli2.js renomeararquivopasta <nome_arquivo> <novo_nome>')
    console.log('node meu_cli2.js mover <nome_arquivo> <destino> || (se for pasta) <nome_arquivo> <destino/nome_arquivo>')
    console.log('node meu_cli2.js criarPasta <nome_pasta>')
}

function exibirArquivo(nomeArquivo) {
    fs.readFile(nomeArquivo, 'utf-8', (err, data) => {
        if (err) {
            console.error('Erro ao exibir o arquivo:', err)
        } else {
            console.log('Conteúdo do arquivo:')
            console.log(data)
        }
    });
}

function criarArquivo(nomeArquivo, conteudo) {
    fs.writeFile(nomeArquivo, conteudo, 'utf-8', err => {
        if (err) {
            console.error('Erro ao criar arquivo.', err)
            return;
        } else {
            console.log(`Arquivo ${nomeArquivo} foi criado com sucesso!`)
        }
    });
}

function criarPasta(nomePasta) {
    fs.mkdir(nomePasta, { recursive: true }, err => {
        if (err) {
            console.error('Erro ao criar pasta.', err)
        } else {
            console.log(`Pasta ${nomePasta} cirada com sucesso!`)
        }
    });
}

function alterarArquivo(nomeArquivo, novoConteudo) {
    fs.writeFile(nomeArquivo, novoConteudo, 'utf-8', err => {
        if (err) {
            console.error('Erro ao alterar arquivo.')
        } else {
            console.log(`Arquivo ${nomeArquivo} alterado com sucesso!`)
        }
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
    fs.rename(nomeArquivo, destino, err => {
        if (err) {
            console.error('Erro ao mover arquivo.', err)
            exibirlistadecomando()
        } else {

            console.log(`Arquivo ${nomeArquivo} movido para ${destino} com sucesso!`)

            if (fs.existsSync(destino)) {
                console.log(`Arquivo esta agora em ${destino}.`)
            } else {
                console.error('Arquivo não encontrado no destino especificado.')
            }
        }
    });
}

function renomearArquivo(nomeArquivo, novoNome) {
    fs.rename(nomeArquivo, novoNome, (err) => {
        if (err) {
            console.log('Erro ao renomear aruivo:', err)
            return

        } else {
            console.log(`Arquivo ${nomeArquivo} renomeado para ${novoNome} com sucesso!`)
        }
    })
}


async function renomeararquivopasta(nomePasta, nomeBase) {
    try {
        // Lê todos os arquivos na pasta especificada
        const files = await fs.promises.readdir(nomePasta);
        let counter = 1; // Inicializa o contador

        for (const file of files) {
            const ext = path.extname(file); // Obtém a extensão do arquivo
            // Cria o novo nome do arquivo usando o nome base e o contador
            const newFileName = `${nomeBase}${counter}${ext}`;
            const oldPath = path.join(nomePasta, file); // Caminho completo do arquivo antigo
            const newPath = path.join(nomePasta, newFileName); // Caminho completo do novo arquivo

            await fs.promises.rename(oldPath, newPath); // Renomeia o arquivo
            counter++; // Incrementa o contador
        }

        console.log(`Todos os arquivos na pasta ${nomePasta} foram renomeados com sucesso!`);
    } catch (err) {
        console.error('Erro ao renomear arquivos na pasta:', err);
    }
}


if (process.argv.length < 4) {
    console.error('Numero insuficiente de argumentos');
    exibirlistadecomando();
    process.exit(1);
}

const comando = process.argv[2];
const nomeArquivo = process.argv[3];
const argumentosRestantes = process.argv.slice(4)


if (comando === 'exibir') {
    if (fs.existsSync(nomeArquivo)) {
        exibirArquivo(nomeArquivo);
    } else {
        console.error(`O arquivo ${nomeArquivo} não existe.`);
        exibirlistadecomando();
    }
} else if (comando === 'criar') {
    criarArquivo(nomeArquivo, argumentosRestantes.join(' '));
} else if (comando === 'criarPasta') {
    criarPasta(nomeArquivo);
} else if (comando === 'alterar') {
    if (fs.existsSync(nomeArquivo)) {
        alterarArquivo(nomeArquivo, argumentosRestantes.join(' '));
    } else {
        console.error(`O arquivo ${nomeArquivo} não existe.`);
        exibirlistadecomando();
    }
} else if (comando === 'renomear') {
    const novoNome = argumentosRestantes[0];
    if (!novoNome) {
        console.error('Novo nome não especificado.');
        exibirlistadecomando();
        process.exit(1);
    }
    if (fs.existsSync(nomeArquivo)) {
        renomearArquivo(nomeArquivo, novoNome);
    } else {
        console.error(`Erro ao renomear arquivo ${nomeArquivo}`);
        exibirlistadecomando();
    }
} else if (comando === 'remover') {
    if (fs.existsSync(nomeArquivo)) {
        removerArquivo(nomeArquivo);
    } else {
        console.error(`O arquivo ${nomeArquivo} não existe.`);
        exibirlistadecomando();
    }
} else if (comando === 'mover') {
    const destino = argumentosRestantes[0];
    if (!destino) {
        console.error('Destino não especificado.');
        exibirlistadecomando();
        process.exit(1);
    }
    moverArquivo(nomeArquivo, destino);
} else if (comando === 'renomeararquivopasta') {
    const nomeBase = argumentosRestantes[0];
    if (!nomeBase) {
        console.error('Novo nome não especificado.');
        exibirlistadecomando();
        process.exit(1);
    }
    if (fs.existsSync(nomeArquivo) && fs.lstatSync(nomeArquivo).isDirectory()) {
        renomeararquivopasta(nomeArquivo, nomeBase);
    } else {
        console.error(`A pasta ${nomeArquivo} não existe ou não é uma pasta.`);
        exibirlistadecomando();
    }
} else {
    console.error('Comando inválido.');
    exibirlistadecomando();
} 

if (comando === 'help') {
    exibirlistadecomando()
}
 // comentario so pra testar uma coisa 
 