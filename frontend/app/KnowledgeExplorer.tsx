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
      <defs><radialGradient id="cosmos" cx="50%" cy="42%" r="78%"><stop offset="0" stopColor="#312e81" /><stop offset="0.48" stopColor="#111b4f" /><stop offset="1" stopColor="#050816" /></radialGradient><radialGradient id="violet-nebula"><stop offset="0" stopColor="#8b5cf6" stopOpacity="0.45" /><stop offset="1" stopColor="#8b5cf6" stopOpacity="0" /></radialGradient><radialGradient id="orange-nebula"><stop offset="0" stopColor="#f97316" stopOpacity="0.3" /><stop offset="1" stopColor="#f97316" stopOpacity="0" /></radialGradient><linearGradient id="milky-way" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#38bdf8" stopOpacity="0" /><stop offset="0.48" stopColor="#c4b5fd" stopOpacity="0.16" /><stop offset="0.55" stopColor="#f8fafc" stopOpacity="0.2" /><stop offset="1" stopColor="#818cf8" stopOpacity="0" /></linearGradient><filter id="star-glow"><feGaussianBlur stdDeviation="7" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      <rect width="1440" height="900" fill="url(#cosmos)" /><g className="knowledge-nebula"><ellipse cx="200" cy="220" rx="370" ry="260" fill="url(#violet-nebula)" /><ellipse cx="1250" cy="760" rx="420" ry="300" fill="url(#orange-nebula)" /></g><path className="knowledge-milky-way" d="M-180 850 Q450 480 720 420 T1600 -40" fill="none" stroke="url(#milky-way)" strokeWidth="190" opacity="0.7" />
      <g className="knowledge-stars-far">{stars.filter((_,index)=>index%2===0).map((star,index) => <circle className={index % 9 === 0 ? "knowledge-twinkle" : undefined} key={`${star.x}-${star.y}-${index}`} cx={star.x*14.4} cy={star.y*9} r={star.radius} fill={index % 13 === 0 ? "#c4b5fd" : index % 17 === 0 ? "#bae6fd" : "#fff"} opacity={star.opacity} style={{animationDelay:`${(index % 12) * -0.28}s`}} />)}</g>
      <g className="knowledge-stars-near">{stars.filter((_,index)=>index%2===1).map((star,index) => <circle className={index % 7 === 0 ? "knowledge-twinkle" : undefined} key={`${star.x}-${star.y}-${index}-near`} cx={star.x*14.4} cy={star.y*9} r={star.radius} fill={index % 11 === 0 ? "#fef3c7" : "#fff"} opacity={star.opacity} style={{animationDelay:`${(index % 10) * -0.34}s`}} />)}</g>
      <g className="knowledge-constellations" fill="none" stroke="#bfdbfe" strokeWidth="1.4">
        <path d="M82 170 L132 116 L205 145 L260 92 L318 150" /><path d="M1120 118 L1174 160 L1240 105 L1302 154 L1370 112" /><path d="M1030 690 L1094 642 L1162 706 L1235 650 L1310 722" /><path d="M86 675 L146 623 L210 690 L276 636 L344 703" />
        {[82,132,205,260,318].map((x,index)=><circle key={`math-${x}`} cx={x} cy={[170,116,145,92,150][index]} r={index===3?4:2.4} fill="#bfdbfe" />)}
        {[1120,1174,1240,1302,1370].map((x,index)=><circle key={`ai-${x}`} cx={x} cy={[118,160,105,154,112][index]} r={index===2?4:2.4} fill="#a7f3d0" />)}
        {[1030,1094,1162,1235,1310].map((x,index)=><circle key={`physics-${x}`} cx={x} cy={[690,642,706,650,722][index]} r={index===1?4:2.4} fill="#fed7aa" />)}
        {[86,146,210,276,344].map((x,index)=><circle key={`algo-${x}`} cx={x} cy={[675,623,690,636,703][index]} r={index===2?4:2.4} fill="#ddd6fe" />)}
      </g>
      <g fill="#e0e7ff" fontFamily="Georgia, serif" fontSize="22" opacity="0.18"><text x="375" y="116">∫ f(x) dx</text><text x="985" y="245">E = mc²</text><text x="116" y="410">&lt;/&gt;</text><text x="1245" y="466">π</text><text x="465" y="760">∞</text><text x="850" y="805">Σ</text></g>
      <g transform="translate(1030 455)" fill="none" stroke="#a5f3fc" strokeWidth="2" opacity="0.16"><ellipse rx="46" ry="16" /><ellipse rx="46" ry="16" transform="rotate(60)" /><ellipse rx="46" ry="16" transform="rotate(120)" /><circle r="5" fill="#a5f3fc" /></g>
      <path d="M80 690 C230 610 320 220 470 265 S760 730 980 610 S1190 190 1360 225" fill="none" stroke="#ddd6fe" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 18" opacity="0.35" /><path d="M-40 470 C250 340 390 540 610 380 S1040 190 1490 430" fill="none" stroke="#60a5fa" strokeWidth="2" opacity="0.18" />
      {stops.map((item,index) => <g key={item.en} transform={`translate(${item.x*14.4} ${item.y*9})`} className="knowledge-float" style={{animationDelay:`${index*-1.1}s`}}><circle r={index%2?68:58} fill={item.color} opacity="0.08" filter="url(#star-glow)" /><circle r="22" fill={item.color} opacity="0.22" /><circle r="9" fill={item.color} /><text y={index%2?50:43} textAnchor="middle" fill="#f8fafc" fontSize="18" fontWeight="700" opacity="0.86">{language === "zh"?item.zh:item.en}</text></g>)}
      <g className="knowledge-float knowledge-float-slow" transform="translate(735 145)"><circle r="45" fill="#fef3c7" opacity="0.12" /><path d="M-36 4 C-18 -38 7 39 28 -7 S65 -19 75 11" fill="none" stroke="#fde68a" strokeWidth="5" strokeLinecap="round" /></g><g className="knowledge-float knowledge-float-reverse" transform="translate(300 780)"><path d="M-65 25 L0 -48 L66 25 L0 63 Z" fill="#67e8f9" opacity="0.16" /><path d="M-65 25 L0 -48 L66 25 L0 63 Z M0 -48 V63 M-65 25 H66" fill="none" stroke="#a5f3fc" strokeWidth="3" opacity="0.55" /></g>
      <g className="knowledge-wanderer" style={{transform:`translate(${stop.x*14.4}px, ${stop.y*9}px)`}}>
        <g className="knowledge-flyer">
          <ellipse cx="-16" cy="16" rx="58" ry="15" fill="#a78bfa" opacity="0.2" filter="url(#star-glow)" />
          <path d="M-31 -2 Q-55 -3 -67 13 L-47 31 L-20 15 Z" fill="#4c1d95" stroke="#c4b5fd" strokeWidth="3" />
          <path d="M-22 -8 Q-35 1 -31 24 Q-9 35 15 20 Q16 2 6 -10 Z" fill="#f59e0b" stroke="#fff7ed" strokeWidth="3" />
          <path d="M-25 20 Q-53 36 -74 45 M-8 27 Q-29 50 -49 62" fill="none" stroke="#172554" strokeWidth="12" strokeLinecap="round" />
          <path d="M-75 45 L-88 47 M-50 62 L-60 72" stroke="#dbeafe" strokeWidth="10" strokeLinecap="round" />
          <path d="M-25 0 Q-45 -17 -59 -14 M10 -1 Q28 4 39 14" fill="none" stroke="#f8fafc" strokeWidth="9" strokeLinecap="round" />
          <path d="M-63 -15 L-52 -8 M36 11 L47 18" stroke="#f2c6a0" strokeWidth="8" strokeLinecap="round" />
          <circle cx="14" cy="-28" r="20" fill="#f2c6a0" stroke="#fff" strokeWidth="4" />
          <path d="M-4 -33 Q5 -53 23 -46 Q38 -39 32 -23 Q23 -35 11 -33 Q3 -28 -4 -22 Z" fill="#312e81" />
          <circle cx="10" cy="-28" r="2" fill="#172554" /><circle cx="23" cy="-27" r="2" fill="#172554" />
          <path d="M12 -19 Q18 -15 23 -20" fill="none" stroke="#9a3412" strokeWidth="2" strokeLinecap="round" />
          <path d="M2 -8 Q-19 -23 -43 -30 Q-57 -34 -71 -27" fill="none" stroke="#fb7185" strokeWidth="7" strokeLinecap="round" />
          <path d="M-66 -28 L-85 -40 M-68 -25 L-91 -20" stroke="#fb7185" strokeWidth="4" strokeLinecap="round" />
          <g transform="translate(40 10) rotate(-14)"><path d="M0 0 Q15 -7 29 0 L28 25 Q14 18 1 24 Z" fill="#fff7ed" stroke="#fde68a" strokeWidth="3" /><path d="M14 -2 L14 21" stroke="#f59e0b" strokeWidth="2" /></g>
          <path d="M63 -2 Q75 -17 88 -5" fill="none" stroke="#a78bfa" strokeWidth="2" strokeDasharray="3 5" />
          <circle cx="92" cy="-7" r="4" fill="#fde047" filter="url(#star-glow)" />
        </g>
      </g>
    </svg>
    <button type="button" onClick={()=>setActiveStop(current=>(current+1)%stops.length)} className="knowledge-wander-button" aria-label={label} title={label} style={{left:`${stop.x}%`,top:`${stop.y}%`}}><span className="sr-only">{label}</span></button>
    <p className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-950/35 px-4 py-2 text-xs font-medium text-violet-100 backdrop-blur">{label}</p>
  </div>;
}
