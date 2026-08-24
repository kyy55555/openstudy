"use client";

import { useState } from "react";

type Language = "en" | "zh";

const stops = [
  { x: 19, y: 67, color: "#7c3aed" },
  { x: 39, y: 43, color: "#2563eb" },
  { x: 63, y: 61, color: "#ea580c" },
  { x: 81, y: 34, color: "#059669" },
] as const;

export default function KnowledgeExplorer({ language }: { language: Language }) {
  const [activeStop, setActiveStop] = useState(0);
  const stop = stops[activeStop];
  const label = language === "zh" ? "点击探索者，继续漫步" : "Select the explorer to keep wandering";

  function wander() {
    setActiveStop((current) => (current + 1) % stops.length);
  }

  return (
    <div className="knowledge-space" aria-label={language === "zh" ? "自由探索知识空间" : "A freely explorable knowledge space"}>
      <svg viewBox="0 0 1000 520" role="img" aria-hidden="true" className="h-full w-full">
        <defs>
          <linearGradient id="knowledge-sky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f5f3ff" />
            <stop offset="0.48" stopColor="#eff6ff" />
            <stop offset="1" stopColor="#fff7ed" />
          </linearGradient>
          <filter id="paper-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#312e81" floodOpacity="0.12" />
          </filter>
        </defs>
        <rect width="1000" height="520" rx="40" fill="url(#knowledge-sky)" />
        <path d="M58 388 C196 266 290 376 402 248 S628 180 752 272 S890 250 958 126" fill="none" stroke="#312e81" strokeWidth="5" strokeLinecap="round" strokeDasharray="4 18" opacity="0.55" />

        <g className="knowledge-float knowledge-float-slow" transform="translate(105 78)">
          <circle cx="48" cy="47" r="36" fill="#ede9fe" />
          <path d="M12 55 L42 29 L72 47 L98 18" fill="none" stroke="#6d28d9" strokeWidth="4" />
          {[[12,55],[42,29],[72,47],[98,18]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7" fill="#6d28d9" />)}
        </g>

        <g className="knowledge-float" transform="translate(360 82) rotate(-5)" filter="url(#paper-shadow)">
          <rect width="154" height="92" rx="16" fill="#ffffff" />
          <path d="M24 29 H128 M24 48 H104 M24 67 H119" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" opacity="0.75" />
        </g>

        <g className="knowledge-float knowledge-float-reverse" transform="translate(697 78)">
          <path d="M0 52 C28 2 55 102 84 52 S139 2 168 52" fill="none" stroke="#ea580c" strokeWidth="7" strokeLinecap="round" />
          <circle cx="0" cy="52" r="8" fill="#fb923c" /><circle cx="168" cy="52" r="8" fill="#fb923c" />
        </g>

        <g className="knowledge-float knowledge-float-slow" transform="translate(820 322) rotate(7)">
          <rect x="0" y="0" width="88" height="74" rx="12" fill="#fef3c7" />
          <rect x="54" y="42" width="86" height="70" rx="12" fill="#d1fae5" />
          <path d="M18 22 H65 M18 39 H56 M72 65 H120 M72 82 H109" stroke="#065f46" strokeWidth="4" strokeLinecap="round" opacity="0.65" />
        </g>

        <g transform="translate(545 345)">
          <path d="M0 42 L45 0 L90 42 L45 84 Z" fill="#bfdbfe" opacity="0.9" />
          <path d="M45 0 L45 84 M0 42 H90" stroke="#1d4ed8" strokeWidth="3" opacity="0.65" />
        </g>

        {stops.map((item, index) => <g key={item.x} transform={`translate(${item.x * 10} ${item.y * 5.2})`} opacity={activeStop === index ? 1 : 0.45}><circle r="18" fill={item.color} opacity="0.16" /><circle r="6" fill={item.color} /></g>)}

        <g className="knowledge-wanderer" style={{ transform: `translate(${stop.x * 10}px, ${stop.y * 5.2}px)` }}>
          <ellipse cx="0" cy="46" rx="35" ry="10" fill="#312e81" opacity="0.13" />
          <circle cx="0" cy="-23" r="17" fill="#111827" />
          <path d="M-15 -9 C-33 11 -28 40 -17 52 L20 52 C30 26 28 5 14 -9 Z" fill={stop.color} />
          <path d="M-12 50 L-24 82 M16 50 L29 79" stroke="#111827" strokeWidth="9" strokeLinecap="round" />
          <path d="M-19 6 L-46 30 M19 8 L43 20" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
          <path d="M31 12 L55 -7" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
          <path d="M42 -6 Q54 -19 68 -6 Q55 2 42 -6" fill="#fbbf24" stroke="#111827" strokeWidth="3" />
        </g>
      </svg>
      <button type="button" onClick={wander} className="knowledge-wander-button" aria-label={label} title={label} style={{ left: `${stop.x}%`, top: `${stop.y}%` }}>
        <span className="sr-only">{label}</span>
      </button>
      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/75 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur">{label}</p>
    </div>
  );
}
