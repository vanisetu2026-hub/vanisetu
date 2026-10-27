import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLearning } from '../contexts/LearningContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { PasswordInput } from '../components/common/PasswordInput';
import { useNotification } from '../contexts/NotificationContext';
import {
  Settings as SettingsIcon,
  User,
  Globe2,
  Lock,
  Volume2,
  LogOut,
  CheckCircle2,
  Shield,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { allLanguages, selectedLanguage, setSelectedLanguageId } = useLearning();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [dailyGoal, setDailyGoal] = useState(user?.dailyGoal?.toString() || '50');

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({
      name,
      dailyGoal: parseInt(dailyGoal, 10) || 50,
    });
    addToast({
      type: 'success',
      title: 'Preferences Saved',
      message: 'Account details successfully updated.',
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      addToast({
        type: 'error',
        message: 'Password must be at least 6 characters.',
      });
      return;
    }
    setNewPassword('');
    addToast({
      type: 'success',
      title: 'Password Updated',
      message: 'Your new password has been applied.',
    });
  };

  const handleLogout = async () => {
    await logout();
    addToast({
      type: 'info',
      message: 'Logged out successfully. See you again! (Johar)',
    });
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="border-b-2 border-sage-200 pb-4">
        <div className="flex items-center gap-2 text-forest-700 mb-1">
          <SettingsIcon className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Configuration</span>
        </div>
        <h1 className="text-3xl font-extrabold font-display text-teal-950">
          Application Settings
        </h1>
        <p className="text-sm text-teal-700 font-medium">
          Manage your account profile, learning goals, language preferences, and security.
        </p>
      </div>

      {/* 1. Account & Learning Profile */}
      <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-sage-200">
          <User className="w-5 h-5 text-forest-600" />
          <h3 className="font-display font-extrabold text-lg text-teal-950">
            Learner Profile & Goals
          </h3>
        </div>

        <form onSubmit={handleSaveGeneral} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
            <Input
              label="Email Address"
              value={email}
              disabled
              helperText="Associated with your learning identity"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-teal-800 mb-1.5">
                Active Tribal Language
              </label>
              <select
                value={selectedLanguage.languageId}
                onChange={(e) => setSelectedLanguageId(e.target.value)}
                className="w-full rounded-2xl bg-cream-50 border-2 border-sage-200 py-3 px-4 text-teal-900 font-bold focus:border-forest-600 outline-none"
              >
                {allLanguages.map((l) => (
                  <option key={l.languageId} value={l.languageId}>
                    {l.name} ({l.nativeName})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Daily Learning Goal (XP)"
              type="number"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              min="10"
              max="500"
              helperText="Target points per day"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="md" icon={<CheckCircle2 className="w-4 h-4" />}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* 2. Security & Password */}
      <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-sage-200">
          <Lock className="w-5 h-5 text-gold-600" />
          <h3 className="font-display font-extrabold text-lg text-teal-950">
            Security & Password
          </h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="outline"
              size="md"
              disabled={!newPassword}
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* 3. Session & Sign Out */}
      <div className="bg-terracotta-50/60 border-2 border-terracotta-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-display font-bold text-base text-terracotta-900">
            Account Session
          </h4>
          <p className="text-xs text-terracotta-700 mt-0.5">
            Sign out of your current session on this device.
          </p>
        </div>

        <Button
          variant="danger"
          size="md"
          onClick={handleLogout}
          icon={<LogOut className="w-4 h-4" />}
        >
          Sign Out of VANISETU
        </Button>
      </div>
    </div>
  );
};
