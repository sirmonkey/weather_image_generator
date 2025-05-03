// Weather data fetching service for Louisville, Colorado
// This file handles fetching and processing weather data from OpenWeatherMap API

export interface WeatherData {
  condition: string;       // Main weather condition (e.g., "Clear", "Rain", "Clouds")
  description: string;     // Detailed description
  temperature: number;     // Temperature in Fahrenheit
  humidity: number;        // Humidity percentage
  windSpeed: number;       // Wind speed in mph
  precipitation: number;   // Precipitation amount in inches (if any)
  cloudCover: number;      // Cloud cover percentage
  icon: string;            // Weather icon code
  timestamp: number;       // Unix timestamp of data retrieval
}

// Louisville, Colorado coordinates
const LOUISVILLE_LAT = 39.9778;
const LOUISVILLE_LON = -105.1319;

// You would need to get an API key from OpenWeatherMap
// For production, store this in environment variables
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '748ff840cd2dd6cd4fbe6bdf2283de9a'; // Use provided key as fallback

/**
 * Fetches current weather data for Louisville, Colorado from OpenWeatherMap
 */
export async function fetchWeatherData(): Promise<WeatherData> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${LOUISVILLE_LAT}&lon=${LOUISVILLE_LON}&appid=${WEATHER_API_KEY}&units=imperial`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process and normalize the data
    return {
      condition: data.weather[0].main,
      description: data.weather[0].description,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      // Convert precipitation from mm (default) to inches if available
      precipitation: data.rain ? (data.rain['1h'] || 0) / 25.4 : 0,
      cloudCover: data.clouds.all,
      icon: data.weather[0].icon,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return a default fallback in case of API errors
    return {
      condition: "Clear",
      description: "clear sky (fallback data)",
      temperature: 65,
      humidity: 45,
      windSpeed: 5,
      precipitation: 0,
      cloudCover: 10,
      icon: "01d",
      timestamp: Date.now()
    };
  }
}

/**
 * Maps weather conditions to image generation parameters
 */
export function mapWeatherToImageParams(weather: WeatherData): {
  prompt: string;
  style: string;
} {
  // Base prompt for Louisville garden scene
  let basePrompt = "A garden scene in Louisville, Colorado with blue-purple mountains in the background";
  
  // Customize based on weather conditions
  switch(weather.condition) {
    case "Clear":
      return {
        prompt: `${basePrompt}. Bright sunny day with vibrant spring flowers in reds, yellows, pinks, and oranges. Clear blue sky. The scene has a warm, bright atmosphere. Watercolor style with soft edges, color bleeding, and paper texture.`,
        style: "watercolor"
      };
    
    case "Rain":
    case "Drizzle":
      return {
        prompt: `${basePrompt}. Light showers with vibrant spring flowers in reds, yellows, pinks, and oranges with water droplets on petals. The sky is partially cloudy with soft, diffused light. There are small puddles on the ground reflecting the sky. The ground appears wet and darker than usual. The scene has a peaceful, refreshing atmosphere with gentle rain falling. Watercolor style with soft edges, color bleeding, and paper texture.`,
        style: "watercolor"
      };
    
    case "Clouds":
      // Differentiate between partly cloudy and overcast
      if (weather.cloudCover < 70) {
        return {
          prompt: `${basePrompt}. Partly cloudy day with vibrant spring flowers in reds, yellows, pinks, and oranges. The sky has scattered white fluffy clouds. Soft, diffused sunlight filters through the clouds. The scene has a pleasant, calm atmosphere. Watercolor style with soft edges, color bleeding, and paper texture.`,
          style: "watercolor"
        };
      } else {
        return {
          prompt: `${basePrompt}. Overcast day with vibrant spring flowers in slightly muted reds, yellows, pinks, and oranges. The sky is covered with gray clouds. Soft, diffused light creates a moody atmosphere. The scene has a peaceful, contemplative feeling. Watercolor style with soft edges, color bleeding, and paper texture.`,
          style: "watercolor"
        };
      }
    
    case "Snow":
      return {
        prompt: `${basePrompt}. Light snowfall with spring flowers peeking through a dusting of snow. The sky is pale gray. Snowflakes gently falling. The ground has patches of white snow. The scene has a serene, quiet atmosphere. Watercolor style with soft edges, color bleeding, and paper texture.`,
        style: "watercolor"
      };
    
    case "Thunderstorm":
      return {
        prompt: `${basePrompt}. Dramatic stormy sky with dark clouds. Spring flowers bending in the wind. Distant lightning over the mountains. The ground appears wet and darker. The scene has a dramatic, intense atmosphere. Watercolor style with strong contrasts, color bleeding, and paper texture.`,
        style: "watercolor"
      };
    
    default:
      return {
        prompt: `${basePrompt}. Vibrant spring flowers in reds, yellows, pinks, and oranges. The sky shows typical weather conditions for ${weather.condition}. The scene has a natural, peaceful atmosphere. Watercolor style with soft edges, color bleeding, and paper texture.`,
        style: "watercolor"
      };
  }
}
