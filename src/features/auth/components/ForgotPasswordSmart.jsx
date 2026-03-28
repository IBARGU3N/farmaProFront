import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { authService } from '../../../services/auth/authService';
import { AuthLayout } from './AuthLayout';
import ForgotPasswordForm from './ForgotPasswordForm';

export const ForgotPasswordSmart = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  const { mutate: forgotPassword, isLoading, isSuccess, isError, error } = useMutation({
    mutationFn: (data) => authService.forgotPassword(data.email),
  });

  const onSubmit = (data) => {
    forgotPassword(data);
  };

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email to receive a password reset link"
    >
      <ForgotPasswordForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        error={error?.response?.data?.message || 'An error occurred'}
      />
      <div className="mt-8 text-center">
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
