// API route for image generation
import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/deepinfra';
import { UnfurlEngine } from '@/lib/unfurl-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { seed, styleHint, model = 'black-forest-labs/FLUX-1-dev' } = body;

    if (!seed) {
      return NextResponse.json(
        { error: 'Seed prompt is required' },
        { status: 400 }
      );
    }

    // Unfurl the seed into a rich prompt
    const unfurlEngine = new UnfurlEngine();
    const unfurlResult = unfurlEngine.unfurl(seed, styleHint);

    // Generate image
    const imageUrl = await generateImage(unfurlResult.final_prompt, model);

    // Return the generated image and the unfurl analysis
    return NextResponse.json({
      success: true,
      image: imageUrl,
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
