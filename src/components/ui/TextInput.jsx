import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';

export const TextInput = forwardRef(({
  label,
  type = 'text',
  placeholder = '',
  error,
  ...rest
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  // Colors: 
  // DAFFED (Lightest Mint)
  // 9BF3F0 (Electric Cyan)
  // 473198 (Deep Purple)
  // 4A0D67 (Darker Purple for focus)
  // ADFC92 (Light Green)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <motion.label
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        htmlFor={label.toLowerCase().replace(/\s+/g, '-')} 
        className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
          isFocused ? 'text-[#4A0D67]' : 'text-[#473198]'
        }`}
      >
        {label}
      </motion.label>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="relative group"
      >
        <input
          id={label.toLowerCase().replace(/\s+/g, '-')}
          type={type}
          placeholder={placeholder}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-2 bg-[#DAFFED]/20 border-2 rounded-xl transition-all duration-200
            ${
              error 
                ? 'border-red-400 focus:border-red-500 focus:ring-red-100' 
                : isFocused 
                  ? 'border-[#9BF3F0] ring-4 ring-[#9BF3F0]/20' 
                  : 'border-[#9BF3F0]/30 group-hover:border-[#9BF3F0]/60'
            }
            placeholder:text-[#473198]/30 text-[#473198] focus:outline-none`}
          {...rest}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-1.5 text-xs font-semibold text-red-500 flex items-center"
          >
            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
});

TextInput.displayName = 'TextInput';


