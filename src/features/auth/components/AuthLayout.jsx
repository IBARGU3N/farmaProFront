import React from 'react';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#DAFFED] p-4 font-sans selection:bg-[#9BF3F0] selection:text-[#473198]">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#9BF3F0]/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#ADFC92]/20 blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-5xl bg-white/40 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_120px_-20px_rgba(71,49,152,0.1)] overflow-hidden flex flex-col md:flex-row min-h-[700px] border border-white/60 relative z-10">
        
        {/* Left Side - Brand & Visuals */}
        <div className="w-full md:w-5/12 bg-[#473198] p-12 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Abstract Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:24px_24px]" />
          </div>
          
          <div className="relative z-20 text-center">
            <div className="inline-block px-4 py-1.5 bg-[#9BF3F0] text-[#473198] text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6">
              Core System v2.0
            </div>
            
            <div className="mb-8">
              <h2 className="text-[#DAFFED] text-7xl font-black italic tracking-tighter leading-none mb-1">FARMA</h2>
              <div className="text-white text-8xl font-light leading-none opacity-90">PRO</div>
            </div>

            <div className="space-y-4 max-w-[240px] mx-auto">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-[#ADFC92] font-bold text-[10px] uppercase tracking-wider">Pharmacy Control</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-[#9BF3F0]" />
                  <div className="w-1 h-1 rounded-full bg-[#9BF3F0]/40" />
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-[#ADFC92] font-bold text-[10px] uppercase tracking-wider">Inventory Sync</span>
                <span className="text-white/40 font-mono text-[10px]">ACTIVE</span>
              </div>
              <p className="text-white/40 text-[10px] font-medium leading-relaxed tracking-wide pt-2">
                Unified pharmaceutical management platform with real-time analytics.
              </p>
            </div>
          </div>

          {/* Bottom Accreditation */}
          <div className="absolute bottom-8 left-12 right-12 flex justify-between items-center text-white/20 text-[8px] font-bold uppercase tracking-[0.2em]">
            <span>Secure Access</span>
            <div className="w-8 h-px bg-white/10" />
            <span>Encrypted Endpoint</span>
          </div>
        </div>

        {/* Right Side - Form Container */}
        <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center relative bg-gradient-to-br from-white/40 to-transparent">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-1 rounded-full bg-[#9BF3F0]" />
                <h3 className="text-[#473198] text-sm font-black uppercase tracking-widest">{title}</h3>
              </div>
              <p className="text-[#473198]/40 text-sm font-medium">
                {subtitle || 'Manage your pharmacy with the most advanced core system available.'}
              </p>
            </div>

            <div className="space-y-6">
              {children}
            </div>

            <div className="mt-12 text-center">
              <p className="text-[10px] text-[#473198]/30 font-bold uppercase tracking-[0.2em]">
                &copy; 2026 FarmaPro Systems &bull; All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



