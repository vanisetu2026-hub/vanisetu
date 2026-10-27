import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  AlertTriangle,
  Flame,
  Award,
  Globe,
  CheckCircle,
  HelpCircle,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type { PlatformSettings, AdminLanguage } from '../../types';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sData, lData] = await Promise.all([
        adminApi.getSettings(),
        adminApi.getLanguages()
      ]);
      setSettings(sData);
      setLanguages(lData);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load platform settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      const updated = await adminApi.updateSettings(settings);
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update platform settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-xl text-center text-sm text-vanisetu-text-muted border border-vanisetu-primary/10">
        Loading platform configurations...
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="bg-white p-8 rounded-xl text-center text-red-600 text-sm border border-red-200">
        {error || 'Unable to retrieve settings'}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-vanisetu-primary flex items-center gap-2">
            <Settings className="w-7 h-7 text-vanisetu-accent" />
            Platform Settings & System Configuration
          </h1>
          <p className="text-sm text-vanisetu-text-muted mt-1">
            Global metadata, pedagogical gamification weights, social channels, and maintenance mode status.
          </p>
        </div>
        {saveSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-semibold animate-pulse">
            <CheckCircle className="w-4 h-4" />
            Platform configurations saved!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Maintenance Mode Banner Card */}
        <div className={`p-5 rounded-xl border transition ${
          settings.maintenanceMode
            ? 'bg-red-50 border-red-200 text-red-900'
            : 'bg-white border-vanisetu-primary/10 shadow-sm'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${settings.maintenanceMode ? 'bg-red-100 text-red-700' : 'bg-amber-50 text-amber-600'}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Maintenance Mode</h3>
                <p className="text-xs text-vanisetu-text-muted mt-0.5">
                  When enabled, non-admin learners will receive a system maintenance warning screen.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>

        {/* Brand & Platform Identity */}
        <div className="bg-white p-6 rounded-xl border border-vanisetu-primary/10 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-vanisetu-primary uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-vanisetu-accent" />
            Platform Identity & General Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Platform Name</label>
              <input
                type="text"
                required
                value={settings.platformName}
                onChange={e => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none font-bold text-vanisetu-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tagline</label>
              <input
                type="text"
                required
                value={settings.tagline}
                onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Platform Description</label>
            <textarea
              rows={2}
              value={settings.description}
              onChange={e => setSettings({ ...settings, description: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Default Selected Language</label>
              <select
                value={settings.defaultLanguage}
                onChange={e => setSettings({ ...settings, defaultLanguage: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
              >
                {languages.map(l => (
                  <option key={l.languageId} value={l.languageId}>
                    {l.name} ({l.nativeName})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Support Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* Gamification & XP Calibrations */}
        <div className="bg-white p-6 rounded-xl border border-vanisetu-primary/10 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-vanisetu-primary uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-vanisetu-accent" />
            Gamification, Streaks & XP Reward Engine
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Base Lesson XP</label>
              <input
                type="number"
                min={5}
                max={100}
                value={settings.baseXpReward}
                onChange={e => setSettings({ ...settings, baseXpReward: parseInt(e.target.value) || 10 })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none font-bold"
              />
              <span className="text-[10px] text-vanisetu-text-muted">Earned on lesson completion</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">100% Accuracy Bonus</label>
              <input
                type="number"
                min={0}
                max={50}
                value={settings.bonusAccuracyXp}
                onChange={e => setSettings({ ...settings, bonusAccuracyXp: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none font-bold"
              />
              <span className="text-[10px] text-vanisetu-text-muted">Flawless exercise bonus</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Daily Streak Bonus</label>
              <input
                type="number"
                min={1}
                max={50}
                value={settings.dailyStreakBonusXp}
                onChange={e => setSettings({ ...settings, dailyStreakBonusXp: parseInt(e.target.value) || 5 })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none font-bold"
              />
              <span className="text-[10px] text-vanisetu-text-muted">Daily retention multiplier</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Contribution XP</label>
              <input
                type="number"
                min={5}
                max={200}
                value={settings.contributionXpReward}
                onChange={e => setSettings({ ...settings, contributionXpReward: parseInt(e.target.value) || 25 })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none font-bold"
              />
              <span className="text-[10px] text-vanisetu-text-muted">For approved contributions</span>
            </div>
          </div>
        </div>

        {/* Social Links & Legal */}
        <div className="bg-white p-6 rounded-xl border border-vanisetu-primary/10 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-vanisetu-primary uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-vanisetu-accent" />
            Social Media Channels & Policy URLs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Twitter / X Profile URL</label>
              <input
                type="url"
                value={settings.socialX || ''}
                onChange={e => setSettings({ ...settings, socialX: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Instagram Profile URL</label>
              <input
                type="url"
                value={settings.socialInstagram || ''}
                onChange={e => setSettings({ ...settings, socialInstagram: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Privacy Policy URL</label>
              <input
                type="text"
                value={settings.privacyUrl || '/privacy'}
                onChange={e => setSettings({ ...settings, privacyUrl: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Terms of Service URL</label>
              <input
                type="text"
                value={settings.termsUrl || '/terms'}
                onChange={e => setSettings({ ...settings, termsUrl: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-vanisetu-primary text-vanisetu-cream rounded-xl text-sm font-bold hover:bg-vanisetu-primary-dark transition shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Changes...' : 'Save System Configurations'}
          </button>
        </div>
      </form>
    </div>
  );
};
