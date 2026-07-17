/**
 * StadiumIQ — Register Page
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@context/AuthContext';
import { ROUTES } from '@constants';
import { extractErrorMessage } from '@utils';

const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const navigate                   = useNavigate();
  const [isLoading, setIsLoading]  = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email, password, displayName }) => {
    setIsLoading(true);
    try {
      await registerAuth(email, password, displayName);
      toast.success('Account created! Welcome to StadiumIQ.');
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-dark p-8">
      <h2 className="text-xl font-bold text-white mb-1">Create account</h2>
      <p className="text-white/40 text-sm mb-6">Join the StadiumIQ operations platform</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="reg-name" className="label">Display Name</label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              id="reg-name"
              type="text"
              placeholder="Your name"
              className="input pl-9"
              {...register('displayName')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-email" className="label">Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              id="reg-email"
              type="email"
              placeholder="you@example.com"
              className={`input pl-9 ${errors.email ? 'input-error' : ''}`}
              {...register('email', { required: 'Email is required.' })}
            />
          </div>
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="reg-password" className="label">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              id="reg-password"
              type="password"
              placeholder="At least 8 characters"
              className={`input pl-9 ${errors.password ? 'input-error' : ''}`}
              {...register('password', {
                required:  'Password is required.',
                minLength: { value: 8, message: 'Password must be at least 8 characters.' },
              })}
            />
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
          id="register-submit-btn"
        >
          {isLoading ? (
            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <><UserPlus size={15} /> Create Account</>
          )}
        </button>
      </form>

      <p className="text-white/30 text-sm text-center mt-6">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary-400 hover:text-primary-300 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
