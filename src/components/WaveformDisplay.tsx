'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline';

interface SpeechData {
  audioUrl?: string | null;
  expandedText: string;
  originalText: string;
  voice: string;
  useBrowserTTS?: boolean;
}

interface WaveformDisplayProps {
  speechData?: SpeechData;
  isGenerating?: boolean;
}

export function WaveformDisplay({ speechData, isGenerating = false }: WaveformDisplayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Debug logging
  console.log('WaveformDisplay speechData:', speechData);

  useEffect(() => {
    if (speechData?.audioUrl && audioRef.current) {
      const audio = audioRef.current;
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        // Auto-play when audio is ready
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.log('Auto-play prevented:', error);
          // User interaction required for autoplay
        });
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [speechData]);

  const handlePlayPause = () => {
    if (!speechData) {
      console.log('No speech data available');
      return;
    }

    console.log('Play button clicked:', { 
      useBrowserTTS: speechData.useBrowserTTS, 
      hasAudioUrl: !!speechData.audioUrl,
      expandedText: speechData.expandedText?.substring(0, 100) + '...'
    });

    if (speechData.useBrowserTTS) {
      // Use browser speech synthesis
      if (isPlaying) {
        console.log('Stopping speech synthesis');
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        console.log('Starting speech synthesis');
        
        // Check if speech synthesis is available
        if (!('speechSynthesis' in window)) {
          console.error('Speech synthesis not supported in this browser');
          alert('Speech synthesis is not supported in this browser');
          return;
        }

        const utterance = new SpeechSynthesisUtterance(speechData.expandedText);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        utterance.lang = 'en-US';
        
        utterance.onstart = () => {
          console.log('Speech synthesis started');
          setIsPlaying(true);
        };
        utterance.onend = () => {
          console.log('Speech synthesis ended');
          setIsPlaying(false);
        };
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setIsPlaying(false);
          alert('Speech synthesis failed: ' + event.error);
        };
        
        speechUtteranceRef.current = utterance;
        
        try {
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          console.error('Error starting speech synthesis:', error);
          alert('Failed to start speech synthesis: ' + (error instanceof Error ? error.message : String(error)));
        }
      }
    } else if (audioRef.current && speechData.audioUrl) {
      // Use audio file
      console.log('Using audio file playback');
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Audio playback error:', error);
          console.log('Falling back to browser TTS due to audio error');
          
          // Fallback to browser TTS if audio fails
          if (speechData.expandedText) {
            const utterance = new SpeechSynthesisUtterance(speechData.expandedText);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            utterance.lang = 'en-US';
            
            utterance.onstart = () => setIsPlaying(true);
            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = () => setIsPlaying(false);
            
            speechUtteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
          }
        });
      }
      setIsPlaying(!isPlaying);
    } else {
      console.log('No audio element or audio URL available, using browser TTS');
      
      // Fallback to browser TTS
      if (speechData.expandedText) {
        const utterance = new SpeechSynthesisUtterance(speechData.expandedText);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        utterance.lang = 'en-US';
        
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        speechUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="hf-glass rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="hf-speaker">
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-hf-cyan to-hf-magenta flex items-center justify-center">
              <span className="text-xs font-bold text-hf-ink-0">♪</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-hf-glass">Spoken Word</h3>
            <p className="text-xs text-hf-glass/60">
              {isGenerating ? 'Generating speech...' : 'AI voice narration'}
            </p>
          </div>
        </div>

        <motion.button
          onClick={handlePlayPause}
          disabled={!speechData || isGenerating}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`
            p-2 rounded-full transition-colors
            ${!speechData || isGenerating
              ? 'bg-hf-glass/10 text-hf-glass/40 cursor-not-allowed'
              : isPlaying
              ? 'bg-hf-magenta/20 text-hf-magenta'
              : 'bg-hf-cyan/20 text-hf-cyan hover:bg-hf-cyan/30'
            }
          `}
        >
          {isPlaying ? (
            <PauseIcon className="w-4 h-4" />
          ) : (
            <PlayIcon className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      {/* Expanded text display */}
      {speechData?.expandedText && (
        <div className="mb-3 p-3 bg-hf-glass/5 rounded-lg">
          <div className="text-sm text-hf-glass/80 leading-relaxed">
            <span className="text-hf-glass/60 text-xs block mb-1">Narration:</span>
            {speechData.expandedText}
          </div>
        </div>
      )}

      {/* Audio element */}
      {speechData?.audioUrl && (
        <audio
          ref={audioRef}
          src={speechData.audioUrl}
          preload="metadata"
          className="hidden"
        />
      )}

      {/* Progress bar */}
      <div className="relative mb-2">
        <div className="w-full h-2 bg-hf-glass/10 rounded-full overflow-hidden">
          {speechData?.useBrowserTTS ? (
            <motion.div
              className="h-full bg-gradient-to-r from-hf-cyan to-hf-magenta rounded-full"
              animate={{
                width: isPlaying ? '100%' : '0%',
              }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <motion.div
              className="h-full bg-gradient-to-r from-hf-cyan to-hf-magenta rounded-full"
              animate={{
                width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </div>
      </div>

      {/* Time display */}
      {!speechData?.useBrowserTTS && (
        <div className="flex justify-between text-xs text-hf-glass/60">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}

      {/* Voice info */}
      <div className="mt-3 pt-3 border-t border-hf-glass/20">
        <div className="flex items-center justify-between">
          <span className="text-xs text-hf-glass/60">Voice:</span>
          <span className="text-xs text-hf-cyan">
            {speechData?.useBrowserTTS ? 'Browser TTS (Fallback)' : 'BELLA'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
