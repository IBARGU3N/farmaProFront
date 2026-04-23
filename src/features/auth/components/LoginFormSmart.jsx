import React, { useEffect } from 'react';
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
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reset]);

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
      const status = err?.response?.status;

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
      else if (status === 401 || errorData?.type === 'authentication_error') {
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
           className="text-primary/60 hover:text-primary text-sm font-bold transition-all duration-200"
         >
           ¿Olvidaste tu contraseña?
         </Link>
         <p className="text-primary/40 text-xs font-bold uppercase tracking-widest">
           ¿No tienes una cuenta?{' '}
           <Link 
             to="/register" 
             className="text-primary hover:text-on-surface border-b-2 border-surface-container-low transition-all duration-200"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};



