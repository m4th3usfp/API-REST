import fs, { Stats } from 'fs';
import path from 'path';

function exibirlistadecomando() {
    console.log('Comandos disponíveis:')
    console.log('node meu_cli2.js help')
    console.log('node meu_cli2.js exibir <nome_arquivo>')
    console.log('node meu_cli2.js criar <nome_arquivo> "conteúdo"')
    console.log('node meu_cli2.js criarPasta <nome_pasta>')
    console.log('node meu_cli2.js alterar <nome_arquivo> "novo_conteudo"')
    console.log('node meu_cli2.js renomear <nome_arquivo> <novo_nome>')
    console.log('node meu_cli2.js remover <nome_arquivo>')
    console.log('node meu_cli2.js renomeararquivopasta <nome_arquivo> <novo_nome>')
    console.log('node meu_cli2.js mover <nome_arquivo> <destino> || (se for pasta) <nome_arquivo> <destino/nome_arquivo>')
    console.log('node meu_cli2.js moverporextensao <diretório> <extensao>')
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
            console.log(`Arquivo ${nomeArquivo} alterado com sucesso!`, argumentosRestantes)
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
                console.log(`Arquivo ${nomeArquivo} esta agora em ${destino}.`, argumentosRestantes[1])
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

async function moverporextensao(dir, extensao) {
    const verificarSePastaContemExtensao = (dir) => {
        const files = fs.readdirSync(dir);
        return files.some(file => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                return verificarSePastaContemExtensao(filePath);
            } else {
                return path.extname(file) === extensao;
            }
        });
    };

    if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) {
        console.error(`A pasta ${dir} não existe ou não é um diretório.`);
        return;
    }

    if (!verificarSePastaContemExtensao(dir)) {
        console.error(`A pasta ${dir} não contém arquivos com a extensão ${extensao}.`);
        return;
    }

    const moveFilesRecursive = (currentDir) => {
        const files = fs.readdirSync(currentDir);
        const arquivos_fixo = ['meu_cli2.js', 'node_modules', 'meu_cli.js', 'server.js','conexao.js','app.js']

        for (const file of files) {
            const filePath = path.join(currentDir, file);
            const stats = fs.statSync(filePath);

            if (arquivos_fixo.includes(file)) {
                continue;
            }

            if (stats.isDirectory()) {
                moveFilesRecursive(filePath);
            } else {
                if (path.extname(file) === extensao) {
                    const novaPasta = path.join(dir, extensao.slice(1));
                    if (!fs.existsSync(novaPasta)) {
                        fs.mkdirSync(novaPasta);
                    }
                    const newFilePath = path.join(novaPasta, file);
                    fs.renameSync(filePath, newFilePath);
                }
            }
        }
    };

    moveFilesRecursive(dir);
    console.log(`Arquivos com a extensão ${extensao} movidos para as respectivas subpastas.`);
}

if (process.argv.length === 3 && process.argv[2] === 'help') {
    exibirlistadecomando();
    process.exit(0)
}

if (process.argv.length < 4) {
    console.error('Numero insuficiente de argumentos');
    exibirlistadecomando();
    process.exit(1);
} 

const comando = process.argv[2];
const nomeArquivo = process.argv[3];
const argumentosRestantes = process.argv.slice(3)


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
        alterarArquivo(nomeArquivo, argumentosRestantes[1]);
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
    const destino = argumentosRestantes[1];
    if (!destino) {
        console.error('Destino não especificado.', argumentosRestantes);
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
} if (comando === 'moverporextensao') {
    // Antes de verificar os argumentos
    console.log('Argumentos Restantes:', argumentosRestantes);

    const dir = argumentosRestantes[0];
    const extensao = argumentosRestantes[1];

    if (!dir || !extensao) {
        console.error('Nome da pasta ou extensão não especificados.');
        exibirlistadecomando();
        process.exit(1);
    }

    console.log('Diretório:', dir);
    console.log('Extensão:', extensao);

    moverporextensao(dir, extensao);
}