import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileBottomNav } from './MobileBottomNav';
import { ToastNotification } from '../common/ToastNotification';

export const AppLayout: React.FC = () => {
  const location = useLocation();

  // Certain screens like full-screen lesson runner shouldn't have sidebars
  const isLessonFlow = location.pathname.startsWith('/lesson/');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isLandingPage = location.pathname === '/';

  if (isLessonFlow) {
    return (
      <div className="min-h-screen bg-cream-200 text-teal-900 flex flex-col font-sans">
        <ToastNotification />
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
    );
  }

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-cream-200 text-teal-900 flex flex-col font-sans">
        <Navbar isLanding={true} />
        <ToastNotification />
        <main className="flex-1 flex items-center justify-center p-3 sm:p-4">
          <Outlet />
        </main>
      </div>
    );
  }

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-cream-200 text-teal-900 flex flex-col font-sans">
        <Navbar isLanding={true} />
        <ToastNotification />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-200 text-teal-900 flex font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-8">
        <Navbar />
        <ToastNotification />
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-6xl xl:max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
};
