import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/auth/authService';
import { authStorage } from '../../../lib/authStorage';
import { AuthLayout } from './AuthLayout';
import LoginForm from './LoginForm';
import useUIStore from '../../../store/uiStore';

export const LoginFormSmart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showToast = useUIStore((state) => state.showToast);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: login, isLoading } = useMutation({
    mutationFn: authService.login,
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
        showToast(serverMessage || 'Error al iniciar sesión. Verifique sus credenciales e intente nuevamente.', 'error');
      }
    },
  });

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <AuthLayout 
      title="Bienvenido" 
      subtitle="Ingrese sus credenciales para acceder a su cuenta"
    >
      <LoginForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isLoading={isLoading}
      />
      <div className="mt-8 flex flex-col space-y-4 text-center">
        <Link 
          to="/forgot-password" 
          className="text-[#473198]/60 hover:text-[#473198] text-sm font-bold transition-all duration-200"
        >
          ¿Olvidaste tu contraseña?
        </Link>
        <p className="text-[#473198]/40 text-xs font-bold uppercase tracking-widest">
          ¿No tienes una cuenta?{' '}
          <Link 
            to="/register" 
            className="text-[#473198] hover:text-[#4A0D67] border-b-2 border-[#9BF3F0] transition-all duration-200"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};



