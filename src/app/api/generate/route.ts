// API route for image and speech generation
import { NextRequest, NextResponse } from 'next/server';
import { generateImage, generateSpeech } from '@/lib/deepinfra';
import { UnfurlEngine } from '@/lib/unfurl-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { seed, styleHint, model = 'black-forest-labs/FLUX-1-dev', voice = 'af_nicole' } = body;

    if (!seed) {
      return NextResponse.json(
        { error: 'Seed prompt is required' },
        { status: 400 }
      );
    }

    // Unfurl the seed into a rich prompt
    const unfurlEngine = new UnfurlEngine();
    const unfurlResult = unfurlEngine.unfurl(seed, styleHint);

    // Generate image first, then try speech generation
    const imageUrl = await generateImage(unfurlResult.final_prompt, model);
    
    // Try to generate speech, but don't fail if it doesn't work
    let speechResult = null;
    try {
      speechResult = await generateSpeech(unfurlResult.final_prompt, voice);
    } catch (speechError) {
      console.warn('Speech generation failed, continuing without speech:', speechError);
    }

    // Return both the generated image, speech, and the unfurl analysis
    return NextResponse.json({
      success: true,
      image: imageUrl,
      speech: speechResult,
      seed,
      styleHint,
      unfurlResult,
      metadata: {
        model,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
