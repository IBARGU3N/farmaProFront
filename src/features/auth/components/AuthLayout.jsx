import React from 'react';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side - Brand & Gradient */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-blue-500 via-emerald-500 to-green-600 p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="bg-black/80 rounded-xl p-8 border-4 border-black w-full max-w-[320px] relative shadow-2xl z-20">
            <h2 className="text-red-600 text-6xl font-black italic tracking-tighter mb-2">FARMA</h2>
            <div className="text-white text-7xl font-light leading-none mb-6">PRO</div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-end border-b border-white/10 pb-1">
                <span className="text-red-500 font-bold text-[10px] uppercase leading-none">Gestión<br/>Avanzada</span>
                <span className="text-white font-mono text-xs text-right">101010<br/>010101</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/10 pb-1">
                <span className="text-red-500 font-bold text-[10px] uppercase leading-none">Inventario</span>
                <span className="text-white font-mono text-xs">101010</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-red-500 font-bold text-[10px] uppercase leading-none">Facturación</span>
                <span className="text-white font-mono text-xs">010101</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Container */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white relative">
          <div className="mb-8 text-center">
            <h1 className="text-red-600 text-5xl md:text-6xl font-bold tracking-tighter italic">FARMAPRO</h1>
            <p className="text-gray-500 mt-2 font-medium tracking-wide uppercase text-sm">
              {title} {subtitle ? `- ${subtitle}` : ''}
            </p>
          </div>

          <div className="w-full max-w-sm mx-auto">
            {children}
          </div>

          <div className="mt-12 flex items-center justify-center gap-3 text-gray-400 font-bold text-xs uppercase tracking-widest">
            <span>Soporte Técnico</span>
            <a href="#" className="text-emerald-500 hover:scale-125 transition-transform">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};



