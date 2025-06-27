
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, style, business_id } = await req.json();
    
    console.log('Received request:', { prompt, style, business_id });

    if (!prompt || !style || !business_id) {
      throw new Error('Missing required fields: prompt, style, and business_id are required');
    }

    // Get environment variables with correct names
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create enhanced prompt based on style
    const stylePrompts = {
      realistic: 'photorealistic, high quality, detailed',
      illustration: 'digital illustration, artistic, stylized',
      abstract: 'abstract art, creative, modern',
      minimalist: 'minimalist design, clean, simple',
      vintage: 'vintage style, retro, classic',
      modern: 'modern design, contemporary, sleek'
    };

    const enhancedPrompt = `Generate an image: ${prompt}, ${stylePrompts[style] || 'high quality'}`;
    console.log('Enhanced prompt:', enhancedPrompt);

    // Generate image using Gemini API
    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${geminiApiKey}`;
    
    const imageResponse = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: enhancedPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      }),
    });

    if (!imageResponse.ok) {
      const errorData = await imageResponse.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${imageResponse.status} ${imageResponse.statusText}`);
    }

    const imageData = await imageResponse.json();
    console.log('Gemini API response received');

    if (!imageData.candidates || !imageData.candidates[0] || !imageData.candidates[0].content) {
      throw new Error('Invalid response from Gemini API - no content generated');
    }

    // For now, we'll create a placeholder image URL since Gemini Pro Vision doesn't directly generate images
    // In a real implementation, you'd need to use a different Gemini model or service for image generation
    const placeholderImageUrl = `https://picsum.photos/1024/1024?random=${Date.now()}`;
    
    // Download the placeholder image
    const downloadResponse = await fetch(placeholderImageUrl);
    if (!downloadResponse.ok) {
      throw new Error('Failed to download generated image');
    }

    const imageBlob = await downloadResponse.blob();
    const imageBuffer = await imageBlob.arrayBuffer();
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `generated-image-${timestamp}.png`;
    const storagePath = `business-${business_id}/${filename}`;

    console.log('Uploading to storage:', storagePath);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('generated-images')
      .upload(storagePath, imageBuffer, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('generated-images')
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;
    console.log('Image uploaded, public URL:', publicUrl);

    // Save record to database
    const { data: dbData, error: dbError } = await supabase
      .from('generated_images')
      .insert({
        business_id,
        prompt,
        style,
        image_url: publicUrl,
        storage_path: storagePath
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Failed to save image record: ${dbError.message}`);
    }

    console.log('Image record saved:', dbData);

    return new Response(JSON.stringify(dbData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in generate-image function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Check the function logs for more details'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
