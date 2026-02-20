"use client";

import type { CSSProperties } from "react";

const FIREWORK_GLYPHS = ["✨", "🎆", "🎇", "✦"] as const;

type Burst = {
  id: number;
  x: number;
  y: number;
};

type Particle = {
  id: string;
  x: number;
  y: number;
  tx: string;
  ty: string;
  delay: string;
  size: "sm" | "md" | "lg";
  style: "spark" | "glow";
  glyph: (typeof FIREWORK_GLYPHS)[number];
};

function makeParticles(burst: Burst): Particle[] {
  return Array.from({ length: 14 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 14;
    const distance = 28 + Math.random() * 46;
    const tx = `${Math.cos(angle) * distance}px`;
    const ty = `${Math.sin(angle) * distance}px`;
    const size: Particle["size"] = index % 4 === 0 ? "lg" : index % 2 === 0 ? "md" : "sm";
    const style: Particle["style"] = index % 3 === 0 ? "glow" : "spark";

    return {
      id: `${burst.id}-${index}`,
      x: burst.x,
      y: burst.y,
      tx,
      ty,
      delay: `${index * 12}ms`,
      size,
      style,
      glyph: FIREWORK_GLYPHS[index % FIREWORK_GLYPHS.length],
    };
  });
}

export function CoolMode({ bursts }: { bursts: Burst[] }) {
  const particles = bursts.flatMap(makeParticles);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[120] overflow-hidden">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className={`credit-firework-particle credit-firework-${particle.style} credit-firework-${particle.size}`}
          style={
            {
              left: particle.x,
              top: particle.y,
              "--tx": particle.tx,
              "--ty": particle.ty,
              "--delay": particle.delay,
            } as CSSProperties
          }
        >
          {particle.glyph}
        </span>
      ))}
    </div>
  );
}
