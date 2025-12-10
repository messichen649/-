import React from 'react';
import { ValveMode, ValveFault } from '../types';

interface ValveAnimationProps {
  mode: ValveMode;
  fault: ValveFault;
}

const ValveAnimation: React.FC<ValveAnimationProps> = ({ mode, fault }) => {
  // Logic to determine physical state based on Mode + Fault
  
  // Coil is only energized if we want Heating AND the coil isn't burnt
  const isCoilEnergized = mode === ValveMode.HEATING && fault !== 'COIL_BURN';
  
  // Slider Position:
  // 0 = Heating Pos (Right - but in previous logic logic was reversed? Let's check existing code)
  // In previous code: 
  //   isCooling (Mode=Cooling) -> translate(100,0) (Right side)
  //   !isCooling (Mode=Heating) -> translate(0,0) (Left side)
  
  // Let's standardize:
  // Default (De-energized/Cooling) -> Piston pushed to one side (say Right, translate 100)
  // Energized (Heating) -> Piston pushed to other side (say Left, translate 0)
  
  // Wait, let's re-read previous logic:
  // transform={`translate(${isCooling ? 100 : 0}, 0)`}
  // isCooling = true -> 100 (Right). D connects to E (Left port)? 
  // If slider is Right (100):
  //    Middle Piston Head is at 220+100 = 320. 
  //    Left Piston Head is at 60+100 = 160.
  //    Gap is between 180 and 320.
  //    Ports: E(85), S(185), C(285).
  //    If slider is Right: S(185) connects to Left side E(85)? No.
  
  // Let's stick to the visual output which worked:
  // isCooling = true -> translate(100, 0).
  // isHeating = false -> translate(0, 0).
  
  let sliderTranslateX = 0;
  if (fault === 'VALVE_STUCK') {
    sliderTranslateX = 50; // Stuck in middle
  } else if (isCoilEnergized) {
    sliderTranslateX = 0; // Heating position
  } else {
    sliderTranslateX = 100; // Cooling/Default position
  }

  // Colors
  const colorHot = '#ef4444'; // Red-500
  const colorCold = '#3b82f6'; // Blue-500
  const colorMixed = '#a855f7'; // Purple-500 (for mixed gas)
  const colorCopper = '#d97706'; // Amber-600
  const colorMetal = '#94a3b8'; // Slate-400

  // Pipe Colors
  let pipeLeftColor = colorMetal; // Default
  let pipeRightColor = colorMetal; // Default

  if (fault === 'VALVE_STUCK') {
      pipeLeftColor = colorMixed;
      pipeRightColor = colorMixed;
  } else if (isCoilEnergized) {
      // Heating: Left=Hot, Right=Cold
      pipeLeftColor = colorHot; // Outdoor becomes Evap? No, Heating: Outdoor is Evap(Cold), Indoor is Cond(Hot).
      // Wait, let's check standard cycle.
      // Heating: Discharge(Hot) -> Indoor. So Indoor pipe should be Hot.
      // Previous code: !isCooling -> pipeRightColor = Hot. Correct.
      pipeRightColor = colorHot; 
      pipeLeftColor = colorCold;
  } else {
      // Cooling: Discharge(Hot) -> Outdoor.
      pipeLeftColor = colorHot;
      pipeRightColor = colorCold;
  }

  return (
    <div className="w-full aspect-square max-w-lg mx-auto bg-slate-100 rounded-xl border border-slate-200 shadow-inner p-4 relative overflow-hidden">
      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-lg">
        <defs>
          <marker id="arrowHot" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill={colorHot} />
          </marker>
          <marker id="arrowCold" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill={colorCold} />
          </marker>
          <marker id="arrowMixed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill={colorMixed} />
          </marker>
          <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="10" style={{stroke:colorMetal, strokeWidth:1}} />
          </pattern>
        </defs>

        {/* --- PIPES OUTSIDE VALVE --- */}
        
        {/* Top Pipe (From Compressor) - Always Hot */}
        <path d="M200 20 L200 120" fill="none" stroke={colorHot} strokeWidth="12" markerEnd="url(#arrowHot)" />
        <text x="205" y="40" className="text-[10px] fill-slate-500">来自压缩机 (D)</text>

        {/* Bottom Middle Pipe (To Compressor) - S */}
        {/* If stuck, return gas is mixed/hot (bad for compressor) */}
        <path d="M200 280 L200 380" fill="none" stroke={fault === 'VALVE_STUCK' ? colorMixed : colorCold} strokeWidth="12" markerEnd={`url(#${fault === 'VALVE_STUCK' ? 'arrowMixed' : 'arrowCold'})`} />
        <text x="205" y="370" className="text-[10px] fill-slate-500">回压缩机 (S)</text>

        {/* Left Pipe (Outdoor Unit) */}
        <path d="M100 280 L100 340 L40 340" fill="none" stroke={pipeLeftColor} strokeWidth="12" className="transition-colors duration-1000" />
        <text x="40" y="330" className="text-[12px] font-bold fill-slate-700">室外机管道 (E)</text>

        {/* Right Pipe (Indoor Unit) */}
        <path d="M300 280 L300 340 L360 340" fill="none" stroke={pipeRightColor} strokeWidth="12" className="transition-colors duration-1000" />
        <text x="290" y="330" className="text-[12px] font-bold fill-slate-700">室内机管道 (C)</text>

        {/* --- VALVE BODY --- */}
        <rect x="60" y="120" width="280" height="160" rx="10" fill="url(#diagonalHatch)" stroke={colorMetal} strokeWidth="4" />
        
        {/* Connection Ports */}
        <rect x="185" y="110" width="30" height="20" fill={colorCopper} />
        <rect x="85" y="270" width="30" height="20" fill={colorCopper} />
        <rect x="185" y="270" width="30" height="20" fill={colorCopper} />
        <rect x="285" y="270" width="30" height="20" fill={colorCopper} />

        {/* --- INTERNAL SLIDER --- */}
        <g 
          className="transition-all duration-1000 ease-in-out" 
          transform={`translate(${sliderTranslateX}, 0)`}
        >
            {/* Slider Mechanism Visual */}
            <path 
                d="M100 240 Q150 200 200 240 L200 280 L100 280 Z" 
                fill={fault === 'VALVE_STUCK' ? colorMixed : colorCold} 
                opacity="0.8"
                stroke="#1e3a8a" 
                strokeWidth="2"
            />
            {/* Piston Heads */}
            <rect x="60" y="160" width="20" height="80" fill="#334155" rx="2" />
            <rect x="220" y="160" width="20" height="80" fill="#334155" rx="2" />
            {/* Connecting Rod */}
            <line x1="80" y1="200" x2="220" y2="200" stroke="#334155" strokeWidth="8" />
        </g>

        {/* --- FLOW ARROWS --- */}
        
        {/* Stuck Mode Flow: Chaos/Mixing */}
        {fault === 'VALVE_STUCK' && (
             <g>
                <path d="M200 130 Q180 200 150 250" fill="none" stroke={colorHot} strokeWidth="4" strokeDasharray="5,5" className="animate-flow-fast opacity-60" />
                <path d="M200 130 Q220 200 250 250" fill="none" stroke={colorHot} strokeWidth="4" strokeDasharray="5,5" className="animate-flow-fast opacity-60" />
                <circle cx="200" cy="270" r="10" fill={colorMixed} className="animate-ping opacity-50" />
                <text x="160" y="260" className="text-[12px] font-bold fill-purple-700">串气 (Leakage)</text>
             </g>
        )}

        {/* Normal Cooling Flow (Slider Right) */}
        {!isCoilEnergized && fault !== 'VALVE_STUCK' && (
             <g>
                <path d="M200 130 Q150 160 100 270" fill="none" stroke={colorHot} strokeWidth="4" strokeDasharray="10,5" className="animate-flow-fast opacity-60" />
                <path d="M300 270 Q250 230 200 270" fill="none" stroke={colorCold} strokeWidth="4" strokeDasharray="10,5" className="animate-flow-fast opacity-60" />
             </g>
        )}

        {/* Normal Heating Flow (Slider Left) */}
        {isCoilEnergized && fault !== 'VALVE_STUCK' && (
            <g>
                <path d="M200 130 Q250 160 300 270" fill="none" stroke={colorHot} strokeWidth="4" strokeDasharray="10,5" className="animate-flow-fast opacity-60" />
                <path d="M100 270 Q150 230 200 270" fill="none" stroke={colorCold} strokeWidth="4" strokeDasharray="10,5" className="animate-flow-fast opacity-60" />
            </g>
        )}

        {/* --- PILOT VALVE & COIL INDICATOR --- */}
        <g transform="translate(160, 80)">
             <path d="M-60 20 L-60 40" stroke={colorMetal} strokeWidth="2" />
             <path d="M140 20 L140 40" stroke={colorMetal} strokeWidth="2" />
             <rect x="0" y="0" width="80" height="25" rx="2" fill="#cbd5e1" stroke={colorMetal} />
             
             {/* Coil Visual */}
             <rect 
               x="80" y="-5" width="30" height="35" rx="2" 
               fill={isCoilEnergized ? '#f59e0b' : '#94a3b8'} 
               stroke={isCoilEnergized ? '#b45309' : '#64748b'}
               className="transition-colors duration-500"
             />
             <path d="M95 -5 L95 -15" stroke={isCoilEnergized ? '#b45309' : '#64748b'} strokeWidth="2" />
             
             {/* Text Indicators */}
             <text x="120" y="15" className={`text-[10px] font-bold ${isCoilEnergized ? 'fill-amber-600' : 'fill-slate-500'}`}>
               {isCoilEnergized ? '线圈通电 (ON)' : '线圈断电 (OFF)'}
             </text>
             {fault === 'COIL_BURN' && (
                 <g>
                    <line x1="80" y1="-5" x2="110" y2="30" stroke="red" strokeWidth="2" />
                    <line x1="110" y1="-5" x2="80" y2="30" stroke="red" strokeWidth="2" />
                    <text x="120" y="30" className="text-[10px] fill-red-600 font-bold">线圈烧毁!</text>
                 </g>
             )}
        </g>

      </svg>
      
      {/* Legend */}
      <div className="absolute top-2 left-2 bg-white/90 p-2 rounded text-xs shadow-sm border">
        <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>高压/高温</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>低压/低温</span>
        </div>
        {fault === 'VALVE_STUCK' && (
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>混合气体 (失效)</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default ValveAnimation;