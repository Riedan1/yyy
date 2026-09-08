import React from "react";

interface YumeProductCardSkeletonProps {
  key?: any;
  isListMode?: boolean;
}

export default function YumeProductCardSkeleton({
  isListMode = false,
}: YumeProductCardSkeletonProps) {
  return (
    <div className="flex flex-col gap-2.5 relative bg-transparent border-0 p-0 select-none text-left w-full overflow-hidden">
      {/* Aspect-Ratio Box containing shimmer */}
      <div className="aspect-[4/5] w-full rounded-[16px] overflow-hidden bg-stone-100 dark:bg-slate-900 border border-stone-150/40 dark:border-slate-800/60 relative shadow-sm flex items-center justify-center">
        {/* Shimmer gradient overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-200/40 dark:via-slate-800/40 to-transparent -translate-x-full" 
          style={{ 
            animation: "shimmer 1.5s infinite",
            backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(220, 220, 220, 0.4) 50%, transparent 100%)"
          }} 
        />
        {/* Heart icon outline placeholder in top-right */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-200/60 dark:bg-slate-800/80 animate-pulse" />
        {/* Compare tag placeholder in top-left */}
        <div className="absolute top-3 left-3 w-12 h-6 rounded-full bg-stone-200/60 dark:bg-slate-800/80 animate-pulse" />
      </div>

      {/* Description Meta Section Block */}
      <div className="flex flex-col text-left px-1 gap-1.5 w-full">
        {/* Title placeholder */}
        <div className="h-4 w-4/5 bg-stone-200/80 dark:bg-slate-800 rounded-md animate-pulse mt-1" />
        
        {/* Price and Cart Row */}
        <div className="flex items-center justify-between mt-1 w-full">
          <div className="flex items-center gap-2">
            {/* Price currency placeholder */}
            <div className="h-4.5 w-16 bg-stone-300/80 dark:bg-slate-800 rounded-md animate-pulse" />
            {/* Discount Badge placeholder */}
            <div className="h-4 w-8 bg-rose-100/50 dark:bg-rose-950/20 rounded-md animate-pulse" />
          </div>
          {/* Cart Button placeholder */}
          <div className="w-7 h-7 rounded-full bg-stone-300/80 dark:bg-slate-800 animate-pulse" />
        </div>

        {/* Stock status placeholder */}
        <div className="h-4 mt-0.5 flex items-center">
          <div className="h-3 w-16 bg-stone-200 dark:bg-slate-800 rounded-xs animate-pulse" />
        </div>
      </div>
    </div>
  );
}
