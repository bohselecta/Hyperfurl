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
      {/* Style selector content can be added here if needed */}
    </div>
  );
}