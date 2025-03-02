// Demo data for contacts and messages (would be replaced with Firebase data)
const demoContacts = [
    { id: 'user2', name: 'Alice Johnson', lastMessage: 'Hey, how are you?', time: '12:30 PM', unread: 2 },
    { id: 'user3', name: 'Bob Wilson', lastMessage: 'Can you send me the report?', time: '11:45 AM', unread: 0 },
    { id: 'user4', name: 'Emily Davis', lastMessage: 'Meeting at 3 PM today', time: 'Yesterday', unread: 0 },
    { id: 'user5', name: 'Michael Brown', lastMessage: 'Thanks for your help!', time: 'Yesterday', unread: 0 }
];

const demoMessages = {
    'user2': [
        { sender: 'user2', text: 'Hey John, how are you?', time: '12:25 PM' },
        { sender: 'user1', text: 'I\'m good, thanks! How about you?', time: '12:26 PM' },
        { sender: 'user2', text: 'Doing well. Do you have time for a quick call?', time: '12:28 PM' },
        { sender: 'user1', text: 'Sure, I\'m free now.', time: '12:29 PM' },
        { sender: 'user2', text: 'Great! I\'ll call you in 5 minutes.', time: '12:30 PM' }
    ],
    'user3': [
        { sender: 'user3', text: 'Hi John, could you send me the quarterly report?', time: '11:40 AM' },
        { sender: 'user1', text: 'Yes, I\'ll email it to you shortly.', time: '11:42 AM' },
        { sender: 'user3', text: 'Thanks! I need it for the meeting tomorrow.', time: '11:43 AM' },
        { sender: 'user1', text: 'No problem, I\'ll include the presentation slides as well.', time: '11:44 AM' },
        { sender: 'user3', text: 'Can you send me the report?', time: '11:45 AM' }
    ],
    'user4': [
        { sender: 'user4', text: 'Good morning John!', time: 'Yesterday' },
        { sender: 'user1', text: 'Good morning Emily, how are you?', time: 'Yesterday' },
        { sender: 'user4', text: 'I\'m well. Just a reminder we have a team meeting at 3 PM today.', time: 'Yesterday' },
        { sender: 'user1', text: 'Thanks for the reminder. I\'ll be there.', time: 'Yesterday' },
        { sender: 'user4', text: 'Meeting at 3 PM today', time: 'Yesterday' }
    ],
    'user5': [
        { sender: 'user1', text: 'Hi Michael, did you fix the bug in the login page?', time: 'Yesterday' },
        { sender: 'user5', text: 'Yes, it\'s fixed now. I pushed the changes to the repository.', time: 'Yesterday' },
        { sender: 'user1', text: 'Great job! That was a critical issue.', time: 'Yesterday' },
        { sender: 'user5', text: 'It was a simple fix, just needed to update the validation logic.', time: 'Yesterday' },
        { sender: 'user5', text: 'Thanks for your help!', time: 'Yesterday' }
    ]
};

// DOM Elements
const contactList = document.getElementById('contact-list');
const chatArea = document.getElementById('chat-area');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-message');
const chatWithText = document.getElementById('chat-with');

// Set up chat event listeners
function setupChatEventListeners() {
    // Send message button
    sendButton.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// Load contacts
function loadContacts() {
    contactList.innerHTML = '';
    
    demoContacts.forEach(contact => {
        const contactElement = document.createElement('div');
        contactElement.className = 'contact-item';
        contactElement.dataset.userId = contact.id;
        
        const initials = getInitials(contact.name);
        const unreadBadge = contact.unread > 0 ? 
            `<span class="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">${contact.unread}</span>` : '';
        
        contactElement.innerHTML = `
            <div class="contact-avatar">${initials}</div>
            <div class="contact-info">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-last-message">${contact.lastMessage}</div>
            </div>
            <div class="flex flex-col items-end">
                <div class="contact-time">${contact.time}</div>
                ${unreadBadge}
            </div>
        `;
        
        contactElement.addEventListener('click', () => {
            openChat(contact);
        });
        
        contactList.appendChild(contactElement);
    });
}

// Open chat with a contact
function openChat(contact) {
    window.currentChat = contact;
    
    // Update active contact
    document.querySelectorAll('.contact-item').forEach(item => {
        if (item.dataset.userId === contact.id) {
            item.classList.add('active');
            // Reset unread count
            const unreadElement = item.querySelector('.bg-green-500');
            if (unreadElement) {
                unreadElement.remove();
            }
            
            // Update contact unread count
            const contactIndex = demoContacts.findIndex(c => c.id === contact.id);
            if (contactIndex !== -1) {
                demoContacts[contactIndex].unread = 0;
            }
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update chat header
    chatWithText.textContent = contact.name;
    
    // Load messages
    loadMessages(contact.id);
}

// Load messages for a chat
function loadMessages(userId) {
    chatArea.innerHTML = '';
    
    const messages = demoMessages[userId] || [];
    
    messages.forEach(message => {
        const isSent = message.sender === window.currentUser.id;
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isSent ? 'message-sent' : 'message-received'}`;
        
        messageElement.innerHTML = `
            <div>${message.text}</div>
            <div class="message-time">${message.time}</div>
        `;
        
        chatArea.appendChild(messageElement);
    });
    
    // Scroll to bottom
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Send a message
function sendMessage() {
    const messageText = messageInput.value.trim();
    
    if (messageText === '' || !window.currentChat) {
        return;
    }
    
    // Create new message
    const now = new Date();
    const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ' ' + (now.getHours() >= 12 ? 'PM' : 'AM');
    
    const newMessage = {
        sender: window.currentUser.id,
        text: messageText,
        time: timeString
    };
    
    // Add to demo data
    if (!demoMessages[window.currentChat.id]) {
        demoMessages[window.currentChat.id] = [];
    }
    
    demoMessages[window.currentChat.id].push(newMessage);
    
    // Update last message in contacts
    const contactIndex = demoContacts.findIndex(c => c.id === window.currentChat.id);
    if (contactIndex !== -1) {
        demoContacts[contactIndex].lastMessage = messageText;
        demoContacts[contactIndex].time = timeString;
        
        // Move this contact to the top
        const contact = demoContacts.splice(contactIndex, 1)[0];
        demoContacts.unshift(contact);
        
        // Reload contacts
        loadContacts();
        
        // Reselect current chat
        document.querySelector(`.contact-item[data-userid="${window.currentChat.id}"]`).classList.add('active');
    }
    
    // Add message to chat
    const messageElement = document.createElement('div');
    messageElement.className = 'message message-sent';
    
    messageElement.innerHTML = `
        <div>${messageText}</div>
        <div class="message-time">${timeString}</div>
    `;
    
    chatArea.appendChild(messageElement);
    
    // Scroll to bottom
    chatArea.scrollTop = chatArea.scrollHeight;
    
    // Clear input
    messageInput.value = '';
    
    // In a real app, this would save the message to Firebase
    // db.collection('messages').add({
    //     chatId: generateChatId(window.currentUser.id, window.currentChat.id),
    //     sender: window.currentUser.id,
    //     text: messageText,
    //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //     read: false
    // }).then(() => {
    //     // Update last message in chats collection
    //     return db.collection('chats').doc(generateChatId(window.currentUser.id, window.currentChat.id)).set({
    //         participants: [window.currentUser.id, window.currentChat.id],
    //         lastMessage: messageText,
    //         lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(),
    //         lastSenderId: window.currentUser.id
    //     }, { merge: true });
    // });
    
    // Simulate reply after a short delay
    if (Math.random() > 0.5) {
        setTimeout(() => {
            simulateReply(window.currentChat.id);
        }, 2000 + Math.random() * 3000);
    }
}

// Simulate a reply message
function simulateReply(userId) {
    if (window.currentChat && window.currentChat.id === userId) {
        const replyTexts = [
            "I'll get back to you on that.",
            "Sounds good!",
            "Can we discuss this later?",
            "Thanks for letting me know.",
            "I'll check and let you know.",
            "👍",
            "Great idea!",
            "I'm not sure about that."
        ];
        
        const replyText = replyTexts[Math.floor(Math.random() * replyTexts.length)];
        const now = new Date();
        const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ' ' + (now.getHours() >= 12 ? 'PM' : 'AM');
        
        const newMessage = {
            sender: userId,
            text: replyText,
            time: timeString
        };
        
        // Add to demo data
        demoMessages[userId].push(newMessage);
        
        // Update last message in contacts
        const contactIndex = demoContacts.findIndex(c => c.id === userId);
        if (contactIndex !== -1) {
            demoContacts[contactIndex].lastMessage = replyText;
            demoContacts[contactIndex].time = timeString;
            
            // Move this contact to the top
            const contact = demoContacts.splice(contactIndex, 1)[0];
            demoContacts.unshift(contact);
            
            // Reload contacts
            loadContacts();
            
            // Reselect current chat
            document.querySelector(`.contact-item[data-userid="${window.currentChat.id}"]`).classList.add('active');
        }
        
        // Add message to chat
        const messageElement = document.createElement('div');
        messageElement.className = 'message message-received';
        
        messageElement.innerHTML = `
            <div>${replyText}</div>
            <div class="message-time">${timeString}</div>
        `;
        
        chatArea.appendChild(messageElement);
        
        // Scroll to bottom
        chatArea.scrollTop = chatArea.scrollHeight;
    }
}

// Function to generate a chat ID for two users
function generateChatId(userId1, userId2) {
    // Sort the IDs to ensure consistency
    const sortedIds = [userId1, userId2].sort();
    return sortedIds.join('_');
}

// Get real-time updates (in a real app)
function setupRealTimeListeners() {
    // In a real app, you would listen for real-time updates
    // Listen for messages in the current chat
    // let unsubscribeMessages = null;
    
    // function listenForMessages(chatId) {
    //     // Unsubscribe from previous listener
    //     if (unsubscribeMessages) {
    //         unsubscribeMessages();
    //     }
    //     
    //     // Listen for new messages
    //     unsubscribeMessages = db.collection('messages')
    //         .where('chatId', '==', chatId)
    //         .orderBy('timestamp')
    //         .onSnapshot((snapshot) => {
    //             snapshot.docChanges().forEach((change) => {
    //                 if (change.type === 'added') {
    //                     const message = change.doc.data();
    //                     
    //                     // Only add new messages
    //                     const messageTime = message.timestamp ? message.timestamp.toDate() : new Date();
    //                     const timeString = formatTime(messageTime);
    //                     
    //                     // Check if this is a new message
    //                     const messageElement = document.createElement('div');
    //                     const isSent = message.sender === window.currentUser.id;
    //                     messageElement.className = `message ${isSent ? 'message-sent' : 'message-received'}`;
    //                     
    //                     messageElement.innerHTML = `
    //                         <div>${message.text}</div>
    //                         <div class="message-time">${timeString}</div>
    //                     `;
    //                     
    //                     chatArea.appendChild(messageElement);
    //                     chatArea.scrollTop = chatArea.scrollHeight;
    //                     
    //                     // Mark as read if received and chat is open
    //                     if (!isSent && window.currentChat && window.currentChat.id === getChatPartnerId(message.chatId)) {
    //                         db.collection('messages').doc(change.doc.id).update({
    //                             read: true
    //                         });
    //                     }
    //                 }
    //             });
    //         });
    // }
    
    // // Listen for contacts/chats
    // db.collection('chats')
    //     .where('participants', 'array-contains', window.currentUser.id)
    //     .orderBy('lastMessageTime', 'desc')
    //     .onSnapshot((snapshot) => {
    //         // Process changes...
    //     });
}

// Export functions
window.setupChatEventListeners = setupChatEventListeners;
window.loadContacts = loadContacts;
window.openChat = openChat;
window.loadMessages = loadMessages;
window.sendMessage = sendMessage;