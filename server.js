// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const errorHandler = require('./utils/errorHandler');
const weatherCronJob = require('./config/weatherCron');
const { protect } = require('./middleware/auth');
const emailService = require('./services/emailService'); // Your email service path
const weatherService = require('./services/weatherService');

// Load environment variablehs
dotenv.config();
console.log('JWT:', process.env.JWT_SECRET);

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/weather', weatherRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});
app.get('/test', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});


// Error handling middleware
app.use(errorHandler);

// Start cron jobs for weather updates
weatherCronJob.start();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});


// // Immediately send a test email with weather report
// const testEmail = 'pasindiarjunie@gmail.com'; // Replace with your email address
// const testLocation = {
//   city: 'Los Angeles',
//   country: 'USA'
// };
// const testWeatherData = {
//   temperature: 23.58,
//   feels_like: 22.72,
//   humidity: 28,
//   pressure: 1020,
//   wind_speed: 7.2,
//   wind_direction: 240,
//   description: 'clear sky',
//   icon: '01d'
// };
// const testAiDescription = 'The weather is clear with mild temperatures and moderate wind speeds.';

// // Send the weather report email immediately when the server starts
// emailService.sendWeatherReport(testEmail, testLocation, testWeatherData, testAiDescription)
//   .then(info => {
//     console.log('Test email sent successfully:', info);
//   })
//   .catch(error => {
//     console.error('Error sending test email:', error);
//   });

// // Server route to test email sending on demand
// app.get('/send-weather-report', (req, res) => {
//   emailService.sendWeatherReport(testEmail, testLocation, testWeatherData, testAiDescription)
//     .then(info => {
//       res.status(200).send('Weather report sent successfully');
//     })
//     .catch(error => {
//       res.status(500).send('Error sending weather report');
//       console.error('Error:', error);
//     });
// });
