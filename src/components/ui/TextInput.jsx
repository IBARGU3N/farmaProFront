import { useState } from 'react';

export const TextInput = ({
  label,
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  error,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-4">
      <label 
        htmlFor={label.toLowerCase().replace(/\s+/g, '-')} 
        className={`block text-sm font-medium text-[#473198] mb-1 ${
          isFocused ? 'text-[#4A0D67]' : 'text-[#473198]'
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={label.toLowerCase().replace(/\s+/g, '-')}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-3 py-2 border border-[#9BF3F0] rounded-md 
            focus:outline-none focus:ring-2 focus:ring-[#9BF3F0]/50 
            ${
              error 
                ? 'border-[#ADFC92]/50 focus:ring-[#ADFC92]/50' 
                : 'focus:border-[#9BF3F0]/50'
            }
            ${isFocused ? 'border-[#9BF3F0]/50' : ''}`}
          {...rest}
        />
        {error && (
          <p className="mt-1 text-sm text-[#ADFC92]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};


