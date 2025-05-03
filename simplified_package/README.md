# Weather Image API for Louisville, Colorado

## Overview
This API service generates high-quality images representing the current weather conditions in Louisville, Colorado. The images are created in a watercolor style and dynamically reflect real-time weather data fetched from OpenWeatherMap.

## API Documentation

### Endpoint
```
GET /api/weather-image
```

### Query Parameters
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `style` | string | Image style (watercolor, realistic) | watercolor |
| `size` | string | Image dimensions (e.g., "640x640") | 640x640 |
| `fresh` | boolean | Force fresh image generation | false |

### Response
- **Content Type**: image/jpeg
- **Status Codes**:
  - `200 OK`: Successfully generated image
  - `500 Internal Server Error`: Failed to generate image

### Response Headers
| Header | Description |
|--------|-------------|
| `X-Weather-Condition` | Current weather condition (e.g., "Clear", "Rain") |
| `X-Weather-Temperature` | Current temperature in Fahrenheit |
| `X-Weather-Description` | Detailed weather description |

### Example Usage
```javascript
// Fetch weather image
const response = await fetch("https://api.example.com/api/weather-image?style=watercolor");
const imageBlob = await response.blob();

// Display the image
const imageUrl = URL.createObjectURL(imageBlob);
document.getElementById("weatherImage").src = imageUrl;

// Access weather information from headers
const condition = response.headers.get("X-Weather-Condition");
const temperature = response.headers.get("X-Weather-Temperature");
```

## Technical Architecture

### Components
1. **Weather Data Service**: Fetches real-time weather data for Louisville, Colorado from OpenWeatherMap API
2. **Image Generation Service**: Creates watercolor-style images based on weather conditions using DeepAI API
3. **API Layer**: Next.js API routes running on Cloudflare Workers
4. **Caching Layer**: Multi-level caching strategy for improved performance

### Data Flow
1. Client requests a weather image
2. API checks cache for recent weather data and matching image
3. If cache miss, fetches current weather data for Louisville from OpenWeatherMap
4. Generates appropriate image based on weather conditions using DeepAI
5. Caches results and returns image to client

### Weather Condition Mapping
The API maps different weather conditions to specific image characteristics:

| Weather Condition | Image Representation |
|-------------------|----------------------|
| Clear/Sunny | Bright garden with vibrant flowers, clear blue sky |
| Light Rain/Showers | Garden with water droplets on flowers, puddles, partially cloudy sky |
| Cloudy | Garden with diffused light, white/gray clouds |
| Snow | Garden with light snow dusting, pale gray sky |
| Thunderstorm | Dramatic sky with dark clouds, flowers bending in wind |

## Deployment

The API is designed for deployment on Cloudflare Pages with Workers, providing:
- Global CDN with edge caching
- Serverless architecture
- Low latency due to edge computing
- Built-in DDoS protection

## Implementation Details

### Technology Stack
- **Framework**: Next.js with TypeScript
- **Weather Data**: OpenWeatherMap API
- **Image Generation**: DeepAI API
- **Deployment**: Cloudflare Pages/Workers

### Key Files
- `src/lib/weatherService.ts`: Weather data fetching and processing
- `src/lib/imageService.ts`: Image generation and caching
- `src/app/api/weather-image/route.ts`: API endpoint implementation

### Environment Variables
For local development, create a `.env` file:
```
OPENWEATHER_API_KEY=your_openweathermap_api_key
DEEPAI_API_KEY=your_deepai_api_key
```
For Cloudflare deployment, set these variables in the dashboard.

## Performance Considerations

### Caching Strategy
- Weather data cached for 30-60 minutes
- Generated images cached for 2-4 hours
- Browser caching for 30 minutes
- Cloudflare edge caching

### Rate Limiting
Consider implementing rate limiting in Cloudflare to prevent abuse.

## Future Enhancements

1. **Additional Weather Parameters**: Support for more detailed weather parameters
2. **Multiple Locations**: Expand to support other locations beyond Louisville
3. **Custom Styles**: Allow more customization of image styles
4. **Animation Support**: Add support for animated weather representations
5. **Historical Weather Images**: Generate images based on historical weather data
