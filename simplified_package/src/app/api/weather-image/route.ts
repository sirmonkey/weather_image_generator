// API route for weather image generation
// This file implements the API endpoint that returns weather-based images for Louisville, Colorado

import { NextRequest, NextResponse } from 'next/server';
import { fetchWeatherData, mapWeatherToImageParams } from '@/lib/weatherService';
import { generateWeatherImage, fetchImageAsBuffer, imageCache } from '@/lib/imageService';

export const runtime = 'edge'; // Use edge runtime for better performance

/**
 * GET handler for /api/weather-image endpoint
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const style = searchParams.get('style') || 'watercolor';
    const size = searchParams.get('size') || '640x640';
    const forceFresh = searchParams.get('fresh') === 'true';
    
    // Fetch current weather data for Louisville, Colorado
    const weatherData = await fetchWeatherData();
    
    // Create a cache key based on weather condition and style
    const cacheKey = `${weatherData.condition}_${style}`;
    
    // Check cache first (unless forceFresh is true)
    let imageResult;
    if (!forceFresh) {
      imageResult = imageCache.get(cacheKey);
    }
    
    // If not in cache or force fresh, generate a new image
    if (!imageResult) {
      // Map weather data to image generation parameters
      const imageParams = mapWeatherToImageParams(weatherData);
      
      // Generate the image
      imageResult = await generateWeatherImage(imageParams.prompt, imageParams.style);
      
      // Store in cache
      imageCache.set(cacheKey, imageResult);
    }
    
    // Fetch the image as a buffer
    const imageBuffer = await fetchImageAsBuffer(imageResult.url);
    
    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=1800', // 30 minutes browser caching
        'X-Weather-Condition': weatherData.condition,
        'X-Weather-Temperature': weatherData.temperature.toString(),
        'X-Weather-Description': weatherData.description
      }
    });
  } catch (error) {
    console.error('Error in weather image API:', error);
    
    // Return an error response
    return NextResponse.json(
      { error: 'Failed to generate weather image' },
      { status: 500 }
    );
  }
}
