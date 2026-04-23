import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { authService } from '../../../services/auth/authService';
import { AuthLayout } from './AuthLayout';
import ForgotPasswordForm from './ForgotPasswordForm';
import useUIStore from '../../../store/uiStore';

export const ForgotPasswordSmart = () => {
  const showToast = useUIStore((state) => state.showToast);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  const { mutate: forgotPassword, isLoading, isSuccess, data, error } = useMutation({
    mutationFn: (data) => authService.forgotPassword(data.email),
    onSuccess: (response) => {
      showToast(response.data.message || 'Se envió el enlace de restablecimiento si el correo existe.', 'success');
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
        showToast(serverMessage || 'Error al enviar el enlace de restablecimiento.', 'error');
      }
    },
  });

  const onSubmit = (data) => {
    forgotPassword(data);
  };

  return (
    <AuthLayout 
      title="Recuperar contraseña" 
      subtitle="Ingresa tu correo para recibir un enlace de restablecimiento"
    >
      <ForgotPasswordForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isLoading={isLoading}
        isSuccess={isSuccess}
        successMessage={data?.data?.message}
        apiError={error?.response?.data?.message}
      />
      <div className="mt-8 text-center">
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
