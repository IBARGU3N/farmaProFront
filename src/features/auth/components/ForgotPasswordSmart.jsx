import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/auth/authService';
import { AuthLayout } from './AuthLayout';
import ForgotPasswordForm from './ForgotPasswordForm';

const ForgotPasswordSmart = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const { mutate: forgotPassword, isLoading, isError, error } = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => {
      navigate('/login?message=reset-link-sent', { replace: true });
    },
    onError: (err) => {
      console.error('Forgot password failed', err);
      reset({ email: '' });
    },
  });

  const onSubmit = (data) => {
    forgotPassword(data);
  };

  return (
    <AuthLayout 
      title="Forgot Password" 
      subtitle="Enter your email to receive a password reset link"
    >
      <ForgotPasswordForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isLoading={isLoading}
        isError={isError}
        error={error?.response?.data?.message || 'An error occurred'}
      />
      <div className="mt-6 flex flex-col space-y-3 text-center text-sm">
        <p className="text-gray-400">
          Remember your password?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
            Back to login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordSmart;

