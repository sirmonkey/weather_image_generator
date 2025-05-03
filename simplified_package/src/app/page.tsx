// Simple frontend page to demonstrate the Weather Image API
// This file creates a basic UI to showcase the API functionality

import { fetchWeatherData } from '@/lib/weatherService';

export default async function Home() {
  // Fetch current weather data to display alongside the image
  const weatherData = await fetchWeatherData().catch(() => null);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gray-50">
      <div className="z-10 w-full max-w-3xl items-center justify-between text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">Louisville, CO Weather Image API</h1>
        
        {weatherData && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">Current Weather</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Condition:</p>
                <p className="font-medium">{weatherData.condition}</p>
              </div>
              <div>
                <p className="text-gray-600">Description:</p>
                <p className="font-medium">{weatherData.description}</p>
              </div>
              <div>
                <p className="text-gray-600">Temperature:</p>
                <p className="font-medium">{weatherData.temperature}°F</p>
              </div>
              <div>
                <p className="text-gray-600">Humidity:</p>
                <p className="font-medium">{weatherData.humidity}%</p>
              </div>
              <div>
                <p className="text-gray-600">Wind Speed:</p>
                <p className="font-medium">{weatherData.windSpeed} mph</p>
              </div>
              <div>
                <p className="text-gray-600">Cloud Cover:</p>
                <p className="font-medium">{weatherData.cloudCover}%</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Weather Image</h2>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-2">This image is dynamically generated based on current weather conditions:</p>
            <div className="relative aspect-square w-full max-w-xl mx-auto border-2 border-gray-200 rounded-lg overflow-hidden">
              {/* Image with query string to prevent caching */}
              <img 
                src={`/api/weather-image?t=${Date.now()}`} 
                alt="Current weather in Louisville, Colorado" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-medium">API Usage</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <code className="text-sm">GET /api/weather-image</code>
            </div>
            
            <h4 className="font-medium">Optional Parameters:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><code className="bg-gray-100 px-1">style</code> - Image style (watercolor, realistic)</li>
              <li><code className="bg-gray-100 px-1">size</code> - Image dimensions</li>
              <li><code className="bg-gray-100 px-1">fresh</code> - Force fresh generation (true/false)</li>
            </ul>
            
            <h4 className="font-medium">Example:</h4>
            <div className="bg-gray-100 p-4 rounded-md">
              <code className="text-sm break-all">https://your-api-domain.com/api/weather-image?style=watercolor&size=640x640</code>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
