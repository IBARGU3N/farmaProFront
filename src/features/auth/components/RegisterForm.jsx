import { Button } from '../../../components/ui/Button';
import { TextInput } from '../../../components/ui/TextInput';
import { Card } from '../../../components/ui/Card';

const RegisterForm = ({ onSubmit, register, watch, errors, isLoading }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={onSubmit} className="space-y-6 p-6">
        <div className="space-y-4">
          <TextInput
            label="Full Name"
            type="text"
            placeholder="John Doe"
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
              }
            })}
            error={errors?.name?.message}
          />

          <TextInput
            label="Email"
            type="email"
            placeholder="john@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Email address is invalid'
              }
            })}
            error={errors?.email?.message}
          />

          <TextInput
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
            error={errors?.password?.message}
          />

          <TextInput
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            {...register('password_confirmation', {
              required: 'Please confirm your password',
              validate: (value) => value === watch('password') || 'Passwords do not match'
            })}
            error={errors?.password_confirmation?.message}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" isLoading={isLoading} className="w-full">
            Create Account
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default RegisterForm;

