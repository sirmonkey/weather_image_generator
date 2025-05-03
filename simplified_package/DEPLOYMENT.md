# Deployment Guide for Weather Image API

## Prerequisites
To deploy this API, you'll need:

1. **API Keys**:
   - OpenWeatherMap API key (for weather data)
   - DeepAI API key (for image generation)

2. **Cloudflare Account**:
   - Free account at cloudflare.com
   - Access to Cloudflare Pages and Workers

## Deployment Steps

### 1. Set Up Environment Variables (Local Development)

Create a `.env` file in the project root with the following variables:
```
OPENWEATHER_API_KEY=your_openweathermap_api_key
DEEPAI_API_KEY=your_deepai_api_key
```
*(The `.env` file in this package is pre-filled with the keys you provided: `OPENWEATHER_API_KEY=748ff840cd2dd6cd4fbe6bdf2283de9a` and `DEEPAI_API_KEY=2d36fbc3bd0c`)*

### 2. Update Wrangler Configuration

The `wrangler.toml` file is already configured with the basic settings. You may want to update:
- `name`: Change if you want a different project name
- Add custom domain configuration if needed via the Cloudflare dashboard

### 3. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 4. Login to Cloudflare

```bash
wrangler login
```

### 5. Build the Application

Navigate to the project directory (`simplified_package`) and run:
```bash
npm install
npm run build
```

### 6. Deploy to Cloudflare

```bash
wrangler deploy
```

### 7. Configure Environment Variables in Cloudflare

After deployment, set up the environment variables in the Cloudflare dashboard:
1. Go to Workers & Pages > Your Application
2. Navigate to Settings > Environment Variables
3. Under **Production** > **Variables**, click **Add variable** twice to add:
   - `OPENWEATHER_API_KEY` (Value: `748ff840cd2dd6cd4fbe6bdf2283de9a`)
   - `DEEPAI_API_KEY` (Value: `2d36fbc3bd0c`)
4. Click **Save**.

## Accessing Your API

Once deployed, your API will be available at the URL provided by Wrangler (e.g., `https://weather-image-api.your-account.workers.dev/api/weather-image`).

## Monitoring and Maintenance

- Monitor API usage in the Cloudflare dashboard
- Check logs for errors or performance issues
- Update API keys if they expire or change

## Troubleshooting

- If deployment fails, check Cloudflare account permissions
- Verify API keys are valid and have necessary permissions
- Check logs for specific error messages
