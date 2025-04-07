const axios = require('axios');
const WeatherData = require('../models/WeatherData');
const User = require('../models/User');
const aiService = require('./aiService');  // Updated import
const emailService = require('./emailService');

exports.fetchWeatherData = async (lat, lon) => {
  try {
    console.log("Fetching weather data for:", lat, lon);
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    console.log("Weather API Response:", response.data);
    
    return {
      temperature: response.data.main.temp,
      feels_like: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      wind_speed: response.data.wind.speed,
      wind_direction: response.data.wind.deg,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Could not fetch weather data');
  }
};

exports.storeWeatherData = async (userId, location, weatherData) => {
  try {
    // // Check if today's weather data already exists
    // const existingRecord = await WeatherData.findOne({
    //   user: userId,
    //   date: { $gte: new Date().setHours(0, 0, 0, 0) },
    // });

    // if (existingRecord) {
    //   console.log('Weather data already exists for today');
    //   return existingRecord;
    // }

    // Prepare the weatherData object with location and weather details
    const weatherDataWithLocation = {
      location: {
        city: location.city,
        country: location.country,
        coordinates: location.coordinates,  // Assuming location has coordinates
      },
      weather: {
        temperature: weatherData.temperature,
        feels_like: weatherData.feels_like,
        humidity: weatherData.humidity,
        pressure: weatherData.pressure,
        wind_speed: weatherData.wind_speed,
        wind_direction: weatherData.wind_direction,
        description: weatherData.description,
        icon: weatherData.icon,
      },
    };

    // Generate AI description using Gemini
    const aiDescription = await aiService.generateWeatherDescription(weatherDataWithLocation);

    // Save weather data
    const weatherRecord = await WeatherData.create({
      user: userId,
      location: location,
      date: new Date(),
      weather: weatherData,
      aiDescription: aiDescription,
    });

    console.log("Weather data saved:", weatherRecord);
    return weatherRecord;
  } catch (error) {
    console.error('Error storing weather data:', error);
    throw new Error('Could not store weather data');
  }
};


exports.fetchAndStoreWeatherForAllUsers = async () => {
  try {
    const users = await User.find();
    
    for (const user of users) {
      try {
        const { lat, lon } = user.location.coordinates;
        
        // Fetch weather data
        const weatherData = await this.fetchWeatherData(lat, lon);
        
        // Store weather data
        const weatherRecord = await this.storeWeatherData(
          user._id,
          user.location,
          weatherData
        );
        
        // Send email report
        await emailService.sendWeatherReport(
          user.email,
          user.location,
          weatherData,
          weatherRecord.aiDescription
        );
        
        console.log(`Weather report sent to ${user.email}`);
      } catch (userError) {
        console.error(`Error processing weather for user ${user.email}:`, userError);
      }
    }
    
    return { success: true, message: 'Weather data updated for all users' };
  } catch (error) {
    console.error('Error in batch weather update:', error);
    throw new Error('Failed to update weather data');
  }
};

exports.getWeatherForDate = async (userId, date) => {
  try {
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(searchDate);
    endDate.setHours(23, 59, 59, 999);
    
    const weatherData = await WeatherData.find({
      user: userId,
      date: {
        $gte: searchDate,
        $lte: endDate
      }
    }).sort({ date: 1 });
    
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data for date:', error);
    throw new Error('Could not fetch weather data for the given date');
  }
};
