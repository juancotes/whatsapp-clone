document.addEventListener("DOMContentLoaded", () => {
    const chatBody = document.getElementById("chat-body");
    const messageInput = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-btn");
    const locationBtn = document.getElementById("location-btn");

    // Generar un user_id único por dispositivo y guardarlo en localStorage
    let userId = localStorage.getItem("user_id");
    if (!userId) {
        userId = "user-" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("user_id", userId);
    }
    console.log("🔹 User ID asignado:", userId); // Debugging

    function appendMessage(text, sender) {
        let messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.innerText = text;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function sendMessageToBot(message, latitude = null, longitude = null) {
        let endpoint = "https://geobottwilio.onrender.com/consultas-generales";

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
        if (event.key === "Enter") {
            event.preventDefault();
            sendBtn.click();
        }
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

    // Mensaje de bienvenida actualizado
    appendMessage("👋 ¡Hola! Resuelvo preguntas sobre ordenamiento territorial en Colombia. Escribe un mensaje para iniciar.", "bot");
});
