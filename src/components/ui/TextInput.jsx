import React, { useState, forwardRef } from 'react';

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
    <div className="mb-4">
      <label 
        htmlFor={label.toLowerCase().replace(/\s+/g, '-')} 
        className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
          isFocused ? 'text-[#4A0D67]' : 'text-[#473198]'
        }`}
      >
        {label}
      </label>
      <div className="relative group">
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
          <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center">
            <span className="mr-1">⚠️</span> {error}
          </p>
        )}
      </div>
    </div>
  );
});

TextInput.displayName = 'TextInput';


