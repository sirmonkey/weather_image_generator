# Weather Image API Deployment Package

This package contains a complete implementation of a weather image API that generates high-quality images representing the current weather in Louisville, Colorado.

## Contents

- `/src` - Source code for the Next.js application
- `/migrations` - Database migration files (not required for basic functionality)
- `wrangler.toml` - Cloudflare Workers configuration
- `DEPLOYMENT.md` - Detailed deployment instructions
- `README.md` - API documentation and overview

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your API keys:
```
OPENWEATHER_API_KEY=your_openweather_api_key
DEEPAI_API_KEY=2d36fbc3bd0c
```

3. Run locally:
```bash
npm run dev
```

4. Deploy to Cloudflare:
```bash
npm run deploy
```

## API Usage

Once deployed, access the API at:
```
https://your-domain.com/api/weather-image
```

See README.md for complete API documentation.

## Notes

- The DeepAI key has been pre-configured with the value you provided
- You'll need to obtain an OpenWeatherMap API key from https://openweathermap.org/api
- For deployment, you'll need a Cloudflare account

For any questions or issues, refer to the detailed documentation in DEPLOYMENT.md and README.md.
