import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white font-sans">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 bg-cyan-500 rounded-full opacity-20 animate-ping"></div>
          <svg className="relative w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 2.5L95.3 26.25V73.75L50 97.5L4.7 73.75V26.25L50 2.5Z" stroke="url(#paint0_linear_1_2)" strokeWidth="5"/>
            <path d="M35 65V35H50C58.28 35 65 41.72 65 50C65 58.28 58.28 65 50 65H35Z" fill="url(#paint1_linear_1_2)"/>
            <path d="M35 50H50" stroke="white" strokeWidth="5" strokeLinecap="round"/>
            <defs>
              <linearGradient id="paint0_linear_1_2" x1="50" y1="2.5" x2="50" y2="97.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22D3EE"/>
                <stop offset="1" stopColor="#0891B2"/>
              </linearGradient>
              <linearGradient id="paint1_linear_1_2" x1="50" y1="35" x2="50" y2="65" gradientUnits="userSpaceOnUse">
                <stop stopColor="#67E8F9"/>
                <stop offset="1" stopColor="#06B6D4"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-300 tracking-wider animate-pulse">
          Roblox Friends Hub
        </h1>
      </div>
      <div className="absolute bottom-8 text-slate-500 text-sm font-light">
        Powered by SAM IA
      </div>
    </div>
  );
};

export default LoadingScreen;
