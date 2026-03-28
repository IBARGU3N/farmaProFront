import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/auth/authService';
import { AuthLayout } from './AuthLayout';
import RegisterForm from './RegisterForm';

export const RegisterFormSmart = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  const { mutate: registerUser, isLoading, isError, error } = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      navigate('/login', { replace: true });
    },
    onError: (err) => {
      console.error('Registration failed', err);
      reset({ name: '', email: '', password: '', password_confirmation: '' });
    },
  });

  const onSubmit = (data) => {
    registerUser(data);
  };

  return (
    <AuthLayout 
      title="Create an Account" 
      subtitle="Join FarmaPro today to manage your pharmacy"
    >
      <RegisterForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        watch={watch}
        errors={errors}
        isLoading={isLoading}
        isError={isError}
        error={error?.response?.data?.message || 'An error occurred'}
      />
      <div className="mt-8 text-center">
        <p className="text-[#473198]/40 text-xs font-bold uppercase tracking-widest">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-[#473198] hover:text-[#4A0D67] border-b-2 border-[#9BF3F0] transition-all duration-200"
          >
            Log in here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};



