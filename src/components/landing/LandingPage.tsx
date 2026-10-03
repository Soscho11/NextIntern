import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PATHWAYS } from '../../data/mockData';
import { 
  Terminal, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Code2, 
  Cpu, 
  Database, 
  FileText, 
  Layers, 
  Users, 
  TrendingUp,
  GitPullRequest,
  Check,
  ChevronRight,
  ExternalLink,
  Lock
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setActivePathwayId, setActiveTaskId, setCurrentRole } = useApp();
  const [selectedPathwayTab, setSelectedPathwayTab] = useState<string>('swe-cloud');

  const activePathway = PATHWAYS.find((p) => p.id === selectedPathwayTab) || PATHWAYS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Meta kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 font-mono mb-4">
              <span>Next-Gen Workplace Simulation</span>
              <span className="text-slate-600">·</span>
              <span>Autonomous Socratic Mentorship</span>
              <span className="text-slate-600">·</span>
              <span>Enterprise Proof-of-Work</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-[1.15]">
              Turn Unverified Potential Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Verifiable Proof-of-Work
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-300 sm:text-xl font-normal leading-relaxed">
              Bridge the entry-level <strong className="text-white font-medium">Experience Catch-22</strong>. 
              Step into simulated production engineering sprints, resolve uncleaned enterprise tickets under real SLAs, 
              work with Socratic AI Tech Leads, and earn tamper-proof cryptographic candidate dossiers.
            </p>

            {/* Dual CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  setActivePathwayId('swe-cloud');
                  setActiveTaskId('task-402');
                  setCurrentView('workspace');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-lg bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
              >
                <Terminal className="h-4 w-4" />
                <span>Start Micro-Internship</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  setCurrentRole('RECRUITER');
                  setCurrentView('recruiter');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/90 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:border-slate-500 hover:text-white transition-colors"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Hire Pre-Vetted Talent</span>
              </button>

              <button
                onClick={() => setCurrentView('onboarding')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors py-2 px-3"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>Take 5-Min Diagnostic Calibration</span>
              </button>
            </div>
          </div>

          {/* Interactive Workspace Mockup Preview */}
          <div className="mt-14 relative mx-auto max-w-5xl rounded-xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
            {/* Top IDE / Jira Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-slate-500 font-mono text-[11px] ml-2">cloudpulse-systems · sprint-28 · TASK-402</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Simulated Production Env
                </span>
                <span>branch: feat/task-402-rate-limiter</span>
              </div>
            </div>

            {/* Split Mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px] divide-y lg:divide-y-0 lg:divide-x divide-slate-800 font-sans">
              {/* Left: Jira Ticket Brief */}
              <div className="lg:col-span-4 p-5 bg-slate-950/60 text-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2 font-mono">
                  <span className="text-emerald-400 font-semibold">TICKET: TASK-402</span>
                  <span className="text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded text-[10px]">CRITICAL SLA</span>
                </div>
                <h3 className="font-semibold text-slate-100 text-sm mb-2">
                  Implement Token Bucket Rate-Limiter with Redis Fallback
                </h3>
                <p className="text-slate-400 text-[11px] leading-relaxed mb-4">
                  Unauthenticated scraping on /v1/telemetry/query is spiking p99 ingestion latency. 
                  Enforce 60 req/min token capacity, emit RFC-6585 headers, and fail-open when Redis disconnects.
                </p>

                <div className="border-t border-slate-800 pt-3">
                  <div className="text-[11px] font-medium text-slate-300 mb-2">Acceptance Criteria</div>
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check className="h-3.5 w-3.5" />
                      <span>Sliding window token replenishment</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check className="h-3.5 w-3.5" />
                      <span>HTTP 429 & Retry-After header calculation</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="h-3.5 w-3.5 rounded border border-slate-600" />
                      <span>Graceful local fallback during Redis drop</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center: Code Snippet & Terminal Output */}
              <div className="lg:col-span-5 p-5 bg-slate-900 flex flex-col justify-between font-mono text-xs">
                <div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-slate-800 mb-3">
                    <span className="text-slate-200">src/rate-limiter.ts</span>
                    <span className="text-emerald-400">Jest Test Suite: 4/4 Passed</span>
                  </div>
                  <pre className="text-slate-300 text-[11px] leading-relaxed overflow-x-auto">
                    <code>{`export async function evaluateTokenBucket(
  clientKey: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const elapsedSec = (Date.now() - state.lastRefill) / 1000;
  state.tokens = Math.min(config.max, state.tokens + (elapsedSec * refill));
  
  if (state.tokens >= 1) {
    state.tokens -= 1;
    return { allowed: true, remaining: Math.floor(state.tokens) };
  }
  return { allowed: false, retryAfterSec: calculateWait() };
}`}</code>
                  </pre>
                </div>

                <div className="mt-4 rounded bg-slate-950 p-2.5 border border-slate-800 text-[11px]">
                  <div className="text-emerald-400 font-semibold mb-1">✓ Jest Assertions: 4 Passed (18ms)</div>
                  <div className="text-slate-400">✓ TC-01: Permitted requests consume tokens</div>
                  <div className="text-slate-400">✓ TC-02: Burst traffic triggers HTTP 429 & Retry-After</div>
                </div>
              </div>

              {/* Right: Socratic Mentor Scaffolding */}
              <div className="lg:col-span-3 p-5 bg-slate-950/80 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800 mb-3">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" 
                      alt="Alex Vance" 
                      className="h-6 w-6 rounded-full border border-slate-700" 
                    />
                    <div>
                      <div className="text-slate-200 font-semibold text-[11px]">Alex Vance</div>
                      <div className="text-[10px] text-emerald-400">Senior Staff Architect (AI Mentor)</div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-900 p-3 text-[11px] text-slate-300 leading-relaxed border border-slate-800/80">
                    <p className="font-medium text-emerald-300 mb-1">Directional Scaffolding:</p>
                    "Good progress on the token calculation. But notice what happens if Redis encounters a 5-second socket timeout during high load. 
                    Will your handler fail open or crash the gateway? Review Acceptance Criterion #3."
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActivePathwayId('swe-cloud');
                    setActiveTaskId('task-402');
                    setCurrentView('workspace');
                  }}
                  className="mt-4 w-full flex items-center justify-center gap-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 py-1.5 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                >
                  <span>Launch Live Workspace</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM VS SOLUTION MATRIX */}
      <section className="py-20 border-b border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">Structural Breakthrough</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              The "Experience Catch-22" Solved
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              Entry-level jobs demand 2+ years of experience, but no one offers the first chance. 
              NextIntern AI converts hypothetical theory into auditable production execution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* The Broken Status Quo */}
            <div className="rounded-xl border border-rose-900/30 bg-rose-950/10 p-6 sm:p-8">
              <div className="flex items-center gap-3 text-rose-400 font-semibold mb-4">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-lg text-white">The Broken Traditional Path</h3>
              </div>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold">✕</span>
                  <div>
                    <strong className="text-white block font-medium">Toy Todo-App Repos</strong>
                    Generic tutorials with copy-pasted code that recruiters skip within 4 seconds.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold">✕</span>
                  <div>
                    <strong className="text-white block font-medium">Unverifiable Résumé Bullet Points</strong>
                    Self-proclaimed "experienced in distributed systems" without verifiable pull requests or execution audit.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold">✕</span>
                  <div>
                    <strong className="text-white block font-medium">LeetCode Disconnect</strong>
                    Inverting a binary tree does not test whether you can handle Redis dropouts or uncleaned CSV data in production.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold">✕</span>
                  <div>
                    <strong className="text-white block font-medium">Metro & Prestige College Bias</strong>
                    Talented self-taught and non-metro candidates get filtered by automated ATS keyword screeners.
                  </div>
                </li>
              </ul>
            </div>

            {/* The NextIntern AI Way */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-6 sm:p-8">
              <div className="flex items-center gap-3 text-emerald-400 font-semibold mb-4">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="text-lg text-white">The NextIntern AI Solution</h3>
              </div>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <div>
                    <strong className="text-white block font-medium">Enterprise Simulation Environments</strong>
                    Solve actual P1 outage tickets, corrupt datasets, and RFC protocol implementations under production SLAs.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <div>
                    <strong className="text-white block font-medium">Socratic Scaffolding (No AI Spoon-Feeding)</strong>
                    Senior Staff AI mentor guides your architectural intuition and edge case thinking without handing out answers.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <div>
                    <strong className="text-white block font-medium">Multi-Dimensional Rubric Audits</strong>
                    Automated code review evaluates Technical Soundness, Business Specs, Error Resilience, and Documentation.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <div>
                    <strong className="text-white block font-medium">Tamper-Proof Proof-of-Work Ledger</strong>
                    Cryptographically hashed candidate dossiers with inspectable PR diffs and real unit test passes.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STEP-BY-STEP SIMULATION FLOW */}
      <section className="py-20 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">End-to-End Journey</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              5 Steps from Potential to Hired
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              How NextIntern AI operates as a dynamic, autonomous workplace simulator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Adaptive Calibration',
                description: 'A 5-minute interactive scenario dynamically identifies whether you start at Junior I, Junior II, or Mid-level.',
                icon: Sparkles,
              },
              {
                step: '02',
                title: 'Virtual Enterprise Sprints',
                description: 'Receive real Jira tickets, client briefs, and uncleaned datasets from simulated Series B companies.',
                icon: Briefcase,
              },
              {
                step: '03',
                title: 'Socratic AI Mentorship',
                description: 'Interact with Staff Architect Alex Vance for architectural hints, race condition traps, and edge cases.',
                icon: Users,
              },
              {
                step: '04',
                title: 'Multi-Rubric Evaluation',
                description: 'Automated PR audit measures Technical Soundness, Business Specs, Error Resilience, and Code Clarity.',
                icon: GitPullRequest,
              },
              {
                step: '05',
                title: 'Verifiable Proof Dossier',
                description: 'A tamper-proof ledger link with live code diffs and test passes that hiring managers can verify in 1 click.',
                icon: ShieldCheck,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-3">
                      <span>STEP {item.step}</span>
                      <Icon className="h-4 w-4 text-emerald-400" />
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE PATHWAY EXPLORER */}
      <section className="py-20 border-b border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">Curated Tracks</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Simulated Enterprise Pathways
              </h2>
              <p className="mt-3 text-slate-400 text-sm max-w-xl">
                Real companies. Production tickets. No toy tutorials. Pick your track and build proof-of-work.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="mt-6 md:mt-0 flex flex-wrap gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800">
              {PATHWAYS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPathwayTab(p.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    selectedPathwayTab === p.id
                      ? 'bg-emerald-500 text-slate-950 font-semibold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p.category}
                </button>
              ))}
            </div>
          </div>

          {/* Active Track Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <span>Sponsored by {activePathway.companySponsor}</span>
                  <span>·</span>
                  <span className="text-emerald-400">{activePathway.difficultyLevel}</span>
                  <span>·</span>
                  <span>{activePathway.durationEst}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{activePathway.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {activePathway.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">Core Skills Validated</div>
                  <div className="flex flex-wrap gap-2">
                    {activePathway.skills.map((skill, i) => (
                      <span key={i} className="text-xs text-slate-300 bg-slate-800 border border-slate-700/80 px-2.5 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setActivePathwayId(activePathway.id);
                      setActiveTaskId(activePathway.tasks[0]?.id || 'task-402');
                      setCurrentView('workspace');
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
                  >
                    <span>Launch Ticket #{activePathway.tasks[0]?.ticketId}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentView('onboarding')}
                    className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    Check My Fit First →
                  </button>
                </div>
              </div>

              {/* Right: Ticket Breakdown */}
              <div className="lg:col-span-5 bg-slate-950 rounded-lg p-5 border border-slate-800/80">
                <div className="text-xs font-mono text-emerald-400 mb-3 flex items-center justify-between">
                  <span>SPRINT TICKETS ({activePathway.tasks.length})</span>
                  <span className="text-slate-500">Production Mode</span>
                </div>

                <div className="space-y-3">
                  {activePathway.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => {
                        setActivePathwayId(activePathway.id);
                        setActiveTaskId(task.id);
                        setCurrentView('workspace');
                      }}
                      className="group cursor-pointer rounded border border-slate-800/80 bg-slate-900/50 p-3 hover:border-emerald-500/50 transition-all"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-semibold text-emerald-400 group-hover:text-emerald-300">
                          {task.ticketId}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {task.priority}
                        </span>
                      </div>
                      <div className="font-medium text-slate-200 text-xs mb-1 group-hover:text-white">
                        {task.title}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {task.briefDescription}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SOCIAL PROOF & DEMOCRATIZATION METRICS */}
      <section className="py-20 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40">
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">84%</div>
              <div className="mt-2 text-sm font-semibold text-white">Interview Conversion</div>
              <p className="mt-1 text-xs text-slate-400">For non-metro & self-taught candidates submitting verified dossiers</p>
            </div>
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40">
              <div className="text-3xl font-extrabold text-teal-400 font-mono">3.8x</div>
              <div className="mt-2 text-sm font-semibold text-white">Faster Time-to-Offer</div>
              <p className="mt-1 text-xs text-slate-400">Hiring managers bypass screening calls by inspecting live code diffs</p>
            </div>
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40">
              <div className="text-3xl font-extrabold text-cyan-400 font-mono">100%</div>
              <div className="mt-2 text-sm font-semibold text-white">Tamper-Proof Ledger</div>
              <p className="mt-1 text-xs text-slate-400">Every pull request and test run is cryptographically fingerprinted</p>
            </div>
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40">
              <div className="text-3xl font-extrabold text-violet-400 font-mono">0 Bias</div>
              <div className="mt-2 text-sm font-semibold text-white">Blind Rubric Auditing</div>
              <p className="mt-1 text-xs text-slate-400">Scored solely on technical soundness, resilience, and business specs</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER BANNER */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Prove Your Engineering Caliber?
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            Take on an enterprise ticket right now. Get feedback from Staff Architect Alex Vance, 
            pass production tests, and generate your verifiable proof-of-work link.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                setActivePathwayId('swe-cloud');
                setActiveTaskId('task-402');
                setCurrentView('workspace');
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Terminal className="h-4 w-4" />
              <span>Launch Ticket TASK-402</span>
            </button>
            <button
              onClick={() => setCurrentView('portfolio')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-200 hover:text-white transition-colors"
            >
              <span>View Verified Dossier Sample</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
