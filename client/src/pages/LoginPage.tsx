import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/common/Input';
import { PasswordInput } from '../components/common/PasswordInput';
import { Button } from '../components/common/Button';
import { GoogleSignInButton } from '../components/common/GoogleSignInButton';
import { useNotification } from '../contexts/NotificationContext';
import { Mail, ArrowRight, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const { login, signInWithGoogle, loginAsGuest } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      await login(cleanEmail, password);
      addToast({
        type: 'success',
        title: 'Welcome Back!',
        message: 'Successfully logged in. Let us continue learning!',
      });
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setError(msg);
      addToast({
        type: 'error',
        title: 'Login Failed',
        message: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleSubmitting(true);
    try {
      await signInWithGoogle();
      addToast({
        type: 'success',
        title: 'Welcome to VANISETU! 🌟',
        message: 'Successfully signed in with Google.',
      });
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed. Please try again.';
      setError(msg);
      addToast({
        type: 'error',
        title: 'Sign In Failed',
        message: msg,
      });
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    addToast({
      type: 'info',
      title: 'Guest Mode Activated',
      message: 'Exploring as guest. Your progress will be stored in this browser session.',
    });
    navigate('/dashboard');
  };

  return (
    <div className="w-full max-w-md mx-auto my-8">
      <div className="bg-cream-100 border-3 border-sage-200 rounded-3xl p-6 sm:p-8 shadow-earthy-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold font-display text-forest-800">
            Welcome Back
          </h2>
          <p className="text-sm text-teal-700 font-medium mt-1">
            Sign in to continue your tribal language journey.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-terracotta-50 border-2 border-terracotta-300 rounded-2xl text-xs font-bold text-terracotta-700">
            {error}
          </div>
        )}

        {/* 1-Click Sign in with Google */}
        <div className="mb-5 space-y-4">
          <GoogleSignInButton
            onClick={handleGoogleSignIn}
            isLoading={isGoogleSubmitting}
            text="Sign in with Google"
          />

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 h-px bg-sage-200" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-500">
              or with email
            </span>
            <div className="flex-1 h-px bg-sage-200" />
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            leftIcon={<Mail className="w-5 h-5 text-forest-500" />}
            required
          />

          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs font-semibold pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-teal-800 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-forest-600 focus:ring-forest-500 w-4 h-4"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={() =>
                addToast({
                  type: 'info',
                  title: 'Password Reset',
                  message: 'A password reset link will be sent to your email address.',
                })
              }
              className="text-forest-600 hover:text-forest-800 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth={true}
              isLoading={isSubmitting}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Sign In
            </Button>
          </div>
        </form>

        {/* Guest Learning Option */}
        <div className="my-6 flex items-center justify-between gap-4">
          <div className="flex-1 h-px bg-sage-200" />
          <span className="text-xs font-bold uppercase tracking-wider text-teal-500">
            or explore
          </span>
          <div className="flex-1 h-px bg-sage-200" />
        </div>

        <Button
          type="button"
          variant="outline"
          size="md"
          fullWidth={true}
          onClick={handleGuestLogin}
          icon={<UserCheck className="w-4 h-4 text-forest-600" />}
        >
          Continue as Guest Learner
        </Button>

        {/* Link to Signup */}
        <p className="text-center text-xs text-teal-700 font-medium mt-6">
          Don&apos;t have an account yet?{' '}
          <Link to="/signup" className="font-bold text-forest-700 hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};
