import { Button } from '../../../components/ui/Button';
import { TextInput } from '../../../components/ui/TextInput';
import { Card } from '../../../components/ui/Card';
import { motion } from 'framer-motion';

const ForgotPasswordForm = ({ onSubmit, register, errors, isLoading, apiError }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <motion.form 
        onSubmit={onSubmit} 
        className="space-y-6 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          <TextInput
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            error={errors?.email?.message || apiError}
            {...register('email')}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="pt-2"
        >
          <Button type="submit" isLoading={isLoading} className="w-full">
            Send Reset Link
          </Button>
        </motion.div>
      </motion.form>
    </Card>
  );
};

export default ForgotPasswordForm;
