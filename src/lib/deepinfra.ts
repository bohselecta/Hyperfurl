import { TextToImage } from "deepinfra";

const DEEPINFRA_API_KEY = process.env.DEEPINFRA_API_KEY || "9ZzUkgeqUZXZLC0ZRibcUkN8NZyTmyjH";

export async function generateImage(prompt: string, model: string = 'black-forest-labs/FLUX-1-schnell') {
  try {
    const textToImageModel = new TextToImage(model, DEEPINFRA_API_KEY);
    
    const response = await textToImageModel.generate({
      prompt: prompt,
      width: 1024,
      height: 576, // 16:9 aspect ratio
      num_inference_steps: 20,
      guidance_scale: 7.5,
    });

    // Return the image URL from the response
    return response.images[0];
  } catch (error) {
    console.error('Error generating image with DeepInfra:', error);
    throw error;
  }
}

export async function expandTextWithDeepSeek(text: string) {
  try {
    const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPINFRA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3.2-Exp',
        messages: [
          {
            role: 'system',
            content: 'You are a master storyteller and narrator. Transform image prompts into rich, vivid narratives that paint a complete picture. Use descriptive language, sensory details, and emotional depth. Keep it engaging and cinematic, like describing a scene from a movie.'
          },
          {
            role: 'user',
            content: `Transform this image prompt into a rich, detailed narrative that would be perfect for audio narration: "${text}"`
          }
        ],
        max_tokens: 300,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek expansion failed: ${response.status}`);
    }

    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error('Error expanding text with DeepSeek:', error);
    throw error;
  }
}

export async function generateSpeech(text: string, voice: string = 'af_bella') {
  try {
    // First expand the text with DeepSeek
    const expandedText = await expandTextWithDeepSeek(text);
    
    // Use DeepInfra inference API for Kokoro-82M
    const response = await fetch('https://api.deepinfra.com/v1/inference/hexgrad/Kokoro-82M', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPINFRA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: expandedText
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepInfra Kokoro API error:', response.status, errorText);
      
      // Fallback to browser TTS if API fails
      return {
        audioUrl: null,
        expandedText,
        originalText: text,
        voice: voice,
        useBrowserTTS: true
      };
    }

    // Parse the JSON response from inference API
    const result = await response.json();
    console.log('Kokoro API response:', result);

    // Check if we got audio data in the response
    if (result.audio) {
      // Convert base64 audio to blob URL
      const binaryString = atob(result.audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      console.log('Created audio URL from base64:', audioUrl, 'Blob size:', audioBlob.size);
      
      return {
        audioUrl,
        expandedText,
        originalText: text,
        voice: voice,
        useBrowserTTS: false
      };
    } else if (result.output) {
      // Try to handle different output formats
      console.log('Got output field:', typeof result.output);
      
      // If output is a URL, use it directly
      if (typeof result.output === 'string' && result.output.startsWith('http')) {
        return {
          audioUrl: result.output,
          expandedText,
          originalText: text,
          voice: voice,
          useBrowserTTS: false
        };
      }
    }

    console.warn('No audio data in Kokoro response, falling back to browser TTS');
    return {
      audioUrl: null,
      expandedText,
      originalText: text,
      voice: voice,
      useBrowserTTS: true
    };
  } catch (error) {
    console.error('Error generating speech:', error);
    
    // Fallback to browser TTS
    return {
      audioUrl: null,
      expandedText: text, // Use original text if expansion fails
      originalText: text,
      voice: voice,
      useBrowserTTS: true
    };
  }
}

export async function getAvailableImageModels() {
  return [
    { id: 'black-forest-labs/FLUX-1-schnell', name: 'FLUX 1 Schnell (Fast)' },
    { id: 'black-forest-labs/FLUX-1-dev', name: 'FLUX 1 Dev (Balanced)' },
    { id: 'black-forest-labs/FLUX-1.1-pro', name: 'FLUX 1.1 Pro (Quality)' },
  ];
}

export async function getAvailableVoiceModels() {
  return [
    { id: 'af_bella', name: 'BELLA (Warm, friendly female voice)' },
    { id: 'af_sarah', name: 'SARAH (Clear, professional female voice)' },
    { id: 'af_emma', name: 'EMMA (Energetic, youthful female voice)' },
    { id: 'af_zoe', name: 'ZOE (Smooth, sophisticated female voice)' },
    { id: 'af_grace', name: 'GRACE (Elegant, refined female voice)' },
    { id: 'af_rose', name: 'ROSE (Gentle, caring female voice)' },
  ];
}