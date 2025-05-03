// Image generation service for weather-based images
// This file handles generating images based on weather conditions using DeepAI API

import { WeatherData } from './weatherService';

export interface ImageGenerationResult {
  url: string;        // URL to the generated image (if using external API)
  buffer?: Buffer;    // Raw image data (if available)
  timestamp: number;  // When the image was generated
  weatherCondition: string; // Weather condition this image represents
}

// DeepAI API key - store in environment variables for production
const DEEPAI_API_KEY = process.env.DEEPAI_API_KEY || 'YOUR_DEEPAI_API_KEY';

/**
 * Generates an image using DeepAI based on weather conditions
 */
export async function generateWeatherImage(
  prompt: string,
  style: string = 'watercolor'
): Promise<ImageGenerationResult> {
  try {
    // Call DeepAI API to generate the image
    const response = await fetch('https://api.deepai.org/api/text2img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': DEEPAI_API_KEY
      },
      body: JSON.stringify({
        text: prompt,
        grid_size: '1',
        width: 640,
        height: 640
      })
    });

    if (!response.ok) {
      throw new Error(`DeepAI API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the image URL from the response
    const imageUrl = data.output_url;
    
    if (!imageUrl) {
      throw new Error('No image URL returned from DeepAI API');
    }
    
    return {
      url: imageUrl,
      timestamp: Date.now(),
      weatherCondition: prompt.split('.')[0] // Extract the main weather condition
    };
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate weather image');
  }
}

/**
 * Fetches the generated image as a buffer
 */
export async function fetchImageAsBuffer(imageUrl: string): Promise<Buffer> {
  try {
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Error fetching image as buffer:', error);
    throw new Error('Failed to fetch image data');
  }
}

/**
 * Cache implementation for storing generated images
 * In a production environment, you would use a more robust caching solution
 */
interface CacheEntry {
  data: ImageGenerationResult;
  expiresAt: number;
}

class ImageCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly DEFAULT_TTL = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
  
  /**
   * Get an image from cache by weather condition
   */
  get(weatherCondition: string): ImageGenerationResult | null {
    const entry = this.cache.get(weatherCondition);
    
    if (!entry) {
      return null;
    }
    
    // Check if the entry has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(weatherCondition);
      return null;
    }
    
    return entry.data;
  }
  
  /**
   * Store an image in cache
   */
  set(weatherCondition: string, data: ImageGenerationResult, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(weatherCondition, {
      data,
      expiresAt: Date.now() + ttl
    });
  }
  
  /**
   * Clear all entries from cache
   */
  clear(): void {
    this.cache.clear();
  }
}

// Export a singleton instance of the cache
export const imageCache = new ImageCache();
