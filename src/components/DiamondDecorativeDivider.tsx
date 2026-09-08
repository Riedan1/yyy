import React from "react";

interface DiamondDecorativeDividerProps {
  className?: string;
  accentColor?: string;
  bgClassName?: string;
}

export const DiamondDecorativeDivider: React.FC<DiamondDecorativeDividerProps> = ({
  className = "my-2",
  accentColor = "#78350f",
  bgClassName = "bg-transparent"
}) => {
  return (
    <div className={`flex items-center justify-center w-full py-1 select-none pointer-events-none ${className}`}>
      {/* Left line */}
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-slate-500 dark:to-slate-500" />

      {/* Decorative center shield/diamonds */}
      <div className={`flex items-center gap-1.5 px-2.5 shrink-0 ${bgClassName}`}>
        <span className="w-0.5 h-0.5 rounded-full bg-slate-400 dark:bg-slate-500" />
        <span className="w-1 h-1 rounded-full bg-slate-500 dark:bg-slate-400" />
        <span className="w-1.5 h-1.5 rotate-45 border border-slate-400 dark:border-slate-500 bg-transparent shrink-0" />
        <span
          className="w-2.5 h-2.5 rotate-45 border shrink-0"
          style={{ borderColor: accentColor, backgroundColor: accentColor }}
        />
        <span className="w-1.5 h-1.5 rotate-45 border border-slate-400 dark:border-slate-500 bg-transparent shrink-0" />
        <span className="w-1 h-1 rounded-full bg-slate-500 dark:bg-slate-400" />
        <span className="w-0.5 h-0.5 rounded-full bg-slate-400 dark:bg-slate-500" />
      </div>

      {/* Right line */}
      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-slate-300 dark:via-slate-700 to-slate-500 dark:to-slate-500" />
    </div>
  );
};

export default DiamondDecorativeDivider;
