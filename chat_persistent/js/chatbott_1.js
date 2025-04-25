// chatbot.js
document.addEventListener('DOMContentLoaded', function() {
    // Cargar estado del chatbot
    const chatState = JSON.parse(localStorage.getItem('chatbotState')) || {
        open: false,
        currentMenu: 'main',
        conversation: [],
        userData: {}
    };

    // Crear estructura del chatbot
    const chatbotHTML = `
        <div id="chatbot-container" class="${chatState.open ? 'open' : ''}">
            <div class="chatbot-header">
                <h3>Asistente Virtual</h3>
                <button class="close-chatbot">×</button>
            </div>
            <div class="chatbot-body">
                <div class="chat-messages">
                    ${loadPreviousMessages(chatState.conversation)}
                </div>
                <div class="chat-options">
                    ${renderMenu(chatState.currentMenu, chatState.userData)}
                </div>
            </div>
            <button class="chatbot-toggle">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmci fill='white' width='24' height='24' viewBox='0 0 24 24'><path d='M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.522 4.82 3.889 6.115l-.78 2.77 3.116-1.65c.88.275 1.823.425 2.775.425 4.97 0 9-3.186 9-7.115C21 6.186 16.97 3 12 3z'/></svg>
                <span>Chatea con nosotros</span>
            </button>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    // Event listeners
    document.querySelector('.chatbot-toggle').addEventListener('click', toggleChatbot);
    document.querySelector('.close-chatbot').addEventListener('click', toggleChatbot);
    
    // Delegación de eventos para las opciones del menú
    document.querySelector('.chat-options').addEventListener('click', function(e) {
        if (e.target.classList.contains('chat-option')) {
            handleOptionSelection(e.target.dataset.option, e.target.dataset.value);
        }
    });

    // Funciones
    function toggleChatbot() {
        const container = document.getElementById('chatbot-container');
        container.classList.toggle('open');
        chatState.open = container.classList.contains('open');
        saveChatState();
    }

    function handleOptionSelection(option, value) {
        // Agregar selección del usuario al historial
        addMessageToHistory('user', option, 'option');
        
        // Lógica de navegación del menú en árbol
        switch(chatState.currentMenu) {
            case 'main':
                handleMainMenu(option);
                break;
            case 'productos':
                handleProductMenu(option, value);
                break;
            case 'soporte':
                handleSupportMenu(option);
                break;
            // Puedes añadir más casos según tus menús
        }
    }

    function handleMainMenu(option) {
        switch(option) {
            case 'productos':
                chatState.currentMenu = 'productos';
                updateChatInterface();
                break;
            case 'soporte':
                chatState.currentMenu = 'soporte';
                updateChatInterface();
                break;
            case 'contacto':
                addMessageToHistory('bot', 'Puedes contactarnos en contacto@empresa.com o llamando al 123-456-789', 'info');
                chatState.currentMenu = 'main';
                updateChatInterface();
                break;
        }
    }

    function handleProductMenu(option, value) {
        if (option === 'back') {
            chatState.currentMenu = 'main';
            updateChatInterface();
            return;
        }
        
        // Ejemplo de guardar datos del usuario
        if (option === 'select_product') {
            chatState.userData.selectedProduct = value;
            addMessageToHistory('bot', `Has seleccionado ${value}. ¿Qué deseas saber sobre este producto?`, 'info');
            
            const productInfo = {
                'Producto A': 'Este producto es nuestro bestseller con garantía de 2 años.',
                'Producto B': 'Producto premium con las últimas tecnologías.',
                'Producto C': 'Opción económica con buena relación calidad-precio.'
            };
            
            const optionsHTML = `
                <button class="chat-option" data-option="details" data-value="${value}">Ver detalles</button>
                <button class="chat-option" data-option="price" data-value="${value}">Consultar precio</button>
                <button class="chat-option" data-option="back">Volver</button>
            `;
            
            document.querySelector('.chat-options').innerHTML = optionsHTML;
        } else if (option === 'details') {
            const details = {
                'Producto A': 'Detalles: Material resistente, 3 colores disponibles, 2 años de garantía.',
                'Producto B': 'Detalles: Tecnología avanzada, 5 estrellas en reviews, 3 años de garantía.',
                'Producto C': 'Detalles: Básico pero funcional, 1 año de garantía, disponible en 2 colores.'
            };
            addMessageToHistory('bot', details[value], 'info');
        } else if (option === 'price') {
            const prices = {
                'Producto A': '$199.99',
                'Producto B': '$349.99',
                'Producto C': '$99.99'
            };
            addMessageToHistory('bot', `El precio de ${value} es ${prices[value]}`, 'info');
        }
    }

    function handleSupportMenu(option) {
        if (option === 'back') {
            chatState.currentMenu = 'main';
            updateChatInterface();
            return;
        }
        
        addMessageToHistory('bot', `Hemos registrado tu solicitud de soporte sobre "${option}". Nuestro equipo te contactará en 24 horas.`, 'info');
        chatState.currentMenu = 'main';
        updateChatInterface();
    }

    function updateChatInterface() {
        document.querySelector('.chat-options').innerHTML = renderMenu(chatState.currentMenu, chatState.userData);
        saveChatState();
    }

    function addMessageToHistory(sender, text, type) {
        chatState.conversation.push({
            sender,
            text,
            type,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        });
        
        const messagesContainer = document.querySelector('.chat-messages');
        messagesContainer.innerHTML += `
            <div class="message ${sender} ${type}">
                <div class="message-content">${text}</div>
                <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
        `;
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        saveChatState();
    }

    function renderMenu(menu, userData) {
        switch(menu) {
            case 'main':
                return `
                    <button class="chat-option" data-option="productos">Productos</button>
                    <button class="chat-option" data-option="soporte">Soporte Técnico</button>
                    <button class="chat-option" data-option="contacto">Contacto</button>
                `;
            case 'productos':
                return `
                    <p>Selecciona un producto:</p>
                    <button class="chat-option" data-option="select_product" data-value="Producto A">Producto A</button>
                    <button class="chat-option" data-option="select_product" data-value="Producto B">Producto B</button>
                    <button class="chat-option" data-option="select_product" data-value="Producto C">Producto C</button>
                    <button class="chat-option" data-option="back">Volver al menú principal</button>
                `;
            case 'soporte':
                return `
                    <p>¿Con qué necesitas ayuda?</p>
                    <button class="chat-option" data-option="instalación">Instalación</button>
                    <button class="chat-option" data-option="configuración">Configuración</button>
                    <button class="chat-option" data-option="garantía">Garantía</button>
                    <button class="chat-option" data-option="back">Volver al menú principal</button>
                `;
            default:
                return `<button class="chat-option" data-option="back">Volver al menú principal</button>`;
        }
    }

    function loadPreviousMessages(conversation) {
        return conversation.map(msg => `
            <div class="message ${msg.sender} ${msg.type}">
                <div class="message-content">${msg.text}</div>
                <div class="message-time">${msg.time}</div>
            </div>
        `).join('');
    }

    function saveChatState() {
        localStorage.setItem('chatbotState', JSON.stringify(chatState));
    }
});