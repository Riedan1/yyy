import React from "react";

export function BookmarkStar({ filled, className = "w-6 h-8" }: { filled: boolean; className?: string }) {
  if (filled) {
    return (
      <svg
        viewBox="0 0 100 120"
        className={`${className} transition-all duration-300 drop-shadow-[0_4px_10px_rgba(247,46,95,0.45)] hover:scale-110 active:scale-95`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ribbon Left Side (Lighter Coral/Rose) */}
        <path
          d="M15 10H50V85L15 102V10Z"
          fill="#ff6b7d"
        />
        {/* Ribbon Right Side (Darker Rose) */}
        <path
          d="M50 10H85V102L50 85V10Z"
          fill="#f72e5f"
        />
        {/* Star Left Side (Lighter Gold/Yellow) */}
        <path
          d="M50 25 L 42 41 L 24 41 L 36 52 L 30 69 L 50 59 Z"
          fill="#ffd325"
        />
        {/* Star Right Side (Darker Gold/Orange) */}
        <path
          d="M50 25 L 58 41 L 76 41 L 64 52 L 70 69 L 50 59 Z"
          fill="#ffa903"
        />
      </svg>
    );
  } else {
    return (
      <svg
        viewBox="0 0 100 120"
        className={`${className} transition-all duration-300 hover:scale-115 active:scale-95`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* White bookmark with light gray shadow and outline */}
        <path
          d="M15 10H85V102L50 85L15 102V10Z"
          fill="#ffffff"
          stroke="#e2e8f0"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        {/* Light gray star outline in the middle */}
        <path
          d="M50 25 L 58 41 L 76 41 L 64 52 L 70 69 L 50 59 L 30 69 L 36 52 L 24 41 L 42 41 Z"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
}
