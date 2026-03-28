import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/auth/authService';
import { authStorage } from '../../../lib/authStorage';
import { AuthLayout } from './AuthLayout';
import LoginForm from './LoginForm';

export const LoginFormSmart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: login, isLoading, isError, error } = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      authStorage.saveTokens(data.access_token, data.refresh_token);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      navigate('/dashboard', { replace: true });
    },
    onError: (err) => {
      console.error('Login failed', err);
      reset({ email: '', password: '' });
    },
  });

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Enter your credentials to access your account"
    >
      <LoginForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isLoading={isLoading}
        isError={isError}
        error={error?.response?.data?.message || 'An error occurred'}
      />
      <div className="mt-8 flex flex-col space-y-4 text-center">
        <Link 
          to="/forgot-password" 
          className="text-[#473198]/60 hover:text-[#473198] text-sm font-bold transition-all duration-200"
        >
          Forgot your password?
        </Link>
        <p className="text-[#473198]/40 text-xs font-bold uppercase tracking-widest">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="text-[#473198] hover:text-[#4A0D67] border-b-2 border-[#9BF3F0] transition-all duration-200"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};



