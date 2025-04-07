// routes/userRoutes.js
const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getMe, 
  updateLocation 
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

// Register validation
const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('location').isObject().withMessage('Location must be an object'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.country').notEmpty().withMessage('Country is required'),
  body('location.coordinates').isObject().withMessage('Coordinates must be an object'),
  body('location.coordinates.lat').isNumeric().withMessage('Latitude must be a number'),
  body('location.coordinates.lon').isNumeric().withMessage('Longitude must be a number'),
];

// Location update validation
const locationValidation = [
  body('location').isObject().withMessage('Location must be an object'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.country').notEmpty().withMessage('Country is required'),
  body('location.coordinates').isObject().withMessage('Coordinates must be an object'),
  body('location.coordinates.lat').isNumeric().withMessage('Latitude must be a number'),
  body('location.coordinates.lon').isNumeric().withMessage('Longitude must be a number'),
];

router.post('/register', registerValidation, validateRequest, registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/location', protect, locationValidation, validateRequest, updateLocation);

module.exports = router;