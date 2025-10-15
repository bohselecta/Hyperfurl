// HyperFurl Interactive Hooks
// Drop-in JavaScript for enhanced interactions

// 1) Parallax tilt on hero console
export function initParallaxTilt() {
  const el = document.querySelector('.hf-tilt');
  if (!el) return;

  const max = 4; // deg

  const handlePointerMove = (e: Event) => {
    const pointerEvent = e as PointerEvent;
    const r = el.getBoundingClientRect();
    const px = (pointerEvent.clientX - r.left) / r.width - 0.5;
    const py = (pointerEvent.clientY - r.top) / r.height - 0.5;
    (el as HTMLElement).style.transform = `rotateY(${px * max}deg) rotateX(${-(py * max)}deg)`;
  };

  const handlePointerLeave = () => {
    (el as HTMLElement).style.transform = 'rotateY(0) rotateX(0)';
  };

  el.addEventListener('pointermove', handlePointerMove);
  el.addEventListener('pointerleave', handlePointerLeave);

  return () => {
    el.removeEventListener('pointermove', handlePointerMove);
    el.removeEventListener('pointerleave', handlePointerLeave);
  };
}

// 2) Audio-reactive speaker glow
export function initAudioReactiveSpeakers() {
  const speakers = document.querySelectorAll('.hf-speaker');
  if (speakers.length === 0) return;

  // Create audio context and analyser
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioContext = new AudioContextClass();
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // Create a simple oscillator for demo purposes
  // In a real app, this would connect to actual audio
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(analyser);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

  oscillator.start();

  function updateGlow() {
    analyser.getByteFrequencyData(dataArray);

    // Calculate RMS (Root Mean Square) for overall volume
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += (dataArray[i] / 255) ** 2;
    }
    const rms = Math.sqrt(sum / bufferLength);

    // Apply glow effect
    const cyanIntensity = Math.round(22 * rms);
    const magentaIntensity = Math.round(22 * rms);

    const cyanGlow = `0 0 ${cyanIntensity}px rgba(98,225,255,${0.55 * rms})`;
    const magentaGlow = `0 0 ${magentaIntensity}px rgba(255,113,201,${0.45 * rms})`;

    speakers.forEach(speaker => {
      (speaker as HTMLElement).style.boxShadow = `
        inset 0 0 12px rgba(0,0,0,.6),
        ${cyanGlow},
        ${magentaGlow}
      `;
    });

    requestAnimationFrame(updateGlow);
  }

  updateGlow();

  return () => {
    oscillator.stop();
    audioContext.close();
  };
}

// 3) Trigger ripples on UNFURL
export function initRippleEffects() {
  const unfurlButton = document.querySelector('#unfurl');
  if (!unfurlButton) return;

  const handleClick = () => {
    const ripplesContainer = document.querySelector('.hf-ripples');
    if (!ripplesContainer) return;

    // Create ripple elements
    const ripple1 = document.createElement('span');
    const ripple2 = document.createElement('span');
    const ripple3 = document.createElement('span');

    ripplesContainer.appendChild(ripple1);
    ripplesContainer.appendChild(ripple2);
    ripplesContainer.appendChild(ripple3);

    // Remove ripples after animation
    setTimeout(() => {
      [ripple1, ripple2, ripple3].forEach(ripple => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      });
    }, 1100);
  };

  unfurlButton.addEventListener('click', handleClick);

  return () => {
    unfurlButton.removeEventListener('click', handleClick);
  };
}

// 4) Breathing animation for UI elements
export function initBreathingElements() {
  const breathingElements = document.querySelectorAll('.hf-breathe');
  if (breathingElements.length === 0) return;

  // Breathing elements already have CSS animation
  // This is just for potential runtime control
  return () => {
    // Cleanup if needed
  };
}

// 5) Initialize all hooks
export function initHyperFurlHooks() {
  const cleanupFunctions = [
    initParallaxTilt(),
    initAudioReactiveSpeakers(),
    initRippleEffects(),
    initBreathingElements(),
  ].filter(Boolean);

  return () => {
    cleanupFunctions.forEach(cleanup => cleanup?.());
  };
}

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initHyperFurlHooks();
  });
}
