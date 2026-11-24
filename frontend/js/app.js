
// ==========================================
// VIZINHO ALERTA - JAVASCRIPT PRINCIPAL
// ==========================================

const API_URL = "http://127.0.0.1:8000";

// ==========================================
// IDENTIFICAÇÃO DAS TELAS
// ==========================================

const paginaInicio = document.getElementById("pagina-inicio");
const paginaCadastro = document.getElementById("pagina-cadastro");
const paginaConsulta = document.getElementById("pagina-consulta");
const paginaLoginAdmin = document.getElementById("pagina-login-admin");
const paginaAdmin = document.getElementById("pagina-admin");

// ==========================================
// BOTÕES PRINCIPAIS
// ==========================================

const botaoCadastrar = document.getElementById("botao-cadastrar");
const botaoConsultar = document.getElementById("botao-consultar");
const botaoAdministracao = document.getElementById("botao-administracao");

// ==========================================
// ACESSIBILIDADE
// ==========================================

const botaoOuvir = document.getElementById("botao-ouvir");
const botaoPararAudio = document.getElementById("botao-parar-audio");

// ==========================================
// FORMULÁRIO DE ALERTA
// ==========================================

const formulario = document.getElementById("form-alerta");

const categoriaSelect = document.getElementById("categoria");
const situacaoSelect = document.getElementById("situacao");
const tituloInput = document.getElementById("titulo");

const campoDescricao = document.getElementById("descricao");
const botaoDitado = document.getElementById("botao-ditado");
const mensagemVoz = document.getElementById("mensagem-voz");
const mensagemFormulario = document.getElementById("mensagem-formulario");

// ==========================================
// ADMINISTRAÇÃO
// ==========================================

const formularioLoginAdmin = document.getElementById("form-login-admin");
const campoUsuarioAdmin = document.getElementById("admin-usuario");
const campoSenhaAdmin = document.getElementById("admin-senha");
const mensagemLoginAdmin = document.getElementById("mensagem-login-admin");

const listaAlertasAdmin = document.getElementById("lista-alertas-admin");
const botaoAtualizarAdmin = document.getElementById("botao-atualizar-admin");
const botaoSairAdmin = document.getElementById("botao-sair-admin");

// O token permanece somente na memória desta página.
let tokenAdmin = null;

// ==========================================
// SITUAÇÕES DISPONÍVEIS POR CATEGORIA
// ==========================================

const situacoesPorCategoria = {
    "Segurança": [
        "Tentativa de invasão a residência",
        "Tentativa de furto",
        "Furto ocorrido",
        "Pessoas rondando residências em circunstâncias suspeitas",
        "Movimentação suspeita",
        "Ameaças ou conflitos",
        "Veículo em situação suspeita",
        "Outros riscos à segurança"
    ],

    "Infraestrutura": [
        "Poste com lâmpada apagada",
        "Falta de iluminação pública",
        "Buracos nas ruas",
        "Calçadas danificadas",
        "Bueiros abertos ou entupidos",
        "Vazamento de água",
        "Problemas de sinalização"
    ],

    "Meio ambiente": [
        "Descarte irregular de lixo",
        "Entulho em locais públicos",
        "Árvore caída ou galhos perigosos",
        "Alagamentos",
        "Animais abandonados",
        "Focos de água parada"
    ],

    "Ajuda comunitária": [
        "Pedido de ajuda a moradores",
        "Pessoa idosa precisando de auxílio",
        "Animal perdido",
        "Objeto encontrado",
        "Apoio em situação de emergência",
        "Ação solidária no bairro"
    ],

    "Outra": [
        "Problema não listado",
        "Sugestão para melhoria do bairro"
    ]
};

// ==========================================
// FORMATAÇÃO DE DATA BRASILEIRA
// ==========================================

function formatarDataBrasileira(data) {
    if (!data) {
        return "Não informada";
    }

    const partes = String(data).substring(0, 10).split("-");

    if (partes.length !== 3 || partes[0].length !== 4) {
        return data;
    }

    const [ano, mes, dia] = partes;

    return `${dia}/${mes}/${ano}`;
}

// ==========================================
// ATUALIZAR OPÇÕES DE SITUAÇÃO
// ==========================================

function atualizarSituacoes() {
    if (!categoriaSelect || !situacaoSelect) return;

    const categoria = categoriaSelect.value;
    const situacoes = situacoesPorCategoria[categoria] || [];

    situacaoSelect.innerHTML = "";

    const opcaoInicial = document.createElement("option");
    opcaoInicial.value = "";
    opcaoInicial.textContent = situacoes.length
        ? "Selecione uma situação"
        : "Primeiro selecione uma categoria";

    situacaoSelect.appendChild(opcaoInicial);

    situacoes.forEach(function (situacao) {
        const opcao = document.createElement("option");
        opcao.value = situacao;
        opcao.textContent = situacao;
        situacaoSelect.appendChild(opcao);
    });

    situacaoSelect.disabled = situacoes.length === 0;

    if (tituloInput) {
        tituloInput.value = "";
    }
}

if (categoriaSelect) {
    categoriaSelect.addEventListener("change", atualizarSituacoes);
}

if (situacaoSelect) {
    situacaoSelect.addEventListener("change", function () {
        if (tituloInput) {
            tituloInput.value = situacaoSelect.value;
        }
    });
}

// ==========================================
// NAVEGAÇÃO ENTRE TELAS
// ==========================================

function mostrarTela(tela) {
    const todasAsTelas = [
        paginaInicio,
        paginaCadastro,
        paginaConsulta,
        paginaLoginAdmin,
        paginaAdmin
    ];

    todasAsTelas.forEach(function (pagina) {
        if (pagina) {
            pagina.hidden = true;
        }
    });

    const telas = {
        inicio: paginaInicio,
        cadastro: paginaCadastro,
        consulta: paginaConsulta,
        loginAdmin: paginaLoginAdmin,
        admin: paginaAdmin
    };

    if (telas[tela]) {
        telas[tela].hidden = false;
    }

    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// ==========================================
// ABRIR TELA DE CADASTRO
// ==========================================

if (botaoCadastrar) {
    botaoCadastrar.addEventListener("click", function () {
        mostrarTela("cadastro");

        if (categoriaSelect) {
            categoriaSelect.focus();
        }
    });
}

// ==========================================
// ABRIR TELA DE CONSULTA
// ==========================================

if (botaoConsultar) {
    botaoConsultar.addEventListener("click", function () {
        mostrarTela("consulta");
        consultarAlertas();
    });
}

// ==========================================
// ABRIR ÁREA ADMINISTRATIVA
// ==========================================

if (botaoAdministracao) {
    botaoAdministracao.addEventListener("click", function () {
        mostrarTela("loginAdmin");

        if (campoUsuarioAdmin) {
            campoUsuarioAdmin.focus();
        }
    });
}

// ==========================================
// BOTÕES DE VOLTAR
// ==========================================

document.querySelectorAll(".botao-voltar").forEach(function (botao) {
    botao.addEventListener("click", function () {
        mostrarTela(botao.dataset.tela || "inicio");
    });
});

// ==========================================
// LEITURA DAS INFORMAÇÕES EM VOZ ALTA
// ==========================================

if (botaoOuvir && "speechSynthesis" in window) {
    botaoOuvir.addEventListener("click", function () {
        window.speechSynthesis.cancel();

        const telaAtiva = document.querySelector(
            "main section:not([hidden])"
        );

        if (!telaAtiva) return;

        const conteudo = telaAtiva.innerText;
        const fala = new SpeechSynthesisUtterance(conteudo);

        fala.lang = "pt-BR";
        fala.rate = 0.9;
        fala.pitch = 1;

        window.speechSynthesis.speak(fala);
    });
}

if (botaoPararAudio && "speechSynthesis" in window) {
    botaoPararAudio.addEventListener("click", function () {
        window.speechSynthesis.cancel();
    });
}

// ==========================================
// DITADO POR VOZ COM TEXTO PROGRESSIVO
// ==========================================

let reconhecimentoAtivo = null;
let ditadoEmAndamento = false;

function atualizarVisualDitado(ativo) {
    if (!botaoDitado) return;

    botaoDitado.classList.toggle("ouvindo", ativo);
    botaoDitado.setAttribute("aria-pressed", String(ativo));

    if (ativo) {
        botaoDitado.textContent = "🔴 Ouvindo... fale agora";
    } else {
        botaoDitado.textContent = "🎤 Falar descrição";
    }
}

function encerrarDitado() {
    ditadoEmAndamento = false;
    reconhecimentoAtivo = null;

    atualizarVisualDitado(false);
}

if (botaoDitado) {
    botaoDitado.addEventListener("click", function () {
        const Reconhecimento =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!Reconhecimento) {
            if (mensagemVoz) {
                mensagemVoz.textContent =
                    "Seu navegador não oferece suporte ao ditado por voz. Você pode digitar a descrição.";
            }
            return;
        }

        if (ditadoEmAndamento && reconhecimentoAtivo) {
            reconhecimentoAtivo.stop();
            return;
        }

        const reconhecimento = new Reconhecimento();

        reconhecimentoAtivo = reconhecimento;
        ditadoEmAndamento = true;

        reconhecimento.lang = "pt-BR";
        reconhecimento.continuous = false;
        reconhecimento.interimResults = true;
        reconhecimento.maxAlternatives = 1;

        const textoAnterior = campoDescricao
            ? campoDescricao.value.trim()
            : "";

        let textoReconhecido = "";
        let textoParcial = "";

        atualizarVisualDitado(true);

        if (mensagemVoz) {
            mensagemVoz.textContent =
                "Ouvindo sua voz... fale naturalmente. O texto aparecerá aqui na descrição.";
            mensagemVoz.className = "voz-ouvindo";
        }

        if (campoDescricao) {
            campoDescricao.focus();
        }

        reconhecimento.onstart = function () {
            if (mensagemVoz) {
                mensagemVoz.textContent =
                    "🔴 Microfone ativo! Pode falar. Sua fala está sendo transformada em texto.";
            }
        };

        reconhecimento.onresult = function (evento) {
            textoParcial = "";

            for (
                let i = evento.resultIndex;
                i < evento.results.length;
                i++
            ) {
                const resultado = evento.results[i];
                const texto = resultado[0].transcript;

                if (resultado.isFinal) {
                    textoReconhecido += texto + " ";
                } else {
                    textoParcial += texto;
                }
            }

            if (campoDescricao) {
                const textoAtual = [
                    textoAnterior,
                    textoReconhecido.trim(),
                    textoParcial.trim()
                ].filter(Boolean).join(" ");

                campoDescricao.value = textoAtual;
            }

            if (mensagemVoz) {
                mensagemVoz.textContent = textoParcial
                    ? `🔴 Ouvindo: ${textoParcial}`
                    : "Texto reconhecido! Pode continuar falando.";
            }
        };

        reconhecimento.onerror = function (evento) {
            if (mensagemVoz) {
                if (evento.error === "not-allowed") {
                    mensagemVoz.textContent =
                        "O acesso ao microfone foi bloqueado. Autorize o uso do microfone no navegador.";
                } else if (evento.error === "no-speech") {
                    mensagemVoz.textContent =
                        "Nenhuma fala foi identificada. Tente novamente em um local mais silencioso.";
                } else {
                    mensagemVoz.textContent =
                        "Não foi possível reconhecer a voz. Você pode digitar a descrição.";
                }

                mensagemVoz.className = "voz-erro";
            }
        };

        reconhecimento.onend = function () {
            encerrarDitado();

            if (mensagemVoz) {
                if (campoDescricao && campoDescricao.value.trim()) {
                    mensagemVoz.textContent =
                        "Ditado finalizado! Confira o texto da descrição antes de enviar.";
                    mensagemVoz.className = "voz-concluida";
                } else {
                    mensagemVoz.textContent =
                        "Ditado encerrado. Se necessário, tente novamente ou digite a descrição.";
                    mensagemVoz.className = "";
                }
            }
        };

        try {
            reconhecimento.start();
        } catch (erro) {
            encerrarDitado();

            if (mensagemVoz) {
                mensagemVoz.textContent =
                    "Não foi possível iniciar o microfone. Tente novamente.";
                mensagemVoz.className = "voz-erro";
            }

            console.error("Erro ao iniciar ditado:", erro);
        }
    });
}

// ==========================================
// CADASTRAR ALERTA NA API
// ==========================================

if (formulario) {
    formulario.addEventListener("submit", cadastrarAlerta);
}

async function cadastrarAlerta(evento) {
    evento.preventDefault();

    const dados = {
        titulo: formulario.elements.namedItem("titulo").value.trim(),
        descricao: formulario.elements.namedItem("descricao").value.trim(),
        categoria: formulario.elements.namedItem("categoria").value,
        bairro: formulario.elements.namedItem("bairro").value.trim(),
        situacao: formulario.elements.namedItem("situacao").value,
        data_ocorrencia:
            formulario.elements.namedItem("data_ocorrencia").value || null,
        horario_aproximado:
            formulario.elements.namedItem("horario_aproximado").value || null,
        local_referencia:
            formulario.elements.namedItem("local_referencia").value.trim() || null
    };

    if (!dados.situacao) {
        mensagemFormulario.textContent =
            "Selecione a situação que deseja comunicar.";
        return;
    }

    try {
        mensagemFormulario.textContent = "Enviando alerta...";

        const resposta = await fetch(`${API_URL}/alertas/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            const erro = await resposta.text();
            throw new Error(erro || "Não foi possível cadastrar o alerta.");
        }

        mensagemFormulario.textContent =
            "Alerta cadastrado com sucesso! Seu alerta foi recebido e está pendente de análise pela administração. Após a aprovação, ficará disponível na consulta dos alertas do bairro.";

        formulario.reset();
        atualizarSituacoes();

        if (mensagemVoz) {
            mensagemVoz.textContent = "";
            mensagemVoz.className = "";
        }

    } catch (erro) {
        mensagemFormulario.textContent =
            "Não foi possível enviar. Verifique se a API está funcionando.";

        console.error("Erro ao cadastrar alerta:", erro);
    }
}

// ==========================================
// CONSULTAR ALERTAS PUBLICADOS
// ==========================================

async function consultarAlertas() {
    const area = document.getElementById("lista-alertas");

    if (!area) return;

    area.textContent = "Carregando alertas...";

    try {
        const resposta = await fetch(`${API_URL}/alertas/`);

        if (!resposta.ok) {
            throw new Error("Erro ao consultar alertas.");
        }

        const alertas = await resposta.json();

        area.innerHTML = "";

        if (alertas.length === 0) {
            area.textContent = "Nenhum alerta publicado no momento.";
            return;
        }

        alertas.forEach(function (alerta) {
            const item = document.createElement("article");

            const titulo = document.createElement("h3");
            const descricao = document.createElement("p");
            const categoria = document.createElement("p");
            const situacao = document.createElement("p");
            const bairro = document.createElement("p");
            const data = document.createElement("p");
            const horario = document.createElement("p");
            const referencia = document.createElement("p");
            const status = document.createElement("p");

            titulo.textContent = alerta.titulo;
            descricao.textContent = alerta.descricao;
            categoria.textContent = `Categoria: ${alerta.categoria}`;
            situacao.textContent = `Situação: ${alerta.situacao || "Não informada"}`;
            bairro.textContent = `Bairro: ${alerta.bairro}`;
            data.textContent = `Data da ocorrência: ${formatarDataBrasileira(alerta.data_ocorrencia)}`;
            horario.textContent = `Horário aproximado: ${alerta.horario_aproximado || "Não informado"}`;
            referencia.textContent = `Local de referência: ${alerta.local_referencia || "Não informado"}`;
            status.textContent = `Status: ${alerta.status}`;

            status.className = "status-alerta";
            status.classList.add(obterClasseStatus(alerta.status));

            item.append(
                titulo,
                descricao,
                categoria,
                situacao,
                bairro,
                data,
                horario,
                referencia,
                status
            );

            area.appendChild(item);
        });

    } catch (erro) {
        area.textContent =
            "Não foi possível carregar os alertas. Verifique a conexão com a API.";

        console.error("Erro ao consultar alertas:", erro);
    }
}

// ==========================================
// CLASSES VISUAIS DOS STATUS
// ==========================================

function obterClasseStatus(status) {
    const classesStatus = {
        "pendente": "status-pendente",
        "em análise": "status-em-analise",
        "publicado": "status-publicado",
        "resolvido": "status-resolvido"
    };

    return classesStatus[status] || "status-pendente";
}

// ==========================================
// LOGIN DO ADMINISTRADOR
// ==========================================

if (formularioLoginAdmin) {
    formularioLoginAdmin.addEventListener("submit", fazerLoginAdmin);
}

async function fazerLoginAdmin(evento) {
    evento.preventDefault();

    const usuario = campoUsuarioAdmin.value.trim();
    const senha = campoSenhaAdmin.value;

    if (mensagemLoginAdmin) {
        mensagemLoginAdmin.textContent = "Verificando acesso...";
        mensagemLoginAdmin.className = "";
    }

    try {
        const dados = new URLSearchParams();

        dados.append("username", usuario);
        dados.append("password", senha);

        const resposta = await fetch(`${API_URL}/admin/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: dados
        });

        if (!resposta.ok) {
            throw new Error("Usuário ou senha incorretos.");
        }

        const resultado = await resposta.json();

        tokenAdmin = resultado.access_token;

        campoSenhaAdmin.value = "";

        if (mensagemLoginAdmin) {
            mensagemLoginAdmin.textContent = "Acesso autorizado!";
            mensagemLoginAdmin.className = "sucesso";
        }

        mostrarTela("admin");
        await carregarAlertasAdmin();

    } catch (erro) {
        tokenAdmin = null;

        if (mensagemLoginAdmin) {
            mensagemLoginAdmin.textContent =
                "Não foi possível entrar. Confira o usuário e a senha.";
            mensagemLoginAdmin.className = "erro";
        }

        console.error("Erro no login administrativo:", erro);
    }
}

// ==========================================
// CARREGAR FILA DE MODERAÇÃO
// ==========================================

async function carregarAlertasAdmin() {
    if (!listaAlertasAdmin) return;

    if (!tokenAdmin) {
        listaAlertasAdmin.textContent =
            "Faça login para consultar os alertas.";
        return;
    }

    listaAlertasAdmin.textContent = "Carregando alertas para análise...";

    try {
        const resposta = await fetch(
            `${API_URL}/admin/alertas`,
            {
                headers: {
                    "Authorization": `Bearer ${tokenAdmin}`
                }
            }
        );

        if (resposta.status === 401) {
            tokenAdmin = null;
            mostrarTela("loginAdmin");

            if (mensagemLoginAdmin) {
                mensagemLoginAdmin.textContent =
                    "Sua sessão expirou. Faça login novamente.";
                mensagemLoginAdmin.className = "erro";
            }

            return;
        }

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar a fila administrativa.");
        }

        const alertas = await resposta.json();

        listaAlertasAdmin.innerHTML = "";

        if (alertas.length === 0) {
            listaAlertasAdmin.textContent =
                "Não há alertas cadastrados no momento.";
            return;
        }

        alertas.forEach(function (alerta) {
            criarCartaoAdmin(alerta);
        });

    } catch (erro) {
        listaAlertasAdmin.textContent =
            "Não foi possível carregar os alertas. Verifique se a API está funcionando.";

        console.error("Erro ao carregar fila administrativa:", erro);
    }
}

// ==========================================
// CRIAR CARTÃO DO ALERTA NA ADMINISTRAÇÃO
// ==========================================

function criarCartaoAdmin(alerta) {
    const item = document.createElement("article");

    const titulo = document.createElement("h3");
    titulo.textContent = alerta.titulo;

    const descricao = document.createElement("p");
    descricao.textContent = `Descrição: ${alerta.descricao}`;

    const categoria = document.createElement("p");
    categoria.textContent = `Categoria: ${alerta.categoria}`;

    const situacao = document.createElement("p");
    situacao.textContent = `Situação: ${alerta.situacao || "Não informada"}`;

    const bairro = document.createElement("p");
    bairro.textContent = `Bairro: ${alerta.bairro}`;

    const data = document.createElement("p");
    data.textContent = `Data da ocorrência: ${formatarDataBrasileira(alerta.data_ocorrencia)}`;

    const horario = document.createElement("p");
    horario.textContent = `Horário aproximado: ${alerta.horario_aproximado || "Não informado"}`;

    const referencia = document.createElement("p");
    referencia.textContent = `Local de referência: ${alerta.local_referencia || "Não informado"}`;

    const status = document.createElement("p");
    status.textContent = `Status: ${alerta.status}`;
    status.className = "status-alerta";
    status.classList.add(obterClasseStatus(alerta.status));

    item.append(
        titulo,
        descricao,
        categoria,
        situacao,
        bairro,
        data,
        horario,
        referencia,
        status
    );

    const acoes = document.createElement("div");
    acoes.className = "acoes-admin";

    if (alerta.status === "pendente") {
        const botaoAnalisar = document.createElement("button");

        botaoAnalisar.type = "button";
        botaoAnalisar.textContent = "Iniciar análise";

        botaoAnalisar.addEventListener("click", function () {
            atualizarStatusAdmin(alerta.id, "em análise");
        });

        acoes.appendChild(botaoAnalisar);
    }

    if (alerta.status === "em análise") {
        const botaoPublicar = document.createElement("button");

        botaoPublicar.type = "button";
        botaoPublicar.textContent = "Publicar alerta";

        botaoPublicar.addEventListener("click", function () {
            const confirmar = window.confirm(
                "Confirma a publicação deste alerta para consulta pelos moradores?"
            );

            if (confirmar) {
                atualizarStatusAdmin(alerta.id, "publicado");
            }
        });

        acoes.appendChild(botaoPublicar);
    }

    const botaoExcluir = document.createElement("button");
    botaoExcluir.type = "button";
    botaoExcluir.textContent = "Excluir alerta";
    botaoExcluir.addEventListener("click", function () {
        const confirmar = window.confirm(
            "Tem certeza de que deseja excluir permanentemente este alerta? Esta ação não poderá ser desfeita."
        );

        if (confirmar) {
            excluirAlertaAdmin(alerta.id);
        }
    });
    acoes.appendChild(botaoExcluir);
    item.appendChild(acoes);
    listaAlertasAdmin.appendChild(item);
}

// ==========================================
// ATUALIZAR STATUS DO ALERTA
// ==========================================

async function excluirAlertaAdmin(id) {
    if (!tokenAdmin) {
        mostrarTela("loginAdmin");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/alertas/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${tokenAdmin}`
            }
        });

        if (resposta.status === 401) {
            tokenAdmin = null;
            mostrarTela("loginAdmin");
            window.alert("Sua sessão expirou. Faça login novamente.");
            return;
        }

        if (resposta.status === 404) {
            throw new Error("Alerta não encontrado.");
        }

        if (!resposta.ok) {
            throw new Error("Não foi possível excluir o alerta.");
        }

        await carregarAlertasAdmin();

    } catch (erro) {
        window.alert(erro.message || "Não foi possível excluir o alerta.");
        console.error("Erro ao excluir alerta:", erro);
    }
}
async function atualizarStatusAdmin(id, novoStatus) {
    if (!tokenAdmin) {
        mostrarTela("loginAdmin");
        return;
    }

    try {
        const resposta = await fetch(
            `${API_URL}/alertas/${id}/status?novo_status=${encodeURIComponent(novoStatus)}`,
            {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${tokenAdmin}`
                }
            }
        );

        if (resposta.status === 401) {
            tokenAdmin = null;
            mostrarTela("loginAdmin");

            if (mensagemLoginAdmin) {
                mensagemLoginAdmin.textContent =
                    "Sua sessão expirou. Faça login novamente.";
                mensagemLoginAdmin.className = "erro";
            }

            return;
        }

        if (!resposta.ok) {
            throw new Error("Não foi possível atualizar o status do alerta.");
        }

        await carregarAlertasAdmin();

    } catch (erro) {
        window.alert(
            "Não foi possível atualizar o alerta. Tente novamente."
        );

        console.error("Erro ao atualizar status:", erro);
    }
}

// ==========================================
// ATUALIZAR LISTA ADMINISTRATIVA
// ==========================================

if (botaoAtualizarAdmin) {
    botaoAtualizarAdmin.addEventListener("click", function () {
        carregarAlertasAdmin();
    });
}

// ==========================================
// SAIR DA ÁREA ADMINISTRATIVA
// ==========================================

if (botaoSairAdmin) {
    botaoSairAdmin.addEventListener("click", function () {
        tokenAdmin = null;

        if (formularioLoginAdmin) {
            formularioLoginAdmin.reset();
        }

        if (mensagemLoginAdmin) {
            mensagemLoginAdmin.textContent = "";
            mensagemLoginAdmin.className = "";
        }

        if (listaAlertasAdmin) {
            listaAlertasAdmin.innerHTML = "";
        }

        mostrarTela("inicio");
    });
}
