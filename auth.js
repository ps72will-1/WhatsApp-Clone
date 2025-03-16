// Authentication Module
const Auth = (function() {
    // Private variables and functions
    let currentUser = null;
    
    // DOM Elements
    const authScreen = document.getElementById('auth-screen');
    const phoneAuth = document.getElementById('phone-auth');
    const emailAuth = document.getElementById('email-auth');
    const emailSignup = document.getElementById('email-signup');
    const otpAuth = document.getElementById('otp-auth');
    const userInfo = document.getElementById('user-info');
    const adminLogin = document.getElementById('admin-login');
    
    // Auth tabs
    const phoneAuthTab = document.getElementById('phone-auth-tab');
    const emailAuthTab = document.getElementById('email-auth-tab');
    
    // Phone Auth Elements
    const sendOtpBtn = document.getElementById('send-otp-btn');
    const verifyOtpBtn = document.getElementById('verify-otp-btn');
    const changeNumberBtn = document.getElementById('change-number-btn');
    const phoneDisplay = document.getElementById('phone-display');
    const phoneNumber = document.getElementById('phone-number');
    const countryCodeSelector = document.getElementById('country-code-selector');
    const countrySelect = document.getElementById('country-select');
    const selectedCode = document.getElementById('selected-code');
    const selectedFlag = document.getElementById('selected-flag');
    const otpInputs = document.querySelectorAll('.otp-input');
    const resendTimer = document.getElementById('resend-timer');
    
    // Email Auth Elements
    const authEmail = document.getElementById('auth-email');
    const authPassword = document.getElementById('auth-password');
    const emailSigninBtn = document.getElementById('email-signin-btn');
    const forgotPassword = document.getElementById('forgot-password');
    const showEmailSignup = document.getElementById('show-email-signup');
    
    // Email Signup Elements
    const signupName = document.getElementById('signup-name');
    const signupEmail = document.getElementById('signup-email');
    const signupPassword = document.getElementById('signup-password');
    const signupConfirmPassword = document.getElementById('signup-confirm-password');
    const emailSignupBtn = document.getElementById('email-signup-btn');
    const showEmailSignin = document.getElementById('show-email-signin');
    
    // Account Setup Elements
    const setupAccountBtn = document.getElementById('setup-account-btn');
    const userName = document.getElementById('user-name');
    const profileUpload = document.getElementById('profile-upload');
    const profilePreview = document.getElementById('profile-preview');
    const profilePlaceholder = document.getElementById('profile-placeholder');
    
    // Admin Login Elements
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminLoginLink = document.getElementById('admin-login-link');
    const backToUserLogin = document.getElementById('back-to-user-login');
    const adminUsername = document.getElementById('admin-username');
    const adminPassword = document.getElementById('admin-password');
    
    // Profile Elements
    const userAvatar = document.getElementById('user-avatar');
    const myStatusAvatar = document.getElementById('my-status-avatar');
    const settingsProfileImg = document.getElementById('settings-profile-img');
    const settingsUserName = document.getElementById('settings-user-name');
    const settingsUserStatus = document.getElementById('settings-user-status');
    
    // Initialize event listeners
    function init() {
        // Auth method tabs
        phoneAuthTab.addEventListener('click', switchToPhoneAuth);
        emailAuthTab.addEventListener('click', switchToEmailAuth);
        
        // Phone auth
        sendOtpBtn.addEventListener('click', handleSendOTP);
        verifyOtpBtn.addEventListener('click', handleVerifyOTP);
        changeNumberBtn.addEventListener('click', handleChangeNumber);
        
        // OTP input handling
        otpInputs.forEach(input => {
            input.addEventListener('input', handleOTPInput);
            input.addEventListener('keydown', handleOTPKeydown);
        });
        
        // Email auth
        emailSigninBtn.addEventListener('click', handleEmailSignIn);
        forgotPassword.addEventListener('click', handleForgotPassword);
        showEmailSignup.addEventListener('click', switchToEmailSignup);
        
        // Email signup
        emailSignupBtn.addEventListener('click', handleEmailSignUp);
        showEmailSignin.addEventListener('click', switchToEmailAuth);
        
        // Account setup
        setupAccountBtn.addEventListener('click', handleSetupAccount);
        profileUpload.addEventListener('change', handleProfileUpload);
        
        // Admin login
        adminLoginBtn.addEventListener('click', handleAdminLogin);
        adminLoginLink.addEventListener('click', showAdminLogin);
        backToUserLogin.addEventListener('click', showPhoneAuth);
        
        // Country code selector
        countryCodeSelector.addEventListener('click', toggleCountrySelect);
        document.querySelectorAll('.country-option').forEach(option => {
            option.addEventListener('click', selectCountryCode);
        });
    }
    
    // Authentication Method Switching
    function switchToPhoneAuth() {
        // Update tab styles
        phoneAuthTab.classList.remove('bg-gray-200', 'text-gray-700');
        phoneAuthTab.classList.add('bg-green-500', 'text-white');
        emailAuthTab.classList.remove('bg-green-500', 'text-white');
        emailAuthTab.classList.add('bg-gray-200', 'text-gray-700');
        
        // Show phone auth form, hide others
        phoneAuth.classList.remove('hidden');
        emailAuth.classList.add('hidden');
        emailSignup.classList.add('hidden');
    }
    
    function switchToEmailAuth() {
        // Update tab styles
        emailAuthTab.classList.remove('bg-gray-200', 'text-gray-700');
        emailAuthTab.classList.add('bg-green-500', 'text-white');
        phoneAuthTab.classList.remove('bg-green-500', 'text-white');
        phoneAuthTab.classList.add('bg-gray-200', 'text-gray-700');
        
        // Show email auth form, hide others
        emailAuth.classList.remove('hidden');
        phoneAuth.classList.add('hidden');
        emailSignup.classList.add('hidden');
    }
    
    function switchToEmailSignup() {
        emailSignup.classList.remove('hidden');
        emailAuth.classList.add('hidden');
    }
    
    // Phone Authentication Handlers
    function handleSendOTP() {
        const phone = phoneNumber.value.trim();
        if (phone) {
            simulateOTPSend(phone);
        } else {
            Utilities.showToast('Please enter a valid phone number', 'error');
        }
    }
    
    function simulateOTPSend(phoneNum) {
        // Display the phone number in the OTP screen
        phoneDisplay.textContent = selectedCode.textContent + ' ' + phoneNum;
        
        // Show OTP input screen
        phoneAuth.classList.add('hidden');
        otpAuth.classList.remove('hidden');
        
        // Start countdown for resend
        let seconds = 30;
        const countdownInterval = setInterval(() => {
            seconds--;
            resendTimer.textContent = `Resend in ${seconds}s`;
            
            if (seconds <= 0) {
                clearInterval(countdownInterval);
                resendTimer.textContent = 'Resend OTP';
                resendTimer.classList.add('text-blue-600', 'hover:underline', 'cursor-pointer');
                
                // Add click event for resend
                resendTimer.addEventListener('click', () => handleSendOTP());
            }
        }, 1000);
        
        // Focus first OTP input
        if (otpInputs.length > 0) {
            otpInputs[0].focus();
        }
        
        Utilities.showToast('OTP sent successfully!', 'success');
    }
    
    function handleVerifyOTP() {
        let otp = '';
        otpInputs.forEach(input => {
            otp += input.value;
        });
        
        if (otp.length === 6) {
            // Show user info screen for final setup
            otpAuth.classList.add('hidden');
            userInfo.classList.remove('hidden');
            // Pre-fill with phone number
            userName.value = '';
            Utilities.showToast('OTP verified successfully!', 'success');
        } else {
            Utilities.showToast('Please enter a valid 6-digit OTP', 'error');
        }
    }
    
    function handleOTPInput(e) {
        const index = parseInt(e.target.getAttribute('data-index'));
        
        if (e.target.value && index < 6) {
            document.querySelector(`.otp-input[data-index="${index + 1}"]`).focus();
        }
    }
    
    function handleOTPKeydown(e) {
        const index = parseInt(e.target.getAttribute('data-index'));
        
        if (e.key === 'Backspace' && !e.target.value && index > 1) {
            document.querySelector(`.otp-input[data-index="${index - 1}"]`).focus();
        }
    }
    
    function handleChangeNumber() {
        otpAuth.classList.add('hidden');
        phoneAuth.classList.remove('hidden');
    }
    
    // Email Authentication Handlers
    function handleEmailSignIn() {
        const email = authEmail.value.trim();
        const password = authPassword.value.trim();
        
        // Simple validation
        if (!email) {
            Utilities.showToast('Please enter your email address', 'error');
            return;
        }
        
        if (!password) {
            Utilities.showToast('Please enter your password', 'error');
            return;
        }
        
        // In a real app, this would connect to your authentication service
        // For demo purposes, we'll simulate a successful login
        simulateEmailLogin(email);
    }
    
    function simulateEmailLogin(email) {
        // Create user object with email info
        currentUser = {
            name: email.split('@')[0], // Use part of email as name
            email: email,
            avatar: 'https://i.imgur.com/8uuq4DZ.png', // Default avatar
            status: 'Available',
            lastSeen: new Date()
        };
        
        // Update UI with user info
        userAvatar.src = currentUser.avatar;
        myStatusAvatar.src = currentUser.avatar;
        settingsProfileImg.src = currentUser.avatar;
        settingsUserName.textContent = currentUser.name;
        settingsUserStatus.textContent = currentUser.status;
        
        // Switch to chat interface
        authScreen.classList.add('hidden');
        document.getElementById('chat-screen').classList.remove('hidden');
        
        // Initialize demo chat data
        Chat.initializeDemoData();
        
        Utilities.showToast('Welcome to WhatsApp Web Clone!', 'success');
    }
    
    function handleEmailSignUp() {
        const name = signupName.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value.trim();
        const confirmPassword = signupConfirmPassword.value.trim();
        
        // Validation
        if (!name) {
            Utilities.showToast('Please enter your name', 'error');
            return;
        }
        
        if (!email) {
            Utilities.showToast('Please enter your email address', 'error');
            return;
        }
        
        if (!password) {
            Utilities.showToast('Please create a password', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            Utilities.showToast('Passwords do not match', 'error');
            return;
        }
        
        // In a real app, this would register a new user account
        // For demo purposes, we'll simulate a successful registration and login
        
        // Create user object
        currentUser = {
            name: name,
            email: email,
            avatar: 'https://i.imgur.com/8uuq4DZ.png', // Default avatar
            status: 'Available',
            lastSeen: new Date()
        };
        
        // Update UI with user info
        userAvatar.src = currentUser.avatar;
        myStatusAvatar.src = currentUser.avatar;
        settingsProfileImg.src = currentUser.avatar;
        settingsUserName.textContent = currentUser.name;
        settingsUserStatus.textContent = currentUser.status;
        
        // Switch to chat interface
        authScreen.classList.add('hidden');
        document.getElementById('chat-screen').classList.remove('hidden');
        
        // Initialize demo chat data
        Chat.initializeDemoData();
        
        Utilities.showToast('Account created successfully! Welcome to WhatsApp Web Clone!', 'success');
    }
    
    function handleForgotPassword() {
        const email = authEmail.value.trim();
        
        if (!email) {
            Utilities.showToast('Please enter your email address', 'error');
            return;
        }
        
        // In a real app, this would send a password reset email
        Utilities.showToast('Password reset instructions sent to your email', 'success');
    }
    
    // Account Setup Handlers
    function handleSetupAccount() {
        const name = userName.value.trim();
        
        if (!name) {
            Utilities.showToast('Please enter your name', 'error');
            return;
        }
        
        // Create user object (for phone auth flow)
        currentUser = {
            name: name,
            phone: phoneDisplay.textContent,
            avatar: profilePreview.src || 'https://i.imgur.com/8uuq4DZ.png',
            status: 'Available',
            lastSeen: new Date()
        };
        
        // Update UI with user info
        userAvatar.src = currentUser.avatar;
        myStatusAvatar.src = currentUser.avatar;
        settingsProfileImg.src = currentUser.avatar;
        settingsUserName.textContent = currentUser.name;
        settingsUserStatus.textContent = currentUser.status;
        
        // Switch to chat interface
        authScreen.classList.add('hidden');
        document.getElementById('chat-screen').classList.remove('hidden');
        
        // Initialize demo chat data
        Chat.initializeDemoData();
        
        Utilities.showToast('Welcome to WhatsApp Web Clone!', 'success');
    }
    
    // Profile Image Upload
    function handleProfileUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePreview.src = e.target.result;
                profilePreview.classList.remove('hidden');
                profilePlaceholder.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Admin Login
    function handleAdminLogin() {
        const username = adminUsername.value.trim();
        const password = adminPassword.value.trim();
        
        if (username === 'admin' && password === 'admin123') {
            authScreen.classList.add('hidden');
            document.getElementById('admin-panel').classList.remove('hidden');
            Utilities.showToast('Admin login successful!', 'success');
        } else {
            Utilities.showToast('Invalid admin credentials', 'error');
        }
    }
    
    // UI Helpers
    function showAdminLogin() {
        phoneAuth.classList.add('hidden');
        emailAuth.classList.add('hidden');
        emailSignup.classList.add('hidden');
        otpAuth.classList.add('hidden');
        userInfo.classList.add('hidden');
        adminLogin.classList.remove('hidden');
    }
    
    function showPhoneAuth() {
        adminLogin.classList.add('hidden');
        phoneAuth.classList.remove('hidden');
        phoneAuthTab.click(); // Reset to phone tab
    }
    
    function toggleCountrySelect() {
        countrySelect.classList.toggle('hidden');
    }
    
    function selectCountryCode(e) {
        selectedCode.textContent = e.target.getAttribute('data-code');
        selectedFlag.textContent = e.target.getAttribute('data-flag');
        countrySelect.classList.add('hidden');
    }
    
    // Logout
    function logout() {
        currentUser = null;
        
        // Reset auth screens
        phoneAuthTab.click(); // Reset to phone tab
        phoneAuth.classList.remove('hidden');
        emailAuth.classList.add('hidden');
        emailSignup.classList.add('hidden');
        otpAuth.classList.add('hidden');
        userInfo.classList.add('hidden');
        adminLogin.classList.add('hidden');
        
        // Clear input fields
        phoneNumber.value = '';
        authEmail.value = '';
        authPassword.value = '';
        signupName.value = '';
        signupEmail.value = '';
        signupPassword.value = '';
        signupConfirmPassword.value = '';
        userName.value = '';
        adminUsername.value = '';
        adminPassword.value = '';
        otpInputs.forEach(input => input.value = '');
        
        // Reset profile image
        profilePreview.classList.add('hidden');
        profilePlaceholder.classList.remove('hidden');
        
        // Switch back to auth screen
        document.getElementById('chat-screen').classList.add('hidden');
        document.getElementById('admin-panel').classList.add('hidden');
        document.getElementById('settings-screen').classList.add('hidden');
        document.getElementById('blocked-contacts-screen').classList.add('hidden');
        authScreen.classList.remove('hidden');
        
        Utilities.showToast('Logged out successfully', 'success');
    }
    
    // Public API
    return {
        init,
        logout,
        getCurrentUser: function() {
            return currentUser;
        }
    };
})();

// Initialize Auth module when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // This will be called from app.js to avoid initialization order issues
});