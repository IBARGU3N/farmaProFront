import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { SecurityUtils } from '../../utils/security';

export const TextInput = forwardRef(({
  label,
  type = 'text',
  placeholder = '',
  error,
  securityPattern,
  allowedChars,
  maxLength,
  onChange,
  onPaste,
  onKeyDown,
  ...rest
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const currentValue = typeof rest.value === 'string' ? rest.value : '';
  const currentLength = currentValue.length;

  const normalizeValue = (value) => {
    let next = typeof value === 'string' ? SecurityUtils.sanitize(value) : value;

    if (typeof next === 'string' && allowedChars) {
      next = Array.from(next).filter((char) => allowedChars.test(char)).join('');
    }

    if (typeof next === 'string' && maxLength && next.length > maxLength) {
      next = next.slice(0, maxLength);
    }

    return next;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = normalizeValue(value);
    
    const patchedEvent = {
      ...event,
      target: {
        ...event.target,
        name,
        value: nextValue,
      },
    };

    if (onChange) onChange(patchedEvent);
    if (rest.onChange) rest.onChange(patchedEvent);
  };

  const handlePaste = (event) => {
    const pastedData = event.clipboardData.getData('text');

    if (!SecurityUtils.isSecure(pastedData, securityPattern)) {
      event.preventDefault();
      return;
    }

    const nextValue = normalizeValue(pastedData);
    event.preventDefault();

    const patchedEvent = {
      ...event,
      target: {
        ...event.target,
        value: nextValue,
      },
    };

    if (onChange) onChange(patchedEvent);
    if (rest.onChange) rest.onChange(patchedEvent);
    if (onPaste) onPaste(patchedEvent);
  };

  const handleKeyDown = (event) => {
    const char = event.key;
    const blocklist = [';', '<', '>', '/'];

    if (blocklist.includes(char) && type !== 'password') {
      event.preventDefault();
      return;
    }

    if (allowedChars && char.length === 1 && !allowedChars.test(char)) {
      event.preventDefault();
      return;
    }

    if (onKeyDown) onKeyDown(event);
    if (rest.onKeyDown) rest.onKeyDown(event);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
       {label && (
         <motion.label
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.98 }}
           htmlFor={label ? label.toLowerCase().replace(/\s+/g, '-') : undefined}
           className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
             isFocused ? 'text-primary' : 'text-primary/70'
           }`}
         >
           {label}
         </motion.label>
       )}

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="relative group">
          <input
            id={label ? label.toLowerCase().replace(/\s+/g, '-') : undefined}
            type={type}

          placeholder={placeholder}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          maxLength={maxLength}
          className={`w-full px-4 py-2 bg-surface-container-low/20 border-2 rounded-xl transition-all duration-200 ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
               : isFocused
                 ? 'border-secondary ring-4 ring-secondary/20'
                 : 'border-secondary/30 group-hover:border-secondary/60'

          } placeholder:text-primary/30 text-primary focus:outline-none`}
          {...rest}
        />
        {maxLength && (
          <div className="mt-2 text-right text-[11px] text-primary/70">
            {currentLength}/{maxLength}
          </div>
        )}
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


