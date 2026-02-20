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

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(740, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(1180, audioContext.currentTime + 0.12);

  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.16);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.18);
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
