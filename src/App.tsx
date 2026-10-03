import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { WorkplaceSimulator } from './components/workspace/WorkplaceSimulator';
import { ProofOfWorkPortfolio } from './components/portfolio/ProofOfWorkPortfolio';
import { RecruiterDiscovery } from './components/recruiter/RecruiterDiscovery';
import { DiagnosticAssessment } from './components/onboarding/DiagnosticAssessment';
import { AdminPortal } from './components/admin/AdminPortal';
import { Terminal } from 'lucide-react';

function AppContent() {
  const { currentView, setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-200">
      <Navbar />

      <main className="flex-1">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'workspace' && <WorkplaceSimulator />}
        {currentView === 'portfolio' && <ProofOfWorkPortfolio />}
        {currentView === 'recruiter' && <RecruiterDiscovery />}
        {currentView === 'onboarding' && <DiagnosticAssessment />}
        {currentView === 'admin' && <AdminPortal />}
      </main>

      {/* Footer for non-workspace views */}
      {currentView !== 'workspace' && (
        <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500/10 text-emerald-400">
                <Terminal className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold text-slate-300">NextIntern AI</span>
              <span>· Enterprise Workplace Simulator & Micro-Internship Platform</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <button onClick={() => setCurrentView('landing')} className="hover:text-slate-300">
                Home
              </button>
              <button onClick={() => setCurrentView('workspace')} className="hover:text-slate-300">
                Simulator
              </button>
              <button onClick={() => setCurrentView('portfolio')} className="hover:text-slate-300">
                Proof-of-Work
              </button>
              <button onClick={() => setCurrentView('recruiter')} className="hover:text-slate-300">
                Recruiters
              </button>
              <button onClick={() => setCurrentView('onboarding')} className="hover:text-slate-300">
                Diagnostic
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
