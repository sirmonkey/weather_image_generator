# Weather Image API - Simplified Deployment

This version of the Weather Image API has been modified to work with only the DeepAI API key you provided. I've implemented a simplified weather service that generates realistic weather data for Louisville, Colorado without requiring an external weather API.

## Features of the Simplified Version

- Uses the DeepAI API key you provided (2d36fbc3bd0c)
- Generates simulated weather data based on time of day and season
- Creates high-quality watercolor garden images reflecting the simulated weather
- Includes all the same API endpoints and functionality as the full version
- Can be deployed to Cloudflare or run locally

## Files Included

- Complete Next.js application with API routes
- Modified weather service that doesn't require OpenWeatherMap
- Image generation service using your DeepAI key
- Deployment documentation
- Sample frontend for testing

## How to Use

### Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your DeepAI key:
   ```
   DEEPAI_API_KEY=2d36fbc3bd0c
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Access the API at `http://localhost:3000/api/weather-image`

### Deployment

Follow the instructions in DEPLOYMENT.md, but you'll only need to configure the DeepAI API key in your environment variables.

## Weather Simulation

The simplified weather service generates realistic weather patterns based on:
- Current time of day (temperature peaks in afternoon)
- Current season (based on month)
- Randomized conditions with appropriate probabilities

This provides a realistic approximation of Louisville weather without requiring an external API.

## Future Enhancements

If you obtain an OpenWeatherMap API key in the future, you can easily switch to real weather data by:
1. Replacing `weatherService.simplified.ts` with the original `weatherService.ts`
2. Adding your OpenWeatherMap API key to the environment variables
