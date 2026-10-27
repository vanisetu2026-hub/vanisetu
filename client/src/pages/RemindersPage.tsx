import React, { useState } from 'react';
import { useLearning } from '../contexts/LearningContext';
import { Button } from '../components/common/Button';
import { ReminderSettings } from '../types';
import { Bell, Clock, Calendar, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

export const RemindersPage: React.FC = () => {
  const { reminderSettings, updateReminderSettings } = useLearning();

  const [enabled, setEnabled] = useState(reminderSettings.enabled);
  const [time, setTime] = useState(reminderSettings.time);
  const [days, setDays] = useState<string[]>(reminderSettings.days);
  const [soundEnabled, setSoundEnabled] = useState(reminderSettings.sound);

  const daysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    const updated: ReminderSettings = {
      enabled,
      time,
      days,
      sound: soundEnabled,
    };
    updateReminderSettings(updated);
  };

  const presetTimes = ['08:00', '12:30', '18:00', '21:00'];

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-3xl bg-gold-100 border-2 border-gold-300 text-gold-700 flex items-center justify-center mx-auto shadow-sm">
          <Bell className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-teal-950">
          Build a Habit with Reminders
        </h1>
        <p className="text-xs sm:text-sm text-teal-700 font-medium max-w-md mx-auto">
          Just 5 minutes of tribal language learning every day keeps your tongue fluent and your cultural connection alive.
        </p>
      </div>

      {/* Main Settings Card */}
      <div className="bg-cream-100 border-2 sm:border-3 border-sage-200 rounded-3xl p-5 sm:p-8 shadow-earthy space-y-5 sm:space-y-6">
        {/* Enable / Disable Switch */}
        <div className="flex items-center justify-between pb-5 sm:pb-6 border-b border-sage-200 gap-4">
          <div>
            <h3 className="font-display font-extrabold text-base sm:text-lg text-teal-950">
              Daily Practice Notifications
            </h3>
            <p className="text-xs text-teal-600 font-medium">
              Receive a gentle nudge on your preferred days and time.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-7 sm:w-14 sm:h-8 bg-cream-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 sm:peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-cream-50 after:border-sage-300 after:border after:rounded-full after:h-5 after:w-5 sm:after:h-6 sm:after:w-6 after:transition-all peer-checked:bg-forest-600" />
          </label>
        </div>

        {enabled && (
          <>
            {/* Preferred Time Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-teal-900">
                <Clock className="w-4 h-4 text-forest-600" />
                <span>Preferred Reminder Time</span>
              </label>

              {/* Time input & Presets */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-cream-50 border-2 border-sage-300 rounded-2xl px-4 py-2 sm:py-2.5 text-base sm:text-lg font-bold text-teal-900 focus:border-forest-600 outline-none w-full sm:w-auto"
                />

                {/* Presets */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {presetTimes.map((pt) => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => setTime(pt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        time === pt
                          ? 'bg-forest-600 text-cream-50 shadow-sm'
                          : 'bg-cream-200 text-teal-800 hover:bg-cream-300'
                      }`}
                    >
                      {pt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preferred Days Selection */}
            <div className="space-y-2.5 sm:space-y-3 pt-2 sm:pt-3">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-teal-900">
                <Calendar className="w-4 h-4 text-gold-600" />
                <span>Learning Days of the Week</span>
              </label>

              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {daysList.map((day) => {
                  const isSelected = days.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`
                        py-2 sm:py-3 px-0.5 sm:px-1 rounded-2xl font-bold text-[11px] sm:text-sm text-center border-2 transition-all touch-manipulation select-none
                        ${
                          isSelected
                            ? 'bg-gold-400 border-gold-500 text-teal-950 shadow-[0_2px_0_#CF841C] sm:shadow-[0_3px_0_#CF841C]'
                            : 'bg-cream-200/80 border-sage-300 text-teal-700 hover:bg-cream-200'
                        }
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Audio Feedback Sound Toggle */}
            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-sage-200 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center shrink-0">
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-teal-950">Sound Effects & Fanfare</h4>
                  <p className="text-[11px] sm:text-xs text-teal-600">Play celebratory sounds during lessons.</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-5 h-5 text-forest-600 rounded focus:ring-forest-500"
              />
            </div>
          </>
        )}

        {/* Save Preferences Button */}
        <div className="pt-2 sm:pt-4">
          <Button
            variant="gold"
            size="lg"
            fullWidth={true}
            onClick={handleSave}
            icon={<CheckCircle2 className="w-5 h-5" />}
          >
            Save Reminder Preferences
          </Button>
        </div>
      </div>

      <div className="p-3 sm:p-4 bg-cream-50 rounded-2xl border border-sage-200 text-xs text-teal-700 text-center font-medium">
        <Sparkles className="w-4 h-4 text-gold-500 inline mr-1.5" />
        Push notifications integrate with your browser&apos;s notification system and device reminders.
      </div>
    </div>
  );
};
