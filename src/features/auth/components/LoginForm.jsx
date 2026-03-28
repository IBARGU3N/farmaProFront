import { Button } from '../../../components/ui/Button';
import { TextInput } from '../../../components/ui/TextInput';
import { Card } from '../../../components/ui/Card';

const LoginForm = ({ onSubmit, register, errors, isLoading }) => {
  return (
    <Card className="w-full max-w-md">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <TextInput
            label="Email"
            type="email"
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })} 
            error={errors?.password?.message}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Button type="submit" isLoading={isLoading}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default LoginForm;
