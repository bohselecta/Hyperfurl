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
            content: 'You are a concise image describer. Transform image prompts into simple, clear descriptions in 1-2 sentences. Focus on the main subject and key visual elements only. Avoid sound effects, scene details, or cinematic language. Keep it brief and factual.'
          },
          {
            role: 'user',
            content: `Describe this image prompt in 1-2 simple sentences: "${text}"`
          }
        ],
        max_tokens: 100,
        temperature: 0.3
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

export async function generateSpeech(text: string, voice: string = 'af_nicole') {
  try {
    // First expand the text with DeepSeek
    const expandedText = await expandTextWithDeepSeek(text);
    
    // Use DeepInfra OpenAI-compatible Speech API
    const response = await fetch('https://api.deepinfra.com/v1/openai/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPINFRA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'hexgrad/Kokoro-82M',
        voice: voice,
        input: expandedText,
        response_format: 'mp3',
        speed: 1.0
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepInfra TTS API error:', response.status, errorText);
      
      // Return null if API fails - no fallback to browser TTS
      return null;
    }

    // Get the audio data as ArrayBuffer
    const audioBuffer = await response.arrayBuffer();
    
    // Convert ArrayBuffer to Blob and create object URL
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    console.log('Created audio URL from DeepInfra TTS:', audioUrl, 'Blob size:', audioBlob.size);
    
    return {
      audioUrl,
      expandedText,
      originalText: text,
      voice: voice,
      useBrowserTTS: false
    };
  } catch (error) {
    console.error('Error generating speech:', error);
    
    // Return null if speech generation fails - no fallback to browser TTS
    return null;
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
    { id: 'af_nicole', name: 'NICOLE (Soft spoken voice)' },
    { id: 'ai_nova', name: 'NOVA (Natural AI Voice)' },
    { id: 'af_bella', name: 'BELLA (Warm, friendly female voice)' },
    { id: 'af_sarah', name: 'SARAH (Clear, professional female voice)' },
    { id: 'af_emma', name: 'EMMA (Energetic, youthful female voice)' },
    { id: 'af_zoe', name: 'ZOE (Smooth, sophisticated female voice)' },
    { id: 'af_grace', name: 'GRACE (Elegant, refined female voice)' },
    { id: 'af_rose', name: 'ROSE (Gentle, caring female voice)' },
  ];
}