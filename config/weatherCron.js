// cron/weatherCron.js
const cron = require('node-cron');
const weatherService = require('../services/weatherService');

// Schedule to run every 3 hours: at minute 0 of hour 0, 3, 6, 9, 12, 15, 18, 21
const weatherUpdateSchedule = '0 0,3,6,9,12,15,18,21 * * *';

const weatherUpdateJob = cron.schedule(weatherUpdateSchedule, async () => {
  console.log('Running scheduled weather update job');
  try {
    await weatherService.fetchAndStoreWeatherForAllUsers();
    console.log('Weather update job completed successfully');
  } catch (error) {
    console.error('Error in weather update cron job:', error);
  }
}, {
  scheduled: false, // Don't start automatically
  timezone: 'UTC'   // Use UTC timezone for consistency
});

// Function to start the cron job
const start = () => {
  console.log('Starting weather update cron job');
  weatherUpdateJob.start();
};

// Function to stop the cron job
const stop = () => {
  console.log('Stopping weather update cron job');
  weatherUpdateJob.stop();
};

module.exports = {
  start,
  stop
};