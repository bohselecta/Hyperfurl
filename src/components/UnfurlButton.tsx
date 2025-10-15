'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Expand } from 'lucide-react';

interface UnfurlButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
}

export function UnfurlButton({ onClick, disabled = false, isGenerating = false }: UnfurlButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (!disabled && !isGenerating) {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);
      onClick();
    }
  };

  return (
    <div className="flex justify-center relative">
      {/* Ripple container */}
      <div className="hf-ripples absolute inset-0 pointer-events-none" />

      <motion.button
        onClick={handleClick}
        disabled={disabled || isGenerating}
        whileHover={!disabled && !isGenerating ? { scale: 1.02 } : {}}
        whileTap={!disabled && !isGenerating ? { scale: 0.98 } : {}}
        animate={isPressed ? { scale: 0.98 } : { scale: 1 }}
        className={`
          relative overflow-hidden rounded-2xl font-bold font-display text-lg
          transition-all duration-300 px-6 py-4 md:px-16 md:py-8 w-full max-w-[395px] md:max-w-[500px] h-[56px] md:h-[80px]
          ${disabled || isGenerating
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer'
          }
        `}
        style={{
          background: 'url(/button.svg)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      >
        {/* Scanner animation overlay - Knight Rider effect */}
        <motion.div
          className="absolute inset-0"
          animate={{
            x: ['-50%', '150%', '-50%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
          style={{
            width: '40%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(98,225,255,0.6) 30%, rgba(98,225,255,0.8) 50%, rgba(98,225,255,0.6) 70%, transparent 100%)',
            filter: 'blur(0.5px)',
            boxShadow: '0 0 10px rgba(98,225,255,0.4)'
          }}
          className="h-full"
        />

        {/* Button content */}
        <div className="relative z-10 flex items-center justify-center space-x-2 md:space-x-3 h-full md:-translate-y-3.5">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-center space-x-2 md:space-x-3"
              >
                {/* Spinning loader */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                <span className="text-white font-bold text-sm md:text-lg">Unfurling...</span>
              </motion.div>
            ) : (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-center space-x-2 md:space-x-3"
              >
                <span className="text-white font-bold text-sm md:text-lg">UNFURL</span>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Expand className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>

      {/* Ripple rings animation */}
      <AnimatePresence>
        {isPressed && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 2.4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, delay: i * 0.2 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-hyper-cyan/30 rounded-full"
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
