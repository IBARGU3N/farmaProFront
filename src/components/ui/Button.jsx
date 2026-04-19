import { useState } from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  ...rest
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  const baseClasses = `
    inline-flex items-center justify-center px-4 py-2 border border-transparent 
    text-sm font-medium rounded-xl shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:pointer-events-none
    transition-all duration-150 ease-in-out
  `;

  const variantClasses = variant === 'primary'
    ? 'bg-primary text-on-primary hover:bg-primary-container ring-primary/50 shadow-lg shadow-primary/20'
    : variant === 'secondary'
    ? 'bg-secondary text-on-secondary hover:bg-secondary-container ring-secondary/50 shadow-lg shadow-secondary/20'
    : variant === 'outline'
    ? 'border-2 border-primary text-primary hover:bg-primary/10 ring-primary/50'
    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-lowest';

  const sizeClasses = size === 'small'
    ? 'px-3 py-1 text-xs'
    : size === 'large'
    ? 'px-6 py-3 text-base'
    : 'px-4 py-2';

  const loadingClasses = isLoading
    ? 'pointer-events-none opacity-75'
    : '';

  const pressedClasses = isPressed && !isLoading
    ? 'scale-95'
    : '';

  return (
    <motion.button
      initial={{ scale: 1 }}
      whileTap={{ scale: 0.95 }}
      type={type}
      disabled={disabled || isLoading}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${loadingClasses} ${pressedClasses} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          {children}
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};



