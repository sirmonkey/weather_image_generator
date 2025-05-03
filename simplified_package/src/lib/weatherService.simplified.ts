// Modified weather service that uses only the DeepAI key
// This version uses a simplified approach with static weather data for Louisville, CO

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

/**
 * Simulates fetching weather data for Louisville, Colorado
 * This is a fallback implementation that doesn't require an OpenWeatherMap API key
 */
export async function fetchWeatherData(): Promise<WeatherData> {
  try {
    // For a real implementation, you would use:
    // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=39.9778&lon=-105.1319&appid=${OPENWEATHER_API_KEY}&units=imperial`);
    
    // Instead, we'll use a simulated response based on the current date/time
    // This creates somewhat realistic weather patterns based on time of day and season
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth(); // 0-11
    
    // Determine season (rough approximation)
    const isWinter = month >= 11 || month <= 1; // Dec-Feb
    const isSpring = month >= 2 && month <= 4;  // Mar-May
    const isSummer = month >= 5 && month <= 7;  // Jun-Aug
    const isFall = month >= 8 && month <= 10;   // Sep-Nov
    
    // Base temperature varies by season
    let baseTemp = 0;
    if (isWinter) baseTemp = 35;
    if (isSpring) baseTemp = 55;
    if (isSummer) baseTemp = 75;
    if (isFall) baseTemp = 60;
    
    // Temperature varies by time of day
    const tempVariation = Math.sin((hour - 14) * Math.PI / 12) * 15; // Peak at 2pm
    const temperature = Math.round(baseTemp + tempVariation);
    
    // Humidity varies inversely with temperature
    const humidity = Math.round(70 - tempVariation/2);
    
    // Wind speed varies by season
    const windSpeed = Math.round((isWinter ? 8 : 5) + Math.random() * 5);
    
    // Cloud cover and weather condition
    // Use a simple algorithm to determine weather based on time and randomness
    const random = Math.random();
    let condition, description, cloudCover, precipitation, icon;
    
    if (random < 0.6) { // 60% chance of clear/partly cloudy
      cloudCover = Math.round(random * 40); // 0-40% cloud cover
      condition = cloudCover < 20 ? "Clear" : "Clouds";
      description = cloudCover < 20 ? "clear sky" : "few clouds";
      precipitation = 0;
      icon = cloudCover < 20 ? "01d" : "02d";
    } else if (random < 0.8) { // 20% chance of cloudy
      cloudCover = 40 + Math.round(random * 40); // 40-80% cloud cover
      condition = "Clouds";
      description = "scattered clouds";
      precipitation = 0;
      icon = "03d";
    } else if (random < 0.95) { // 15% chance of rain
      cloudCover = 70 + Math.round(random * 30); // 70-100% cloud cover
      condition = "Rain";
      description = "light rain";
      precipitation = Math.random() * 0.3; // 0-0.3 inches
      icon = "10d";
    } else { // 5% chance of snow (in winter) or thunderstorm
      cloudCover = 80 + Math.round(random * 20); // 80-100% cloud cover
      if (isWinter) {
        condition = "Snow";
        description = "light snow";
        precipitation = Math.random() * 0.5; // 0-0.5 inches
        icon = "13d";
      } else {
        condition = "Thunderstorm";
        description = "thunderstorm";
        precipitation = Math.random() * 0.8; // 0-0.8 inches
        icon = "11d";
      }
    }
    
    // Adjust icon for night time
    if (hour < 6 || hour > 18) {
      icon = icon.replace('d', 'n');
    }
    
    return {
      condition,
      description,
      temperature,
      humidity,
      windSpeed,
      precipitation,
      cloudCover,
      icon,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error with weather data:', error);
    
    // Return a default fallback in case of any errors
    return {
      condition: "Clear",
      description: "clear sky",
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
        prompt: `${basePrompt}. Vibrant spring flowers in reds, yellows, pinks, and oranges. The sky shows typical weather conditions. The scene has a natural, peaceful atmosphere. Watercolor style with soft edges, color bleeding, and paper texture.`,
        style: "watercolor"
      };
  }
}
