import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../../services/auth/authService';
import { AuthLayout } from './AuthLayout';
import ResetPasswordForm from './ResetPasswordForm';

export const ResetPasswordSmart = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm({
    mode: 'onChange',
  });

  const { mutate: resetPassword, isLoading, isError, error } = useMutation({
    mutationFn: (data) => authService.resetPassword({
      ...data,
      token,
      email
    }),
    onSuccess: () => {
      // Redirect to login after successful reset
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    },
  });

  const onSubmit = (data) => {
    resetPassword(data);
  };

  return (
    <AuthLayout 
      title="Create New Password" 
      subtitle="Complete the form to set a new password for your account"
    >
      <ResetPasswordForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isLoading={isLoading}
        isSuccess={false} // Managed by higher level if needed
        isError={isError}
        error={error?.response?.data?.message || 'An error occurred'}
      />
      <div className="mt-8 text-center text-sm">
        <Link 
          to="/login" 
          className="text-[#473198]/60 hover:text-[#473198] text-sm font-bold transition-all duration-200"
        >
          &larr; Back to login
        </Link>
      </div>
    </AuthLayout>
  );
};
