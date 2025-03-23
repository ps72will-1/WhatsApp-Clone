// server/routes/auth.js
const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Register new user with email
router.post(
  '/register-email',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  authController.registerByEmail
);

// Login user with email
router.post(
  '/login-email',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authController.loginByEmail
);

// Send OTP for phone authentication
router.post(
  '/send-otp',
  [
    check('phone', 'Please include a valid phone number').isMobilePhone(),
  ],
  authController.sendOTP
);

// Verify OTP for phone authentication
router.post(
  '/verify-otp',
  [
    check('phone', 'Please include a valid phone number').isMobilePhone(),
    check('code', 'OTP code is required').isLength({ min: 4, max: 6 }),
  ],
  authController.verifyOTP
);

// Setup account after phone verification
router.post(
  '/setup-account',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('phone', 'Phone number is required').isMobilePhone(),
  ],
  authController.setupAccount
);

// Forgot password
router.post(
  '/forgot-password',
  [
    check('email', 'Please include a valid email').isEmail(),
  ],
  authController.forgotPassword
);

// Logout
router.post('/logout', auth, authController.logout);

module.exports = router;