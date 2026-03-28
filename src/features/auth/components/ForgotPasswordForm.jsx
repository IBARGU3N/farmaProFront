import { Button } from '../../../components/ui/Button';
import { TextInput } from '../../../components/ui/TextInput';
import { Card } from '../../../components/ui/Card';

const ForgotPasswordForm = ({ onSubmit, register, errors, isLoading }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={onSubmit} className="space-y-6 p-6">
        <div className="space-y-4">
          <TextInput
            label="Email Address"
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
        </div>

        <div className="pt-2">
          <Button type="submit" isLoading={isLoading} className="w-full">
            Send Reset Link
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ForgotPasswordForm;


