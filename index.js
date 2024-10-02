const { select, input, checkbox } = require('@inquirer/prompts');
const fs = require("fs").promises;

let mensagem = "Bem-vindo ao programa!"

let metas = []

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8");
        metas = JSON.parse(dados);
    } catch (error) {
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2));
}

const start = async () => {

    cadastrarMeta = async () => {
        const meta = await input({message: "digite a meta: "})

        if(meta.length == 0) {
            mensagem = "Você não digitou nada."
            return;
        } else {
            metas.push({
                value: meta,
                checked: false
            })
        }
    }

    listarMetas = async () => {
        
        if(metas.length == 0) {
            mensagem = "Nenhuma meta disponível para listar."
            return
        }
        
        
        const respostas = await checkbox({
            message: "Use as setas para mover, a barra de espaço para marcar ou desmarcar e Enter para concluir",
            choices: [...metas],
            instructions: false
        })

        metas.forEach((m) => {
            m.checked = false;
        })

        
        respostas.forEach((r) => {
            const meta = metas.find((m) => {
                return m.value == r;
            })

            meta.checked = true;
        })

        mensagem = "Meta(s) marcada(s) como concluída(s)!"
    }

    metasRealizadas = async () => {
        const realizadas = metas.filter((m) => { 
            return m.checked; 
        })

        if(realizadas.length == 0) {
            mensagem = "Não há meta(s) realizada(s) ainda!"
            return;
        }

        await select({
            message: "Meta(s) Realizada(s): " + realizadas.length,
            choices: [...realizadas]
        })
    }

    metasAbertas = async () => {
        const abertas = metas.filter((m) => {
            return !m.checked;
        })

        if(abertas.length == 0) {
            mensagem = "Não há meta(s) em aberto!";
            return;
        }

        await select({
            message: "Meta(s) em aberto: " + abertas.length,
            choices: [...abertas]
        })
    }

    deletarMetas = async () => {
        
        const novaLista = metas.map((m) => {
            return {value: m.value, checked: false}
        })
        
        const itensParaDeletar = await checkbox({
            message: "Selecione e confirme para deletar",
            choices: [...novaLista],
            instructions: false
        })


         if (itensParaDeletar.length == 0) {
            mensagem = "Nenhuma meta foi selecionada para ser excluída."
            return;
        }

        itensParaDeletar.forEach((item) => {
            metas = metas.filter((m) => {
                return m.value != item
            })
         })


        mensagem = "Meta(s) deletada(s)!"

        
    }


    const mostrarMensagem = () => {
        console.clear();

        if(mensagem != "") {
            console.log(mensagem)
            console.log("")
            mensagem = "";
        }
    }

    
    await carregarMetas();

    while(true) {

        mostrarMensagem();
        await salvarMetas();

        const option = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Deletar metas",
                    value: "deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })

        switch(option) {
            case "cadastrar":
                await cadastrarMeta();
                break;
            case "listar":
                await listarMetas();
                break;
            case "realizadas":
                await metasRealizadas();
                break;
            case "abertas":
                await metasAbertas();
                break;
            case "deletar":
                await deletarMetas();
                break;
            case "sair":
                console.log("Até mais!")
                return;
        
        }
    }
}

start();