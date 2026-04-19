import React from 'react';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface relative p-4 font-sans transition-colors duration-500">
      <div className="absolute inset-0 bg-clinical-ether opacity-50 dark:opacity-100 z-0 pointer-events-none" />
      
      {/* Background Elements - Simplified to static divs to avoid crashes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px] animate-pulse delay-700" />
      </div>

       <div className="w-full max-w-5xl neo-glass rounded-[3rem] overflow-hidden flex flex-col md:flex-row min-h-[700px] relative z-10 border border-on-surface/10 shadow-2xl">
        
        {/* Left Side - Brand & Visuals */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-primary to-secondary p-12 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Abstract Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:24px_24px]" />
          </div>
          
          <div className="relative z-20 text-center">
            <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6">
              Sistema Base v2.0
            </div>
            
            <div className="mb-8 font-headline">
              <h2 className="text-white text-7xl font-black italic tracking-tighter leading-none mb-1">FARMA</h2>
              <div className="text-white/90 text-8xl font-light leading-none opacity-90">PRO</div>
            </div>
          </div>

          {/* Bottom Accreditation */}
          <div className="absolute bottom-8 left-12 right-12 flex justify-between items-center text-white/20 text-[8px] font-bold uppercase tracking-[0.2em]">
            <span>Acceso Seguro</span>
            <div className="w-8 h-px bg-white/10" />
            <span>Conexión Encriptada</span>
          </div>
        </div>

        {/* Right Side - Form Container */}
        <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center relative bg-surface-container-lowest/50 dark:bg-surface/50">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-1 rounded-full bg-primary" />
                <h3 className="text-primary text-sm font-black uppercase tracking-widest">{title}</h3>
              </div>
              <p className="text-on-surface-variant text-sm font-medium">
                {subtitle || 'Gestiona tu farmacia con el sistema más avanzado disponible.'}
              </p>
            </div>

            <div className="space-y-6">
              {children}
            </div>

            <div className="mt-12 text-center">
               <p className="text-[10px] text-on-surface-variant/50 font-bold uppercase tracking-[0.2em]">
                 &copy; 2026 FarmaPro Systems &bull; Todos los Derechos Reservados
               </p>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 };
