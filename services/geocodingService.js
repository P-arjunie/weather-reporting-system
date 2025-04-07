// services/geocodingService.js
const axios = require('axios');

exports.getCityFromCoordinates = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.status !== 'OK') {
      throw new Error(`Geocoding API error: ${response.data.status}`);
    }

    // Extract city and country from results
    let city = '';
    let country = '';

    const addressComponents = response.data.results[0].address_components;
    
    for (const component of addressComponents) {
      if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (component.types.includes('country')) {
        country = component.long_name;
      }
    }

    return {
      city: city || 'Unknown city',
      country: country || 'Unknown country',
      coordinates: { lat, lon }
    };
  } catch (error) {
    console.error('Error getting location from coordinates:', error);
    throw new Error('Could not get location from coordinates');
  }
};