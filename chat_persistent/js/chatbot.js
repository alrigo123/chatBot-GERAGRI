document.addEventListener('DOMContentLoaded', function () {
    // Cargar estado del chatbot
    const chatState = JSON.parse(localStorage.getItem('chatbotState')) || {
        open: false,
        currentMenu: 'main',
        conversation: [],
        userData: {}
    };

    // Estructura del menú que proporcionaste
    const menuStructure = {
        main: {
            title: "🌟 ¡Bienvenido a GERAGRI! 🌱<br>Tu asistente agribot :D",
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
                    response: "👋 ¡Gracias por usar en GERAGRIBOT! <br>Si necesitas más ayuda, aquí estaré.",
                },
            ],
        },
        STRAMITES: {
            title: "📋 <strong>Trámites Disponibles</strong><br>Selecciona una opción:",
            options: [
                {
                    text: "🏖️ Vacaciones Truncas y/o Compensación vacacional",
                    action: "message",
                    response: "📜 <strong>Requisitos:</strong><br>• Solicitud dirigida al gerente.<br>• Contratos, adendas o resoluciones de designación y conclusión.<br>• Constancia de no deudor de la Unidad no Estructurada de Contabilidad, Tesorería y Control Patrimonial.",
                },
                {
                    text: "⏳ Compensación por Tiempo de Servicios",
                    action: "message",
                    response: "📜 <strong>Requisitos:</strong><br>• Solicitud dirigida al gerente.<br>• Resolución de cese.<br>• Constancia de pagos y descuentos.<br>• Constancia de no deudor de la Unidad no Estructurada de Contabilidad, Tesorería y Control Patrimonial.",
                },
                {
                    text: "💝 Pensión por Sobrevivencia",
                    action: "message",
                    response: "📜 <strong>Requisitos:</strong><br>• Solicitud dirigida al gerente.<br>• Acta de defunción.<br>• Acta original de matrimonio.<br>• DNI del fallecido.<br>• DNI del solicitante.<br>• Formato III - <em>FORMATO DE SOLICITUD de la Resolución Jefatural N° 150-2021-ONP-JF.</em><br>• Resolución de nombramiento.<br>• Resolución de incorporación al D.L. N° 20530.<br>• Resolución de cese.<br>• Resolución de pensión definitiva.<br>• 3 últimas boletas de pago de pensión del fallecido.<br>• Nro de cuenta del Banco de la Nación.",
                },
                {
                    text: "👨‍👩‍👧‍👦 Reconocimiento como Herederos de Deuda Social",
                    action: "message",
                    response: "📜 <strong>Requisitos:</strong><br>• Sucesión intestada.<br>• Testimonio expedido por la notaría.<br>• Sentencia de vista del proceso judicial.<br>• Resolución consentida del proceso judicial.<br>• Liquidación del proceso judicial.<br>• DNI de los herederos universales.",
                },
                {
                    text: "<strong>⚰️ Gastos de Sepelio</strong><br><small>Subsidios</small>",
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
            title: "⚰️ <strong>Sepelios</strong><br>Tipos de gasto:",
            options: [
                {
                    text: "💐 Subsidio por Gastos por Sepelio",
                    action: "message",
                    response: "🧾 <strong>Requisitos:</strong><br>• Solicitud dirigida al gerente.<br>• Acta de defunción.<br>• Acta original de matrimonio o de nacimiento, dependiendo de quien solicita.<br>• DNI del fallecido.<br>• DNI del solicitante.<br>• Comprobantes de pago de los gastos realizados.<br>• Resolución de pensión.<br>• Última boleta de pago de pensión del fallecido<br>• Nro de cuenta del Banco de la Nación.",
                },
                {
                    text: "💸 Subsidio por Fallecimiento",
                    action: "message",
                    response: "🧾 <strong>Requisitos:</strong><br>• Solicitud dirigida al gerente.<br>• Acta de defunción.<br>• Acta original de matrimonio o sucesión intestada, dependiendo de quien solicita.<br>• DNI del fallecido.<br>• DNI del solicitante.<br>• Resolución de pensión.<br>• Última boleta de pago de pensión del fallecido.<br>• Nro de cuenta del Banco de la Nación.",
                },
                {
                    text: "↩️ <strong>Volver a Trámites</strong>",
                    action: "menu",
                    target: "STRAMITES",
                },
            ],
        },
        PLEGALES: {
            title: "⚖️ <strong>Procedimientos Legales</strong><br>Área jurídica especializada:",
            options: [
                {
                    text: "👨‍⚖️ Sentencias Consentidas",
                    action: "message",
                    response: "🧾 <strong>Requisitos:</strong><br>• Copia del D.N.I del beneficiario (legible).<br>• Resolución Directoral de Reconocimiento de Deuda..<br>• Auto-admisorio de la Demanda.<br>• Sentencia Judicial de 1ra y 2da Instancia.<br>• Resolución Judicial que declara Consentida.<br>• Resolución Judicial que aprueba la Liquidación de Pool de Peritos.<br>• Liquidación de Pool de Peritos.<br>• Resolución Judicial de Requerimiento de Pago.<br>• Notificación Judicial de Requerimiento de Pago.",
                },
                {
                    text: "👪 Requisito de Herederos",
                    action: "message",
                    response: "🧾 <strong>Requisitos:</strong><br>• Copia del D.N.I de herederos o beneficiarios.<br>• Resolución Directoral de Reconocimiento de Herederos.<br>• Resolución de Incorporación al proceso judicial como heredero en el expediente principal en ejecución.<br>• Sucesión Intestada JUDICIAL O NOTARIAL.<br>• Partida Registral de la Sucesión Intestada DEFINITIVA debidamente inscrita en la SUNARP.",
                },
                {
                    text: "🩺 Requisitos por Enfermedad",
                    action: "message",
                    response: "🧾 <strong>Requisitos:</strong><br>• Informe firma por la Junta de Médicos <em>(TRES MEDICOS de MINSA O ESSALUD)</em>.<br>• Los médicos que suscriben el informe deben estar habilitados, indicar especialidad y N.° de colegiatura otorgado por el Colegio de Médicos del Perú.<br>• Indicar FASE y/o ESTADO de la enfermedad sea terminal o avanzado de paciente.<br>• Especificar EL CODIGO DE LA ENFERMEDAD.<br>• Fecha, lugar, N.° de Informe, datos completos del paciente y motivo de la expedición del Informe.",
                },
                {
                    text: "🔙 <strong>Volver al inicio</strong>",
                    action: "menu",
                    target: "main",
                },
            ],
        },
        PAREA: {
            title: "🌄 <strong>Tramites de Área de Comunidades</strong><br>Procedimientos y Requisitos:",
            options: [
                {
                    text: "<strong>🏡 Comunidades Campesinas</strong><br><small>Reconocimiento y titulación</small>",
                    action: "menu",
                    target: "CCAMPESINASS",
                },
                {
                    text: "<strong>🌳 Comunidades Nativas</strong><br><small>Reconocimiento y titulación</small>",
                    action: "menu",
                    target: "CNATIVAS",
                },
                {
                    text: "<strong>📝 Procedimientos Administrativos</strong><br><small>Saneamientos y más</small>",
                    action: "menu",
                    target: "PADMINISTRATIVOS",
                },
                {
                    text: "<strong>🗺️ Servicios Catastrales</strong><br><small>Asignacion de codigos y mas</small>",
                    action: "menu",
                    target: "SCATASTRALES",
                },
                {
                    text: "🛣️ Formalización Tierras Eriazas",
                    action: "message",
                    response: "🧾 <strong>Requisitos:</strong><br> Los Requisitos se aprecian en la siguiente imagen.<strong><br>Haz click 👇:</strong>",
                    image: "ERIAZAS.png",
                },
                {
                    text: "👨‍💼 Cambio de Titular en Zonas Catastradas ",
                    action: "message",
                    response: "🧾 <strong>Requisitos:</strong><br>• La información señalada en el artículo 124 del TUO de la LPAG.<br>• La ubicación del predio y el Código de Referencia Catastral.<br>• Documento que acredite fehacientemente la condición de propietario. <small>En caso de sucesivas transferencias, se acredita el tracto sucesivo.</small><br>• De encontrarse inscrito el predio, copia literal actualizada de la partida registral del predio.",
                },
                {
                    text: "🔙 <strong>Volver al inicio</strong>",
                    action: "menu",
                    target: "main",
                },
            ],
        },
        CCAMPESINASS: {
            title: "🏡 <strong>Comunidades Campesinas</strong><br>Procedimientos disponibles:",
            options: [
                {
                    text: "🆔 Reconocimiento de Comunidades",
                    action: "message",
                    response: "🧾 <strong>Requisitos:</strong><br> Los Requisitos se aprecian en la siguiente imagen.<strong><br>Haz click 👇:</strong>",
                    image: "RECON_COM_CAMPESINAS.png",
                },
                {
                    text: "📍 Deslinde y Titulación de Comunidades",
                    action: "message",
                    response: "🧾 <strong>Requisitos:</strong><br> Los Requisitos se aprecian en la siguiente imagen.<strong><br>Haz click 👇:</strong>",
                    image: "DESLINDE_TITULACION_COM_CAMPESINAS.png",
                },
                {
                    text: "🛰️ Georreferenciación Comunidades",
                    action: "message",
                    response: "🧾 <strong>Requisitos:</strong><br> Los Requisitos se aprecian en la siguiente imagen.<strong><br>Haz click 👇:</strong>",
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
            title: "🌳 <strong>Comunidades Nativas</strong><br>Procedimientos disponibles:",
            options: [
                {
                    text: "🆔 Reconocimiento de Comunidades",
                    action: "message",
                    response: "🧾 <strong>Requisitos:</strong><br> Los Requisitos se aprecian en la siguiente imagen.<strong><br>Haz click 👇:</strong>",
                    image: "RECON_COM_NATIVA.png",
                },
                {
                    text: "📍 Demarcación y Titulación de Comunidades",
                    action: "message",
                    response: "🧾 <strong>Requisitos:</strong><br> Los Requisitos se aprecian en la siguiente imagen.<strong><br>Haz click 👇:</strong>",
                    image: "DEMARC_COM_NATIVA.png",
                },
                {
                    text: "🛰️ Georreferenciación de Comunidades",
                    action: "message",
                    response: "🧾 <strong>Requisitos:</strong><br> Los Requisitos se aprecian en la siguiente imagen.<strong><br>Haz click 👇:</strong>",
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
            title: "📑 <strong>Procedimientos Administrativos</strong><br>Procedimientos disponibles:",
            options: [
                {
                    text: "🔄 Saneamiento de predios rústicos (Zonas catastradas/no catastradas)",
                    action: "message",
                    response: "📄 Requisitos completos en imagen.<strong><br>Haz click 👇:</strong>",
                    image: "PAdm_1.png",
                },
                {
                    text: "🏜️ Formalización de Eriazas (antes de 2010)",
                    action: "message",
                    response: "📄 Requisitos completos en imagen.<strong><br>Haz click 👇:</strong>",
                    image: "PAdm_2.png",
                },
                {
                    text: "⏳ Declaración por Prescripción (predios particulares)",
                    action: "message",
                    response: "📄 Requisitos completos en imagen.<strong><br>Haz click 👇:</strong>",
                    image: "PAdm_3.png",
                },
                {
                    text: "📝 Declaración de propiedad y regulación de transferencias de dominio",
                    action: "message",
                    response: "📄 Requisitos completos en imagen.<strong><br>Haz click 👇:</strong>",
                    image: "PAdm_4.png",
                },
                {
                    text: "✔️ Rectificación de áreas/linderos (predios rurales)",
                    action: "message",
                    response: "📄 Requisitos completos en imagen.<strong><br>Haz click 👇:</strong>",
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
            title: "🗺️ <strong>Servicios Catastrales</strong><br>Servicios disponibles:",
            options: [
                {
                    text: "🔢 Asignación de Código catastral y expedición de certificado para inmatriculación de predios (zonas no catastradas)",
                    action: "message",
                    response: "📄 Requisitos completos en imagen<strong><br>Haz click 👇:</strong>",
                    image: "SCat_1.png",
                },
                {
                    text: "✏️ Asignación de Código catastral y expedición de certificado para modificación de predios (zonas catastradas) ",
                    action: "message",
                    response: "📄 Requisitos completos en imagen<strong><br>Haz click 👇:</strong>",
                    image: "SCat_2.png",
                },
                {
                    text: "🏷️ Expedición de Certificado catastral para inmatriculación de predios (zonas catastradas)",
                    action: "message",
                    response: "📄 Requisitos completos en imagen<strong><br>Haz click 👇:</strong>",
                    image: "SCat_3.png",
                },
                {
                    text: "📑 Visación de planos y de memoria descriptiva de predios (procesos judiciales zonas catastradas/no catastradas)",
                    action: "message",
                    response: "📄 Requisitos completos en imagen. <strong><br>Haz click 👇:</strong>",
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

    // Crear estructura del chatbot
    const chatbotHTML = `
        <div id="chatbot-container" class="${chatState.open ? 'open' : ''}">
            <div class="chatbot-header">
                <h3>GERAGRI - Asistente Virtual</h3>
                <button class="close-chatbot">×</button>
            </div>
            <div class="chatbot-body">
                <div class="chat-messages">
                    ${loadPreviousMessages(chatState.conversation)}
                </div>
                <div class="chat-menu">
                    ${renderCurrentMenu()}
                </div>
            </div>
            <button class="chatbot-toggle">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmci fill='white' width='24' height='24' viewBox='0 0 24 24'><path d='M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.522 4.82 3.889 6.115l-.78 2.77 3.116-1.65c.88.275 1.823.425 2.775.425 4.97 0 9-3.186 9-7.115C21 6.186 16.97 3 12 3z'/></svg>
                <span>Asistente GERAGRI</span>
            </button>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    // Event listeners
    document.querySelector('.chatbot-toggle').addEventListener('click', toggleChatbot);
    document.querySelector('.close-chatbot').addEventListener('click', toggleChatbot);

    // Delegación de eventos para las opciones del menú
    document.querySelector('.chat-menu').addEventListener('click', function (e) {
        const optionBtn = e.target.closest('.chat-option');
        if (optionBtn) {
            handleOptionSelection(
                optionBtn.dataset.action,
                optionBtn.dataset.target,
                optionBtn.dataset.response,
                optionBtn.dataset.image
            );
        }
    });

    // Funciones
    function toggleChatbot() {
        const container = document.getElementById('chatbot-container');
        container.classList.toggle('open');
        chatState.open = container.classList.contains('open');
        saveChatState();
    }

    function handleOptionSelection(action, target, response, image) {
        const currentMenu = menuStructure[chatState.currentMenu];
        const selectedOption = currentMenu.options.find(opt =>
            (opt.action === action && opt.target === target) ||
            (opt.action === action && opt.response === response)
        );

        if (!selectedOption) return;

        // Agregar selección del usuario al historial
        addMessageToHistory('user', selectedOption.text, 'option');

        switch (action) {
            case 'menu':
                chatState.currentMenu = target;
                updateChatInterface();
                break;

            case 'message':
                addMessageToHistory('bot', response, 'info');
                if (image) {
                    addMessageToHistory('bot', `<img src="images/${image}" alt="Requisitos" style="max-width: 100%; margin-top: 10px;">`, 'image');
                }
                break;

            case 'end':
                addMessageToHistory('bot', response, 'info');
                setTimeout(() => {
                    chatState.open = false;
                    document.getElementById('chatbot-container').classList.remove('open');
                    saveChatState();
                }, 1500);
                break;
        }
    }

    function renderCurrentMenu() {
        const menu = menuStructure[chatState.currentMenu];
        if (!menu) return '';

        let menuHTML = `<div class="menu-title">${menu.title}</div><div class="menu-options">`;

        menu.options.forEach(option => {
            menuHTML += `
                <button class="chat-option" 
                    data-action="${option.action}" 
                    ${option.target ? `data-target="${option.target}"` : ''}
                    ${option.response ? `data-response="${escapeHtml(option.response)}"` : ''}
                    ${option.image ? `data-image="${option.image}"` : ''}>
                    ${option.text}
                </button>
            `;
        });

        menuHTML += '</div>';
        return menuHTML;
    }

    function addMessageToHistory(sender, text, type) {
        chatState.conversation.push({
            sender,
            text,
            type,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        const messagesContainer = document.querySelector('.chat-messages');
        messagesContainer.innerHTML += `
            <div class="message ${sender} ${type}">
                <div class="message-content">${text}</div>
                <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        `;

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        saveChatState();
    }

    function loadPreviousMessages(conversation) {
        return conversation.map(msg => `
            <div class="message ${msg.sender} ${msg.type}">
                <div class="message-content">${msg.text}</div>
                <div class="message-time">${msg.time}</div>
            </div>
        `).join('');
    }

    function updateChatInterface() {
        document.querySelector('.chat-menu').innerHTML = renderCurrentMenu();
        saveChatState();
    }

    function saveChatState() {
        localStorage.setItem('chatbotState', JSON.stringify(chatState));
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});