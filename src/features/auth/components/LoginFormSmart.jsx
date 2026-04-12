import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/auth/authService';
import { authStorage } from '../../../lib/authStorage';
import { AuthLayout } from './AuthLayout';
import LoginForm from './LoginForm';
import useUIStore from '../../../store/uiStore';
import { useAuthStore } from '../../../store/authStore';

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
        
        // Update Zustand Global State
        useAuthStore.getState().setUser(payload.user);

        queryClient.invalidateQueries({ queryKey: ['auth'] });
        navigate('/dashboard', { replace: true });
        showToast('¡Bienvenido! Sesión iniciada con éxito.', 'success');
      }
    },
    onError: (err) => {
      const serverMessage = err?.response?.data?.message;
      const errorData = err?.response?.data?.error;
      const fieldErrors = err?.response?.data?.errors;

      // Handle FormRequest validation errors (422)
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setError(field, {
              type: 'server',
              message: messages[0],
            });
          }
        });
        showToast('Por favor, revisa los campos del formulario.', 'error');
      } 
      // Handle AuthenticationException errors (401 from backend changes)
      else if (errorData?.type === 'authentication_error') {
         setError('email', { type: 'server', message: 'Credenciales inválidas' });
         setError('password', { type: 'server', message: 'Credenciales inválidas' });
         showToast(serverMessage || 'Las credenciales proporcionadas son incorrectas.', 'error');
      } 
      // Handle undefined errors
      else {
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



