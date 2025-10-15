// HyperFurl Unfurl Engine - transforms simple ideas into rich visual prompts
export interface UnfurlResult {
  final_prompt: string;
  negative_prompt: string;
  variants: Array<{
    name: string;
    prompt: string;
    differences: string[];
  }>;
  inspector: {
    seed: string;
    style_hint?: string;
    ripples: {
      r1: string;
      r2: string;
      r3: string;
    };
    scores?: {
      clarity: number;
      edge: number;
      lighting: number;
      palette: number;
      depth: number;
      narrative: number;
      style: number;
      total: number;
    };
  };
}

export class UnfurlEngine {
  private styleModules: Record<string, string> = {
    realism: "photorealistic, highly detailed, professional photography, natural lighting, sharp focus",
    cyberpunk: "cyberpunk aesthetic, neon lights, futuristic city, holographic elements, dark atmosphere",
    impressionism: "impressionist painting style, visible brush strokes, broken color, plein-air lighting",
    'line-art': "clean line art, minimal colors, graphic novel style, vector illustration",
    abstract: "abstract art, non-representational, geometric forms, bold colors, artistic composition",
    cartoon: "cartoon style, animated, colorful, exaggerated features, comic book aesthetic",
    baroque: "baroque painting style, dramatic lighting, ornate details, theatrical composition",
    'graphic-poster': "graphic design, flat colors, bold typography, minimalist composition",
    watercolor: "watercolor painting, soft edges, bleeding colors, artistic brushwork",
    surrealist: "surrealist art, dream-like, impossible scenes, symbolic elements",
    'photojournalistic': "documentary photography, natural lighting, candid moments, realistic",
    macro: "macro photography, extreme close-up, sharp details, bokeh background",
    cinematic: "cinematic lighting, movie still, dramatic composition, professional cinematography"
  };

  normalizeInput(seed: string, styleHint?: string): {
    clean: string;
    entities: string[];
    style_hint?: string;
  } {
    // Clean and normalize the input
    const clean = seed.trim().toLowerCase()
      .replace(/[^\w\s,]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Extract key entities (simple keyword extraction)
    const words = clean.split(' ');
    const entities = words.filter(word =>
      word.length > 3 &&
      !['the', 'and', 'with', 'from', 'that', 'this', 'will', 'can', 'are', 'was', 'had', 'has'].includes(word)
    );

    return {
      clean,
      entities: entities.slice(0, 5), // Limit to top 5 entities
      style_hint: styleHint
    };
  }

  generateRipple1(subject: string, entities: string[]): string {
    // R1 - Literal Core: Describe what, where, when plainly
    const subjectClause = subject || entities[0] || "a mysterious scene";
    const environment = entities.slice(1, 3).join(" and ") || "an interesting environment";
    const time = entities.slice(2, 4).join(" ") || "at a dramatic moment";

    return `${subjectClause} in ${environment} during ${time}`;
  }

  generateRipple2(_r1: string, _entities: string[]): string {
    // R2 - Composition & Light: Add camera, framing, depth, atmosphere, palette
    const compositions = [
      "centered hero composition with rule of thirds",
      "dynamic composition with leading lines",
      "close-up macro shot",
      "wide angle environmental shot",
      "over-the-shoulder perspective"
    ];

    const lenses = ["35mm lens", "50mm lens", "85mm lens", "24mm wide-angle lens", "100mm macro lens"];
    const lighting = [
      "soft natural lighting with rim light",
      "dramatic chiaroscuro lighting",
      "neon-lit atmosphere with backlighting",
      "golden hour sunlight",
      "moody overcast sky"
    ];
    const atmospheres = [
      "with volumetric fog and light rays",
      "with rain and wet reflections",
      "with dust motes in the air",
      "with dramatic shadows",
      "with ethereal glow"
    ];
    const palettes = [
      "warm golden and amber tones",
      "cool blue and cyan palette",
      "vibrant magenta and purple hues",
      "monochrome with silver highlights",
      "pastel pink and mint colors"
    ];

    const composition = compositions[Math.floor(Math.random() * compositions.length)];
    const lens = lenses[Math.floor(Math.random() * lenses.length)];
    const light = lighting[Math.floor(Math.random() * lighting.length)];
    const atmosphere = atmospheres[Math.floor(Math.random() * atmospheres.length)];
    const palette = palettes[Math.floor(Math.random() * palettes.length)];

    return `${composition} with ${lens}, ${light}, ${atmosphere}, ${palette}`;
  }

  generateRipple3(_r2: string, _r1: string, _entities: string[]): string {
    // R3 - Material & Detail: Add surface qualities, micro details, scene props, story cues
    const textures = [
      "with intricate texture details and fine surface imperfections",
      "with realistic material properties and subsurface scattering",
      "with detailed craftsmanship and artisanal quality",
      "with organic textures and natural weathering",
      "with polished surfaces and mirror-like reflections"
    ];

    const microDetails = [
      "micro-droplets beading on surfaces",
      "subtle fingerprints and smudges",
      "fine dust particles in the air",
      "delicate edge highlights and fresnel effects",
      "intricate shadow patterns"
    ];

    const props = [
      "scattered personal artifacts and mementos",
      "atmospheric particles and floating elements",
      "architectural details and structural elements",
      "natural elements like leaves, water, or stone",
      "mysterious objects hinting at deeper meaning"
    ];

    const storyCues = [
      "suggesting a moment of quiet contemplation",
      "evoking a sense of wonder and discovery",
      "capturing the essence of human connection",
      "telling a story of transformation and growth",
      "creating an atmosphere of mystery and intrigue"
    ];

    const texture = textures[Math.floor(Math.random() * textures.length)];
    const micro = microDetails[Math.floor(Math.random() * microDetails.length)];
    const prop = props[Math.floor(Math.random() * props.length)];
    const story = storyCues[Math.floor(Math.random() * storyCues.length)];

    return `${texture}, ${micro}, ${prop}, ${story}`;
  }

  applyStyleFusion(styleHint?: string): string {
    if (!styleHint || !this.styleModules[styleHint.toLowerCase()]) {
      return "";
    }

    return `in the style of ${this.styleModules[styleHint.toLowerCase()]}`;
  }

  generateVariants(basePrompt: string): Array<{name: string; prompt: string; differences: string[]}> {
    const variants = [
      {
        name: "Composition Alternative",
        prompt: basePrompt.replace(/composition with \w+/, "composition with dynamic diagonal lines"),
        differences: ["composition", "framing"]
      },
      {
        name: "Lighting Variation",
        prompt: basePrompt.replace(/lighting, \w+/, "lighting with cinematic shadows and highlights"),
        differences: ["lighting", "mood"]
      },
      {
        name: "Color Palette Shift",
        prompt: basePrompt.replace(/palette, \w+/, "palette with vibrant complementary colors"),
        differences: ["color palette", "atmosphere"]
      }
    ];

    return variants;
  }

  calculateScores(prompt: string): UnfurlResult['inspector']['scores'] {
    // Simple heuristic scoring based on prompt complexity and quality indicators
    const hasLighting = /lighting|light|shadow|glow|illuminate/.test(prompt);
    const hasComposition = /composition|framing|angle|perspective/.test(prompt);
    const hasTexture = /texture|material|surface|detail/.test(prompt);
    const hasColor = /palette|color|hue|tone/.test(prompt);
    const hasStory = /moment|story|emotion|mood|atmosphere/.test(prompt);
    const hasTechnical = /lens|focal|bokeh|depth|sharp/.test(prompt);

    const scores = {
      clarity: Math.min(1, (prompt.split(' ').length / 100) + 0.3),
      edge: hasTechnical ? 0.9 : 0.7,
      lighting: hasLighting ? 0.9 : 0.6,
      palette: hasColor ? 0.9 : 0.6,
      depth: (hasComposition && hasTexture) ? 0.9 : 0.6,
      narrative: hasStory ? 0.9 : 0.6,
      style: 0.8,
      total: 0
    };

    scores.total = Object.values(scores).reduce((sum, score) => sum + score, 0) / 7;
    return scores;
  }

  unfurl(seed: string, styleHint?: string): UnfurlResult {
    const normalized = this.normalizeInput(seed, styleHint);

    // Generate the three ripples
    const r1 = this.generateRipple1(seed, normalized.entities);
    const r2 = this.generateRipple2(r1, normalized.entities);
    const r3 = this.generateRipple3(r2, r1, normalized.entities);

    // Apply style fusion if specified
    const styleFusion = this.applyStyleFusion(styleHint);

    // Combine into final prompt
    let finalPrompt = `${r1}. ${r2}. ${r3}`;
    if (styleFusion) {
      finalPrompt += `. ${styleFusion}`;
    }

    // Add quality enhancers
    finalPrompt += ". Highly detailed, professional, coherent lighting, clean edges, balanced contrast, sharp focus";

    // Generate variants
    const variants = this.generateVariants(finalPrompt);

    // Calculate scores
    const scores = this.calculateScores(finalPrompt);

    return {
      final_prompt: finalPrompt,
      negative_prompt: "low-res, oversharpening, compression artifacts, extra limbs, deformed anatomy, watermark, text artifacts, bad hands, bad eyes, crooked horizon, heavy banding, duplicate subjects, frame cutoffs",
      variants,
      inspector: {
        seed,
        style_hint: styleHint,
        ripples: {
          r1,
          r2,
          r3
        },
        scores
      }
    };
  }
}

// Export a default instance
export const unfurlEngine = new UnfurlEngine();
