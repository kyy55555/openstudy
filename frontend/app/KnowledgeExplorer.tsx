"use client";

import { useState } from "react";

type Language = "en" | "zh";
const stops = [
  { x: 14, y: 70, color: "#c4b5fd", en: "Algorithms", zh: "算法" },
  { x: 31, y: 29, color: "#93c5fd", en: "Mathematics", zh: "数学" },
  { x: 68, y: 67, color: "#fdba74", en: "Physics", zh: "物理" },
  { x: 85, y: 25, color: "#6ee7b7", en: "AI", zh: "人工智能" },
] as const;
const stars = [[6,14,2],[12,34,1],[19,8,1.5],[25,56,1],[37,14,2],[44,76,1.5],[51,22,1],[58,47,2],[64,9,1],[73,38,1.5],[78,82,2],[91,55,1],[96,12,1.5],[4,86,1],[48,91,1],[93,91,2]] as const;

export default function KnowledgeExplorer({ language }: { language: Language }) {
  const [activeStop, setActiveStop] = useState(0);
  const stop = stops[activeStop];
  const label = language === "zh" ? "点击探索者，飞向下一颗知识星" : "Select the explorer to fly toward another knowledge star";
  return <div className="knowledge-space" aria-label={language === "zh" ? "浩瀚的知识宇宙" : "A vast universe of knowledge"}>
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true" className="h-full w-full">
      <defs><radialGradient id="cosmos" cx="50%" cy="42%" r="78%"><stop offset="0" stopColor="#312e81" /><stop offset="0.48" stopColor="#111b4f" /><stop offset="1" stopColor="#050816" /></radialGradient><radialGradient id="violet-nebula"><stop offset="0" stopColor="#8b5cf6" stopOpacity="0.45" /><stop offset="1" stopColor="#8b5cf6" stopOpacity="0" /></radialGradient><radialGradient id="orange-nebula"><stop offset="0" stopColor="#f97316" stopOpacity="0.3" /><stop offset="1" stopColor="#f97316" stopOpacity="0" /></radialGradient><filter id="star-glow"><feGaussianBlur stdDeviation="7" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      <rect width="1440" height="900" fill="url(#cosmos)" /><ellipse cx="200" cy="220" rx="370" ry="260" fill="url(#violet-nebula)" /><ellipse cx="1250" cy="760" rx="420" ry="300" fill="url(#orange-nebula)" />
      {stars.map(([x,y,r]) => <circle key={`${x}-${y}`} cx={x*14.4} cy={y*9} r={r} fill="#fff" opacity={0.45+r/6} />)}
      <path d="M80 690 C230 610 320 220 470 265 S760 730 980 610 S1190 190 1360 225" fill="none" stroke="#ddd6fe" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 18" opacity="0.35" /><path d="M-40 470 C250 340 390 540 610 380 S1040 190 1490 430" fill="none" stroke="#60a5fa" strokeWidth="2" opacity="0.18" />
      {stops.map((item,index) => <g key={item.en} transform={`translate(${item.x*14.4} ${item.y*9})`} className="knowledge-float" style={{animationDelay:`${index*-1.1}s`}}><circle r={index%2?68:58} fill={item.color} opacity="0.08" filter="url(#star-glow)" /><circle r="22" fill={item.color} opacity="0.22" /><circle r="9" fill={item.color} /><text y={index%2?50:43} textAnchor="middle" fill="#f8fafc" fontSize="18" fontWeight="700" opacity="0.86">{language === "zh"?item.zh:item.en}</text></g>)}
      <g className="knowledge-float knowledge-float-slow" transform="translate(735 145)"><circle r="45" fill="#fef3c7" opacity="0.12" /><path d="M-36 4 C-18 -38 7 39 28 -7 S65 -19 75 11" fill="none" stroke="#fde68a" strokeWidth="5" strokeLinecap="round" /></g><g className="knowledge-float knowledge-float-reverse" transform="translate(300 780)"><path d="M-65 25 L0 -48 L66 25 L0 63 Z" fill="#67e8f9" opacity="0.16" /><path d="M-65 25 L0 -48 L66 25 L0 63 Z M0 -48 V63 M-65 25 H66" fill="none" stroke="#a5f3fc" strokeWidth="3" opacity="0.55" /></g>
      <g className="knowledge-wanderer" style={{transform:`translate(${stop.x*14.4}px, ${stop.y*9}px)`}}><ellipse cx="0" cy="53" rx="42" ry="12" fill="#c4b5fd" opacity="0.18" filter="url(#star-glow)" /><circle cx="0" cy="-28" r="17" fill="#f8fafc" /><path d="M-15 -13 C-33 7 -28 39 -17 53 L20 53 C30 25 28 2 14 -13 Z" fill="#f97316" /><path d="M-12 51 L-27 84 M16 51 L31 82 M-19 3 L-48 27 M19 5 L46 16" stroke="#f8fafc" strokeWidth="9" strokeLinecap="round" /><path d="M31 8 L58 -13" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" /><path d="M44 -12 Q57 -27 73 -12 Q58 -2 44 -12" fill="#fde047" stroke="#f8fafc" strokeWidth="3" /></g>
    </svg>
    <button type="button" onClick={()=>setActiveStop(current=>(current+1)%stops.length)} className="knowledge-wander-button" aria-label={label} title={label} style={{left:`${stop.x}%`,top:`${stop.y}%`}}><span className="sr-only">{label}</span></button>
    <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-slate-950/40 px-4 py-2 text-xs font-medium text-violet-100 shadow-lg backdrop-blur">{label}</p>
  </div>;
}
