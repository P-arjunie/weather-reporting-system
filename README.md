# Weather Reporting System 🌤️

Welcome to the Weather Reporting System! This project provides real-time weather updates, detailed weather summaries, and AI-powered weather analysis via email every 3 hours.

## Features 🚀

- **Real-Time Weather Data**: Fetch and display real-time weather data for any city across the globe.
- **AI-Powered Weather Reports**: Generate weather summaries using Google's Gemini AI model.
- **Email Reports**: Users receive weather reports in their inbox every 3 hours.
- **Scheduled Weather Updates**: The system automatically fetches and stores weather data for all users every 3 hours.
- **User Location-Based**: The weather updates are tailored to the user's location.
- **Cron Jobs**: Automatically send hourly weather reports to users.

## Project Structure 📁
weather-api/
├── config/
│   ├── db.js            # MongoDB connection
│   └── weatherCron.js   # Schedule weather updates
├── controllers/
│   ├── userController.js
│   └── weatherController.js    
├── models/
│   ├── User.js
│   └── WeatherData.js
├── routes/
│   ├── userRoutes.js
│   └── weatherRoutes.js
├── services/
│   ├── weatherService.js
│   ├── emailService.js
│   ├── openaiService.js
│   └── geocodingService.js
├── utils/
│   ├── validators.js
│   └── errorHandler.js
├── middleware/
│   ├── auth.js
│   └── validation.js
├── .env
├── .gitignore
├── package.json           
└── server.js            # Express app setup


## How It Works 🛠️

1. **Weather Data Fetching**: The system fetches weather data using the OpenWeatherMap API for a given location (city and country).
2. **AI Weather Summaries**: Once the weather data is fetched, the system generates a detailed weather report using Google’s Gemini AI model.
3. **Email Delivery**: Every 3 hours, the system sends an email to users with the latest weather update, including an AI-generated summary of the weather.
4. **Cron Jobs**: A cron job runs every 3 hours to keep the weather data up-to-date and automatically emails the reports.

## Getting Started 🏁

To get started with the Weather Reporting System, follow these steps:

### Prerequisites

- **Node.js** installed (preferably v14+)
- **npm** or **yarn** for managing dependencies
- **Vercel** account (for deployment)

### Setup the Project

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/weather-reporting-system.git
   cd weather-reporting-system
2. Install dependencies:
    npm install
3. Create a .env file in the root of the project and add the following environment variables:
    GEMINI_API_KEY=your_gemini_api_key
    EMAIL_SERVICE=gmail
    EMAIL_USERNAME=your_email@example.com
    EMAIL_PASSWORD=your_email_password
    EMAIL_FROM=your_email@example.com

4. Start the server:
    npm start

#### Email Reports 📧
Users will automatically receive weather reports every 3 hours.

The email contains:

Weather data: temperature, humidity, wind speed, etc.

A weather description generated by the AI model.

The email is formatted with an HTML layout for a better user experience.

##### Cron Jobs ⏰
The weather update cron job runs every 3 hours, ensuring users receive the latest weather updates automatically.

###### Technologies Used ⚙️
Node.js: JavaScript runtime for building the backend services.

Nodemailer: For sending email reports to users.

OpenWeatherMap API: For fetching real-time weather data.

Google Gemini AI: For generating AI-powered weather reports.

Cron Jobs: To schedule weather updates every 3 hours.

Vercel: For serverless deployment.
