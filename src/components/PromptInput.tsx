'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Describe your idea...",
  disabled = false
}: PromptInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Debug logging
  console.log('PromptInput - disabled:', disabled, 'value:', value);
  
  // Add click handler for debugging
  const handleClick = () => {
    console.log('PromptInput clicked!', { disabled, value, isFocused });
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <motion.div
      className={`relative transition-all duration-300 ${
        isFocused ? 'transform scale-[1.02]' : ''
      }`}
      animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
    >
      <div 
        className={`
          relative hf-glass rounded-xl p-4 transition-all duration-300
          ${isFocused ? 'ring-2 ring-hf-cyan/50 shadow-lg shadow-hf-cyan/20' : 'ring-1 ring-hf-glass/20'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={handleClick}
      >
        {/* Background glow */}
        <div className={`
          absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none
          ${isFocused ? 'bg-hf-cyan/5' : 'bg-transparent'}
        `} />

        {/* Breathing cursor effect */}
        <div className={`
          absolute left-4 top-4 w-0.5 h-6 bg-hf-cyan transition-all duration-1000 pointer-events-none
          ${isFocused ? 'opacity-100 animate-pulse' : 'opacity-0'}
        `} />

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full bg-transparent text-hf-glass placeholder-hf-glass/40
            resize-none outline-none border-none
            text-lg leading-relaxed
            font-light tracking-wide
            ${disabled ? 'cursor-not-allowed' : 'cursor-text'}
          `}
          rows={1}
          style={{ minHeight: '48px' }}
        />

        {/* Character counter */}
        <div className="absolute bottom-2 right-4 text-xs text-hf-glass/50 pointer-events-none">
          {value.length > 0 && `${value.length} characters`}
        </div>

        {/* Ripple effect on focus */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-hf-cyan/30 pointer-events-none"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
    </motion.div>
  );
}
