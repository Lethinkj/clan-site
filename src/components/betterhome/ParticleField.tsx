"use client";

import { useEffect, useMemo } from "react";

interface Particle {
  id: number;
  left: string;
  bottom: string;
  size: number;
  duration: number;
  delay: number;
  type: "ember" | "cyan";
}

export default function ParticleField({ count = 40 }: { count?: number }) {
  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      bottom: `${Math.random() * -10}%`,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 10,
      type: Math.random() > 0.4 ? ("ember" as const) : ("cyan" as const),
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`particle ${
            p.type === "ember" ? "particle-ember" : "particle-cyan"
          }`}
          style={{
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
