"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type Language = "en" | "zh";
const stops = [
  { x: 24, y: 60, color: "#c4b5fd", en: "Algorithms", zh: "算法" },
  { x: 18, y: 18, color: "#93c5fd", en: "Mathematics", zh: "数学" },
  { x: 78, y: 63, color: "#fdba74", en: "Physics", zh: "物理" },
  { x: 88, y: 18, color: "#6ee7b7", en: "AI", zh: "人工智能" },
] as const;
const stars = Array.from({ length: 180 }, (_, index) => ({
  x: (index * 47 + (index % 7) * 13) % 100,
  y: (index * 71 + (index % 11) * 7) % 100,
  radius: index % 19 === 0 ? 2.2 : index % 7 === 0 ? 1.35 : 0.7,
  opacity: 0.28 + (index % 6) * 0.11,
}));

function LivingStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    let animation = 0;
    const points = Array.from({ length: 720 }, (_, index) => ({
      x: ((index * 73 + (index % 17) * 29) % 997) / 997,
      y: ((index * 151 + (index % 23) * 37) % 991) / 991,
      depth: 0.25 + ((index * 19) % 75) / 100,
      phase: (index * 0.83) % (Math.PI * 2),
      tint: index % 19 === 0 ? "176, 221, 255" : index % 29 === 0 ? "221, 214, 254" : "244, 248, 255",
    }));

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const draw = () => {
      context.clearRect(0, 0, width, height);
      const sky = context.createRadialGradient(width * 0.5, height * 0.44, 20, width * 0.5, height * 0.5, Math.max(width, height) * 0.8);
      sky.addColorStop(0, "#152966"); sky.addColorStop(0.48, "#091637"); sky.addColorStop(1, "#02040d");
      context.fillStyle = sky; context.fillRect(0, 0, width, height);
      const time = frame * 0.004;
      points.forEach((point, index) => {
        const driftX = Math.sin(time * point.depth + point.phase) * 10 * point.depth;
        const driftY = Math.cos(time * 0.7 + point.phase) * 5 * point.depth;
        const x = (point.x * width + driftX + width) % width;
        const y = (point.y * height + driftY + height) % height;
        const pulse = 0.68 + Math.sin(time * 2 + point.phase) * 0.27;
        const radius = 0.35 + point.depth * (index % 41 === 0 ? 2.5 : 1.15);
        if (index % 41 === 0) {
          const glow = context.createRadialGradient(x, y, 0, x, y, radius * 6);
          glow.addColorStop(0, `rgba(${point.tint},${0.65 * pulse})`); glow.addColorStop(1, `rgba(${point.tint},0)`);
          context.fillStyle = glow; context.beginPath(); context.arc(x, y, radius * 6, 0, Math.PI * 2); context.fill();
        }
        context.fillStyle = `rgba(${point.tint},${Math.max(0.18, pulse)})`;
        context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2); context.fill();
      });
      frame += 1;
      if (!reduceMotion) animation = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener("resize", resize);
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animation); };
  }, []);

  return <canvas ref={canvasRef} className="knowledge-star-canvas" aria-hidden="true" />;
}

export default function KnowledgeExplorer({ language }: { language: Language }) {
  return <div className="knowledge-space" aria-label={language === "zh" ? "浩瀚的知识宇宙" : "A vast universe of knowledge"}>
    <LivingStarfield />
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true" className="h-full w-full">
      <defs><radialGradient id="cosmos" cx="50%" cy="42%" r="78%"><stop offset="0" stopColor="#312e81" /><stop offset="0.48" stopColor="#111b4f" /><stop offset="1" stopColor="#050816" /></radialGradient><radialGradient id="violet-nebula"><stop offset="0" stopColor="#8b5cf6" stopOpacity="0.45" /><stop offset="1" stopColor="#8b5cf6" stopOpacity="0" /></radialGradient><radialGradient id="orange-nebula"><stop offset="0" stopColor="#f97316" stopOpacity="0.3" /><stop offset="1" stopColor="#f97316" stopOpacity="0" /></radialGradient><linearGradient id="milky-way" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#38bdf8" stopOpacity="0" /><stop offset="0.48" stopColor="#c4b5fd" stopOpacity="0.16" /><stop offset="0.55" stopColor="#f8fafc" stopOpacity="0.2" /><stop offset="1" stopColor="#818cf8" stopOpacity="0" /></linearGradient><filter id="star-glow"><feGaussianBlur stdDeviation="7" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      <rect width="1440" height="900" fill="url(#cosmos)" opacity="0.23" /><g className="knowledge-nebula"><ellipse cx="200" cy="220" rx="370" ry="260" fill="url(#violet-nebula)" opacity="0.45" /><ellipse cx="1250" cy="760" rx="420" ry="300" fill="url(#orange-nebula)" opacity="0.35" /></g><path className="knowledge-milky-way" d="M-180 850 Q450 480 720 420 T1600 -40" fill="none" stroke="url(#milky-way)" strokeWidth="190" opacity="0.45" />
      <g className="knowledge-stars-near">{stars.filter((_,index)=>index%5===0).map((star,index) => <circle className={index % 7 === 0 ? "knowledge-twinkle" : undefined} key={`${star.x}-${star.y}-${index}-near`} cx={star.x*14.4} cy={star.y*9} r={star.radius} fill={index % 11 === 0 ? "#fef3c7" : "#fff"} opacity={star.opacity} style={{animationDelay:`${(index % 10) * -0.34}s`}} />)}</g>
      <g className="knowledge-constellations" fill="none" stroke="#bfdbfe" strokeWidth="1.4">
        <path d="M82 170 L132 116 L205 145 L260 92 L318 150" /><path d="M1120 118 L1174 160 L1240 105 L1302 154 L1370 112" /><path d="M1030 690 L1094 642 L1162 706 L1235 650 L1310 722" /><path d="M86 675 L146 623 L210 690 L276 636 L344 703" />
        {[82,132,205,260,318].map((x,index)=><circle key={`math-${x}`} cx={x} cy={[170,116,145,92,150][index]} r={index===3?4:2.4} fill="#bfdbfe" />)}
        {[1120,1174,1240,1302,1370].map((x,index)=><circle key={`ai-${x}`} cx={x} cy={[118,160,105,154,112][index]} r={index===2?4:2.4} fill="#a7f3d0" />)}
        {[1030,1094,1162,1235,1310].map((x,index)=><circle key={`physics-${x}`} cx={x} cy={[690,642,706,650,722][index]} r={index===1?4:2.4} fill="#fed7aa" />)}
        {[86,146,210,276,344].map((x,index)=><circle key={`algo-${x}`} cx={x} cy={[675,623,690,636,703][index]} r={index===2?4:2.4} fill="#ddd6fe" />)}
      </g>
      <g fill="#e0e7ff" fontFamily="Georgia, serif" fontSize="22" opacity="0.18"><text x="375" y="116">∫ f(x) dx</text><text x="985" y="245">E = mc²</text><text x="116" y="410">&lt;/&gt;</text><text x="1245" y="466">π</text><text x="465" y="760">∞</text><text x="850" y="805">Σ</text></g>
      <g className="knowledge-whispers" fill="#dbeafe" fontSize="14" fontWeight="600" letterSpacing="2">
        <text x="390" y="205">{language === "zh" ? "概率" : "PROBABILITY"}</text><text x="735" y="105">{language === "zh" ? "线性代数" : "LINEAR ALGEBRA"}</text><text x="1120" y="350">{language === "zh" ? "机器学习" : "MACHINE LEARNING"}</text><text x="103" y="520">{language === "zh" ? "编程" : "PROGRAMMING"}</text><text x="395" y="805">{language === "zh" ? "计算机系统" : "COMPUTER SYSTEMS"}</text><text x="930" y="795">{language === "zh" ? "化学" : "CHEMISTRY"}</text>
      </g>
      <g transform="translate(1030 455)" fill="none" stroke="#a5f3fc" strokeWidth="2" opacity="0.16"><ellipse rx="46" ry="16" /><ellipse rx="46" ry="16" transform="rotate(60)" /><ellipse rx="46" ry="16" transform="rotate(120)" /><circle r="5" fill="#a5f3fc" /></g>
      <path d="M80 690 C230 610 320 220 470 265 S760 730 980 610 S1190 190 1360 225" fill="none" stroke="#ddd6fe" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 18" opacity="0.35" /><path d="M-40 470 C250 340 390 540 610 380 S1040 190 1490 430" fill="none" stroke="#60a5fa" strokeWidth="2" opacity="0.18" />
      {stops.map((item,index) => <g key={item.en} transform={`translate(${item.x*14.4} ${item.y*9})`} className="knowledge-float" style={{animationDelay:`${index*-1.1}s`}}><circle r={index%2?68:58} fill={item.color} opacity="0.08" filter="url(#star-glow)" /><circle r="22" fill={item.color} opacity="0.22" /><circle r="9" fill={item.color} /><text y={index%2?50:43} textAnchor="middle" fill="#f8fafc" fontSize="18" fontWeight="700" opacity="0.86">{language === "zh"?item.zh:item.en}</text></g>)}
      <g className="knowledge-float knowledge-float-slow" transform="translate(735 145)"><circle r="45" fill="#fef3c7" opacity="0.12" /><path d="M-36 4 C-18 -38 7 39 28 -7 S65 -19 75 11" fill="none" stroke="#fde68a" strokeWidth="5" strokeLinecap="round" /></g><g className="knowledge-float knowledge-float-reverse" transform="translate(300 780)"><path d="M-65 25 L0 -48 L66 25 L0 63 Z" fill="#67e8f9" opacity="0.16" /><path d="M-65 25 L0 -48 L66 25 L0 63 Z M0 -48 V63 M-65 25 H66" fill="none" stroke="#a5f3fc" strokeWidth="3" opacity="0.55" /></g>
    </svg>
    <div className="knowledge-lamb-lookout" aria-hidden="true"><Image className="knowledge-lamb-scene" src="/art/knowledge-lamb-lookout-v3.png" width={512} height={768} sizes="(max-width: 640px) 112px, 144px" loading="eager" alt="" /></div>
  </div>;
}
