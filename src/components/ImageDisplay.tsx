'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowPathIcon,
  ShareIcon,
  HeartIcon,
  EyeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid';

interface GeneratedImage {
  image: string;
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

interface ImageDisplayProps {
  generatedImage: GeneratedImage | null;
  isGenerating: boolean;
  onRefurl: () => void;
  onToggleInspector: () => void;
  showInspector: boolean;
}

export function ImageDisplay({
  generatedImage,
  isGenerating,
  onRefurl,
  onToggleInspector,
  showInspector
}: ImageDisplayProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleShare = async () => {
    if (generatedImage && navigator.share) {
      try {
        await navigator.share({
          title: 'HyperFurl Creation',
          text: `Created with HyperFurl: "${generatedImage.seed}"`,
          url: window.location.href,
        });
      } catch {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage.image;
      link.download = `hyperfurl-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="relative">
      {/* Image Frame */}
      <motion.div
        className="relative hf-glass rounded-2xl overflow-hidden aspect-video max-w-4xl mx-auto"
        animate={{
          boxShadow: isGenerating
            ? 'var(--hf-glow-cyan)'
            : 'var(--hf-shadow-soft)'
        }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"
            >
              <div className="text-center">
                {/* Dual Loading Spinners */}
                <div className="flex justify-center space-x-8 mb-6">
                  {/* Image Generation Spinner */}
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-hf-cyan/30 border-t-hf-cyan rounded-full mx-auto mb-2"
                    />
                    <p className="text-hf-cyan text-sm font-medium">Generating Image</p>
                  </div>
                  
                  {/* Speech Generation Spinner */}
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
                      className="w-12 h-12 border-4 border-hf-magenta/30 border-t-hf-magenta rounded-full mx-auto mb-2"
                    />
                    <p className="text-hf-magenta text-sm font-medium">Creating Audio</p>
                  </div>
                </div>
                
                <p className="text-hf-glass font-medium">Unfurling your vision...</p>
                <div className="flex justify-center space-x-1 mt-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 h-2 bg-hf-glass rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : generatedImage ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group"
              onMouseEnter={() => setShowActions(true)}
              onMouseLeave={() => setShowActions(false)}
            >
              <img
                src={generatedImage.image}
                alt={`Generated from: ${generatedImage.seed}`}
                className="w-full h-full object-cover"
              />

              {/* Overlay actions */}
              <AnimatePresence>
                {showActions && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center"
                  >
                    <div className="flex space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onRefurl}
                        className="p-3 bg-hyper-cyan/20 hover:bg-hyper-cyan/30 rounded-full transition-colors"
                      >
                        <ArrowPathIcon className="w-6 h-6 text-hyper-cyan" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleShare}
                        className="p-3 bg-hyper-magenta/20 hover:bg-hyper-magenta/30 rounded-full transition-colors"
                      >
                        <ShareIcon className="w-6 h-6 text-hyper-magenta" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsLiked(!isLiked)}
                        className={`p-3 rounded-full transition-colors ${
                          isLiked
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {isLiked ? (
                          <HeartIconSolid className="w-6 h-6" />
                        ) : (
                          <HeartIcon className="w-6 h-6" />
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleDownload}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l4-4m-4 4l-4-4m8 2h3m-3 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Inspector toggle */}
              <motion.button
                onClick={onToggleInspector}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <DocumentTextIcon className={`w-5 h-5 ${showInspector ? 'text-hyper-cyan' : 'text-white'}`} />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 flex items-center justify-center"
            >
              <div className="text-center text-gray-400">
                <EyeIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Your creation will appear here</p>
                <p className="text-sm">Enter a prompt above and click UNFURL</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Image metadata */}
      {generatedImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
            <div className="inline-flex items-center space-x-4 px-6 py-3 bg-hf-glass/10 rounded-full">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-hf-cyan rounded-full animate-pulse" />
              <span className="text-sm text-hf-glass/80">Generated</span>
            </div>
            <div className="w-px h-4 bg-hf-glass/30" />
            <span className="text-sm text-hf-glass/60">
              {new Date(generatedImage.timestamp).toLocaleTimeString()}
            </span>
            {generatedImage.styleHint && (
              <>
                <div className="w-px h-4 bg-hf-glass/30" />
                <span className="text-sm text-hf-cyan capitalize">
                  {generatedImage.styleHint} style
                </span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
