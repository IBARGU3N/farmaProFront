import { Button } from '../../../components/ui/Button';
import { TextInput } from '../../../components/ui/TextInput';
import { Card } from '../../../components/ui/Card';
import { motion } from 'framer-motion';

const RegisterForm = ({ onSubmit, register, watch, errors, isLoading }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <motion.form 
        onSubmit={onSubmit} 
        className="space-y-6 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          <TextInput
            label="Nombre completo"
            type="text"
            placeholder="Juan Pérez"
            {...register('name', {
              required: 'El nombre es obligatorio',
              minLength: {
                value: 2,
                message: 'El nombre debe tener al menos 2 caracteres'
              },
              pattern: {
                value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
                message: 'El nombre solo puede contener letras y espacios'
              }
            })}
            error={errors?.name?.message}
          />

          <TextInput
            label="Correo electrónico"
            type="email"
            placeholder="juan@ejemplo.com"
            {...register('email', {
              required: 'El correo electrónico es obligatorio',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'El correo electrónico debe tener un formato válido'
              }
            })}
            error={errors?.email?.message}
          />

          <TextInput
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 8,
                message: 'La contraseña debe tener al menos 8 caracteres'
              }
            })}
            error={errors?.password?.message}
          />

          <TextInput
            label="Confirmar contraseña"
            type="password"
            placeholder="••••••••"
            {...register('password_confirmation', {
              required: 'Por favor confirme su contraseña',
              validate: (value) => value === watch('password') || 'Las contraseñas no coinciden'
            })}
            error={errors?.password_confirmation?.message}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="pt-2"
        >
          <Button type="submit" isLoading={isLoading} className="w-full">
            Crear cuenta
          </Button>
        </motion.div>
      </motion.form>
    </Card>
  );
};

export default RegisterForm;

