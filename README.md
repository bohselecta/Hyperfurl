# HyperFurl 🎵✨

**From thought to form** - A futuristic AI image generator with matching theme songs.

## Features

- 🎨 **AI Image Generation** powered by DeepInfra (Black Forest Labs Flux models)
- 🎵 **Music Generation** with matching theme songs
- 🌊 **Unfurl Engine** - 3-stage prompt enhancement system
- 🎪 **Floating Speakers** - Desktop-only immersive audio experience
- ⚡ **Knight Rider Scanner** - Animated UNFURL button
- 📱 **Responsive Design** - Clean mobile experience
- 🎭 **Glass Morphism UI** - Futuristic tactile interface

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS + Custom Design Tokens
- **Animations**: Framer Motion
- **Image Generation**: DeepInfra API
- **Deployment**: Vercel

## Environment Variables

Create a `.env.local` file with:

```bash
# DeepInfra API Key for image generation and text-to-speech
DEEPINFRA_API_KEY=your_deepinfra_api_key_here
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `DEEPINFRA_API_KEY`
   - `MUSIC_API_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to Vercel
npx vercel --prod
```

## API Endpoints

- `POST /api/generate` - Generate images with the Unfurl Engine
- `GET /api/models` - List available image generation models

## Design System

HyperFurl uses a comprehensive design token system with:

- **Colors**: Cyan (#62E1FF), Magenta (#FF71C9), Mint (#C8FFF9)
- **Typography**: Orbitron (display), Inter (UI)
- **Animations**: Breathing, glint, ripple effects
- **Glass Morphism**: Translucent surfaces with backdrop blur

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

**HyperFurl** - Where imagination meets reality through AI-powered creativity.