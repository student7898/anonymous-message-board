let API_URL = "https://anonymous-message-board-l82k.onrender.com/api/messages";
let messagesContainer = document.getElementById("chat-log");
let messageInput = document.getElementById("message-input");
let userId = localStorage.getItem("userId");

if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("userId", userId);
}

function formatTime(isoString) {
    let date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function loadMessages() {
    try {
        let response = await fetch(API_URL);
        let messages = await response.json();
        messagesContainer.innerHTML = "";
        messages.forEach(loadedMessage => {
            let newDivider = document.createElement("div");
            newDivider.classList.add("full-message");
            console.log(loadedMessage.message)
            if (loadedMessage.userId == userId) {
                newDivider.classList.add("my-message");
            } else {
                newDivider.classList.add("other-message");
            }
            newDivider.innerHTML = "<div>" + loadedMessage.message + "</div><div class='timestamp'>" + formatTime(loadedMessage.timestamp) + "</div>";
            messagesContainer.appendChild(newDivider);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight; 
    } catch (error) {
        console.error("Failed to load messages:", error);
    }
}

async function sendMessage() {
    let messageText = messageInput.value;
    if (!messageText) {
        return;
    }
    let newMessage = {
        message: messageText,
        userId: userId
    };
    try {
        let response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMessage)
        });
        if (response.ok) {
            messageInput.value = "";
            loadMessages();
        } else {
            console.error("Failed to a send message.");
        }
    } catch (error) {
        console.error("Error occurred:", error);
    }
}

loadMessages();