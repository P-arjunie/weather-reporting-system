// controllers/weatherController.js
const WeatherData = require('../models/WeatherData');
const weatherService = require('../services/weatherService');
const geocodingService = require('../services/geocodingService');

// @desc    Get weather data for a user by date
// @route   GET /api/weather/:date
// @access  Private
exports.getWeatherByDate = async (req, res) => {
  try {
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a date',
      });
    }

    const weatherData = await weatherService.getWeatherForDate(req.user.id, date);

    res.status(200).json({
      success: true,
      count: weatherData.length,
      data: weatherData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get weather data for a specific location
// @route   POST /api/weather/check
// @access  Private
exports.checkWeather = async (req, res) => {
  try {
    const { lat, lon } = req.body;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        error: 'Please provide latitude and longitude',
      });
    }

    // Get weather data
    const weatherData = await weatherService.fetchWeatherData(lat, lon);

    // Get city and country from coordinates
    const location = await geocodingService.getCityFromCoordinates(lat, lon);

    res.status(200).json({
      success: true,
      data: {
        location,
        weather: weatherData,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Trigger weather update for current user
// @route   POST /api/weather/update
// @access  Private
exports.updateWeather = async (req, res) => {
  try {
    const user = req.user;
    console.log('User:', user); // Check if user is populated correctly
    const { lat, lon } = user.location.coordinates;

    // Get weather data
    const weatherData = await weatherService.fetchWeatherData(lat, lon);

    // Store weather data
    const weatherRecord = await weatherService.storeWeatherData(
      user._id,
      user.location,
      weatherData
    );

    res.status(200).json({
      success: true,
      data: weatherRecord,
    });
  } catch (error) {
    console.error('Error during weather update:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get latest weather data for current user
// @route   GET /api/weather/latest
// @access  Private
exports.getLatestWeather = async (req, res) => {
  try {
    const latestWeather = await WeatherData.findOne({ user: req.user.id })
      .sort({ date: -1 })
      .limit(1);
      
    console.log("Fetching latest weather for user:", req.user.id);

    if (!latestWeather) {
      return res.status(404).json({
        success: false,
        error: 'No weather data found for this user',
      });
    }

    res.status(200).json({
      success: true,
      data: latestWeather,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
