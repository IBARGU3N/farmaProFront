import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/auth/authService';
import { authStorage } from '../../../lib/authStorage';
import { AuthLayout } from './AuthLayout';
import RegisterForm from './RegisterForm';
import useUIStore from '../../../store/uiStore';

export const RegisterFormSmart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showToast = useUIStore((state) => state.showToast);
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  const { mutate: registerUser, isLoading } = useMutation({
    mutationFn: authService.register,
    onSuccess: (response) => {
      if (response.data.success) {
        const payload = response.data.data;
        authStorage.saveTokens(payload.access_token, payload.refresh_token);
        queryClient.invalidateQueries({ queryKey: ['auth'] });
        navigate('/dashboard', { replace: true });
      }
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
        showToast(serverMessage || 'Error al registrar usuario. Por favor, intente nuevamente.', 'error');
      }
    },
  });

  const onSubmit = (data) => {
    registerUser(data);
  };

  return (
    <AuthLayout 
      title="Crear una cuenta" 
      subtitle="Únete a FarmaPro hoy para gestionar tu farmacia"
    >
      <RegisterForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        watch={watch}
        errors={errors}
        isLoading={isLoading}
      />
      <div className="mt-8 text-center">
        <p className="text-[#473198]/40 text-xs font-bold uppercase tracking-widest">
          ¿Ya tienes una cuenta?{' '}
          <Link 
            to="/login" 
            className="text-[#473198] hover:text-[#4A0D67] border-b-2 border-[#9BF3F0] transition-all duration-200"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};



