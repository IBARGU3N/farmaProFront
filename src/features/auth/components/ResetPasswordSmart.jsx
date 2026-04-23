import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../../services/auth/authService';
import { AuthLayout } from './AuthLayout';
import ResetPasswordForm from './ResetPasswordForm';
import useUIStore from '../../../store/uiStore';

export const ResetPasswordSmart = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const showToast = useUIStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: email || '',
    },
  });

  const { mutate: resetPassword, isLoading, isError, error, data } = useMutation({
    mutationFn: (data) => authService.resetPassword({
      ...data,
      token,
      email,
    }),
    onSuccess: (response) => {
      showToast(response.data.message || 'La contraseña ha sido restablecida correctamente.', 'success');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    },
    onError: (err) => {
      const serverMessage = err?.response?.data?.message;
      const fieldErrors = err?.response?.data?.errors;

      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setError(field, {
              type: 'server',
              message: messages[0],
            });
          }
        });
      } else {
        showToast(serverMessage || 'Error al restablecer la contraseña.', 'error');
      }
    },
  });

  const onSubmit = (data) => {
    resetPassword(data);
  };

  return (
    <AuthLayout 
      title="Crear nueva contraseña" 
      subtitle="Complete el formulario para establecer una nueva contraseña"
    >
      <ResetPasswordForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isLoading={isLoading}
        isError={isError}
        error={error?.response?.data?.message}
      />
      <div className="mt-8 text-center text-sm">
        <Link 
          to="/login" 
           className="text-primary/60 hover:text-primary text-sm font-bold transition-all duration-200"
        >
          &larr; Volver al inicio de sesión
        </Link>
      </div>
    </AuthLayout>
  );
};
