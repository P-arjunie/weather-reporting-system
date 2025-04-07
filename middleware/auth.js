// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const dotenv = require('dotenv');
dotenv.config();
console.log('JWT_SECRET from .env:', process.env.JWT_SECRET);


// Protect routes
exports.protect = async (req, res, next) => {
  console.log('Middleware triggered');
  let token;
  console.log('Token from header:', token);
  // Check header for token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }
  console.log('Authorization Header:', req.headers.authorization);

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);

    // Find user by id
    req.user = await User.findById(decoded.id);
    console.log('User ID from token:', decoded.id);


    if (!req.user) {
      return res.status(404).json({
        success: false,
        error: 'No user found with this id',
      });
    }

    next();
  } catch (err) {
    console.error('Error verifying token:', err);
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
    });
  }
};