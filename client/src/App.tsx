import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { LearningProvider } from './contexts/LearningContext';

import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { LanguageSelectionPage } from './pages/LanguageSelectionPage';
import { DashboardPage } from './pages/DashboardPage';
import { LessonPage } from './pages/LessonPage';
import { VocabularyFlashcardsPage } from './pages/VocabularyFlashcardsPage';
import { TranslationPage } from './pages/TranslationPage';
import { LessonCompletedPage } from './pages/LessonCompletedPage';
import { DictionaryPage } from './pages/DictionaryPage';
import { ProfilePage } from './pages/ProfilePage';
import { RemindersPage } from './pages/RemindersPage';
import { SettingsPage } from './pages/SettingsPage';
import { CommunityPage } from './pages/CommunityPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <LearningProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/languages" element={<LanguageSelectionPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/learn" element={<DashboardPage />} />
                <Route path="/lesson/:lessonId" element={<LessonPage />} />
                <Route path="/vocabulary" element={<VocabularyFlashcardsPage />} />
                <Route path="/translate" element={<TranslationPage />} />
                <Route path="/lesson-completed" element={<LessonCompletedPage />} />
                <Route path="/dictionary" element={<DictionaryPage />} />
                <Route path="/progress" element={<ProfilePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/reminders" element={<RemindersPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </LearningProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};

export default App;
