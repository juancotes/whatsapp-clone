document.addEventListener("DOMContentLoaded", () => {
    const chatBody = document.getElementById("chat-body");
    const messageInput = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-btn");
    const locationBtn = document.getElementById("location-btn");

    function appendMessage(text, sender) {
        let messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender); // Aplica clase "message" y "user" o "bot"
        messageDiv.innerText = text;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight; // Hace scroll automático al último mensaje
    }

    function sendMessageToBot(message) {
        appendMessage(message, "user");  // Agrega el mensaje del usuario en la interfaz

        fetch("https://geobottwilio.onrender.com/consultas-generales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: "user-123", message })
        })
        .then(response => response.json())
        .then(data => appendMessage(data.reply, "bot")) // Agrega la respuesta del bot
        .catch(() => appendMessage("Error al conectar con el bot", "bot"));
    }

    sendBtn.addEventListener("click", () => {
        let message = messageInput.value.trim();
        if (message) {
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

    appendMessage("👋 ¡Hola! Resuelvo preguntas sobre ordenamiento territorial en Colombia. Escribe un mensaje para iniciar.", "bot");
});
