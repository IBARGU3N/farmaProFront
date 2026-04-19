import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { SecurityUtils } from '../../utils/security';

export const Select = forwardRef(({
  label,
  options = [],
  value,
  onChange,
  error,
  placeholder = 'Seleccione una opción',
  ...rest
}, ref) => {
  const handleChange = (event) => {
    const nextValue = SecurityUtils.sanitize(event.target.value);
    const patchedEvent = {
      ...event,
      target: {
        ...event.target,
        value: nextValue,
      },
    };

    if (onChange) onChange(patchedEvent);
    if (rest.onChange) rest.onChange(patchedEvent);
  };

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
         className="block text-sm font-medium mb-1 text-primary"

      >
        {label}
      </motion.label>
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="relative group">
        <select
          id={label.toLowerCase().replace(/\s+/g, '-')}
          ref={ref}
          value={value}
          onChange={handleChange}
           className={`w-full px-4 py-2 bg-surface/20 border-2 rounded-xl transition-all duration-200 ${

            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
               : 'border-secondary/30 focus:border-secondary focus:ring-4 focus:ring-secondary/20'

           } text-primary focus:outline-none`}

          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => {
            const optionValue = typeof option === 'string' ? option : option.value;
            const optionLabel = typeof option === 'string' ? option : option.label;
            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-1.5 text-xs font-semibold text-red-500"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
});

Select.displayName = 'Select';
