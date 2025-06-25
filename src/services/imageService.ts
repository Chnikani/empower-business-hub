
import { supabase } from '@/lib/supabase'

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
  // Call the Supabase Edge Function for image generation
  const { data, error } = await supabase.functions.invoke('generate-image', {
    body: {
      prompt,
      style,
      business_id: businessId,
    },
  })

  if (error) {
    console.error('Image generation error:', error)
    throw new Error('Failed to generate image')
  }

  return data as GeneratedImage
}

export const getBusinessImages = async (businessId: string): Promise<GeneratedImage[]> => {
  const { data, error } = await supabase
    .from('generated_images')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching images:', error)
    throw error
  }

  return data || []
}

export const downloadImage = async (imageUrl: string, filename: string) => {
  try {
    const response = await fetch(imageUrl)
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
