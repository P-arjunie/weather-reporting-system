// services/emailService.js
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendWeatherReport = async (email, location, weatherData, aiDescription) => {
  try {
    const currentDate = new Date().toLocaleString();
    
    // Create email HTML
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4a6fa5; color: white; padding: 10px 20px; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          .footer { margin-top: 20px; font-size: 12px; color: #777; text-align: center; }
          .weather-icon { text-align: center; margin: 15px 0; }
          .weather-details { margin: 20px 0; }
          .weather-details table { width: 100%; border-collapse: collapse; }
          .weather-details td { padding: 8px; border-bottom: 1px solid #ddd; }
          .ai-description { background: #e9f7fe; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Weather Report</h2>
            <p>${location.city}, ${location.country} - ${currentDate}</p>
          </div>
          <div class="content">
            <div class="weather-icon">
              <img src="http://openweathermap.org/img/wn/${weatherData.icon}@2x.png" alt="Weather Icon">
              <h3>${weatherData.description}</h3>
            </div>
            
            <div class="weather-details">
              <table>
                <tr><td><strong>Temperature:</strong></td><td>${weatherData.temperature}°C</td></tr>
                <tr><td><strong>Feels Like:</strong></td><td>${weatherData.feels_like}°C</td></tr>
                <tr><td><strong>Humidity:</strong></td><td>${weatherData.humidity}%</td></tr>
                <tr><td><strong>Pressure:</strong></td><td>${weatherData.pressure} hPa</td></tr>
                <tr><td><strong>Wind Speed:</strong></td><td>${weatherData.wind_speed} m/s</td></tr>
              </table>
            </div>
            
            <div class="ai-description">
              <h3>Weather Analysis</h3>
              <p>${aiDescription}</p>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated weather report. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Weather Report for ${location.city} - ${new Date().toLocaleDateString()}`,
      html: emailHTML,
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Could not send weather report email');
  }
};