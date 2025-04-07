// models/WeatherData.js
const mongoose = require('mongoose');

const WeatherDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    city: String,
    country: String,
    coordinates: {
      lat: Number,
      lon: Number,
    },
  },
  date: {
    type: Date,
    required: true,
  },
  weather: {
    temperature: Number,
    feels_like: Number,
    humidity: Number,
    pressure: Number,
    wind_speed: Number,
    wind_direction: Number,
    description: String,
    icon: String,
  },
  aiDescription: {
    type: String,
    default: "No AI description available.",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure date is always set to 00:00:00 (ignoring time portion)
WeatherDataSchema.pre('save', function (next) {
  this.date.setHours(0, 0, 0, 0);
  next();
});
// Create compound index on user and date for efficient queries
WeatherDataSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('WeatherData', WeatherDataSchema);