// DOM Elements
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const loadingOverlay = document.getElementById('loading');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const logoutBtn = document.getElementById('logout-btn');

// Current state
window.currentUser = null;
window.currentChat = null;

// Initialize the application
function initApp() {
    // Set up event listeners
    setupAuthEventListeners();
    setupTabEventListeners();
    setupChatEventListeners();
    setupCallsEventListeners();
    setupProfileEventListeners();
    setupAdminEventListeners();
    
    // Load data
    loadContacts();
    loadCalls();
    loadAdminData();

    // For demo purposes, show auth screen first
    showAuthScreen();
    
    // In a real app, check if user is already logged in
    // firebase.auth().onAuthStateChanged((user) => {
    //     hideLoading();
    //     
    //     if (user) {
    //         // User is signed in
    //         db.collection('users').doc(user.uid).get()
    //             .then((doc) => {
    //                 if (doc.exists) {
    //                     const userData = doc.data();
    //                     userData.id = user.uid;
    //                     loginUser(userData);
    //                 } else {
    //                     // Create user profile if it doesn't exist
    //                     const newUser = {
    //                         name: user.displayName || 'User',
    //                         email: user.email || '',
    //                         phone: user.phoneNumber || '',
    //                         status: 'online',
    //                         isAdmin: false,
    //                         createdAt: firebase.firestore.FieldValue.serverTimestamp()
    //                     };
    //                     
    //                     db.collection('users').doc(user.uid).set(newUser)
    //                         .then(() => {
    //                             newUser.id = user.uid;
    //                             loginUser(newUser);
    //                         });
    //                 }
    //             });
    //     } else {
    //         // User is signed out
    //         showAuthScreen();
    //     }
    // });
}

// Tab navigation
function setupTabEventListeners() {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update active tab
    tabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Show active content
    tabContents.forEach(content => {
        if (content.id === tabName + '-tab') {
            content.classList.remove('hidden');
        } else {
            content.classList.add('hidden');
        }
    });
}

// Profile
function setupProfileEventListeners() {
    // Update status
    document.getElementById('update-status').addEventListener('click', () => {
        const statusMessage = document.getElementById('status-message').value;
        
        // In a real app, update status in Firebase
        // db.collection('users').doc(window.currentUser.id).update({
        //     statusMessage: statusMessage
        // }).then(() => {
        //     alert('Status updated successfully');
        // }).catch((error) => {
        //     alert('Error updating status: ' + error.message);
        // });
        
        alert(`Status updated to: ${statusMessage}`);
    });
    
    // Logout
    logoutBtn.addEventListener('click', logoutUser);
}

// Utility Functions
function getInitials(name) {
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase();
}

function showLoading() {
    loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

function showAuthScreen() {
    authSection.classList.remove('hidden');
    appSection.classList.add('hidden');
}

function showAppScreen() {
    authSection.classList.add('hidden');
    appSection.classList.remove('hidden');
    
    // Default to chats tab
    switchTab('chats');
}

// Make these functions globally available
window.getInitials = getInitials;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showAuthScreen = showAuthScreen;
window.showAppScreen = showAppScreen;
window.switchTab = switchTab;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);