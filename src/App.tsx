import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const LandingPage = React.lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })));
const OnboardingPage = React.lazy(() => import('./pages/OnboardingPage').then(module => ({ default: module.OnboardingPage })));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })));

export default function App() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-neutral-50"><div className="w-8 h-8 rounded-full border-4 border-neutral-200 border-t-neutral-900 animate-spin" /></div>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Suspense>
  );
}
