export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white border border-[#9BF3F0]/20 rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};


