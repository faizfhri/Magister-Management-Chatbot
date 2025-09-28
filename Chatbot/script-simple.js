// Simpler implementation focusing on basic functionality
document.addEventListener('DOMContentLoaded', function() {
    const userInfoModal = document.getElementById('userInfoModal');
    const userInfoForm = document.getElementById('userInfoForm');
    const userNameInput = document.getElementById('userName');
    const userPhoneInput = document.getElementById('userPhone');
    const chatBox = document.querySelector('.chat-box');
    
    // Show user info modal when clicking chat trigger or chat button
    const chatButtons = document.querySelectorAll('.chat-button, .chat-trigger-btn');
    chatButtons.forEach(button => {
        button.addEventListener('click', function() {
            const chatButton = document.querySelector('.chat-button');
            if (chatButton) {
                chatButton.style.display = 'none';
            }
            userInfoModal.classList.add('show-modal');
        });
    });
    
    // Close user info modal
    const closeButton = document.querySelector('.modal-close-button');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            userInfoModal.classList.remove('show-modal');
            const chatButton = document.querySelector('.chat-button');
            if (chatButton) {
                chatButton.style.display = 'block';
            }
        });
    }
    
    // Handle user info form submission
    if (userInfoForm) {
        userInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const userName = userNameInput.value.trim();
            const userPhone = userPhoneInput.value.trim();
            
            if (userName === "" || userPhone === "") {
                alert("Nama dan Nomor Telepon harus diisi!");
                return;
            }
            
            // Hide modal and show chat
            userInfoModal.classList.remove('show-modal');
            chatBox.classList.add('show-chat');
            showFAQOptions();
        });
    }
    
    // Close chat box when clicking the close button
    const chatCloseButton = document.querySelector('.chat-box .chat-box-header p');
    if (chatCloseButton) {
        chatCloseButton.addEventListener('click', function() {
            chatBox.classList.remove('show-chat');
            setTimeout(() => {
                const chatButton = document.querySelector('.chat-button');
                if (chatButton) {
                    chatButton.style.display = 'block';
                }
            }, 300);
        });
    }
    
    // List of FAQ options 
    let faqOptions = [
        "Apa itu Program Magister Manajemen Unpad?",
        "Apakah jadwal kuliah fleksibel?",
        "Apa saja jalur masuk ke program MM Unpad?",
        "Apa keunggulan kuliah MM di Unpad?"
    ];
    
    // Function to show FAQ options 
    function showFAQOptions() {
        let faqHtml = "<div class='chat-box-body-receive'><p>Silakan pilih topik yang ingin kamu tanyakan:</p><ul class='faq-list'>";
        faqOptions.forEach((question, index) => {
            faqHtml += `<li class='faq-item' data-question='${question}'>${question}</li>`;
        });
        faqHtml += "</ul></div>";
        const chatBody = document.querySelector('.chat-box-body');
        if (chatBody) {
            chatBody.insertAdjacentHTML('beforeend', faqHtml);
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }
    
    // Function to send a message 
    function sendMessage(message) {
        if (message !== "") {
            let time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            
            // Add user message to chat
            let userMessage = `<div class='chat-box-body-send'><p>${message}</p><span>${time}</span></div>`;
            const chatBody = document.querySelector('.chat-box-body');
            if (chatBody) {
                chatBody.insertAdjacentHTML('beforeend', userMessage);
                const chatInput = document.querySelector('.chat-box-footer input');
                if (chatInput) chatInput.value = "";
                
                // Show loading animation
                let loadingBubble = "<div class='chat-box-body-receive typing loading'><p><span class='dot'></span><span class='dot'></span><span class='dot'></span></p></div>";
                chatBody.insertAdjacentHTML('beforeend', loadingBubble);
                chatBody.scrollTop = chatBody.scrollHeight;
                
                // Simulate response
                setTimeout(() => {
                    const loading = document.querySelector('.loading');
                    if (loading) loading.remove();
                    
                    let botMessage = `<div class='chat-box-body-receive'><p>Demo response for: "${message}". This is a working chatbot integrated with the dashboard!</p><span>${time}</span></div>`;
                    chatBody.insertAdjacentHTML('beforeend', botMessage);
                    chatBody.scrollTop = chatBody.scrollHeight;
                }, 1000);
            }
        }
    }
    
    // Send message when clicking the send button 
    const sendButton = document.querySelector('.send');
    if (sendButton) {
        sendButton.addEventListener('click', function() {
            const chatInput = document.querySelector('.chat-box-footer input');
            if (chatInput) {
                sendMessage(chatInput.value.trim());
            }
        });
    }
    
    // Send message when pressing Enter key 
    const chatInput = document.querySelector('.chat-box-footer input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.which === 13) {
                sendMessage(chatInput.value.trim());
            }
        });
    }
    
    // Handle FAQ selection 
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('faq-item')) {
            const question = e.target.dataset.question;
            sendMessage(question);
        }
    });
});