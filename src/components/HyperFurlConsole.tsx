'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptInput } from './PromptInput';
import { StyleSelector } from './StyleSelector';
import { UnfurlButton } from './UnfurlButton';
import { ImageDisplay } from './ImageDisplay';
import { WaveformDisplay } from './WaveformDisplay';

interface GeneratedImage {
  image: string;
  speech?: {
    audioUrl: string;
    expandedText: string;
    originalText: string;
    voice: string;
  };
  seed: string;
  styleHint?: string;
  unfurlResult: {
    inspector: {
      ripples: {
        r1: string;
        r2: string;
        r3: string;
      };
    };
    final_prompt: string;
  };
  timestamp: string;
}

export function HyperFurlConsole() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Debug: Log state changes
  console.log('isGenerating:', isGenerating, 'prompt:', prompt);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInspector, setShowInspector] = useState(false);

  const consoleRef = useRef<HTMLDivElement>(null);

  const handleUnfurl = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seed: prompt,
          styleHint: selectedStyle || undefined,
          voice: 'af_nicole',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedImage(data);
      } else {
        setError(data.error || 'Failed to generate image');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePromptSubmit = () => {
    handleUnfurl();
  };

  const handleRefurl = () => {
    if (generatedImage) {
      setPrompt(generatedImage.seed);
      setSelectedStyle(generatedImage.styleHint || '');
      handleUnfurl();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Floating Speakers - Desktop Only */}
      <div className="hidden lg:block fixed left-8 z-5 pointer-events-none" style={{ top: 'calc(33.333% - 100px)' }}>
        <motion.div
          className="relative"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 1, 0, -1, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img
            src="/speaker-tall.png"
            alt="Floating Speaker"
            className="w-24 h-auto opacity-80 drop-shadow-2xl"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(98, 225, 255, 0.3))'
            }}
          />
          {/* Audio-reactive glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                '0 0 20px rgba(98, 225, 255, 0.2)',
                '0 0 40px rgba(98, 225, 255, 0.4)',
                '0 0 20px rgba(98, 225, 255, 0.2)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>

      <div className="hidden lg:block fixed right-8 z-5 pointer-events-none" style={{ top: 'calc(33.333% - 100px)' }}>
        <motion.div
          className="relative"
          animate={{
            y: [0, 10, 0],
            rotate: [0, -1, 0, 1, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <img
            src="/speaker-tall.png"
            alt="Floating Speaker"
            className="w-24 h-auto opacity-80 drop-shadow-2xl"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(255, 113, 201, 0.3))'
            }}
          />
          {/* Audio-reactive glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                '0 0 20px rgba(255, 113, 201, 0.2)',
                '0 0 40px rgba(255, 113, 201, 0.4)',
                '0 0 20px rgba(255, 113, 201, 0.2)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </motion.div>
      </div>

      <motion.div
        ref={consoleRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-4xl"
      >
        {/* Main Console Body */}
        <div className="hf-glass rounded-3xl p-6 md:p-8 relative overflow-hidden hf-tilt" style={{ zIndex: 10 }}>
          {/* Ambient glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-hf-cyan/10 via-transparent to-hf-magenta/10 rounded-3xl pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Logo/Brand */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 flex items-center justify-center hf-breathe">
                    <img 
                      src="/logo.png" 
                      alt="HyperFurl Logo" 
                      className="w-full h-full object-contain drop-shadow-lg"
                      style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,.45))' }}
                    />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold font-display text-hf-glass" style={{ fontFamily: 'var(--hf-font-display)' }}>
                      HYPERFURL
                    </h1>
                  </div>
                </div>
              </div>

              {/* Status indicators */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-hf-cyan animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-hf-magenta animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="relative z-20 mb-6">
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={handlePromptSubmit}
              placeholder="Enter your idea for an image"
              disabled={isGenerating}
            />

            <div className="flex justify-center mt-6">
              <UnfurlButton
                onClick={handleUnfurl}
                disabled={!prompt.trim() || isGenerating}
                isGenerating={isGenerating}
              />
            </div>

            <StyleSelector
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
              disabled={isGenerating}
            />
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative z-10 mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
              >
                <p className="text-red-400">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Output Section */}
          <div className="relative z-10">
            <ImageDisplay
              generatedImage={generatedImage}
              isGenerating={isGenerating}
              onRefurl={handleRefurl}
              onToggleInspector={() => setShowInspector(!showInspector)}
              showInspector={showInspector}
            />

            {/* Inspector Panel */}
            <AnimatePresence>
              {showInspector && generatedImage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 hf-glass rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-hf-glass mb-4" style={{ fontFamily: 'var(--hf-font-display)' }}>Prompt Inspector</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-hf-cyan mb-2">Original Seed</h4>
                      <p className="text-hf-glass/80 text-sm">{generatedImage.seed}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-hf-magenta mb-2">Unfurled Prompts</h4>
                      <div className="space-y-2 text-sm">
                        <div className="p-2 bg-hf-cyan/10 rounded-lg">
                          <span className="text-hf-cyan">R1:</span> {generatedImage.unfurlResult.inspector.ripples.r1}
                        </div>
                        <div className="p-2 bg-hf-magenta/10 rounded-lg">
                          <span className="text-hf-magenta">R2:</span> {generatedImage.unfurlResult.inspector.ripples.r2}
                        </div>
                        <div className="p-2 bg-hf-mint/10 rounded-lg">
                          <span className="text-hf-mint">R3:</span> {generatedImage.unfurlResult.inspector.ripples.r3}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-hf-glass mb-2">Final Enhanced Prompt</h4>
                      <p className="text-hf-glass/80 text-sm p-2 bg-hf-ink-1/50 rounded-lg">
                        {generatedImage.unfurlResult.final_prompt}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Waveform Display (for speech integration) */}
          <div className="relative z-10 mt-6">
            <WaveformDisplay 
              speechData={generatedImage?.speech} 
              isGenerating={isGenerating}
            />
          </div>

          {/* Bottom Control Buttons */}
          <div className="relative z-10 mt-6 flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-hf-glass/10 hover:bg-hf-glass/20 rounded-lg text-hf-glass/80 text-sm font-medium transition-colors"
            >
              Settings
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-hf-glass/10 hover:bg-hf-glass/20 rounded-lg text-hf-glass/80 text-sm font-medium transition-colors"
            >
              Gallery
            </motion.button>
          </div>
        </div>

        {/* Ambient particles effect */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(20)].map((_, i) => {
            // Use deterministic positioning to avoid hydration mismatch
            const seed = i * 0.618033988749; // Golden ratio for better distribution
            const left = ((seed * 100) % 100);
            const top = (((seed * 1.618033988749) * 100) % 100);
            
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-hyper-cyan/30 rounded-full"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
