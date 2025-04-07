// require('dotenv').config();
//  // Debugging line to check if the key is loaded
// // services/openaiService.js
// const { OpenAI } = require('openai');

// // Initialize OpenAI API
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// exports.generateWeatherDescription = async (city, country, weatherData) => {
//   try {
//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         {
//           role: 'system',
//           content: 'You are a helpful weather assistant. Create a concise, informative, and engaging paragraph about the current weather conditions.',
//         },
//         {
//           role: 'user',
//           content: `Please describe the current weather in ${city}, ${country}. 
//           Temperature: ${weatherData.temperature}°C
//           Feels like: ${weatherData.feels_like}°C
//           Weather conditions: ${weatherData.description}
//           Humidity: ${weatherData.humidity}%
//           Wind speed: ${weatherData.wind_speed} m/s
//           Pressure: ${weatherData.pressure} hPa`
//         }
//       ],
//       max_tokens: 200,
//     });

//     return response.choices[0].message.content.trim();
//   } catch (error) {
//     console.error('Error generating AI weather description:', error);
//     return `Current weather in ${city}: ${weatherData.temperature}°C, ${weatherData.description}.`;
//   }
// };
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateWeatherDescription = async (weatherData) => {
  try {
    console.log("Weather Data:", JSON.stringify(weatherData, null, 2));

    // Check if all the necessary data is present
    if (!weatherData?.location?.city || !weatherData?.location?.country || !weatherData?.weather) {
        throw new Error("Incomplete weather data");
    }

    // Construct the prompt with the available data
    const prompt = `Provide a detailed yet concise weather summary for today:
      Location: ${weatherData.location.city}, ${weatherData.location.country}
      Temperature: ${weatherData.weather.temperature}°C
      Feels Like: ${weatherData.weather.feels_like}°C
      Humidity: ${weatherData.weather.humidity}%
      Pressure: ${weatherData.weather.pressure} hPa
      Wind Speed: ${weatherData.weather.wind_speed} m/s
      Wind Direction: ${weatherData.weather.wind_direction}°
      Weather Description: ${weatherData.weather.description}

      Format the response naturally as a weather report for a general audience.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });  // Correct model name

    // Generate the content
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    // Handle errors gracefully
    console.error("Gemini API Error:", error);
    return "Weather description not available.";
  }
};

