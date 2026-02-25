import { useRef, useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export type SoundType = 'cardPlace' | 'stockClick' | 'winCelebration';

function playSynth(ctx: AudioContext, type: SoundType) {
  const now = ctx.currentTime;

  switch (type) {
    case 'cardPlace': {
      // Short thud — noise burst through a lowpass filter
      const duration = 0.08;
      const bufferSize = Math.ceil(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      source.connect(filter).connect(gain).connect(ctx.destination);
      source.start(now);
      source.stop(now + duration);
      break;
    }

    case 'stockClick': {
      // Quick click — sine blip
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 900;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
    }

    case 'winCelebration': {
      // Ascending arpeggio — C5, E5, G5, C6
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const gain = ctx.createGain();
        const start = now + i * 0.12;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.25);
      });
      break;
    }
  }
}

export function useSound() {
  const { settings } = useSettings();
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback(
    (type: SoundType) => {
      if (!settings.soundEnabled) return;
      try {
        if (!ctxRef.current) {
          ctxRef.current = new AudioContext();
        }
        // Resume if suspended (browser autoplay policy)
        if (ctxRef.current.state === 'suspended') {
          ctxRef.current.resume();
        }
        playSynth(ctxRef.current, type);
      } catch {
        // Web Audio not supported or blocked
      }
    },
    [settings.soundEnabled]
  );

  return { play };
}
