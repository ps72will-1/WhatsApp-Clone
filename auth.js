// Demo user data (would be replaced with Firebase data in a real application)
const demoUsers = [
    { id: 'user1', name: 'John Smith', email: 'john@example.com', phone: '+1 234 567 8900', status: 'online', isAdmin: true },
    { id: 'user2', name: 'Alice Johnson', email: 'alice@example.com', phone: '+1 987 654 3210', status: 'online', isAdmin: false },
    { id: 'user3', name: 'Bob Wilson', email: 'bob@example.com', phone: '+44 123 456 7890', status: 'offline', isAdmin: false },
    { id: 'user4', name: 'Emily Davis', email: 'emily@example.com', phone: '+61 234 567 890', status: 'online', isAdmin: false },
    { id: 'user5', name: 'Michael Brown', email: 'michael@example.com', phone: '+49 987 654 321', status: 'offline', isAdmin: false }
];

// DOM Elements
const authSection = document.getElementById('auth-section');
const phoneTab = document.getElementById('phone-tab');
const emailTab = document.getElementById('email-tab');
const phoneForm = document.getElementById('phone-form');
const emailForm = document.getElementById('email-form');
const registerForm = document.getElementById('register-form');
const otpForm = document.getElementById('otp-form');
const registerLink = document.getElementById('register-link');
const loginLink = document.getElementById('login-link');

// Setup Auth Event Listeners
function setupAuthEventListeners() {
    // Tab switching
    phoneTab.addEventListener('click', () => {
        phoneTab.classList.add('active');
        emailTab.classList.remove('active');
        phoneForm.classList.remove('hidden');
        emailForm.classList.add('hidden');
        registerForm.classList.add('hidden');
    });
    
    emailTab.addEventListener('click', () => {
        emailTab.classList.add('active');
        phoneTab.classList.remove('active');
        emailForm.classList.remove('hidden');
        phoneForm.classList.add('hidden');
        registerForm.classList.add('hidden');
    });
    
    // Register link
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        emailForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });
    
    // Login link
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        emailForm.classList.remove('hidden');
    });
    
    // Phone verification
    document.getElementById('phone-submit').addEventListener('click', () => {
        const phoneNumber = document.getElementById('phone-number').value;
        const countryCode = document.getElementById('country-code').value;
        
        if (phoneNumber.trim() === '') {
            alert('Please enter a valid phone number');
            return;
        }
        
        // In a real app, this would send a verification code via Firebase
        // For demo purposes, we'll show the OTP form
        showLoading();
        
        // Simulate Firebase phone auth
        // In a real app, you would use:
        // const appVerifier = new firebase.auth.RecaptchaVerifier('phone-submit', { size: 'invisible' });
        // auth.signInWithPhoneNumber(countryCode + phoneNumber, appVerifier)
        //     .then((confirmationResult) => {
        //         window.confirmationResult = confirmationResult;
        //         hideLoading();
        //         otpForm.classList.remove('hidden');
        //     })
        //     .catch((error) => {
        //         hideLoading();
        //         alert('Error sending verification code: ' + error.message);
        //     });
        
        setTimeout(() => {
            hideLoading();
            otpForm.classList.remove('hidden');
        }, 1500);
    });
    
    // OTP verification
    document.getElementById('otp-submit').addEventListener('click', () => {
        const otpCode = document.getElementById('otp-code').value;
        
        if (otpCode.trim() === '') {
            alert('Please enter the verification code');
            return;
        }
        
        // In a real app, this would verify the OTP via Firebase
        // For demo purposes, we'll log in the user
        showLoading();
        
        // In a real app, you would use:
        // window.confirmationResult.confirm(otpCode)
        //     .then((result) => {
        //         // User signed in successfully
        //         const user = result.user;
        //         // Get or create user profile in Firestore
        //         return db.collection('users').doc(user.uid).get()
        //             .then((doc) => {
        //                 if (doc.exists) {
        //                     return doc.data();
        //                 } else {
        //                     // Create new user
        //                     const newUser = {
        //                         name: 'User ' + user.phoneNumber,
        //                         phone: user.phoneNumber,
        //                         status: 'online',
        //                         isAdmin: false,
        //                         createdAt: firebase.firestore.FieldValue.serverTimestamp()
        //                     };
        //                     return db.collection('users').doc(user.uid).set(newUser)
        //                         .then(() => newUser);
        //                 }
        //             });
        //     })
        //     .then((userProfile) => {
        //         hideLoading();
        //         loginUser(userProfile);
        //     })
        //     .catch((error) => {
        //         hideLoading();
        //         alert('Error verifying code: ' + error.message);
        //     });
        
        setTimeout(() => {
            hideLoading();
            loginUser(demoUsers[0]); // Log in as the first demo user
        }, 1500);
    });
    
    // Email login
    document.getElementById('email-submit').addEventListener('click', () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (email.trim() === '' || password.trim() === '') {
            alert('Please enter both email and password');
            return;
        }
        
        // In a real app, this would authenticate via Firebase
        showLoading();
        
        // In a real app, you would use:
        // auth.signInWithEmailAndPassword(email, password)
        //     .then((userCredential) => {
        //         // Get user profile from Firestore
        //         return db.collection('users').doc(userCredential.user.uid).get()
        //             .then((doc) => {
        //                 if (doc.exists) {
        //                     return doc.data();
        //                 } else {
        //                     throw new Error('User profile not found');
        //                 }
        //             });
        //     })
        //     .then((userProfile) => {
        //         hideLoading();
        //         loginUser(userProfile);
        //     })
        //     .catch((error) => {
        //         hideLoading();
        //         alert('Error signing in: ' + error.message);
        //     });
        
        setTimeout(() => {
            hideLoading();
            // Find a matching user
            const user = demoUsers.find(u => u.email === email);
            if (user) {
                loginUser(user);
            } else {
                alert('Invalid email or password');
            }
        }, 1500);
    });
    
    // Register
    document.getElementById('register-submit').addEventListener('click', () => {
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        
        if (name.trim() === '' || email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
            alert('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // In a real app, this would create a user via Firebase
        showLoading();
        
        // In a real app, you would use:
        // auth.createUserWithEmailAndPassword(email, password)
        //     .then((userCredential) => {
        //         // Create user profile in Firestore
        //         const newUser = {
        //             name: name,
        //             email: email,
        //             status: 'online',
        //             isAdmin: false,
        //             createdAt: firebase.firestore.FieldValue.serverTimestamp()
        //         };
        //         return db.collection('users').doc(userCredential.user.uid).set(newUser)
        //             .then(() => {
        //                 return userCredential.user.updateProfile({
        //                     displayName: name
        //                 }).then(() => newUser);
        //             });
        //     })
        //     .then((userProfile) => {
        //         hideLoading();
        //         loginUser(userProfile);
        //     })
        //     .catch((error) => {
        //         hideLoading();
        //         alert('Error creating account: ' + error.message);
        //     });
        
        setTimeout(() => {
            hideLoading();
            // Create a new user object
            const newUser = {
                id: 'user' + (demoUsers.length + 1),
                name: name,
                email: email,
                phone: '',
                status: 'online',
                isAdmin: false
            };
            
            demoUsers.push(newUser);
            loginUser(newUser);
        }, 1500);
    });
}

// Update user status
function updateUserStatus(userId, status) {
    // In a real app, this would update the user status in Firestore
    // db.collection('users').doc(userId).update({
    //     status: status,
    //     lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    // });
    
    // For demo, update the local user object
    const userIndex = demoUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        demoUsers[userIndex].status = status;
    }
}

// Login user
function loginUser(user) {
    // Set current user
    window.currentUser = user;
    
    // Update user status to online
    updateUserStatus(user.id, 'online');
    
    // Update profile information
    const profileAvatar = document.getElementById('profile-avatar');
    const profileName = document.getElementById('profile-name');
    const profilePhone = document.getElementById('profile-phone');
    const profileEmail = document.getElementById('profile-email');
    
    profileAvatar.textContent = getInitials(user.name);
    profileName.textContent = user.name;
    profilePhone.textContent = user.phone || 'Not provided';
    profileEmail.textContent = user.email;
    
    // Show/hide admin tab
    const adminTab = document.querySelector('.admin-tab');
    if (user.isAdmin) {
        adminTab.classList.remove('hidden');
    } else {
        adminTab.classList.add('hidden');
    }
    
    // Show main app
    showAppScreen();
}

// Logout user
function logoutUser() {
    // Update user status to offline
    if (window.currentUser) {
        updateUserStatus(window.currentUser.id, 'offline');
    }
    
    // In a real app, this would sign out from Firebase
    // auth.signOut().then(() => {
    //     window.currentUser = null;
    //     window.currentChat = null;
    //     showAuthScreen();
    // }).catch((error) => {
    //     console.error('Error signing out:', error);
    // });
    
    window.currentUser = null;
    window.currentChat = null;
    
    showAuthScreen();
}

// Export functions
window.setupAuthEventListeners = setupAuthEventListeners;
window.loginUser = loginUser;
window.logoutUser = logoutUser;