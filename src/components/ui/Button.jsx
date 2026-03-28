import { useState } from 'react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  onClick,
  ...rest
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  const baseClasses = `
    inline-flex items-center justify-center px-4 py-2 border border-transparent 
    text-sm font-medium rounded-md shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:pointer-events-none
    transition-all duration-150 ease-in-out
  `;

  const variantClasses = variant === 'primary'
    ? 'bg-[#473198] text-white hover:bg-[#4A0D67] focus:ring-[#4A0D67]/50'
    : variant === 'secondary'
    ? 'bg-[#9BF3F0] text-[#473198] hover:bg-[#ADFC92] focus:ring-[#ADFC92]/50'
    : variant === 'outline'
    ? 'border border-[#9BF3F0] text-[#473198] hover:bg-[#9BF3F0]/20 focus:ring-[#9BF3F0]/50'
    : '';

  const sizeClasses = size === 'small'
    ? 'px-3'
    : size === 'large'
    ? 'px-6 py-3'
    : '';

  const loadingClasses = isLoading
    ? 'pointer-events-none opacity-75'
    : '';

  const pressedClasses = isPressed && !isLoading
    ? 'scale-95'
    : '';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${loadingClasses} ${pressedClasses}`}
      {...rest}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};


