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

// Admin CMS Components & Pages
import { AdminRouteGuard } from './components/admin/AdminRouteGuard';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLanguagesPage } from './pages/admin/AdminLanguagesPage';
import { AdminModulesPage } from './pages/admin/AdminModulesPage';
import { AdminLessonsPage } from './pages/admin/AdminLessonsPage';
import { AdminQuestionsPage } from './pages/admin/AdminQuestionsPage';
import { AdminVocabularyPage } from './pages/admin/AdminVocabularyPage';
import { AdminContributionsPage } from './pages/admin/AdminContributionsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminRolesPage } from './pages/admin/AdminRolesPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <LearningProvider>
            <Routes>
              {/* Learner Facing Application */}
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
              </Route>

              {/* VANISETU Admin Panel & CMS */}
              <Route
                path="/admin"
                element={
                  <AdminRouteGuard>
                    <AdminLayout />
                  </AdminRouteGuard>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="languages" element={<AdminLanguagesPage />} />
                <Route path="modules" element={<AdminModulesPage />} />
                <Route path="lessons" element={<AdminLessonsPage />} />
                <Route path="questions" element={<AdminQuestionsPage />} />
                <Route path="vocabulary" element={<AdminVocabularyPage />} />
                <Route path="contributions" element={<AdminContributionsPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="roles" element={<AdminRolesPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
                <Route path="media" element={<AdminMediaPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="notifications" element={<AdminNotificationsPage />} />
                <Route path="audit-logs" element={<AdminAuditLogsPage />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </LearningProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};

export default App;
