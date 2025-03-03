document.addEventListener("DOMContentLoaded", () => {
    const chatBody = document.getElementById("chat-body");
    const messageInput = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-btn");
    const locationBtn = document.getElementById("location-btn");

    const chatHistory = [];

    function appendMessage(text, sender) {
        let messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.innerText = text;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
        chatHistory.push({ text, sender });
    }

    function sendMessageToBot(message, latitude = null, longitude = null) {
        const userId = "user-123";  
        const endpoint = "https://geobottwilio.onrender.com/consultas-generales"; 

        const payload = latitude && longitude
            ? JSON.stringify({ user_id: userId, message, latitude, longitude })
            : JSON.stringify({ user_id: userId, message });

        fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload
        })
        .then(response => response.json())
        .then(data => appendMessage(data.reply, "bot"))
        .catch(() => appendMessage("Error al conectar con el bot", "bot"));
    }

    sendBtn.addEventListener("click", () => {
        let message = messageInput.value.trim();
        if (message) {
            appendMessage(message, "user");
            sendMessageToBot(message);
            messageInput.value = "";
        }
    });

    messageInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") sendBtn.click();
    });

    locationBtn.addEventListener("click", () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                let locationMessage = `📍 Ubicación: https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`;
                appendMessage(locationMessage, "user");
                sendMessageToBot(locationMessage, position.coords.latitude, position.coords.longitude);
            }, () => {
                appendMessage("No se pudo obtener la ubicación.", "bot");
            });
        } else {
            appendMessage("La geolocalización no está soportada en este navegador.", "bot");
        }
    });

    // Mensaje de bienvenida
    appendMessage("👋 ¡Hola! Escribe un mensaje para comenzar.", "bot");
});

