// Reproducir audio al cargar la página
window.onload = function () {
    let video = document.getElementById("asistente-video");
    video.muted = false;
    video.play();

    // Asegurarse de que los elementos existen antes de modificarlos
    setTimeout(() => {
        let chatContainer = document.getElementById("chat-container");
        let chatOpenBtn = document.getElementById("chat-open-btn");

        if (chatContainer && chatOpenBtn) {
            chatContainer.style.display = "none";
            chatOpenBtn.style.display = "flex";
        }
    }, 100); // Pequeño retraso para asegurar que los elementos están listos
};

function sendMessage() {
    let input = document.getElementById("user-input");
    let chatBox = document.getElementById("chat-box");

    if (input.value.trim() !== "") {
        let userMessage = document.createElement("div");
        userMessage.classList.add("message");
        userMessage.textContent = input.value;
        chatBox.appendChild(userMessage);

        input.value = "";
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
    }
}

(function () {
    "use strict";

    // Elementos del DOM
    const chatContainer = document.getElementById("chat-container");
    const chatHeader = document.getElementById("chat-header");
    const chatBody = document.getElementById("chat-body");
    const chatBox = document.getElementById("chat-box");
    const optionsDiv = document.getElementById("options");
    const minimizeBtn = document.getElementById("minimize-btn");
    const closeBtn = document.getElementById("close-btn");
    const chatOpenBtn = document.getElementById("chat-open-btn");

    // Árbol de conversación: ya no usamos "requiresFeedback" en cada nodo
    const conversationTree = {
        initial: {
            message:
                "¡Bienvenido a GERAGRI! Selecciona una de las siguientes opciones, para facilitarte la información que deseas.",
            options: [
                { text: "Procedimientos Administrativos", next: "procedimientos" },
                { text: "Servicios Prestados en Exclusividad", next: "servicios" },
                { text: "3Autorización de Agropecuarias", next: "soporte" },
                { text: "4Autorización de Agropecuarias", next: "soporte" },
                { text: "5Autorización de Agropecuarias", next: "soporte" },
                { text: "6Autorización de Agropecuarias", next: "soporte" },
                { text: "7Autorización de Agropecuarias", next: "soporte" },
                { text: "8Autorización de Agropecuarias", next: "soporte" },
                { text: "9Autorización de Agropecuarias", next: "soporte" },
                { text: "Otros tramites", next: "otros" },
            ],
        },
        procedimientos: {
            message:
                "Selecciona el tipo de procedimiento que deseas información.",
            options: [
                { text: "Saneamiento físico legal y formalización de predios", next: "saneamiento" },
                { text: "Declaración de propiedad por prescripción", next: "declaracion" },
                { text: "Rectificacion de areas linderos y medidads perimetricas", next: "rectificacion" },
                { text: "Volver al inicio", next: "initial" },
            ],
        },
        saneamiento: {
            message: `
                <p>Requisitos
                <dl>1. Solicitud de petición dirigida a la dirección Regional de Agricultura</dl>
                <dl>2. Copia legalizada de Acta de Constitución e instalación de Comité Organizador</dl>
                <dl>3. Nómina de Miembros de Comité Organizador</dl>
                <dl>4. Declaración jurada de cada uno de los miembros del comité organizador, de no tener antecedentes penales, ni estar incurso en proceso penal por delito doloso y credenciales otorgados por la institución o Asociación de Productores a la que representa (la misma sujeta a verificación)</dl>
                <dl>5. Reglamento interno del evento</dl>
                <dl>6. Presupuesto analítico</dl>
                <dl>7. Programa General de Actividades</dl>
                <dl>8. Informe Técnico de la Dirección Regional de Agricultura Cusco</dl>
                <dl>9. Comprobante de Pago</dl>
                </p>
            `,
            options: [
                { text: "Más detalles", next: "saneamiento_detalles" },
                { text: "Volver", next: "procedimientos" },
            ],
        },
        saneamiento_detalles: {
            message: `
                <p>Aquí tienes más detalles
                <dl>Pago por derecho de tramitación: S/.242.00</dl>
                <dl>Plazo de atención: 5 días hábiles</dl>
                <dl>Código TUPA: PA156095DF</dl>
                </p>
            `,
            options: [
                { text: "Volver a ferias", next: "saneamiento" },
                { text: "Volver al inicio", next: "initial" },
            ],
        },
        declaracion: {
            message: `
                <p>Requisitos
                <dl>1. Solicitud a la Dirección Regional de Agricultura solicitando el inicio del procedimiento de declaración de Prescripción Adquisitiva de dominio,
                    indicando la ubicación del predio y el código de Referencia Catastral.</dl>
                <dl>2. Para persona natural: Copia simple de su D.N.I.</dl>
                <dl>3. Para persona Jurídica: Copia Literal de Partida Registral donde figure la inscripción registral y poder del representante , copia simple del D.N.I.
                    del representante.</dl>
                <dl>4. Pruebas documentales de la posición y explotación económica, según relación contenida en el Art. Nº 41º del D.S. Nº 032-2008-VIVIENDA.</dl>
                <dl>5. Declaración Jurada de no existir vinculo contractual relativo a la posición, entre el poseedor y el propietario original u otro poseedor, ni procesos
                    judiciales o administrativos en los cuales se discuta la posesión o propiedad del predio, según formatos.</dl>
                <dl>6. De encontrarse inscrito el predio: Copia literal actualizada de la partida registral donde se encuentra inscrito el predio y copia del plano que obra
                    en el titulo archivado. De no encontrarse inscrito el predio: Certificado de búsqueda catastral.</dl>
                <dl>7. Comprobante de pago.</dl>
                </p>
            `,
            options: [
                { text: "Más detalles", next: "declaracion_detalles" },
                { text: "Volver", next: "procedimientos" },
            ],
        },
        declaracion_detalles: {
            message: `
            <p>Aquí tienes más detalles
            <dl>"DECLARACIÓN DE PROPIEDAD POR PRESCRIPCIÓN ADQUISITIVA DE DOMINIO EN PREDIOS RÚSTICOS, LUEGO DE TRES (03) VISITAS DE
                OFICIO"</dl>
            <dl>Pago por derecho de tramitación: S/ 185.00</dl>
            <dl>Plazo de atención: 70 días hábiles</dl>
            <dl>Código TUPA: PA156002AB</dl>
            </p>
        `,
            options: [
                { text: "Volver", next: "declaracion" },
                { text: "Volver al inicio", next: "initial" },
            ],
        },
        rectificacion: {
            message:
                "El Producto B se destaca por... [detalles del producto B].",
            options: [
                { text: "Más detalles", next: "productoB_detalles" },
                { text: "Volver a productos", next: "ferias" },
            ],
        },
        productoB_detalles: {
            message: "Aquí tienes más detalles sobre el Producto B...",
            options: [
                { text: "Volver a productos", next: "productos" },
                { text: "Volver al inicio", next: "initial" },
            ],
        },
        servicios: {
            message: "Selecciona el tipo de servicio que deseas información.",
            options: [
                { text: "Asignación de código de referencia catastral y expedicion de certificado de informacion catastral con fines de inmatriculación", next: "soporte_conexion" },
                { text: "Problema de hardware", next: "soporte_hardware" },
                { text: "Visación de planos y memoria descriptiva de predios rurales", next: "visacion" },
                { text: "Otro problema", next: "soporte_otro" },
                { text: "Volver al inicio", next: "initial" },
            ],
        },
        soporte_conexion: {
            message:
                "Para problemas de conexión, intenta reiniciar tu router o verifica tu conexión.",
            options: [
                { text: "Volver a soporte", next: "soporte" },
                { text: "Volver al inicio", next: "initial" },
            ],
        },
        visacion: {
            message:
                "Para problemas de hardware, asegúrate de que los cables estén conectados y prueba reiniciar el dispositivo.",
            options: [
                { text: "Volver a soporte", next: "soporte" },
                { text: "Volver al inicio", next: "initial" },
            ],
        },
        soporte_otro: {
            message:
                "Por favor, describe brevemente tu problema para poder asistirte mejor.",
            options: [
                { text: "Volver a soporte", next: "soporte" },
                { text: "Volver al inicio", next: "initial" },
            ],
        },
        otros: {
            message:
                `Revisar TUPA: <a target="_blank" href="https://cdn.www.gob.pe/uploads/document/file/2836435/Gerencia%20Regional%20de%20Agricultura.pdf?v=1645132912">Click Aquí</a> `,
            options: [{ text: "Volver al inicio", next: "initial" }],
        },
    };

    // Agregar un mensaje al chat
    function addMessage(sender, message, isUser = false) {
        const msgElement = document.createElement("div");
        msgElement.className = "chat-message" + (isUser ? " user" : "");
        msgElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatBox.appendChild(msgElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Muestra las opciones de un nodo y añade un botón extra "Terminar Conversación"
    function showOptions(options) {
        optionsDiv.innerHTML = "";
        options.forEach((opt) => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.textContent = opt.text;
            btn.addEventListener("click", () => {
                addMessage("TU", opt.text, true);
                loadConversation(opt.next);
            });
            optionsDiv.appendChild(btn);
        });
        // Botón para terminar la conversación
        const endBtn = document.createElement("button");
        endBtn.className = "option-btn";
        endBtn.textContent = `Terminar Conversación`;
        endBtn.addEventListener("click", () => {
            addMessage("Tú", "Terminar Conversación", true);
            endConversation();
        });
        optionsDiv.appendChild(endBtn);
    }

    // Función para finalizar la conversación mostrando feedback
    function endConversation() {
        optionsDiv.innerHTML = ""; // Limpia opciones
        showRating(() => {
            addMessage(
                "DANA",
                "Conversación Finalizada. ¡Gracias por tu tiempo!"
            );
            // Aquí puedes optar por resetear la conversación o dejar el chat finalizado.
        });
    }

    // Muestra la sección de calificación (feedback)  
    // *********  QUE SE 
    // REFRESEQUE 
    // EL CHAT BOT
    // DESPUES DEL RATING
    // para que empiece
    // desde 0*/
    function showRating(callback) {
        const ratingContainer = document.createElement("div");
        ratingContainer.className = "rating-container";
        ratingContainer.innerHTML = `<p>¿Te fue útil esta respuesta?</p>`;

        // Botón "Sí"
        const yesBtn = document.createElement("button");
        yesBtn.textContent = "Sí";
        yesBtn.addEventListener("click", () => {
            sendRating("positivo");
            // ratingContainer.innerHTML =
            //     "<p>¡Gracias por tu retroalimentación!</p>";
            // setTimeout(callback, 500);
            mostrarBotonReinicio();
        });

        // Botón "No"
        const noBtn = document.createElement("button");
        noBtn.textContent = "No";
        noBtn.addEventListener("click", () => {
            sendRating("negativo");
            // ratingContainer.innerHTML =
            //     "<p>¡Gracias por tu retroalimentación!</p>";
            // setTimeout(callback, 500);
            mostrarBotonReinicio();  // Llamamos a la función para cerrar o refrescar
        });

        ratingContainer.appendChild(yesBtn);
        ratingContainer.appendChild(noBtn);
        chatBox.appendChild(ratingContainer);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Función para mostrar el botón de "Reiniciar Conversación"
    function mostrarBotonReinicio() {
        const ratingContainer = document.querySelector(".rating-container");
        ratingContainer.innerHTML = "<p>¡Gracias por tu retroalimentación!</p>";

        const restartBtn = document.createElement("button");
        restartBtn.textContent = "Reiniciar Conversación";
        restartBtn.className = "restart-btn";
        restartBtn.addEventListener("click", () => {
            location.reload(); // Refresca la página
        });

        ratingContainer.appendChild(restartBtn);
    }
    // Simula el envío del feedback a un servidor (reemplaza la URL en producción)
    function sendRating(rating) {
        fetch("https://mi-servidor.com/api/rating", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating: rating, timestamp: new Date() }),
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Calificación enviada.");
                } else {
                    console.error("Error al enviar la calificación.");
                }
            })
            .catch((error) => console.error("Error de red:", error));
    }

    // Carga un nodo del árbol de conversación
    function loadConversation(nodeKey) {
        const node = conversationTree[nodeKey];
        if (!node) {
            addMessage("Chatbot", "Ocurrió un error en la conversación.");
            return;
        }
        setTimeout(() => {
            addMessage("DANA", node.message);
            if (node.options && node.options.length > 0) {
                showOptions(node.options);
            }
        }, 500);
    }

    // Inicializa el chat con el nodo inicial
    function initChat() {
        chatBox.innerHTML = "";
        loadConversation("initial");
    }

    // --- Controles del Widget ---
    // Minimizar/Expandir haciendo clic en el header o el botón correspondiente
    minimizeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (chatBody.style.display === "none") {
            chatBody.style.display = "flex";
            minimizeBtn.textContent = "–";
        } else {
            chatBody.style.display = "none";
            minimizeBtn.textContent = "+";
        }
    });
    chatHeader.addEventListener("click", () => {
        if (chatBody.style.display === "none") {
            chatBody.style.display = "flex";
            minimizeBtn.textContent = "–";
        } else {
            chatBody.style.display = "none";
            minimizeBtn.textContent = "+";
        }
    });

    // Cerrar el chat y mostrar botón flotante
    closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        chatContainer.style.display = "none";
        chatOpenBtn.style.display = "flex";
    });
    
    // Reabrir el chat
    chatOpenBtn.addEventListener("click", () => {
        chatContainer.style.display = "flex";
        chatOpenBtn.style.display = "none";
    });

    document.addEventListener("DOMContentLoaded", initChat);
})();