import { Button } from '../../../components/ui/Button';
import { TextInput } from '../../../components/ui/TextInput';
import { Card } from '../../../components/ui/Card';
import { motion } from 'framer-motion';

const ForgotPasswordForm = ({ onSubmit, register, errors, isLoading, isSuccess, successMessage, apiError }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <motion.form 
        onSubmit={onSubmit} 
        className="space-y-6 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {isSuccess && successMessage && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {successMessage}
          </div>
        )}
        {apiError && !errors?.email?.message && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {apiError}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          <TextInput
            label="Correo electrónico"
            type="email"
            placeholder="correo@ejemplo.com"
            error={errors?.email?.message || apiError}
            {...register('email', {
              required: 'El correo electrónico es obligatorio',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'El correo electrónico debe tener un formato válido',
              },
            })}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="pt-2"
        >
          <Button type="submit" isLoading={isLoading} className="w-full">
            Enviar enlace
          </Button>
        </motion.div>
      </motion.form>
    </Card>
  );
};

export default ForgotPasswordForm;
