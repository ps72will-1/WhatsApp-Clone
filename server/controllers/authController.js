// server/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const twilio = require('twilio');

// Initialize Twilio client (if credentials are provided)
let twilioClient;
try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
} catch (error) {
  console.error('Twilio initialization error:', error);
}

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_fallback_key', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user by email
// @route   POST /api/auth/register-email
// @access  Public
exports.registerByEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      status: user.status,
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Login user by email
// @route   POST /api/auth/login-email
// @access  Public
exports.loginByEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last seen and online status
    user.lastSeen = Date.now();
    user.isOnline = true;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      status: user.status,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Send OTP for phone authentication
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOTP = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phone } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ phone });

    if (!twilioClient) {
      // Mock OTP service if Twilio is not configured
      return res.json({
        message: 'OTP sent successfully (mock)',
        isNewUser: !userExists,
      });
    }

    // Send OTP via Twilio
    const verification = await twilioClient.verify.v2.services(
      process.env.TWILIO_VERIFY_SERVICE_SID
    ).verifications.create({
      to: phone,
      channel: 'sms'
    });

    res.json({
      message: 'OTP sent successfully',
      isNewUser: !userExists,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// @desc    Verify OTP for phone authentication
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phone, code } = req.body;

  try {
    let verification_check = { status: 'approved' };
    
    if (twilioClient) {
      // Verify OTP via Twilio
      verification_check = await twilioClient.verify.v2.services(
        process.env.TWILIO_VERIFY_SERVICE_SID
      ).verificationChecks.create({
        to: phone,
        code
      });
    } else {
      // Mock verification for demo purposes
      if (code !== '123456') {
        verification_check.status = 'failed';
      }
    }

    if (verification_check.status !== 'approved') {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Find or create user
    let user = await User.findOne({ phone });
    
    if (!user) {
      // This is a new user, we'll complete registration in the setupAccount endpoint
      return res.json({
        message: 'OTP verified successfully',
        isNewUser: true,
        phone,
      });
    }

    // Update last seen and online status
    user.lastSeen = Date.now();
    user.isOnline = true;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      status: user.status,
      isNewUser: false,
      token,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

// @desc    Setup account after phone verification
// @route   POST /api/auth/setup-account
// @access  Public
exports.setupAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, phone, avatar } = req.body;

  try {
    // Get app branding for custom status message
    const appName = process.env.APP_NAME || 'ChatConnect';
    
    // Create user with custom app name in status
    const user = await User.create({
      name,
      phone,
      avatar: avatar || 'https://i.imgur.com/8uuq4DZ.png',
      status: `Hey there! I am using ${appName}`
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      status: user.status,
      token,
    });
  } catch (error) {
    console.error('Setup account error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Forgot password - send reset link
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // In a real application, send email with reset link
    // For demo purposes, we'll just return success message
    res.json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // Update last seen and set user as offline
    const user = await User.findById(req.user._id);
    if (user) {
      user.lastSeen = Date.now();
      user.isOnline = false;
      await user.save();
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};