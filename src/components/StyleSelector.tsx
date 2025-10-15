'use client';

import { motion } from 'framer-motion';
import { CpuChipIcon } from '@heroicons/react/24/outline';

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  disabled?: boolean;
}


export function StyleSelector({ selectedStyle, onStyleChange, disabled = false }: StyleSelectorProps) {
  return (
    <div className="mt-6">
      {/* Voice info - Zoe is always selected */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 bg-hf-cyan/10 rounded-lg border border-hf-cyan/20"
      >
        <div className="flex items-center space-x-2">
          <CpuChipIcon className="w-4 h-4 text-hf-cyan" />
          <span className="text-sm text-hf-cyan">
            Voice: BELLA (Natural AI Voice)
          </span>
        </div>
        <p className="text-xs text-hf-glass/60 mt-1">
          Warm, friendly female voice powered by Kokoro-82M
        </p>
      </motion.div>
    </div>
  );
}