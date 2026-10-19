import React from 'react';

interface OwlLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const OwlLogo: React.FC<OwlLogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const iconSize = size === 'sm' ? 36 : size === 'lg' ? 64 : 48;

  return (
    <div className="flex items-center gap-3 select-none">
      <div
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 p-1.5 shadow-md shadow-blue-500/20"
        style={{ width: iconSize, height: iconSize }}
      >
        {/* SVG Owl Mascot sitting on open book */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Open Book Base */}
          <path
            d="M15 78 C25 72, 45 74, 50 82 C55 74, 75 72, 85 78 L83 88 C73 82, 55 84, 50 90 C45 84, 27 82, 17 88 Z"
            fill="#f97316"
            stroke="#ea580c"
            strokeWidth="2"
          />
          <path d="M18 78 L48 83 L48 88 L18 84 Z" fill="#fed7aa" />
          <path d="M52 83 L82 78 L82 84 L52 88 Z" fill="#fed7aa" />

          {/* Owl Body */}
          <ellipse cx="50" cy="52" rx="28" ry="26" fill="#38bdf8" />
          {/* Owl Belly */}
          <ellipse cx="50" cy="56" rx="18" ry="17" fill="#ffffff" />
          {/* Belly feather marks */}
          <path d="M44 54 C47 57, 53 57, 56 54" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
          <path d="M42 61 C46 64, 54 64, 58 61" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />

          {/* Owl Eyes */}
          <circle cx="39" cy="42" r="10" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
          <circle cx="61" cy="42" r="10" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
          {/* Pupils */}
          <circle cx="41" cy="42" r="5" fill="#0f172a" />
          <circle cx="59" cy="42" r="5" fill="#0f172a" />
          {/* Eye light reflections */}
          <circle cx="39.5" cy="40.5" r="1.8" fill="#ffffff" />
          <circle cx="57.5" cy="40.5" r="1.8" fill="#ffffff" />

          {/* Beak */}
          <polygon points="50,47 46,54 54,54" fill="#f59e0b" />

          {/* Graduation Cap (Mortarboard) */}
          <polygon points="50,15 80,24 50,33 20,24" fill="#1e293b" />
          <polygon points="50,28 68,34 68,40 50,45 32,40 32,34" fill="#0f172a" />
          {/* Cap Tassel */}
          <circle cx="50" cy="24" r="2.5" fill="#eab308" />
          <path d="M50 24 C60 25, 74 32, 75 42" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
          <rect x="73" y="40" width="4" height="6" rx="1" fill="#ca8a04" />

          {/* Little Wings */}
          <path d="M22 50 C20 58, 25 66, 30 70 C26 64, 25 56, 26 50 Z" fill="#0284c7" />
          <path d="M78 50 C80 58, 75 66, 70 70 C74 64, 75 56, 74 50 Z" fill="#0284c7" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold tracking-tight text-slate-900 text-lg sm:text-xl">
            Tường học tập
          </span>
          <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white bg-sky-600 rounded-md shadow-xs">
            AI
          </span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
            <span>✦</span>
            <span>Truy gốc lỗi</span>
            <span className="hidden sm:inline text-slate-400 font-normal ml-1">
              • Learning Wall AI
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
