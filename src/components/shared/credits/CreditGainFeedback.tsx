"use client";

import { useEffect, useRef, useState } from "react";

import { CoolMode } from "@/components/ui/cool-mode";

type CreditEarnedDetail = {
  x: number;
  y: number;
};

type CreditEarnedEvent = CustomEvent<CreditEarnedDetail>;

type Burst = {
  id: number;
  x: number;
  y: number;
};

export const CREDIT_EARNED_EVENT = "budgetify:credit-earned";

function playCreditSound(audioContextRef: { current: AudioContext | null }) {
  const AudioContextClass =
    window.AudioContext ||
    (
      window as Window &
        typeof globalThis & { webkitAudioContext?: typeof AudioContext }
    ).webkitAudioContext;
  if (!AudioContextClass) return;

  const audioContext = audioContextRef.current ?? new AudioContextClass();
  audioContextRef.current = audioContext;

  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }

  const now = audioContext.currentTime;
  const master = audioContext.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.17, now + 0.02);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.46);
  master.connect(audioContext.destination);

  const scheduleTone = (
    frequency: number,
    startOffset: number,
    duration: number,
    type: OscillatorType
  ) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now + startOffset);
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency * 1.04,
      now + startOffset + duration
    );

    gain.gain.setValueAtTime(0.0001, now + startOffset);
    gain.gain.exponentialRampToValueAtTime(0.11, now + startOffset + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + duration);

    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(now + startOffset);
    oscillator.stop(now + startOffset + duration + 0.01);
  };

  // Celebratory arpeggio with a bright sparkle layer.
  scheduleTone(659.25, 0, 0.2, "triangle");
  scheduleTone(830.61, 0.08, 0.2, "triangle");
  scheduleTone(987.77, 0.16, 0.24, "triangle");
  scheduleTone(1318.51, 0.19, 0.22, "sine");
}

export function CreditGainFeedback() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timeoutIdsRef = useRef<number[]>([]);

  useEffect(() => {
    const onCreditEarned = (event: Event) => {
      const { x, y } = (event as CreditEarnedEvent).detail;
      const burstId = Date.now() + Math.random();
      const timeoutId = window.setTimeout(() => {
        setBursts((prev) => prev.filter((burst) => burst.id !== burstId));
      }, 900);

      setBursts((prev) => [...prev, { id: burstId, x, y }]);
      timeoutIdsRef.current.push(timeoutId);
      playCreditSound(audioContextRef);
    };

    window.addEventListener(CREDIT_EARNED_EVENT, onCreditEarned as EventListener);
    return () => {
      window.removeEventListener(CREDIT_EARNED_EVENT, onCreditEarned as EventListener);
      timeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutIdsRef.current = [];
    };
  }, []);

  return <CoolMode bursts={bursts} />;
}
