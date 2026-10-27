import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/common/Input';
import { PasswordInput } from '../components/common/PasswordInput';
import { Button } from '../components/common/Button';
import { useNotification } from '../contexts/NotificationContext';
import { User, Mail, Sparkles, UserCheck } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup, loginAsGuest } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address (e.g. name@example.com).');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await signup(trimmedName, trimmedEmail, password);
      addToast({
        type: 'success',
        title: 'Account Created!',
        message: 'Welcome to VANISETU! Choose your tribal language to begin.',
      });
      navigate('/languages');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not create account. Please try again.';
      setError(msg);
      addToast({
        type: 'error',
        title: 'Signup Failed',
        message: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    addToast({
      type: 'info',
      title: 'Guest Mode Activated',
      message: 'Exploring as guest. Your progress will be saved locally.',
    });
    navigate('/languages');
  };

  return (
    <div className="w-full max-w-md mx-auto my-8">
      <div className="bg-cream-100 border-3 border-sage-200 rounded-3xl p-6 sm:p-8 shadow-earthy-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gold-100 border-2 border-gold-300 text-gold-700 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold font-display text-forest-800">
            Join VANISETU
          </h2>
          <p className="text-sm text-teal-700 font-medium mt-1">
            Start learning indigenous languages and preserving their cultural heritage.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-terracotta-50 border-2 border-terracotta-300 rounded-2xl text-xs font-bold text-terracotta-700">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Birsa Murmu"
            leftIcon={<User className="w-5 h-5 text-forest-500" />}
            required
          />

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
            placeholder="Minimum 6 characters"
            required
          />

          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="gold"
              size="lg"
              fullWidth={true}
              isLoading={isSubmitting}
            >
              Create Account
            </Button>
          </div>
        </form>

        {/* Guest Alternative */}
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
          Sample Lesson as Guest
        </Button>

        {/* Link to Login */}
        <p className="text-center text-xs text-teal-700 font-medium mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-forest-700 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};
