import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/auth/authService';
import { authStorage } from '../../../lib/authStorage';
import { AuthLayout } from './AuthLayout';
import RegisterForm from './RegisterForm';
import useUIStore from '../../../store/uiStore';
import { useAuthStore } from '../../../store/authStore';

export const RegisterFormSmart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showToast = useUIStore((state) => state.showToast);
  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reset]);

  const { mutate: registerUser, isLoading } = useMutation({
    mutationFn: authService.register,
    onSuccess: (response) => {
      if (response?.success && response?.data) {
        const payload = response.data;
        authStorage.saveTokens(payload.access_token, payload.refresh_token);
        useAuthStore.getState().setUser(payload.user);
        queryClient.invalidateQueries({ queryKey: ['auth'] });
        navigate('/dashboard', { replace: true });
        showToast('Cuenta creada con éxito. ¡Bienvenido a FarmaPro!', 'success');
      }
    },
    onError: (err) => {
      showToast(err.message || 'Error al registrar usuario. Por favor, intente nuevamente.', 'error');
    },
  });

  const onSubmit = (data) => {
    // Map form data to service expectations
    const userData = {
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
      sucursal_id: 1, // Default sucursal for local testing
    };
    registerUser(userData);
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
         <p className="text-primary/40 text-xs font-bold uppercase tracking-widest">
           ¿Ya tienes una cuenta?{' '}
           <Link 
             to="/login" 
             className="text-primary hover:text-on-surface border-b-2 border-surface-container-low transition-all duration-200"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};



