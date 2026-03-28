import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/auth/authService';
import { AuthLayout } from './AuthLayout';
import RegisterForm from './RegisterForm';

const RegisterFormSmart = () => {
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
      <div className="mt-6 flex flex-col space-y-3 text-center text-sm">
        <p className="text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
            Sign in here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterFormSmart;

