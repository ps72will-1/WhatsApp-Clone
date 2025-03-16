// Chat Module
const Chat = (function() {
    // Private variables
    let currentChat = null;
    let chats = {};
    let contacts = {};
    let groups = {};
    let broadcasts = {};
    let blockedContacts = {};
    
    // DOM Elements
    const chatItems = document.querySelectorAll('.chat-item');
    const backToChats = document.getElementById('back-to-chats');
    const chatHeader = document.getElementById('chat-header');
    const currentChatAvatar = document.getElementById('current-chat-avatar');
    const currentChatName = document.getElementById('current-chat-name');
    const currentChatStatus = document.getElementById('current-chat-status');
    const currentChatStatusText = document.getElementById('current-chat-status-text');
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const attachmentBtn = document.getElementById('attachment-btn');
    const attachmentMenu = document.getElementById('attachment-menu');
    const attachmentOptions = document.querySelectorAll('.attachment-option');
    const emojiBtn = document.getElementById('emoji-btn');
    const emojiPicker = document.getElementById('emoji-picker');
    const chatMenuBtn = document.getElementById('chat-menu-btn');
    const chatMenu = document.getElementById('chat-menu');
    const clearChatBtn = document.getElementById('clear-chat-btn');
    const blockContactBtn = document.getElementById('block-contact-btn');
    const newChatBtn = document.getElementById('new-chat-btn');
    const newChatModal = document.getElementById('new-chat-modal');
    const closeNewChat = document.getElementById('close-new-chat');
    const newPrivateChat = document.getElementById('new-private-chat');
    const newGroupChat = document.getElementById('new-group-chat');
    const newBroadcast = document.getElementById('new-broadcast');
    const privateChatForm = document.getElementById('private-chat-form');
    const groupChatForm = document.getElementById('group-chat-form');
    const broadcastForm = document.getElementById('broadcast-form');
    const startChatBtn = document.getElementById('start-chat-btn');
    const createGroupBtn = document.getElementById('create-group-btn');
    const createBroadcastBtn = document.getElementById('create-broadcast-btn');
    const blockedContactsList = document.getElementById('blocked-contacts-list');
    const noBlockedContacts = document.getElementById('no-blocked-contacts');
    
    // Initialize event listeners
    function init() {
        // Chat navigation
        chatItems.forEach(item => {
            item.addEventListener('click', () => {
                const chatId = item.getAttribute('data-chat-id');
                handleChatItemClick(chatId);
            });
        });
        
        backToChats.addEventListener('click', backToChatList);
        
        // Chat actions
        attachmentBtn.addEventListener('click', toggleAttachmentMenu);
        emojiBtn.addEventListener('click', toggleEmojiPicker);
        sendMessageBtn.addEventListener('click', handleSendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });
        
        chatMenuBtn.addEventListener('click', handleChatMenu);
        clearChatBtn.addEventListener('click', clearChat);
        blockContactBtn.addEventListener('click', blockContact);
        
        // New chat modal
        newChatBtn.addEventListener('click', toggleNewChatModal);
        closeNewChat.addEventListener('click', toggleNewChatModal);
        
        newPrivateChat.addEventListener('click', () => switchChatForm('private'));
        newGroupChat.addEventListener('click', () => switchChatForm('group'));
        newBroadcast.addEventListener('click', () => switchChatForm('broadcast'));
        
        startChatBtn.addEventListener('click', () => {
            Utilities.showToast('New chat created', 'success');
            toggleNewChatModal();
        });
        
        createGroupBtn.addEventListener('click', () => {
            Utilities.showToast('New group created', 'success');
            toggleNewChatModal();
        });
        
        createBroadcastBtn.addEventListener('click', () => {
            Utilities.showToast('New broadcast created', 'success');
            toggleNewChatModal();
        });
        
        // Populate emoji picker
        populateEmojiPicker();
    }
    
    // Handle chat selection
    function handleChatItemClick(chatId) {
        currentChat = chatId;
        updateChatHeader(chatId);
        document.body.classList.add('active-chat');
    }
    
    // Update chat header with selected chat info
    function updateChatHeader(chatId) {
        const chatData = {
            chat1: {
                name: 'Lisa Johnson',
                avatar: 'https://i.imgur.com/9qkfQfH.png',
                status: 'online',
                statusText: 'Online'
            },
            chat2: {
                name: 'Mike Smith',
                avatar: 'https://i.imgur.com/Jt1blLU.png',
                status: 'offline',
                statusText: 'Last seen today at 9:15 AM'
            },
            chat3: {
                name: 'Sarah Wilson',
                avatar: 'https://i.imgur.com/bxf3qYO.png',
                status: 'offline',
                statusText: 'Last seen yesterday'
            },
            chat4: {
                name: 'Family Group',
                avatar: null,
                avatarText: 'F',
                avatarColor: 'bg-green-600',
                status: 'group',
                statusText: '5 participants'
            },
            chat5: {
                name: 'Work Announcements',
                avatar: null,
                avatarText: 'W',
                avatarColor: 'bg-purple-600',
                status: 'broadcast',
                statusText: '12 recipients'
            }
        };
        
        const chat = chatData[chatId];
        if (chat) {
            currentChatName.textContent = chat.name;
            currentChatStatusText.textContent = chat.statusText;
            
            if (chat.avatar) {
                currentChatAvatar.src = chat.avatar;
                currentChatAvatar.style.display = 'block';
            } else {
                // Handle group/broadcast avatars with initials
                currentChatAvatar.style.display = 'none';
                // In a real app, we would set the avatar to show initials
            }
            
            // Set status indicator
            if (chat.status === 'online') {
                currentChatStatus.classList.remove('bg-gray-400');
                currentChatStatus.classList.add('bg-green-500');
                currentChatStatus.style.display = 'block';
            } else if (chat.status === 'offline') {
                currentChatStatus.classList.remove('bg-green-500');
                currentChatStatus.classList.add('bg-gray-400');
                currentChatStatus.style.display = 'block';
            } else {
                // Groups and broadcasts don't have status indicators
                currentChatStatus.style.display = 'none';
            }
        }
    }
    
    // Send a message
    function handleSendMessage() {
        const message = messageInput.value.trim();
        
        if (message !== '') {
            // Create message element
            const messageElement = document.createElement('div');
            messageElement.className = 'message-bubble message-outgoing';
            
            // Current time
            const now = new Date();
            const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                              now.getMinutes().toString().padStart(2, '0');
            
            messageElement.innerHTML = `
                <div class="message-text">
                    <p>${message}</p>
                    <span class="message-time text-gray-500">
                        ${timeString}
                        <span class="message-status">
                            <i class="fas fa-check status-sent"></i>
                        </span>
                    </span>
                </div>
            `;
            
            // Add message to chat
            chatMessages.appendChild(messageElement);
            
            // Clear input
            messageInput.value = '';
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Simulate received message after a delay
            setTimeout(() => {
                simulateReceivedMessage();
            }, 1500);
            
            // Simulate message status updates
            setTimeout(() => {
                const statusIcon = messageElement.querySelector('.message-status i');
                statusIcon.className = 'fas fa-check-double status-delivered';
            }, 1000);
            
            setTimeout(() => {
                const statusIcon = messageElement.querySelector('.message-status i');
                statusIcon.className = 'fas fa-check-double status-read';
            }, 3000);
        }
    }
    
    // Simulate receiving a reply
    function simulateReceivedMessage() {
        if (!currentChat) return;
        
        // Demo responses based on chat
        const responses = {
            chat1: ['Sure, that sounds good!', 'I'll let you know 👍', 'Can we talk about it later?'],
            chat2: ['OK, let me check', 'I'm busy right now, I'll call you later', 'Thanks for letting me know'],
            chat3: ['Just sent you the picture', 'Let me know what you think', 'Do you like it?'],
            chat4: ['Mom: Thanks for reminding everyone', 'Dad: I'll be there', 'Sister: Can't wait!'],
            chat5: ['Alex: Meeting updated on calendar', 'Jane: Thanks for the update', 'Mark: See you all there']
        };
        
        const availableResponses = responses[currentChat] || ['OK', 'Got it', 'Thanks'];
        const randomResponse = availableResponses[Math.floor(Math.random() * availableResponses.length)];
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = 'message-bubble message-incoming';
        
        // Current time
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                          now.getMinutes().toString().padStart(2, '0');
        
        messageElement.innerHTML = `
            <div class="message-text">
                <p>${randomResponse}</p>
                <span class="message-time text-gray-500">${timeString}</span>
            </div>
        `;
        
        // Add message to chat
        chatMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate typing indicator before next message
        currentChatStatusText.textContent = 'typing...';
        currentChatStatusText.classList.add('typing-indicator');
        
        setTimeout(() => {
            currentChatStatusText.textContent = 'Online';
            currentChatStatusText.classList.remove('typing-indicator');
        }, 2000);
    }
    
    // UI Handlers
    function backToChatList() {
        document.body.classList.remove('active-chat');
    }
    
    function toggleAttachmentMenu() {
        emojiPicker.classList.add('hidden');
        attachmentMenu.classList.toggle('hidden');
    }
    
    function toggleEmojiPicker() {
        attachmentMenu.classList.add('hidden');
        emojiPicker.classList.toggle('hidden');
    }
    
    function handleChatMenu() {
        chatMenu.classList.toggle('hidden');
    }
    
    function clearChat() {
        // Clear chat messages except for the encryption notice
        const encryptionNotice = chatMessages.querySelector('.encryption-notice');
        chatMessages.innerHTML = '';
        if (encryptionNotice) {
            chatMessages.appendChild(encryptionNotice);
        }
        
        chatMenu.classList.add('hidden');
        Utilities.showToast('Chat cleared', 'success');
    }
    
    function blockContact() {
        if (!currentChat) return;
        
        // Get current chat data
        const chatData = {
            chat1: {
                name: 'Lisa Johnson',
                avatar: 'https://i.imgur.com/9qkfQfH.png',
                phone: '+1 555-123-4567'
            },
            chat2: {
                name: 'Mike Smith',
                avatar: 'https://i.imgur.com/Jt1blLU.png',
                phone: '+1 555-987-6543'
            },
            chat3: {
                name: 'Sarah Wilson',
                avatar: 'https://i.imgur.com/bxf3qYO.png',
                phone: '+1 555-567-8901'
            }
        };
        
        const chat = chatData[currentChat];
        if (chat) {
            // In a real app, we would update the database
            blockedContacts[currentChat] = chat;
            
            // Go back to chat list on mobile
            backToChatList();
            
            // Close menu
            chatMenu.classList.add('hidden');
            
            // Show toast
            Utilities.showToast(`${chat.name} has been blocked`, 'success');
        }
    }
    
    // New Chat Modal
    function toggleNewChatModal() {
        newChatModal.classList.toggle('hidden');
        // Reset form view to private chat
        newPrivateChat.click();
    }
    
    function switchChatForm(formType) {
        // Remove active class from all buttons
        newPrivateChat.classList.remove('bg-green-500', 'text-white');
        newGroupChat.classList.remove('bg-green-500', 'text-white');
        newBroadcast.classList.remove('bg-green-500', 'text-white');
        
        newPrivateChat.classList.add('bg-gray-200', 'text-gray-700');
        newGroupChat.classList.add('bg-gray-200', 'text-gray-700');
        newBroadcast.classList.add('bg-gray-200', 'text-gray-700');
        
        // Hide all forms
        privateChatForm.classList.add('hidden');
        groupChatForm.classList.add('hidden');
        broadcastForm.classList.add('hidden');
        
        // Show selected form and highlight button
        if (formType === 'private') {
            privateChatForm.classList.remove('hidden');
            newPrivateChat.classList.remove('bg-gray-200', 'text-gray-700');
            newPrivateChat.classList.add('bg-green-500', 'text-white');
        } else if (formType === 'group') {
            groupChatForm.classList.remove('hidden');
            newGroupChat.classList.remove('bg-gray-200', 'text-gray-700');
            newGroupChat.classList.add('bg-green-500', 'text-white');
        } else if (formType === 'broadcast') {
            broadcastForm.classList.remove('hidden');
            newBroadcast.classList.remove('bg-gray-200', 'text-gray-700');
            newBroadcast.classList.add('bg-green-500', 'text-white');
        }
    }
    
    // Blocked Contacts
    function updateBlockedContactsList() {
        blockedContactsList.innerHTML = '';
        
        // Check if there are blocked contacts
        const blockedCount = Object.keys(blockedContacts).length;
        
        if (blockedCount === 0) {
            blockedContactsList.classList.add('hidden');
            noBlockedContacts.classList.remove('hidden');
            return;
        }
        
        // Show blocked contacts
        blockedContactsList.classList.remove('hidden');
        noBlockedContacts.classList.add('hidden');
        
        // Add each blocked contact to the list
        for (const [id, contact] of Object.entries(blockedContacts)) {
            const contactElement = document.createElement('div');
            contactElement.className = 'p-4 border-b border-gray-200 flex items-center justify-between';
            contactElement.setAttribute('data-contact-id', id);
            
            contactElement.innerHTML = `
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                        <img src="${contact.avatar}" alt="Contact" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <h4 class="font-medium">${contact.name}</h4>
                        <p class="text-sm text-gray-600">${contact.phone}</p>
                    </div>
                </div>
                <button class="unblock-contact-btn px-3 py-1 bg-green-500 text-white rounded-lg text-sm" data-contact-id="${id}">
                    Unblock
                </button>
            `;
            
            blockedContactsList.appendChild(contactElement);
        }
        
        // Add event listeners to unblock buttons
        const unblockButtons = document.querySelectorAll('.unblock-contact-btn');
        unblockButtons.forEach(button => {
            button.addEventListener('click', handleUnblockContact);
        });
    }
    
    function handleUnblockContact(e) {
        const contactId = e.target.getAttribute('data-contact-id');
        
        if (contactId && blockedContacts[contactId]) {
            const name = blockedContacts[contactId].name;
            delete blockedContacts[contactId];
            
            // Update list
            updateBlockedContactsList();
            
            // Show toast
            Utilities.showToast(`${name} has been unblocked`, 'success');
        }
    }
    
    // Emoji Picker
    function populateEmojiPicker() {
        // Common emojis for demo
        const emojis = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', 
                       '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗',
                       '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮',
                       '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤',
                       '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖',
                       '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯',
                       '❤️', '💙', '💚', '💛', '💜', '🖤', '💔', '🔥', '👍', '👎'];
        
        const emojiContainer = document.getElementById('emoji-picker');
        emojiContainer.innerHTML = '';
        
        emojis.forEach(emoji => {
            const emojiBtn = document.createElement('div');
            emojiBtn.className = 'emoji-btn';
            emojiBtn.textContent = emoji;
            emojiBtn.addEventListener('click', () => {
                insertEmoji(emoji);
            });
            emojiContainer.appendChild(emojiBtn);
        });
    }
    
    function insertEmoji(emoji) {
        messageInput.value += emoji;
        messageInput.focus();
    }
    
    // Demo data initialization
    function initializeDemoData() {
        // Initialize demo contacts
        contacts = {
            1: {
                id: 1,
                name: 'Lisa Johnson',
                phone: '+1 555-123-4567',
                avatar: 'https://i.imgur.com/9qkfQfH.png',
                status: 'Hey there! I am using WhatsApp',
                lastSeen: new Date()
            },
            2: {
                id: 2,
                name: 'Mike Smith',
                phone: '+1 555-987-6543',
                avatar: 'https://i.imgur.com/Jt1blLU.png',
                status: 'Available',
                lastSeen: new Date(Date.now() - 3600000) // 1 hour ago
            },
            3: {
                id: 3,
                name: 'Sarah Wilson',
                phone: '+1 555-567-8901',
                avatar: 'https://i.imgur.com/bxf3qYO.png',
                status: 'At work',
                lastSeen: new Date(Date.now() - 86400000) // 1 day ago
            },
            4: {
                id: 4,
                name: 'John Davis',
                phone: '+1 555-789-1234',
                avatar: 'https://i.imgur.com/8dLPfws.png',
                status: 'Battery about to die',
                lastSeen: new Date(Date.now() - 172800000) // 2 days ago
            }
        };
        
        // Initialize demo groups
        groups = {
            1: {
                id: 1,
                name: 'Family Group',
                members: [1, 2, 3, 4],
                avatar: null,
                avatarText: 'F',
                avatarColor: 'bg-green-600',
                created: new Date(Date.now() - 7776000000) // 90 days ago
            },
            2: {
                id: 2,
                name: 'Work Team',
                members: [1, 3, 4],
                avatar: null,
                avatarText: 'W',
                avatarColor: 'bg-purple-600',
                created: new Date(Date.now() - 2592000000) // 30 days ago
            }
        };
        
        // Initialize demo broadcasts
        broadcasts = {
            1: {
                id: 1,
                name: 'Work Announcements',
                recipients: [1, 2, 3, 4],
                created: new Date(Date.now() - 1296000000) // 15 days ago
            }
        };
        
        // Initialize empty blocked contacts
        blockedContacts = {};
    }
    
    // Public API
    return {
        init,
        initializeDemoData,
        updateBlockedContactsList,
        getCurrentChat: function() {
            return currentChat;
        },
        getBlockedContacts: function() {
            return blockedContacts;
        }
    };
})();

// Initialize Chat module when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // This will be called from app.js to avoid initialization order issues
});