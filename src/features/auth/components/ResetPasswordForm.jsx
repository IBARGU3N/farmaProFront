import { Button } from '../../../components/ui/Button';
import { TextInput } from '../../../components/ui/TextInput';
import { Card } from '../../../components/ui/Card';

const ResetPasswordForm = ({ onSubmit, register, watch, errors, isLoading, isError, error }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={onSubmit} className="space-y-6 p-6">
        {isError && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <TextInput
            label="Correo electrónico"
            type="email"
            placeholder="correo@ejemplo.com"
            {...register('email', {
              required: 'El correo electrónico es obligatorio',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'El correo electrónico debe tener un formato válido',
              },
            })}
            error={errors?.email?.message}
          />

          <TextInput
            label="Nueva contraseña"
            type="password"
            placeholder="••••••••"
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 8,
                message: 'La contraseña debe tener al menos 8 caracteres',
              },
            })}
            error={errors?.password?.message}
          />

          <TextInput
            label="Confirmar contraseña"
            type="password"
            placeholder="••••••••"
            {...register('password_confirmation', {
              required: 'Por favor confirme su contraseña',
              validate: (value) => value === watch('password') || 'Las contraseñas no coinciden',
            })}
            error={errors?.password_confirmation?.message}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" isLoading={isLoading} className="w-full">
            Restablecer contraseña
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ResetPasswordForm;


