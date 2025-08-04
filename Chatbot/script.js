$(document).ready(function () {
    const userInfoModal = $("#userInfoModal");
    const userInfoForm = $("#userInfoForm");
    const userNameInput = $("#userName");
    const userPhoneInput = $("#userPhone");
    const chatBox = $(".chat-box"); 

    // Show user info modal and hide chat button
    $(".chat-button").on("click", function () {
        $(".chat-button").css({ "display": "none" });
        userInfoModal.addClass("show-modal");
    });

    // Close user info modal
    $(".modal-close-button").on("click", function () {
        userInfoModal.removeClass("show-modal");
        $(".chat-button").css({ "display": "block" });
    });

    // Handle user info form submission
    userInfoForm.on("submit", function (e) {
        e.preventDefault();
        const userName = userNameInput.val().trim();
        const userPhone = userPhoneInput.val().trim();

        if (userName === "" || userPhone === "") {
            alert("Nama dan Nomor Telepon harus diisi!");
            return;
        }

        // Send user data to Supabase Edge Function
        $.ajax({
            url: "https://zpwasiqrcqvhdvyyskdv.supabase.co/functions/v1/userdata",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ nama: userName, no_telp: userPhone }),
            success: function (response) {
                console.log("User data saved:", response);
                userInfoModal.removeClass("show-modal");
                chatBox.addClass("show-chat"); 
                showFAQOptions(); 
            },
            error: function (xhr, status, error) {
                console.error("Error saving user data:", error);
                alert("Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
            }
        });
    });

    // Close chat box when clicking the close button
    $(".chat-box .chat-box-header p").on("click", function () {
        chatBox.removeClass("show-chat"); 
        setTimeout(function() {
            $(".chat-button").css({ "display": "block" });
        }, 300); 
    });

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
        $(".chat-box-body").append(faqHtml);
        $(".chat-box-body").scrollTop($(".chat-box-body")[0].scrollHeight);
    }

    // Function to send a message 
    function sendMessage(message) {
        if (message !== "") {
            let time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            
            // Add user message to chat
            let userMessage = `<div class='chat-box-body-send'><p>${message}</p><span>${time}</span></div>`;
            $(".chat-box-body").append(userMessage);
            $(".chat-box-footer input").val("");

            // Show loading animation
            let loadingBubble = "<div class='chat-box-body-receive typing loading'><p><span class='dot'></span><span class='dot'></span><span class='dot'></span></p></div>";
            $(".chat-box-body").append(loadingBubble);
            $(".chat-box-body").scrollTop($(".chat-box-body")[0].scrollHeight);

            // Send to backend
            $.ajax({
                url: "http://localhost:5000/chat",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({ message: message }),
                success: function (response) {
                    $(".loading").remove(); 
                    
                    let botMessage = `<div class='chat-box-body-receive'><p>${response.response}</p><span>${time}</span></div>`;
                    $(".chat-box-body").append(botMessage);
                    $(".chat-box-body").scrollTop($(".chat-box-body")[0].scrollHeight);
                },
                error: function () {
                    $(".loading").remove();
                    
                    let errorMessage = `<div class='chat-box-body-receive'><p>Terjadi kesalahan. Coba lagi nanti.</p><span>${time}</span></div>`;
                    $(".chat-box-body").append(errorMessage);
                }
            });
        }
    }

    // Send message when clicking the send button 
    $(".send").on("click", function () {
        sendMessage($(".chat-box-footer input").val().trim());
    });

    // Send message when pressing Enter key 
    $(".chat-box-footer input").keypress(function (e) {
        if (e.which === 13) {
            sendMessage($(".chat-box-footer input").val().trim());
        }
    });

    // Handle FAQ selection 
    $(document).on("click", ".faq-item", function () {
        let question = $(this).data("question");
        sendMessage(question);
    });
});