export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/80 backdrop-blur-md border border-[#9BF3F0]/30 rounded-3xl shadow-xl shadow-[#473198]/5 ${className}`}>
      {children}
    </div>
  );
};


