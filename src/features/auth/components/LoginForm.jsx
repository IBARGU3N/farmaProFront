import { Button } from '../../../components/ui/Button';
import { TextInput } from '../../../components/ui/TextInput';
import { Card } from '../../../components/ui/Card';
import { motion } from 'framer-motion';

const LoginForm = ({ onSubmit, register, errors, isLoading }) => {
  return (
    <Card className="w-full max-w-md">
      <motion.form 
        onSubmit={onSubmit} 
        className="space-y-6"
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
             label="Correo electrónico"
             type="email"
             placeholder="correo@ejemplo.com"
             maxLength={100}
             {...register('email', {
               required: 'El correo electrónico es obligatorio',
               maxLength: {
                 value: 100,
                 message: 'El correo electrónico no puede exceder 100 caracteres'
               },
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
             maxLength={20}
             {...register('password', {
               required: 'La contraseña es obligatoria',
               minLength: {
                 value: 8,
                 message: 'La contraseña debe tener al menos 8 caracteres'
               },
               maxLength: {
                 value: 20,
                 message: 'La contraseña no puede exceder 20 caracteres'
               }
             })} 
             error={errors?.password?.message}
           />
        </motion.div>
          
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <Button type="submit" isLoading={isLoading}>
            Iniciar sesión
          </Button>
        </motion.div>
      </motion.form>
    </Card>
  );
};

export default LoginForm;
