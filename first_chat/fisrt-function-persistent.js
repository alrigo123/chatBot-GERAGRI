document.addEventListener("DOMContentLoaded", function () {
    // ========================
    // 1. ELEMENTOS DEL DOM
    // ========================
    const chatbot = document.getElementById("chatbot");
    const launcher = document.getElementById("launcher");
    const minimizeBtn = document.getElementById("minimizeBtn");
    const closeBtn = document.getElementById("closeBtn");
    const chatbotHeader = document.getElementById("chatbotHeader");
    const chatMessages = document.getElementById("chatMessages");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const videoAvatar = document.getElementById("asistente-video");

    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const closeModal = document.getElementById("closeModal");
    const openHdLink = document.getElementById("openHD");

    // ========================
    // 2. VARIABLES DE ESTADO
    // ========================
    let isMinimized = false;
    let isClosed = false;
    let currentMenu = "main";
    let menuHistory = [];
    let typingTimeout;

    // ========================
    // 3. FUNCIONES DE PERSISTENCIA
    // ========================
    function saveChatbotState() {
        const state = {
            isMinimized: isMinimized,
            isClosed: isClosed,
            currentMenu: currentMenu,
            menuHistory: menuHistory
        };
        localStorage.setItem("chatbotState", JSON.stringify(state));
    }

    function loadChatbotState() {
        const savedState = localStorage.getItem("chatbotState");
        if (savedState) {
            const state = JSON.parse(savedState);
            isMinimized = state.isMinimized;
            isClosed = state.isClosed || false;
            currentMenu = state.currentMenu || "main";
            menuHistory = state.menuHistory || [];

            // Aplicar estado visual al cargar
            if (isMinimized) {
                chatbot.classList.add("minimized");
                minimizeBtn.innerHTML = '<i class="fas fa-plus"></i>';
            }
            if (isClosed) {
                chatbot.classList.add("closed");
                launcher.style.display = "flex";
            } else {
                chatbot.classList.remove("closed");
                launcher.style.display = "none";
                chatbot.classList.add("visible");
            }
        } else{
            // Estado por defecto (sin datos en localStorage)
        launcher.style.display = "none";  // 👈 Oculta el lanzador
        chatbot.classList.add("visible");  // 👈 Muestra el chat
        }
    }

    // ========================
    // 4. FUNCIONES DEL CHATBOT
    // ========================
    function showTypingIndicator() {
        const typingDiv = document.createElement("div");
        typingDiv.className = "typing-indicator";
        typingDiv.innerHTML = "<span></span><span></span><span></span>";
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    }

    const menuStructure = {
        main: {
            title: "🌟 ¡Bienvenido a GERAGRI! 🌱\nTu asistente agribot :D",
            options: [
                {
                    text: "<strong>📂 Servicio de Trámites</strong>",
                    action: "menu",
                    target: "STRAMITES",
                },
                {
                    text: "<strong>⚖️ Procedimientos Legales</strong>",
                    action: "menu",
                    target: "PLEGALES",
                },
                {
                    text: "<strong>🏞️ Procedimientos comunidades campesinas, nativas y eriazos</strong>",
                    action: "menu",
                    target: "PAREA",
                },
                {
                    text: "<strong>🔴 Terminar chat</strong>",
                    action: "end",
                    response:
                        "👋 ¡Gracias por usar en GERAGRIBOT! \nSi necesitas más ayuda, aquí estaré.",
                },
            ],
        },
        STRAMITES: {
            title:
                "📋 <strong>Trámites Disponibles</strong>\nSelecciona una opción:",
            options: [
                {
                    text: "🏖️ Vacaciones Truncas y/o Compensación vacacional",
                    action: "message",
                    response:
                        "📜 <strong>Requisitos:</strong>\n• Solicitud dirigida al gerente.\n• Contratos, adendas o resoluciones de designación y conclusión.\n• Constancia de no deudor de la Unidad no Estructurada de Contabilidad, Tesorería y Control Patrimonial.",
                },
                {
                    text: "⏳ Compensación por Tiempo de Servicios",
                    action: "message",
                    response:
                        "📜 <strong>Requisitos:</strong>\n• Solicitud dirigida al gerente.\n• Resolución de cese.\n• Constancia de pagos y descuentos.\n• Constancia de no deudor de la Unidad no Estructurada de Contabilidad, Tesorería y Control Patrimonial.",
                },
                {
                    text: "💝 Pensión por Sobrevivencia",
                    action: "message",
                    response:
                        "📜 <strong>Requisitos:</strong>\n• Solicitud dirigida al gerente.\n• Acta de defunción.\n• Acta original de matrimonio.\n• DNI del fallecido.\n• DNI del solicitante.\n• Formato III - <em>FORMATO DE SOLICITUD de la Resolución Jefatural N° 150-2021-ONP-JF.</em>\n• Resolución de nombramiento.\n• Resolución de incorporación al D.L. N° 20530.\n• Resolución de cese.\n• Resolución de pensión definitiva.\n• 3 últimas boletas de pago de pensión del fallecido.\n• Nro de cuenta del Banco de la Nación.",
                },
                {
                    text: "👨‍👩‍👧‍👦 Reconocimiento como Herederos de Deuda Social",
                    action: "message",
                    response:
                        "📜 <strong>Requisitos:</strong>\n• Sucesión intestada.\n• Testimonio expedido por la notaría.\n• Sentencia de vista del proceso judicial.\n• Resolución consentida del proceso judicial.\n• Liquidación del proceso judicial.\n• DNI de los herederos universales.",
                },
                {
                    text: "<strong>⚰️ Gastos de Sepelio</strong>\n<small>Subsidios</small>",
                    action: "menu",
                    target: "SEPELIO_LUTO",
                },
                {
                    text: "🔙 <strong>Volver al inicio</strong>",
                    action: "menu",
                    target: "main",
                },
            ],
        },
        SEPELIO_LUTO: {
            title: "⚰️ <strong>Sepelios</strong>\nTipos de gasto:",
            options: [
                {
                    text: "💐 Subsidio por Gastos por Sepelio",
                    action: "message",
                    response:
                        "🧾 <strong>Requisitos:</strong>\n• Solicitud dirigida al gerente.\n• Acta de defunción.\n• Acta original de matrimonio o de nacimiento, dependiendo de quien solicita.\n• DNI del fallecido.\n• DNI del solicitante.\n• Comprobantes de pago de los gastos realizados.\n• Resolución de pensión.\n• Última boleta de pago de pensión del fallecido\n• Nro de cuenta del Banco de la Nación.",
                },
                {
                    text: "💸 Subsidio por Fallecimiento",
                    action: "message",
                    response:
                        "🧾 <strong>Requisitos:</strong>\n• Solicitud dirigida al gerente.\n• Acta de defunción.\n• Acta original de matrimonio o sucesión intestada, dependiendo de quien solicita.\n• DNI del fallecido.\n• DNI del solicitante.\n• Resolución de pensión.\n• Última boleta de pago de pensión del fallecido.\n• Nro de cuenta del Banco de la Nación.",
                },
                {
                    text: "↩️ <strong>Volver a Trámites</strong>",
                    action: "menu",
                    target: "STRAMITES",
                },
            ],
        },
        PLEGALES: {
            title:
                "⚖️ <strong>Procedimientos Legales</strong>\nÁrea jurídica especializada:",
            options: [
                {
                    text: "👨‍⚖️ Sentencias Consentidas",
                    action: "message",
                    response:
                        "🧾 <strong>Requisitos:</strong>\n• Copia del D.N.I del beneficiario (legible).\n• Resolución Directoral de Reconocimiento de Deuda..\n• Auto-admisorio de la Demanda.\n• Sentencia Judicial de 1ra y 2da Instancia.\n• Resolución Judicial que declara Consentida.\n• Resolución Judicial que aprueba la Liquidación de Pool de Peritos.\n• Liquidación de Pool de Peritos.\n• Resolución Judicial de Requerimiento de Pago.\n• Notificación Judicial de Requerimiento de Pago.",
                },
                {
                    text: "👪 Requisito de Herederos",
                    action: "message",
                    response:
                        "🧾 <strong>Requisitos:</strong>\n• Copia del D.N.I de herederos o beneficiarios.\n• Resolución Directoral de Reconocimiento de Herederos.\n• Resolución de Incorporación al proceso judicial como heredero en el expediente principal en ejecución.\n• Sucesión Intestada JUDICIAL O NOTARIAL.\n• Partida Registral de la Sucesión Intestada DEFINITIVA debidamente inscrita en la SUNARP.",
                },
                {
                    text: "🩺 Requisitos por Enfermedad",
                    action: "message",
                    response:
                        "🧾 <strong>Requisitos:</strong>\n• Informe firma por la Junta de Médicos <em>(TRES MEDICOS de MINSA O ESSALUD)</em>.\n• Los médicos que suscriben el informe deben estar habilitados, indicar especialidad y N.° de colegiatura otorgado por el Colegio de Médicos del Perú.\n• Indicar FASE y/o ESTADO de la enfermedad sea terminal o avanzado de paciente.\n• Especificar EL CODIGO DE LA ENFERMEDAD.\n• Fecha, lugar, N.° de Informe, datos completos del paciente y motivo de la expedición del Informe.",
                },
                {
                    text: "🔙 <strong>Volver al inicio</strong>",
                    action: "menu",
                    target: "main",
                },
            ],
        },
        PAREA: {
            title:
                "🌄 <strong>Tramites de Área de Comunidades</strong>\nProcedimientos y Requisitos:",
            options: [
                {
                    text: "<strong>🏡 Comunidades Campesinas</strong>\n<small>Reconocimiento y titulación</small>",
                    action: "menu",
                    target: "CCAMPESINASS",
                },
                {
                    text: "<strong>🌳 Comunidades Nativas</strong>\n<small>Reconocimiento y titulación</small>",
                    action: "menu",
                    target: "CNATIVAS",
                },
                {
                    text: "<strong>📝 Procedimientos Administrativos</strong>\n<small>Saneamientos y más</small>",
                    action: "menu",
                    target: "PADMINISTRATIVOS",
                },
                {
                    text: "<strong>🗺️ Servicios Catastrales</strong>\n<small>Asignacion de codigos y mas</small>",
                    action: "menu",
                    target: "SCATASTRALES",
                },
                {
                    text: "🛣️ Formalización Tierras Eriazas",
                    action: "message",
                    response:
                        "🧾 <strong>Requisitos:</strong>\n Los Requisitos se aprecian en la siguiente imagen.<strong>\nHaz click 👇:</strong>",
                    image: "ERIAZAS.png",
                },
                {
                    text: "👨‍💼 Cambio de Titular en Zonas Catastradas ",
                    action: "message",
                    response:
                        "🧾 <strong>Requisitos:</strong>\n• La información señalada en el artículo 124 del TUO de la LPAG.\n• La ubicación del predio y el Código de Referencia Catastral.\n• Documento que acredite fehacientemente la condición de propietario. <small>En caso de sucesivas transferencias, se acredita el tracto sucesivo.</small>\n• De encontrarse inscrito el predio, copia literal actualizada de la partida registral del predio.",
                },
                {
                    text: "🔙 <strong>Volver al inicio</strong>",
                    action: "menu",
                    target: "main",
                },
            ],
        },
        CCAMPESINASS: {
            title:
                "🏡 <strong>Comunidades Campesinas</strong>\nProcedimientos disponibles:",
            options: [
                {
                    text: "🆔 Reconocimiento de Comunidades",
                    action: "message",
                    response:
                        "🧾 <strong>Requisitos:</strong>\n Los Requisitos se aprecian en la siguiente imagen.<strong>\nHaz click 👇:</strong>",
                    image: "RECON_COM_CAMPESINAS.png",
                },
                {
                    text: "📍 Deslinde y Titulación de Comunidades",
                    action: "message",
                    response:
                        "🧾 <strong>Requisitos:</strong>\n Los Requisitos se aprecian en la siguiente imagen.<strong>\nHaz click 👇:</strong>",
                    image: "DESLINDE_TITULACION_COM_CAMPESINAS.png",
                },
                {
                    text: "🛰️ Georreferenciación Comunidades",
                    action: "message",
                    response:
                        "🧾 <strong>Requisitos:</strong>\n Los Requisitos se aprecian en la siguiente imagen.<strong>\nHaz click 👇:</strong>",
                    image: "GEOREF_CAMPESI.png",
                },
                {
                    text: "↩️ <strong>Volver a Área Comunidades</strong>",
                    action: "menu",
                    target: "PAREA",
                },
            ],
        },
        CNATIVAS: {
            title:
                "🌳 <strong>Comunidades Nativas</strong>\nProcedimientos disponibles:",
            options: [
                {
                    text: "🆔 Reconocimiento de Comunidades",
                    action: "message",
                    response:
                        "🧾 <strong>Requisitos:</strong>\n Los Requisitos se aprecian en la siguiente imagen.<strong>\nHaz click 👇:</strong>",
                    image: "RECON_COM_NATIVA.png",
                },
                {
                    text: "📍 Demarcación y Titulación de Comunidades",
                    action: "message",
                    response:
                        "🧾 <strong>Requisitos:</strong>\n Los Requisitos se aprecian en la siguiente imagen.<strong>\nHaz click 👇:</strong>",
                    image: "DEMARC_COM_NATIVA.png",
                },
                {
                    text: "🛰️ Georreferenciación de Comunidades",
                    action: "message",
                    response:
                        "🧾 <strong>Requisitos:</strong>\n Los Requisitos se aprecian en la siguiente imagen.<strong>\nHaz click 👇:</strong>",
                    image: "GEOREF_NATIVA.png",
                },
                {
                    text: "↩️ <strong>Volver a Área Comunidades</strong>",
                    action: "menu",
                    target: "PAREA",
                },
            ],
        },
        PADMINISTRATIVOS: {
            title:
                "📑 <strong>Procedimientos Administrativos</strong>\nProcedimientos disponibles:",
            options: [
                {
                    text: "🔄 Saneamiento de predios rústicos (Zonas catastradas/no catastradas)",
                    action: "message",
                    response:
                        "📄 Requisitos completos en imagen.<strong>\nHaz click 👇:</strong>",
                    image: "PAdm_1.png",
                },
                {
                    text: "🏜️ Formalización de Eriazas (antes de 2010)",
                    action: "message",
                    response:
                        "📄 Requisitos completos en imagen.<strong>\nHaz click 👇:</strong>",
                    image: "PAdm_2.png",
                },
                {
                    text: "⏳ Declaración por Prescripción (predios particulares)",
                    action: "message",
                    response:
                        "📄 Requisitos completos en imagen.<strong>\nHaz click 👇:</strong>",
                    image: "PAdm_3.png",
                },
                {
                    text: "📝 Declaración de propiedad y regulación de transferencias de dominio",
                    action: "message",
                    response:
                        "📄 Requisitos completos en imagen.<strong>\nHaz click 👇:</strong>",
                    image: "PAdm_4.png",
                },
                {
                    text: "✔️ Rectificación de áreas/linderos (predios rurales)",
                    action: "message",
                    response:
                        "📄 Requisitos completos en imagen.<strong>\nHaz click 👇:</strong>",
                    image: "PAdm_5.png",
                },
                {
                    text: "↩️ <strong>Volver a Área Comunidades</strong>",
                    action: "menu",
                    target: "PAREA",
                },
            ],
        },
        SCATASTRALES: {
            title:
                "🗺️ <strong>Servicios Catastrales</strong>\nServicios disponibles:",
            options: [
                {
                    text: "🔢 Asignación de Código catastral y expedición de certificado para inmatriculación de predios (zonas no catastradas)",
                    action: "message",
                    response:
                        "📄 Requisitos completos en imagen<strong>\nHaz click 👇:</strong>",
                    image: "SCat_1.png",
                },
                {
                    text: "✏️ Asignación de Código catastral y expedición de certificado para modificación de predios (zonas catastradas) ",
                    action: "message",
                    response:
                        "📄 Requisitos completos en imagen<strong>\nHaz click 👇:</strong>",
                    image: "SCat_2.png",
                },
                {
                    text: "🏷️ Expedición de Certificado catastral para inmatriculación de predios (zonas catastradas)",
                    action: "message",
                    response:
                        "📄 Requisitos completos en imagen<strong>\nHaz click 👇:</strong>",
                    image: "SCat_3.png",
                },
                {
                    text: "📑 Visación de planos y de memoria descriptiva de predios (procesos judiciales zonas catastradas/no catastradas)",
                    action: "message",
                    response:
                        "📄 Requisitos completos en imagen. <strong>\nHaz click 👇:</strong>",
                    image: "SCat_4.png",
                },
                {
                    text: "↩️ <strong>Volver a Área Comunidades</strong>",
                    action: "menu",
                    target: "PAREA",
                },
            ],
        },
    };

    function showMenu(menuId) {
        const menu = menuStructure[menuId];
        if (!menu) return;

        const typing = showTypingIndicator();
        setTimeout(() => {
            chatMessages.innerHTML = "";
            addBotMessage(menu.title);

            if (menuId !== "main") {
                const backDiv = document.createElement("div");
                const backBtn = document.createElement("button");
                backBtn.className = "back-btn";
                backBtn.textContent = "Volver";
                backBtn.onclick = function () {
                    if (menuHistory.length > 0) {
                        const previousMenu = menuHistory.pop();
                        showMenu(previousMenu);
                        saveChatbotState();
                    }
                };
                backDiv.appendChild(backBtn);
                chatMessages.appendChild(backDiv);
            }

            const optionsDiv = document.createElement("div");
            optionsDiv.className = "option-buttons";

            menu.options.forEach((option) => {
                const btn = document.createElement("button");
                btn.className = "option-btn";
                if (option.action === "menu") btn.classList.add("has-children");
                btn.innerHTML = option.text;
                btn.onclick = function () {
                    addUserMessage(option.text.replace(/[^a-zA-Zá-úÁ-Ú ]/g, "").trim());

                    if (option.action === "menu") {
                        if (menuId !== "main") menuHistory.push(menuId);
                        setTimeout(() => {
                            showMenu(option.target);
                            saveChatbotState();
                        }, 300);
                    } else if (option.action === "message") {
                        setTimeout(() => {
                            if (option.image) {
                                addBotMessageWithImage(option.response, option.image);
                            } else {
                                addBotMessage(option.response);
                            }
                            setTimeout(() => showContinueOptions(menuId), 500);
                        }, 500);
                    } else if (option.action === "end") {
                        endConversation(option.response);
                    }
                };
                optionsDiv.appendChild(btn);
            });

            chatMessages.appendChild(optionsDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            currentMenu = menuId;
            saveChatbotState();
        }, 800);
    }

    function addBotMessage(text) {
        const messageDiv = document.createElement("div");
        messageDiv.className = "message bot-message";
        messageDiv.innerHTML = text.replace(/\n/g, "<br>");
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addUserMessage(text) {
        const messageDiv = document.createElement("div");
        messageDiv.className = "message user-message";
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }



    function addBotMessageWithImage(text, imageName) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message bot-message";
    messageDiv.innerHTML = text.replace(/\n/g, "<br>");

    const imgContainer = document.createElement("div");
    imgContainer.className = "response-image-container";

    const img = document.createElement("img");
    const imgSrc = "/landing_page/img/" + imageName;
    img.src = imgSrc;
    img.className = "response-image";
    img.alt = "Imagen informativa";
    img.loading = "lazy";

    // Modal al hacer clic
    img.onclick = function () {
        modal.style.display = "block";
        modalImg.src = this.src;
        openHdLink.href = this.src;
    };

    // Botón de descarga (con ícono SVG)
    const downloadLink = document.createElement("a");
    downloadLink.href = imgSrc;
    downloadLink.download = imageName;
    downloadLink.className = "download-image-link";
    downloadLink.innerHTML = `
        <i class="fas fa-download"></i> Descargar imagen
    `;

    imgContainer.appendChild(img);
    imgContainer.appendChild(downloadLink);
    messageDiv.appendChild(imgContainer);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


    function endConversation(message) {
        chatMessages.innerHTML = "";
        addBotMessage(message);
        setTimeout(() => {
            const restartBtn = document.createElement("button");
            restartBtn.className = "restart-chat-btn";
            restartBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Reiniciar chat';
            restartBtn.onclick = function () {
                menuHistory = [];
                showMenu("main");
                saveChatbotState();
            };
            chatMessages.appendChild(restartBtn);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 2000);
    }

    function showContinueOptions(returnMenu) {
        const optionsDiv = document.createElement("div");
        optionsDiv.className = "option-buttons";

        const continueBtn = document.createElement("button");
        continueBtn.className = "option-btn";
        continueBtn.innerHTML = '<i class="fas fa-reply"></i> Continuar consulta';
        continueBtn.onclick = function () {
            showMenu(returnMenu);
        };
        optionsDiv.appendChild(continueBtn);

        const endBtn = document.createElement("button");
        endBtn.className = "end-chat-btn";
        endBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Terminar chat';
        endBtn.onclick = function () {
            endConversation("¡Gracias por contactar a GERAGRI! 🌱\nEstamos para servirte cuando lo necesites.");
        };
        optionsDiv.appendChild(endBtn);

        chatMessages.appendChild(optionsDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (message !== "") {
            addUserMessage(message);
            userInput.value = "";

            const typing = showTypingIndicator();
            setTimeout(() => {
                chatMessages.removeChild(typing);
                addBotMessage("Recibí tu mensaje. ¿Qué más necesitas?");

                const optionsDiv = document.createElement("div");
                optionsDiv.className = "option-buttons";

                const mainMenuBtn = document.createElement("button");
                mainMenuBtn.className = "option-btn";
                mainMenuBtn.innerHTML = '<i class="fas fa-home"></i> Menú principal';
                mainMenuBtn.onclick = function () {
                    menuHistory = [];
                    showMenu("main");
                    saveChatbotState();
                };
                optionsDiv.appendChild(mainMenuBtn);

                const endBtn = document.createElement("button");
                endBtn.className = "end-chat-btn";
                endBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Terminar chat';
                endBtn.onclick = function () {
                    endConversation("¡Gracias por tu consulta! Si necesitas más ayuda, reinicia el chat cuando quieras.");
                };
                optionsDiv.appendChild(endBtn);

                chatMessages.appendChild(optionsDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1500);
        }
    }

    // ========================
    // 5. EVENT LISTENERS
    // ========================
    videoAvatar.addEventListener("loadeddata", function () {
        videoAvatar.play().catch(e => console.log("Autoplay no permitido:", e));
    });

    minimizeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        isMinimized = !isMinimized;
        if (isMinimized) {
            chatbot.classList.add("minimized");
            minimizeBtn.innerHTML = '<i class="fas fa-plus"></i>';
        } else {
            chatbot.classList.remove("minimized");
            minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
        }
        saveChatbotState();
    });

    closeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        isClosed = true;
        chatbot.classList.remove("visible");
        setTimeout(() => {
            chatbot.classList.add("closed");
            launcher.style.display = "flex";
            saveChatbotState();
        }, 300);
    });

    launcher.addEventListener("click", function () {
        isClosed = false;
        chatbot.classList.remove("closed");
        setTimeout(() => {
            chatbot.classList.add("visible");
            launcher.style.display = "none";
            saveChatbotState();
        }, 50);
    });

    chatbotHeader.addEventListener("click", function () {
        if (isMinimized) {
            isMinimized = false;
            chatbot.classList.remove("minimized");
            minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
            saveChatbotState();
        }
    });

    sendBtn.addEventListener("click", sendMessage);

    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("response-image")) {
            modal.style.display = "block";
            modalImg.src = e.target.src;
            openHdLink.href = e.target.src;
        }
    });

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    chatbot.addEventListener("click", function () {
        userInput.focus();
    });

    // ========================
    // 6. INICIALIZACIÓN
    // ========================
    loadChatbotState(); // Cargar estado al inicio
    showMenu(currentMenu); // Mostrar menú inicial

    // Animación de aparición (si no está cerrado)
    setTimeout(() => {
        if (!isClosed) {
            chatbot.classList.add("visible");
        }
    }, 10);
});