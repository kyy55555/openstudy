"use client";

import { useState } from "react";

type Language = "en" | "zh";
const stops = [
  { x: 11, y: 72, color: "#c4b5fd", en: "Algorithms", zh: "算法" },
  { x: 18, y: 18, color: "#93c5fd", en: "Mathematics", zh: "数学" },
  { x: 82, y: 76, color: "#fdba74", en: "Physics", zh: "物理" },
  { x: 88, y: 18, color: "#6ee7b7", en: "AI", zh: "人工智能" },
] as const;
const stars = Array.from({ length: 180 }, (_, index) => ({
  x: (index * 47 + (index % 7) * 13) % 100,
  y: (index * 71 + (index % 11) * 7) % 100,
  radius: index % 19 === 0 ? 2.2 : index % 7 === 0 ? 1.35 : 0.7,
  opacity: 0.28 + (index % 6) * 0.11,
}));

export default function KnowledgeExplorer({ language }: { language: Language }) {
  const [activeStop, setActiveStop] = useState(0);
  const stop = stops[activeStop];
  const label = language === "zh" ? "点击探索者，飞向下一颗知识星" : "Select the explorer to fly toward another knowledge star";
  return <div className="knowledge-space" aria-label={language === "zh" ? "浩瀚的知识宇宙" : "A vast universe of knowledge"}>
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true" className="h-full w-full">
      <defs><radialGradient id="cosmos" cx="50%" cy="42%" r="78%"><stop offset="0" stopColor="#312e81" /><stop offset="0.48" stopColor="#111b4f" /><stop offset="1" stopColor="#050816" /></radialGradient><radialGradient id="violet-nebula"><stop offset="0" stopColor="#8b5cf6" stopOpacity="0.45" /><stop offset="1" stopColor="#8b5cf6" stopOpacity="0" /></radialGradient><radialGradient id="orange-nebula"><stop offset="0" stopColor="#f97316" stopOpacity="0.3" /><stop offset="1" stopColor="#f97316" stopOpacity="0" /></radialGradient><filter id="star-glow"><feGaussianBlur stdDeviation="7" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      <rect width="1440" height="900" fill="url(#cosmos)" /><ellipse cx="200" cy="220" rx="370" ry="260" fill="url(#violet-nebula)" /><ellipse cx="1250" cy="760" rx="420" ry="300" fill="url(#orange-nebula)" />
      {stars.map((star,index) => <circle className={index % 9 === 0 ? "knowledge-twinkle" : undefined} key={`${star.x}-${star.y}-${index}`} cx={star.x*14.4} cy={star.y*9} r={star.radius} fill={index % 13 === 0 ? "#c4b5fd" : index % 17 === 0 ? "#bae6fd" : "#fff"} opacity={star.opacity} style={{animationDelay:`${(index % 12) * -0.28}s`}} />)}
      <path d="M80 690 C230 610 320 220 470 265 S760 730 980 610 S1190 190 1360 225" fill="none" stroke="#ddd6fe" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 18" opacity="0.35" /><path d="M-40 470 C250 340 390 540 610 380 S1040 190 1490 430" fill="none" stroke="#60a5fa" strokeWidth="2" opacity="0.18" />
      {stops.map((item,index) => <g key={item.en} transform={`translate(${item.x*14.4} ${item.y*9})`} className="knowledge-float" style={{animationDelay:`${index*-1.1}s`}}><circle r={index%2?68:58} fill={item.color} opacity="0.08" filter="url(#star-glow)" /><circle r="22" fill={item.color} opacity="0.22" /><circle r="9" fill={item.color} /><text y={index%2?50:43} textAnchor="middle" fill="#f8fafc" fontSize="18" fontWeight="700" opacity="0.86">{language === "zh"?item.zh:item.en}</text></g>)}
      <g className="knowledge-float knowledge-float-slow" transform="translate(735 145)"><circle r="45" fill="#fef3c7" opacity="0.12" /><path d="M-36 4 C-18 -38 7 39 28 -7 S65 -19 75 11" fill="none" stroke="#fde68a" strokeWidth="5" strokeLinecap="round" /></g><g className="knowledge-float knowledge-float-reverse" transform="translate(300 780)"><path d="M-65 25 L0 -48 L66 25 L0 63 Z" fill="#67e8f9" opacity="0.16" /><path d="M-65 25 L0 -48 L66 25 L0 63 Z M0 -48 V63 M-65 25 H66" fill="none" stroke="#a5f3fc" strokeWidth="3" opacity="0.55" /></g>
      <g className="knowledge-wanderer" style={{transform:`translate(${stop.x*14.4}px, ${stop.y*9}px)`}}>
        <ellipse cx="0" cy="61" rx="48" ry="13" fill="#a78bfa" opacity="0.22" filter="url(#star-glow)" />
        <path d="M-24 1 Q-47 13 -42 48 L-20 50 L-10 7 Z" fill="#4c1d95" stroke="#c4b5fd" strokeWidth="3" />
        <path d="M-15 -11 Q-26 7 -23 48 Q0 60 23 47 Q27 9 14 -11 Z" fill="#f59e0b" stroke="#fff7ed" strokeWidth="3" />
        <path d="M-11 47 L-25 78 L-9 84 L3 55 L15 82 L31 76 L20 46" fill="#172554" stroke="#dbeafe" strokeWidth="4" strokeLinejoin="round" />
        <path d="M-20 5 Q-38 20 -48 39 M20 5 Q36 17 48 30" fill="none" stroke="#f8fafc" strokeWidth="9" strokeLinecap="round" />
        <path d="M-50 34 L-35 44 M44 26 L55 35" stroke="#f2c6a0" strokeWidth="8" strokeLinecap="round" />
        <circle cx="0" cy="-31" r="22" fill="#f2c6a0" stroke="#fff" strokeWidth="4" />
        <path d="M-20 -36 Q-9 -60 11 -50 Q27 -43 19 -25 Q12 -39 -3 -38 Q-13 -31 -20 -25 Z" fill="#312e81" />
        <circle cx="-7" cy="-31" r="2.2" fill="#172554" /><circle cx="8" cy="-31" r="2.2" fill="#172554" />
        <path d="M-5 -21 Q1 -17 7 -22" fill="none" stroke="#9a3412" strokeWidth="2" strokeLinecap="round" />
        <g transform="rotate(-10 54 28)"><path d="M34 18 Q51 11 66 19 L64 48 Q50 40 35 47 Z" fill="#fff7ed" stroke="#fde68a" strokeWidth="3" /><path d="M50 16 L50 43" stroke="#f59e0b" strokeWidth="2" /><path d="M39 25 L47 23 M54 23 L62 25" stroke="#a16207" strokeWidth="1.5" /></g>
        <path d="M-34 -1 Q-48 -21 -37 -34" fill="none" stroke="#a78bfa" strokeWidth="3" strokeDasharray="4 5" />
        <circle cx="-38" cy="-39" r="4" fill="#fde047" filter="url(#star-glow)" />
      </g>
    </svg>
    <button type="button" onClick={()=>setActiveStop(current=>(current+1)%stops.length)} className="knowledge-wander-button" aria-label={label} title={label} style={{left:`${stop.x}%`,top:`${stop.y}%`}}><span className="sr-only">{label}</span></button>
    <p className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-950/35 px-4 py-2 text-xs font-medium text-violet-100 backdrop-blur">{label}</p>
  </div>;
}
