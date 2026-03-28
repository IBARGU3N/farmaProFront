import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { authService } from '../../../services/auth/authService';
import { AuthLayout } from './AuthLayout';
import ResetPasswordForm from './ResetPasswordForm';

const ResetPasswordSmart = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  const { mutate: resetPassword, isLoading, isError, error } = useMutation({
    mutationFn: (data) => authService.resetPassword({ token, ...data }),
    onSuccess: () => {
      navigate('/login?message=password-reset-success', { replace: true });
    },
    onError: (err) => {
      console.error('Reset password failed', err);
      reset({ email: '', password: '', password_confirmation: '' });
    },
  });

  const onSubmit = (data) => {
    resetPassword(data);
  };

  if (!token) {
    return (
      <AuthLayout title="Invalid Request" subtitle="Password reset link is invalid or expired">
        <div className="text-center mt-6">
          <button 
            onClick={() => navigate('/forgot-password', { replace: true })}
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200"
          >
            Go to Forgot Password
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your new password below"
    >
      <ResetPasswordForm
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
          Remember your password?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
            Back to login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordSmart;

