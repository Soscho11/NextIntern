import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Terminal, 
  Briefcase, 
  Award, 
  Compass, 
  Settings2, 
  UserCheck, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Role } from '../../types';

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView, currentRole, setCurrentRole, user } = useApp();

  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    if (role === 'RECRUITER' && currentView !== 'recruiter' && currentView !== 'portfolio') {
      setCurrentView('recruiter');
    } else if (role === 'ADMIN' && currentView !== 'admin') {
      setCurrentView('admin');
    } else if (role === 'CANDIDATE' && (currentView === 'recruiter' || currentView === 'admin')) {
      setCurrentView('landing');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:border-emerald-400 transition-colors">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white">NextIntern</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">AI</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Workplace Simulator & Micro-Internships</p>
            </div>
          </button>

          {/* Primary Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                currentView === 'landing'
                  ? 'text-white bg-slate-800/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('workspace')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                currentView === 'workspace'
                  ? 'text-white bg-slate-800/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
              Workplace Simulator
            </button>
            <button
              onClick={() => setCurrentView('portfolio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                currentView === 'portfolio'
                  ? 'text-white bg-slate-800/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Award className="h-3.5 w-3.5 text-amber-400" />
              Proof-of-Work Dossier
            </button>
            <button
              onClick={() => setCurrentView('recruiter')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                currentView === 'recruiter'
                  ? 'text-white bg-slate-800/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5 text-blue-400" />
              Talent Directory
            </button>
            <button
              onClick={() => setCurrentView('onboarding')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                currentView === 'onboarding'
                  ? 'text-white bg-slate-800/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              Diagnostic Calibration
            </button>
          </nav>
        </div>

        {/* Right Action & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Segmented Role Switcher */}
          <div className="hidden lg:flex items-center rounded-lg border border-slate-800 bg-slate-900/80 p-0.5 text-xs">
            <span className="px-2 py-1 text-[11px] font-medium text-slate-500">View as:</span>
            <button
              onClick={() => handleRoleChange('CANDIDATE')}
              className={`px-2.5 py-1 font-medium rounded-md transition-all ${
                currentRole === 'CANDIDATE'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Candidate
            </button>
            <button
              onClick={() => handleRoleChange('RECRUITER')}
              className={`px-2.5 py-1 font-medium rounded-md transition-all ${
                currentRole === 'RECRUITER'
                  ? 'bg-slate-800 text-blue-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Recruiter
            </button>
            <button
              onClick={() => handleRoleChange('ADMIN')}
              className={`px-2.5 py-1 font-medium rounded-md transition-all ${
                currentRole === 'ADMIN'
                  ? 'bg-slate-800 text-amber-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Quick Launch CTA */}
          {currentView !== 'workspace' ? (
            <button
              onClick={() => setCurrentView('workspace')}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm"
            >
              <span>Launch Simulator</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('portfolio')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-600 transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Inspect Proof-of-Work</span>
            </button>
          )}

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-8 w-8 rounded-full border border-slate-700 object-cover"
            />
            <div className="hidden sm:block text-left text-xs">
              <div className="font-medium text-slate-200 leading-tight">{user.name.split(' ')[0]}</div>
              <div className="text-[10px] text-slate-400">{user.calibratedLevel || 'Junior II'}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
