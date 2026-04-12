export const TopBar = ({ user, currentTime, onLogout, isDark, onToggleDark, AlertBellComponent }) => {
  return (
    <header className="bg-white/60 backdrop-blur-md border-b border-[#9BF3F0]/30 h-16 flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div className="text-[#473198]/40 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
          System 
          <span className="w-1 h-1 rounded-full bg-[#ADFC92] opacity-100" /> 
          Ready
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {AlertBellComponent && <AlertBellComponent />}
        
        <button
          onClick={onToggleDark}
          className="p-2 text-[#473198]/60 hover:text-[#473198] transition-colors"
          title={isDark ? 'Modo claro' : 'Modo oscuro'}
        >
          {isDark ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        
        <div className="h-8 w-px bg-[#473198]/10" />
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-black text-[#473198] uppercase leading-none mb-1">{user?.name || 'Usuario'}</p>
            <p className="text-[10px] text-[#473198]/40 font-bold tracking-tighter">{user?.rol || 'Rol'} · {currentTime}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#DAFFED] border-2 border-[#9BF3F0]/20 flex items-center justify-center text-[#473198] shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-[#473198]/30 hover:text-red-500 hover:bg-red-50 transition-all"
            title="Cerrar sesion"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
