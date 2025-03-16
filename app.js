// Utilities Module
const Utilities = (function() {
    // Show toast notification
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `mb-3 p-3 rounded-lg text-white ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            'bg-blue-500'
        } transform transition-transform duration-300 translate-y-0 opacity-100`;
        
        toast.innerHTML = `
            <div class="flex items-center">
                <div class="flex-shrink-0 mr-2">
                    <i class="fas fa-${
                        type === 'success' ? 'check-circle' : 
                        type === 'error' ? 'exclamation-circle' : 
                        'info-circle'
                    }"></i>
                </div>
                <div>
                    ${message}
                </div>
            </div>
        `;
        
        const toastContainer = document.getElementById('toast-container');
        toastContainer.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // Public API
    return {
        showToast
    };
})();

// Main App Module
const App = (function() {
    // App state
    const appState = {
        darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
        isRTL: false,
        languages: {
            en: { name: 'English', dir: 'ltr' },
            ar: { name: 'العربية', dir: 'rtl' },
            // Add more languages as needed
        },
        currentLanguage: 'en'
    };
    
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
    const userMenuToggle = document.getElementById('user-menu-toggle');
    const userMenu = document.getElementById('user-menu');
    const goToSettings = document.getElementById('go-to-settings');
    const backFromSettings = document.getElementById('back-from-settings');
    const viewBlockedContacts = document.getElementById('view-blocked-contacts');
    const backFromBlocked = document.getElementById('back-from-blocked');
    const languageSelector = document.getElementById('language-selector');
    const logoutBtn = document.getElementById('logout-btn');
    const settingsLogoutBtn = document.getElementById('settings-logout-btn');
    const chatScreen = document.getElementById('chat-screen');
    const settingsScreen = document.getElementById('settings-screen');
    const blockedContactsScreen = document.getElementById('blocked-contacts-screen');
    const statusViewer = document.getElementById('status-viewer');
    const goToStatus = document.getElementById('go-to-status');
    const closeStatus = document.getElementById('close-status');
    
    // Initialize the app
    function init() {
        // Set theme based on system preference
        setTheme(appState.darkMode);
        
        // Set default language
        setLanguage(appState.currentLanguage);
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize modules
        Auth.init();
        Chat.init();
        Calls.init();
        Admin.init();
    }
    
    // Set theme (dark/light)
    function setTheme(isDark) {
        document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        if (themeToggleCheckbox) {
            themeToggleCheckbox.checked = isDark;
        }
        appState.darkMode = isDark;
    }
    
    // Set language
    function setLanguage(langCode) {
        const language = appState.languages[langCode];
        if (language) {
            document.documentElement.setAttribute('dir', language.dir);
            appState.isRTL = language.dir === 'rtl';
            appState.currentLanguage = langCode;
            languageSelector.value = langCode;
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Theme toggle
        themeToggle.addEventListener('click', () => {
            const newTheme = !appState.darkMode;
            setTheme(newTheme);
        });
        
        themeToggleCheckbox?.addEventListener('change', (e) => {
            setTheme(e.target.checked);
        });
        
        // Language selector
        languageSelector.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
        
        // User menu
        userMenuToggle.addEventListener('click', toggleUserMenu);
        
        // Settings navigation
        goToSettings.addEventListener('click', navigateToSettings);
        backFromSettings.addEventListener('click', navigateFromSettings);
        
        // Blocked contacts
        viewBlockedContacts.addEventListener('click', navigateToBlockedContacts);
        backFromBlocked.addEventListener('click', navigateFromBlockedContacts);
        
        // Logout
        logoutBtn.addEventListener('click', Auth.logout);
        settingsLogoutBtn.addEventListener('click', Auth.logout);
        
        // Status viewer
        goToStatus.addEventListener('click', toggleStatusViewer);
        closeStatus.addEventListener('click', toggleStatusViewer);
        
        // Click outside to close menus
        document.addEventListener('click', handleOutsideClicks);
        
        // Handle screen size changes (for mobile view)
        window.addEventListener('resize', handleScreenResize);
    }
    
    // UI Handlers
    function toggleUserMenu() {
        userMenu.classList.toggle('hidden');
    }
    
    function navigateToSettings() {
        chatScreen.classList.add('hidden');
        settingsScreen.classList.remove('hidden');
        userMenu.classList.add('hidden');
    }
    
    function navigateFromSettings() {
        settingsScreen.classList.add('hidden');
        chatScreen.classList.remove('hidden');
    }
    
    function navigateToBlockedContacts() {
        Chat.updateBlockedContactsList();
        settingsScreen.classList.add('hidden');
        blockedContactsScreen.classList.remove('hidden');
    }
    
    function navigateFromBlockedContacts() {
        blockedContactsScreen.classList.add('hidden');
        settingsScreen.classList.remove('hidden');
    }
    
    function toggleStatusViewer() {
        statusViewer.classList.toggle('hidden');
    }
    
    function handleOutsideClicks(e) {
        // Close user menu if clicking outside
        if (userMenuToggle && userMenu && 
            !userMenuToggle.contains(e.target) && 
            !userMenu.contains(e.target)) {
            userMenu.classList.add('hidden');
        }
        
        // Close chat menu if clicking outside
        const chatMenuBtn = document.getElementById('chat-menu-btn');
        const chatMenu = document.getElementById('chat-menu');
        if (chatMenuBtn && chatMenu && 
            !chatMenuBtn.contains(e.target) && 
            !chatMenu.contains(e.target)) {
            chatMenu.classList.add('hidden');
        }
        
        // Close emoji picker if clicking outside
        const emojiBtn = document.getElementById('emoji-btn');
        const emojiPicker = document.getElementById('emoji-picker');
        if (emojiBtn && emojiPicker && 
            !emojiBtn.contains(e.target) && 
            !emojiPicker.contains(e.target)) {
            emojiPicker.classList.add('hidden');
        }
        
        // Close attachment menu if clicking outside
        const attachmentBtn = document.getElementById('attachment-btn');
        const attachmentMenu = document.getElementById('attachment-menu');
        if (attachmentBtn && attachmentMenu && 
            !attachmentBtn.contains(e.target) && 
            !attachmentMenu.contains(e.target)) {
            attachmentMenu.classList.add('hidden');
        }
        
        // Close country selector if clicking outside
        const countryCodeSelector = document.getElementById('country-code-selector');
        const countrySelect = document.getElementById('country-select');
        if (countryCodeSelector && countrySelect && 
            !countryCodeSelector.contains(e.target) && 
            !countrySelect.contains(e.target)) {
            countrySelect.classList.add('hidden');
        }
    }
    
    function handleScreenResize() {
        if (window.innerWidth >= 768) {
            document.body.classList.remove('active-chat');
        }
    }
    
    // Return public API
    return {
        init
    };
})();

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});