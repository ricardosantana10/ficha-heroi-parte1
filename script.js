document.addEventListener("DOMContentLoaded", () => {

    // 1. MENU RESPONSIVO

    const menuToggle = document.querySelector("#menu-toggle");
    const nav = document.querySelector("#nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            const menuAberto = nav.classList.toggle("active");

            menuToggle.classList.toggle("active", menuAberto);
            menuToggle.setAttribute("aria-expanded", menuAberto);
            menuToggle.setAttribute(
                "aria-label",
                menuAberto ? "Fechar menu" : "Abrir menu"
            );
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Abrir menu");
            });
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                nav.classList.remove("active");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Abrir menu");
            }
        });
    }


    // 2. SAUDAÇÃO DINÂMICA

    const heroContent = document.querySelector(".hero-content");

    if (heroContent) {
        const hora = new Date().getHours();
        let saudacao;

        if (hora >= 5 && hora < 12) {
            saudacao = "Bom dia, viajante.";
        } else if (hora >= 12 && hora < 18) {
            saudacao = "Boa tarde, guerreiro.";
        } else {
            saudacao = "Boa noite, guardião.";
        }

        const mensagemSaudacao = document.createElement("p");
        mensagemSaudacao.className = "greeting-message";
        mensagemSaudacao.textContent = saudacao;

        heroContent.prepend(mensagemSaudacao);
    }


    // 3. HISTÓRIA — VER MAIS / VER MENOS

    const characterContent = document.querySelector(".section-content");

    if (characterContent) {
        const paragrafos = characterContent.querySelectorAll(":scope > p");

        if (paragrafos.length >= 3) {
            const paragrafoExtra = paragrafos[paragrafos.length - 1];

            paragrafoExtra.classList.add("historia-extra");
            paragrafoExtra.hidden = true;

            const botaoHistoria = document.createElement("button");
            botaoHistoria.type = "button";
            botaoHistoria.className = "btn btn-outline story-button";
            botaoHistoria.textContent = "Ver história completa";
            botaoHistoria.setAttribute("aria-expanded", "false");

            paragrafoExtra.after(botaoHistoria);

            botaoHistoria.addEventListener("click", () => {
                const historiaVisivel = !paragrafoExtra.hidden;

                paragrafoExtra.hidden = historiaVisivel;

                botaoHistoria.textContent = historiaVisivel
                    ? "Ver história completa"
                    : "Ver menos";

                botaoHistoria.setAttribute(
                    "aria-expanded",
                    String(!historiaVisivel)
                );
            });
        }
    }


    // 4. INVENTÁRIO DINÂMICO

    const itensInventario = [
        {
            nome: "DRAUGR",
            tipo: "Arma",
            raridade: "Lendário",
            descricao: "Machado ancestral forjado no coração das montanhas de Vardheim."
        },
        {
            nome: "ESCUDO DE RUNAS",
            tipo: "Defesa",
            raridade: "Épico",
            descricao: "Escudo capaz de absorver impactos e devolver parte da força recebida."
        },
        {
            nome: "CORRENTE DE SKAL",
            tipo: "Arma",
            raridade: "Raro",
            descricao: "Correntes mágicas utilizadas para prender criaturas sobrenaturais."
        },
        {
            nome: "ARMADURA DO GUARDIÃO",
            tipo: "Armadura",
            raridade: "Lendário",
            descricao: "Proteção criada com metais encontrados nos limites dos nove reinos."
        },
        {
            nome: "POÇÃO DE VARDHEIM",
            tipo: "Poção",
            raridade: "Incomum",
            descricao: "Poção antiga que recupera parte da energia do guerreiro."
        },
        {
            nome: "SÍMBOLO DOS GUARDIÕES",
            tipo: "Relíquia",
            raridade: "Mítico",
            descricao: "Relíquia recebida por Kael após sobreviver à queda de Vardheim."
        }
    ];

    const listaArmas = document.querySelector(".weapon-list");
    let filtroAtual = "Todos";

    if (listaArmas) {
        listaArmas.innerHTML = "";

        const areaFiltros = document.createElement("div");
        areaFiltros.className = "inventory-filters";

        const categorias = [
            "Todos",
            "Arma",
            "Defesa",
            "Armadura",
            "Poção",
            "Relíquia"
        ];

        categorias.forEach((categoria) => {
            const botao = document.createElement("button");

            botao.type = "button";
            botao.className = "filter-button";
            botao.textContent = categoria;
            botao.dataset.filtro = categoria;

            if (categoria === "Todos") {
                botao.classList.add("active");
                botao.setAttribute("aria-pressed", "true");
            } else {
                botao.setAttribute("aria-pressed", "false");
            }

            botao.addEventListener("click", () => {
                filtroAtual = categoria;

                areaFiltros.querySelectorAll("button").forEach((item) => {
                    const ativo = item.dataset.filtro === filtroAtual;

                    item.classList.toggle("active", ativo);
                    item.setAttribute("aria-pressed", String(ativo));
                });

                renderizarInventario();
            });

            areaFiltros.appendChild(botao);
        });

        const contadorItens = document.createElement("p");
        contadorItens.className = "inventory-counter";
        contadorItens.setAttribute("aria-live", "polite");

        const areaItens = document.createElement("div");
        areaItens.className = "inventory-items";

        listaArmas.append(areaFiltros, contadorItens, areaItens);

        // Sistema de favoritos usando localStorage

        let favoritos = [];

        try {
            favoritos = JSON.parse(localStorage.getItem("kaelFavoritos")) || [];
        } catch (erro) {
            favoritos = [];
        }

        function renderizarInventario() {
            areaItens.innerHTML = "";

            const itensFiltrados = itensInventario.filter((item) => {
                return filtroAtual === "Todos" || item.tipo === filtroAtual;
            });

            itensFiltrados.forEach((item, indice) => {
                const card = document.createElement("article");
                card.className = "weapon inventory-item";

                const numero = document.createElement("span");
                numero.className = "weapon-number";
                numero.textContent = String(indice + 1).padStart(2, "0");

                const informacoes = document.createElement("div");

                const titulo = document.createElement("h3");
                titulo.textContent = item.nome;

                const descricao = document.createElement("p");
                descricao.textContent = item.descricao;

                const detalhes = document.createElement("small");
                detalhes.className = "item-details";
                detalhes.textContent = `${item.tipo} • ${item.raridade}`;

                informacoes.append(titulo, descricao, detalhes);

                const botaoFavorito = document.createElement("button");

                botaoFavorito.type = "button";
                botaoFavorito.className = "favorite-button";

                botaoFavorito.textContent = favoritos.includes(item.nome)
                    ? "★ Favorito"
                    : "☆ Favoritar";

                botaoFavorito.setAttribute(
                    "aria-pressed",
                    String(favoritos.includes(item.nome))
                );

                botaoFavorito.addEventListener("click", () => {
                    if (favoritos.includes(item.nome)) {
                        favoritos = favoritos.filter(
                            (nome) => nome !== item.nome
                        );
                    } else {
                        favoritos.push(item.nome);
                    }

                    localStorage.setItem(
                        "kaelFavoritos",
                        JSON.stringify(favoritos)
                    );

                    renderizarInventario();
                });

                card.append(numero, informacoes, botaoFavorito);
                areaItens.appendChild(card);
            });

            contadorItens.textContent =
                `${itensFiltrados.length} de ${itensInventario.length} itens exibidos • ` +
                `${favoritos.length} favorito(s)`;

            if (itensFiltrados.length === 0) {
                areaItens.textContent =
                    "Nenhum item encontrado nesta categoria.";
            }
        }

        renderizarInventario();
    }


    // 5. EXPERIÊNCIA (XP) E LEVEL UP

    const secaoAtributos = document.querySelector("#atributos");

    let xp = 0;
    const xpNecessario = 100;

    if (secaoAtributos) {
        const painelXP = document.createElement("div");
        painelXP.className = "xp-panel";

        const tituloXP = document.createElement("h3");
        tituloXP.textContent = "EXPERIÊNCIA DO GUARDIÃO";

        const textoXP = document.createElement("p");
        textoXP.className = "xp-text";
        textoXP.textContent = `XP: ${xp} / ${xpNecessario}`;

        const barraXP = document.createElement("div");
        barraXP.className = "xp-bar";
        barraXP.setAttribute("role", "progressbar");
        barraXP.setAttribute("aria-valuemin", "0");
        barraXP.setAttribute("aria-valuemax", String(xpNecessario));
        barraXP.setAttribute("aria-valuenow", "0");

        const progressoXP = document.createElement("span");
        barraXP.appendChild(progressoXP);

        const botaoXP = document.createElement("button");
        botaoXP.type = "button";
        botaoXP.className = "btn btn-primary";
        botaoXP.textContent = "Completar missão (+25 XP)";

        const mensagemXP = document.createElement("p");
        mensagemXP.className = "xp-feedback";
        mensagemXP.setAttribute("aria-live", "polite");

        painelXP.append(
            tituloXP,
            textoXP,
            barraXP,
            botaoXP,
            mensagemXP
        );

        secaoAtributos.appendChild(painelXP);

        function atualizarXP() {
            const porcentagem = (xp / xpNecessario) * 100;

            progressoXP.style.width = `${porcentagem}%`;
            textoXP.textContent = `XP: ${xp} / ${xpNecessario}`;

            barraXP.setAttribute("aria-valuenow", String(xp));
        }

        botaoXP.addEventListener("click", () => {
            if (xp < xpNecessario) {
                xp = Math.min(xp + 25, xpNecessario);

                atualizarXP();

                if (xp >= xpNecessario) {
                    mensagemXP.textContent =
                        "Nível up! Kael alcançou um novo nível!";

                    botaoXP.disabled = true;
                    botaoXP.textContent = "Missão concluída";
                } else {
                    mensagemXP.textContent =
                        "Missão concluída! Kael ganhou 25 XP.";
                }
            }
        });
    }


    // 6. FORMULÁRIO DE CONTATO


// 6. FORMULÁRIO DE CONTATO COM ENVIO DE E-MAIL

const formulario = document.querySelector(".contact-form");

if (formulario) {
    const campoNome = formulario.querySelector("#nome");
    const campoEmail = formulario.querySelector("#email");
    const campoMensagem = formulario.querySelector("#mensagem");

    const feedbackFormulario = document.createElement("p");
    feedbackFormulario.className = "form-feedback";
    feedbackFormulario.setAttribute("aria-live", "polite");

    formulario.appendChild(feedbackFormulario);

    formulario.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nome = campoNome.value.trim();
        const email = campoEmail.value.trim();
        const mensagem = campoMensagem.value.trim();

        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        feedbackFormulario.classList.remove("success", "error");

        if (!nome || !email || !mensagem) {
            feedbackFormulario.textContent =
                "Preencha todos os campos antes de enviar.";
            feedbackFormulario.classList.add("error");
            return;
        }

        if (!formatoEmail.test(email)) {
            feedbackFormulario.textContent =
                "Digite um endereço de e-mail válido.";
            feedbackFormulario.classList.add("error");
            campoEmail.focus();
            return;
        }

        // Substitua pelos seus dados do EmailJS
        const SERVICE_ID = "SEU_SERVICE_ID";
        const TEMPLATE_ID = "SEU_TEMPLATE_ID";
        const PUBLIC_KEY = "SUA_PUBLIC_KEY";

        const parametros = {
            from_name: nome,
            from_email: email,
            reply_to: email,
            message: mensagem
        };

        const botaoEnviar = formulario.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

        if (botaoEnviar) {
            botaoEnviar.disabled = true;
            botaoEnviar.textContent = "Enviando...";
        }

        feedbackFormulario.textContent = "Enviando sua mensagem...";

        try {
            await emailjs.send(
                service_7d449lg,
                template_a801odk,
                parametros,
                { publicKey: W3ufJ4RTBJsaXAkeE }
            );

            feedbackFormulario.textContent =
                "Mensagem enviada com sucesso! Obrigado pelo contato.";

            feedbackFormulario.classList.add("success");

            formulario.reset();

        } catch (erro) {
            console.error("Erro ao enviar e-mail:", erro);

            feedbackFormulario.textContent =
                "Não foi possível enviar sua mensagem. Tente novamente.";

            feedbackFormulario.classList.add("error");

        } finally {
            if (botaoEnviar) {
                botaoEnviar.disabled = false;
                botaoEnviar.textContent = "Enviar mensagem";
            }
        }
    });
}



    // 7. MODO CLARO E ESCURO

    const botaoTema = document.createElement("button");

    botaoTema.type = "button";
    botaoTema.className = "theme-toggle";
    botaoTema.textContent = "☾ Modo da Claro";
    botaoTema.setAttribute("aria-pressed", "false");
    botaoTema.setAttribute("aria-label", "Ativar modo claro");

    const header = document.querySelector(".header");

    if (header) {
        header.appendChild(botaoTema);

        const temaSalvo = localStorage.getItem("kaelTema");

        if (temaSalvo === "claro") {
            document.body.classList.add("guild-light");

            botaoTema.textContent = "☀ Modo escuro";
            botaoTema.setAttribute("aria-pressed", "true");
        }

        botaoTema.addEventListener("click", () => {
            const modoClaro = document.body.classList.toggle("guild-light");

            botaoTema.textContent = modoClaro
                ? "☀ Modo escuro"
                : "☾ Modo da Claro";

            botaoTema.setAttribute("aria-pressed", String(modoClaro));

            botaoTema.setAttribute(
                "aria-label",
                modoClaro ? "Ativar modo escuro" : "Ativar modo claro"
            );

            localStorage.setItem(
                "kaelTema",
                modoClaro ? "claro" : "escuro"
            );
        });
    }


    // 8. ESTILOS DOS ELEMENTOS CRIADOS PELO JAVASCRIPT

    const estilos = document.createElement("style");

    estilos.textContent = `
        .greeting-message {
            color: var(--gold);
            font-size: 12px;
            letter-spacing: 2px;
            margin-bottom: 18px;
            text-transform: uppercase;
        }

        .story-button {
            margin-top: 22px;
            background: transparent;
        }

        .inventory-filters {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 22px;
        }

        .filter-button,
        .favorite-button,
        .theme-toggle {
            padding: 10px 13px;
            color: var(--gold);
            background: var(--black-light);
            border: 1px solid rgba(184,154,90,.35);
            cursor: pointer;
            transition: .3s;
        }

        .filter-button:hover,
        .filter-button.active,
        .favorite-button:hover,
        .theme-toggle:hover {
            color: var(--black);
            background: var(--gold);
        }

        .inventory-counter {
            margin-bottom: 12px;
            color: var(--gray);
            font-size: 11px;
        }

        .inventory-items .weapon {
            grid-template-columns: 35px 1fr auto;
            gap: 12px;
            padding: 18px 0;
        }

        .inventory-items .weapon h3 {
            font-size: 18px;
        }

        .item-details {
            display: inline-block;
            margin-top: 8px;
            color: var(--gold);
            font-size: 10px;
        }

        .favorite-button {
            font-size: 10px;
            white-space: nowrap;
        }

        .xp-panel {
            max-width: 650px;
            margin: 45px auto 0;
            padding: 25px;
            background: var(--black-light);
            border: 1px solid var(--border);
        }

        .xp-panel h3 {
            color: var(--gold);
            font-family: var(--title);
            font-size: 17px;
            margin-bottom: 12px;
        }

        .xp-text,
        .xp-feedback {
            color: var(--gray);
            font-size: 12px;
            margin: 12px 0;
        }

        .xp-bar {
            height: 10px;
            overflow: hidden;
            background: #292929;
            border: 1px solid var(--border);
            margin: 12px 0 20px;
        }

        .xp-bar span {
            display: block;
            width: 0;
            height: 100%;
            background: linear-gradient(90deg, var(--red), var(--gold));
            transition: width .4s ease;
        }

        .xp-feedback {
            color: var(--gold);
        }

        .form-feedback {
            font-size: 12px;
            line-height: 1.6;
        }

        .form-feedback.error {
            color: #ff7777;
        }

        .form-feedback.success {
            color: #8fd6a0;
        }

        .input-error {
            border-color: #c62828 !important;
        }

        .theme-toggle {
            margin-left: 15px;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        body.guild-light {
            --black: #e9e5dc;
            --black-light: #ded8cc;
            --dark: #d2cabb;
            --white: #171717;
            --gray: #55534e;
            --border: rgba(0,0,0,.16);
            background: var(--black);
            color: var(--white);
        }

        body.guild-light .header,
        body.guild-light .nav,
        body.guild-light .footer,
        body.guild-light .contact-container,
        body.guild-light .attribute-card,
        body.guild-light .xp-panel {
            background: #ded8cc;
        }

        body.guild-light .nav a,
        body.guild-light .footer-column a,
        body.guild-light .footer-brand p {
            color: #55534e;
        }

        body.guild-light .input-group input,
        body.guild-light .input-group textarea {
            color: #171717;
            background: #f4f0e8;
        }

        body.guild-light .inventory-items .weapon {
            border-color: rgba(0,0,0,.16);
        }

        @media (max-width: 1050px) {
            .theme-toggle {
                margin-left: auto;
                margin-right: 12px;
                padding: 8px;
                font-size: 9px;
            }
        }

        @media (max-width: 550px) {
            .inventory-items .weapon {
                grid-template-columns: 28px 1fr;
            }

            .inventory-items .favorite-button {
                grid-column: 2;
                justify-self: start;
            }

            .xp-panel {
                padding: 18px;
            }

            .theme-toggle {
                max-width: 105px;
                font-size: 8px;
            }
        }
    `;

    document.head.appendChild(estilos);

});

