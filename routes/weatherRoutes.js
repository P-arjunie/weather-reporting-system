// routes/weatherRoutes.js
const express = require('express');
const { 
  getWeatherByDate, 
  checkWeather, 
  updateWeather, 
  getLatestWeather 
} = require('../controllers/weatherController');
const { protect } = require('../middleware/auth');
const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

// Weather route validations
const checkWeatherValidation = [
  body('lat').isNumeric().withMessage('Latitude must be a number'),
  body('lon').isNumeric().withMessage('Longitude must be a number'),
];

// All routes are protected
router.use(protect);

router.get('/latest', getLatestWeather);
router.post('/check', checkWeatherValidation, validateRequest, checkWeather);
router.post('/update', updateWeather);
router.get('/:date', getWeatherByDate);

module.exports = router;