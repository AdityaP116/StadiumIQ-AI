/**
 * StadiumIQ — Login Page
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@context/AuthContext';
import { ROUTES } from '@constants';
import { extractErrorMessage } from '@utils';

const LoginPage = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate                     = useNavigate();
  const location                     = useLocation();
  const [isLoading, setIsLoading]    = useState(false);
  const from                         = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    setIsLoading(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-dark p-8">
      <h2 className="text-xl font-bold text-white mb-1">Sign in</h2>
      <p className="text-white/40 text-sm mb-6">Access the StadiumIQ operations platform</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="label">Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              className={`input pl-9 ${errors.email ? 'input-error' : ''}`}
              {...register('email', { required: 'Email is required.' })}
            />
          </div>
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="login-password" className="label">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              className={`input pl-9 ${errors.password ? 'input-error' : ''}`}
              {...register('password', { required: 'Password is required.' })}
            />
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
          id="login-submit-btn"
        >
          {isLoading ? (
            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <><LogIn size={15} /> Sign In</>
          )}
        </button>
      </form>

      <div className="divider my-5" />

      <button
        onClick={onGoogleSignIn}
        disabled={isLoading}
        className="btn-secondary w-full"
        id="google-signin-btn"
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <p className="text-white/30 text-sm text-center mt-6">
        Don&apos;t have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-primary-400 hover:text-primary-300 transition-colors">
          Register
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
