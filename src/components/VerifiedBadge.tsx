import React from "react";

interface VerifiedBadgeProps {
  className?: string;
  size?: number | string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ className = "w-4 h-4", size }) => {
  // Dynamic 12-lobed scalloped rosette path
  const count = 12;
  const cx = 50;
  const cy = 50;
  const rOuter = 49;
  const rInner = 43;
  
  let path = "";
  for (let i = 0; i < count; i++) {
    const angle1 = (i * 2 * Math.PI) / count;
    const angle2 = ((i + 0.5) * 2 * Math.PI) / count;
    const angle3 = (((i + 1) * 2 * Math.PI) / count);

    const x1 = cx + rInner * Math.cos(angle1);
    const y1 = cy + rInner * Math.sin(angle1);
    const x2 = cx + rOuter * Math.cos(angle2);
    const y2 = cy + rOuter * Math.sin(angle2);
    const x3 = cx + rInner * Math.cos(angle3);
    const y3 = cy + rInner * Math.sin(angle3);

    if (i === 0) {
      path += `M ${x1} ${y1}`;
    }
    path += ` Q ${x2} ${y2} ${x3} ${y3}`;
  }
  path += " Z";

  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${className} inline-block shrink-0 select-none`}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer scalloped mint background */}
      <path d={path} fill="#10b981" />
      
      {/* Off-white light inner border circle matching the screenshot */}
      <circle cx="50" cy="50" r="32" fill="none" stroke="#f8fafc" strokeWidth="4" strokeOpacity="1" />
      
      {/* Innermost filled teal circle */}
      <circle cx="50" cy="50" r="26" fill="#10b981" />
      
      {/* Pristine checkmark in the center */}
      <path 
        d="M37 50 L46 59 M46 59 L63 42" 
        stroke="white" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
      />
    </svg>
  );
};
