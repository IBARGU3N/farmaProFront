import { useForm } from 'react-hook-form';
import { SecurityUtils } from '../utils/security';

/**
 * Custom hook to handle secure form state and submission.
 * Encapsulates validation, controlled input support, and final sanitization.
 */
export const useSecureForm = ({ defaultValues = {}, mode = 'onChange' } = {}) => {
  const formMethods = useForm({
    mode,
    defaultValues,
  });

  const { register, control, handleSubmit: originalHandleSubmit, setValue, ...rest } = formMethods;

  const sanitizeValue = (value) => SecurityUtils.sanitize(value);

  const registerSecure = (name, rules = {}) => {
    return register(name, {
      ...rules,
      setValueAs: sanitizeValue,
      onChange: (event) => {
        const sanitized = sanitizeValue(event.target?.value);
        if (event.target) {
          event.target.value = sanitized;
        }
        if (rules.onChange) {
          rules.onChange(event);
        }
      },
    });
  };

  const handleSubmit = (onSubmitHandler) => {
    return originalHandleSubmit(async (data) => {
      try {
        const sanitizedData = SecurityUtils.sanitizeObject(data);
        await onSubmitHandler(sanitizedData);
      } catch (error) {
        console.error('Secure submit error:', error);
        throw error;
      }
    });
  };

  const setSecureValue = (field, value, options) => {
    setValue(field, sanitizeValue(value), options);
  };

  return {
    ...rest,
    control,
    register: registerSecure,
    handleSubmit,
    setValue: setSecureValue,
    setSecureValue,
    sanitizeValue,
  };
};
