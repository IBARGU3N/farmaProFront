import React from 'react';

export const TopBar = () => {
  return (
    <header className="bg-white/60 backdrop-blur-md border-b border-[#9BF3F0]/30 h-16 flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div className="text-[#473198]/40 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
          System 
          <span className="w-1 h-1 rounded-full bg-[#ADFC92] opacity-100" /> 
          Ready
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <button className="relative p-2 text-[#473198]/60 hover:text-[#473198] transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#9BF3F0] rounded-full border-2 border-white group-hover:scale-110 transition-transform" />
        </button>
        
        <div className="h-8 w-px bg-[#473198]/10" />
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-black text-[#473198] uppercase leading-none mb-1">Pharmacist</p>
            <p className="text-[10px] text-[#473198]/40 font-bold tracking-tighter">Session: 04:32:11</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#DAFFED] border-2 border-[#9BF3F0]/20 flex items-center justify-center text-[#473198] shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};
