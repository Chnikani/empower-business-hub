
import { apiClient } from '@/lib/apiClient';

export interface GeneratedImage {
  id: string
  business_id: string
  prompt: string
  style: string
  image_url: string
  storage_path: string
  created_at: string
}

export const generateImage = async (prompt: string, style: string, businessId: string): Promise<GeneratedImage> => {
  console.log('Calling generate-image API with:', { prompt, style, business_id: businessId });
  
  try {
    const data = await apiClient.generateImage(prompt, style, businessId);
    console.log('API response:', data);
    return data as GeneratedImage;
  } catch (error) {
    console.error('Image generation error:', error);
    throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const getBusinessImages = async (businessId: string): Promise<GeneratedImage[]> => {
  console.log('Fetching images for business:', businessId);
  
  try {
    const data = await apiClient.getGeneratedImages(businessId);
    console.log('Fetched images:', data);
    return (data || []) as GeneratedImage[];
  } catch (error) {
    console.error('Error fetching images:', error);
    throw new Error(`Failed to fetch images: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const downloadImage = async (imageUrl: string, filename: string) => {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch image')
    }
    
    const blob = await response.blob()
    
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading image:', error)
    throw new Error('Failed to download image')
  }
}
