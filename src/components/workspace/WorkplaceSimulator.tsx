import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Terminal as TerminalIcon, 
  Play, 
  Send, 
  GitPullRequest, 
  CheckCircle2, 
  AlertCircle, 
  FileCode, 
  FileText, 
  Database, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  RotateCcw, 
  Check, 
  Clock, 
  ChevronRight,
  Maximize2,
  Minimize2,
  Activity,
  Layers,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RubricEvaluation } from '../../types';
import { ProjectProgressTracker } from './ProjectProgressTracker';

export const WorkplaceSimulator: React.FC = () => {
  const { 
    currentTask, 
    currentPathway,
    progress, 
    updateTaskCode, 
    setActiveFile, 
    toggleAcceptanceCriterion,
    runTests,
    sendMentorMessage,
    submitForReview,
    isEvaluating,
    isMentorTyping,
    setCurrentView
  } = useApp();

  const taskProg = progress[currentTask.id] || {
    status: 'IN_PROGRESS',
    code: { ...currentTask.files },
    activeFile: currentTask.activeFile,
    testCases: [...currentTask.testCases],
    acceptanceCriteria: currentTask.acceptanceCriteria.map((ac) => ({ id: ac.id, completed: !!ac.completed })),
    currentIteration: 1,
    chatHistory: [],
  };

  const activeFilename = taskProg.activeFile || currentTask.activeFile;
  const currentCode = taskProg.code[activeFilename] || '';

  // Workspace UI states
  const [activeTab, setActiveTab] = useState<'editor' | 'diff' | 'telemetry' | 'spec'>('editor');
  const [activeOutputTab, setActiveOutputTab] = useState<'tests' | 'telemetry' | 'pr'>('tests');
  const [mentorInput, setMentorInput] = useState<string>('');
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
  const [testOutputLogs, setTestOutputLogs] = useState<string[]>([]);
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [latestReview, setLatestReview] = useState<RubricEvaluation | null>(taskProg.rubric || null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  // Live Token Bucket interactive telemetry state
  const [simReqRate, setSimReqRate] = useState<number>(30); // req/min
  const [simTokensRemaining, setSimTokensRemaining] = useState<number>(60);
  const [simBlockedCount, setSimBlockedCount] = useState<number>(0);
  const [simAllowedCount, setSimAllowedCount] = useState<number>(120);

  // Tick simulated telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setSimTokensRemaining((prev) => {
        const added = 1; // 1 token/sec refill
        const consumed = simReqRate > 60 ? 2 : 1;
        const next = Math.max(0, Math.min(60, prev + added - consumed));
        if (next === 0 && simReqRate > 60) {
          setSimBlockedCount((c) => c + 1);
        } else {
          setSimAllowedCount((c) => c + 1);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [simReqRate]);

  // Handle Run Tests
  const handleExecuteTests = async () => {
    setIsTestRunning(true);
    setActiveOutputTab('tests');
    setTestOutputLogs(['$ npm test -- --coverage --verbose', 'Running 4 test suites...']);

    await new Promise((resolve) => setTimeout(resolve, 800));
    setTestOutputLogs((prev) => [
      ...prev,
      ' PASS  test/rate-limiter.test.ts',
      '  ✓ TC-01: Permitted requests consume tokens and return remaining count (4ms)',
      '  ✓ TC-02: Burst traffic beyond max capacity triggers HTTP 429 with Retry-After (8ms)',
      '  ✓ TC-03: Graceful fallback fails open when Redis connectivity is severed (12ms)',
      '  ✓ TC-04: Clock drift arithmetic preserves integer boundary checks (6ms)',
      '',
      'Test Suites: 1 passed, 1 total',
      'Tests:       4 passed, 4 total',
      'Snapshots:   0 total',
      'Time:        1.42s',
      'Coverage:    96.4% Statements | 94.2% Branches | 100% Functions',
    ]);
    await runTests(currentTask.id);
    setIsTestRunning(false);
  };

  // Handle Send Mentor Message
  const handleSendMentor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mentorInput.trim()) return;
    const msg = mentorInput;
    setMentorInput('');
    await sendMentorMessage(currentTask.id, msg);
  };

  // Quick mentor suggestions
  const handleQuickPrompt = (promptText: string) => {
    sendMentorMessage(currentTask.id, promptText);
  };

  // Handle Submit Pull Request
  const handleSubmitPR = async () => {
    try {
      const evaluation = await submitForReview(currentTask.id);
      setLatestReview(evaluation);
      setReviewModalOpen(true);
      setActiveOutputTab('pr');

      if (evaluation.verdict === 'APPROVED') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  const allTestsPassed = taskProg.testCases.every((tc) => tc.passed);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. TOP ENTERPRISE SPRINT BAR */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono">
            <span className="font-bold text-white text-sm">{currentTask.company.name}</span>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400 font-semibold">{currentTask.sprint}</span>
            <span className="text-slate-600">/</span>
            <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-bold text-rose-400 font-mono">
              {currentTask.priority}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-400 font-mono text-[11px] pl-3 border-l border-slate-800">
            <span className="text-slate-500">git:</span>
            <span className="text-slate-200">{currentTask.prTemplate.branch}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Iteration #{taskProg.currentIteration}</span>
          </div>

          {/* Action: Run Tests */}
          <button
            onClick={handleExecuteTests}
            disabled={isTestRunning}
            className="inline-flex items-center gap-1.5 rounded bg-slate-800 px-3 py-1.5 font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Play className={`h-3.5 w-3.5 text-emerald-400 ${isTestRunning ? 'animate-spin' : ''}`} />
            <span>{isTestRunning ? 'Running Tests...' : 'Run Test Suite'}</span>
          </button>

          {/* Action: Submit PR */}
          <button
            onClick={handleSubmitPR}
            disabled={isEvaluating}
            className="inline-flex items-center gap-1.5 rounded bg-emerald-500 px-3.5 py-1.5 font-semibold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm disabled:opacity-50"
          >
            <GitPullRequest className="h-3.5 w-3.5" />
            <span>{isEvaluating ? 'Evaluating Code...' : 'Submit Pull Request'}</span>
          </button>
        </div>
      </div>

      {/* SUB-TASK PROGRESS TRACKER (Step Indicators & Progress Bar) */}
      <ProjectProgressTracker
        task={currentTask}
        acceptanceCriteria={taskProg.acceptanceCriteria}
        onToggleCriterion={(critId) => toggleAcceptanceCriterion(currentTask.id, critId)}
        allTestsPassed={allTestsPassed}
        onRunTests={handleExecuteTests}
        isTestRunning={isTestRunning}
        review={latestReview}
        onSubmitPR={handleSubmitPR}
        isEvaluating={isEvaluating}
        onOpenTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'spec' && currentTask.resources[0]) {
            setSelectedAsset(currentTask.resources[0].name);
          }
        }}
      />

      {/* 2. MAIN WORKSPACE (Split 3-Col Layout: Jira Ticket | Code & Output | Socratic AI Mentor) */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANE: Jira / Linear Ticket & Specs (320px) */}
        <div className="w-80 border-r border-slate-800 bg-slate-950/90 flex flex-col overflow-hidden hidden md:flex shrink-0">
          <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between text-xs">
            <span className="font-mono font-semibold text-emerald-400">{currentTask.ticketId} Specification</span>
            <span className="text-slate-500 font-mono text-[10px]">P1 Production SLA</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-slate-300">
            {/* Title & PM Context */}
            <div>
              <h2 className="text-sm font-bold text-white mb-2">{currentTask.title}</h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-3">
                <img src={currentTask.productManager.avatar} alt="PM" className="h-5 w-5 rounded-full" />
                <span>Reported by {currentTask.productManager.name} ({currentTask.productManager.role})</span>
              </div>
              <div className="rounded bg-slate-900 p-2.5 text-[11px] text-slate-300 leading-relaxed border border-slate-800/80">
                {currentTask.clientContext}
              </div>
            </div>

            {/* Acceptance Criteria Checklist */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-white uppercase tracking-wider font-mono mb-2">
                <span>Acceptance Criteria</span>
                <span className="text-emerald-400">
                  {taskProg.acceptanceCriteria.filter((c) => c.completed).length} / {currentTask.acceptanceCriteria.length} Done
                </span>
              </div>
              <div className="space-y-2">
                {currentTask.acceptanceCriteria.map((ac) => {
                  const isChecked = taskProg.acceptanceCriteria.find((c) => c.id === ac.id)?.completed;
                  return (
                    <div
                      key={ac.id}
                      onClick={() => toggleAcceptanceCriterion(currentTask.id, ac.id)}
                      className={`cursor-pointer rounded p-2.5 border transition-all ${
                        isChecked
                          ? 'border-emerald-500/40 bg-emerald-950/20 text-slate-200'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          isChecked ? 'border-emerald-400 bg-emerald-500 text-slate-950' : 'border-slate-600'
                        }`}>
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <div>
                          <div className={`font-medium ${isChecked ? 'text-white' : 'text-slate-300'}`}>
                            {ac.title}
                          </div>
                          <p className="mt-1 text-[10px] text-slate-400 leading-relaxed">
                            {ac.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attached Assets / RFC Specs */}
            <div>
              <div className="text-[11px] font-semibold text-white uppercase tracking-wider font-mono mb-2">
                Resources & Data Specs ({currentTask.resources.length})
              </div>
              <div className="space-y-1.5">
                {currentTask.resources.map((asset, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedAsset(asset.name);
                      setActiveTab('spec');
                    }}
                    className="w-full text-left rounded p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="font-mono text-[11px] text-slate-200">{asset.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase">{asset.type}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER PANE: Code Editor & Output Tabs */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
          {/* File Tabs & Views */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-2 text-xs">
            <div className="flex items-center gap-1 overflow-x-auto">
              {Object.keys(currentTask.files).map((filename) => (
                <button
                  key={filename}
                  onClick={() => {
                    setActiveFile(currentTask.id, filename);
                    setActiveTab('editor');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono border-b-2 transition-colors ${
                    activeFilename === filename && activeTab === 'editor'
                      ? 'border-emerald-500 text-white bg-slate-900'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{filename}</span>
                </button>
              ))}

              <button
                onClick={() => setActiveTab('telemetry')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono border-b-2 transition-colors ${
                  activeTab === 'telemetry'
                    ? 'border-cyan-500 text-white bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Activity className="h-3.5 w-3.5 text-cyan-400" />
                <span>Live Telemetry Visualizer</span>
              </button>

              {selectedAsset && (
                <button
                  onClick={() => setActiveTab('spec')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono border-b-2 transition-colors ${
                    activeTab === 'spec'
                      ? 'border-amber-500 text-white bg-slate-900'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 text-amber-400" />
                  <span>{selectedAsset}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 pr-2 text-slate-500 font-mono text-[11px]">
              <span>TypeScript 5.4</span>
              <span>·</span>
              <span>UTF-8</span>
            </div>
          </div>

          {/* Center Editor Body */}
          <div className="flex-1 overflow-hidden relative">
            {activeTab === 'editor' && (
              <div className="h-full flex flex-col">
                <textarea
                  value={currentCode}
                  onChange={(e) => updateTaskCode(currentTask.id, activeFilename, e.target.value)}
                  className="w-full h-full resize-none p-4 font-mono text-xs sm:text-[13px] leading-relaxed bg-slate-900 text-slate-200 outline-none selection:bg-emerald-500/20 selection:text-emerald-200 border-none"
                  spellCheck={false}
                />
              </div>
            )}

            {activeTab === 'telemetry' && (
              <div className="h-full overflow-y-auto p-6 bg-slate-950 text-xs">
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Activity className="h-4 w-4 text-cyan-400" />
                        Interactive Gateway Telemetry & Bucket Simulator
                      </h3>
                      <p className="text-slate-400 text-xs mt-1">
                        Test your rate limiter under simulated production load in real time.
                      </p>
                    </div>
                    <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">
                      LIVE INGESTION
                    </span>
                  </div>

                  {/* Load Slider Control */}
                  <div className="rounded-lg bg-slate-900 p-4 border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-200">Simulated Request Pressure</span>
                      <span className="font-mono text-emerald-400 font-bold text-sm">
                        {simReqRate} requests / min
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={120}
                      step={5}
                      value={simReqRate}
                      onChange={(e) => setSimReqRate(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                      <span>10 req/min (Normal Traffic)</span>
                      <span>60 req/min (Max Capacity)</span>
                      <span>120 req/min (Burst Scraping)</span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-lg bg-slate-900 p-4 border border-slate-800">
                      <div className="text-slate-400 text-[11px] mb-1">Tokens Remaining in Bucket</div>
                      <div className="text-2xl font-bold font-mono text-emerald-400">
                        {simTokensRemaining} / 60
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 transition-all duration-300"
                          style={{ width: `${(simTokensRemaining / 60) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="rounded-lg bg-slate-900 p-4 border border-slate-800">
                      <div className="text-slate-400 text-[11px] mb-1">HTTP 200 OK (Allowed)</div>
                      <div className="text-2xl font-bold font-mono text-blue-400">
                        {simAllowedCount}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-2">Passed through to upstream telemetry</div>
                    </div>

                    <div className="rounded-lg bg-slate-900 p-4 border border-slate-800">
                      <div className="text-slate-400 text-[11px] mb-1">HTTP 429 Too Many Requests</div>
                      <div className="text-2xl font-bold font-mono text-rose-400">
                        {simBlockedCount}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-2">Throttled with Retry-After header</div>
                    </div>
                  </div>

                  {/* Telemetry Log Stream */}
                  <div className="rounded-lg bg-slate-900 p-4 border border-slate-800 font-mono text-[11px]">
                    <div className="text-slate-400 mb-2 font-semibold flex items-center justify-between">
                      <span>Gateway Access Log Stream</span>
                      <span className="text-[10px] text-slate-500">Auto-refreshing</span>
                    </div>
                    <div className="space-y-1 text-slate-300">
                      <div className="text-emerald-400">
                        [200 OK] GET /v1/telemetry/query · 198.51.100.42 · remaining: {simTokensRemaining}
                      </div>
                      {simTokensRemaining <= 2 && (
                        <div className="text-rose-400">
                          [429 THROTTLED] GET /v1/telemetry/query · 198.51.100.42 · Retry-After: 4s
                        </div>
                      )}
                      <div className="text-slate-500">
                        [DEBUG] Token replenishment tick: +1 token/sec added to client key bucket.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'spec' && selectedAsset && (
              <div className="h-full overflow-y-auto p-6 bg-slate-950 font-mono text-xs text-slate-300">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                    <span className="font-bold text-white text-sm">{selectedAsset}</span>
                    <button
                      onClick={() => setActiveTab('editor')}
                      className="text-xs text-emerald-400 hover:underline font-sans"
                    >
                      Back to Code Editor →
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap leading-relaxed">
                    {currentTask.resources.find((r) => r.name === selectedAsset)?.content || 'Asset not found.'}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM OUTPUT PANE: Terminal / Test Runner / PR Review */}
          <div className="h-44 border-t border-slate-800 bg-slate-950 flex flex-col shrink-0">
            {/* Output Sub-Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-3 py-1.5 text-xs">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveOutputTab('tests')}
                  className={`font-mono text-[11px] font-medium transition-colors ${
                    activeOutputTab === 'tests' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Jest Test Runner ({taskProg.testCases.filter((tc) => tc.passed).length}/4)
                </button>
                <button
                  onClick={() => setActiveOutputTab('pr')}
                  className={`font-mono text-[11px] font-medium transition-colors ${
                    activeOutputTab === 'pr' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  PR Rubric Feedback {latestReview && `(${latestReview.overallScore}%)`}
                </button>
              </div>

              <div className="text-[10px] font-mono text-slate-500">
                Terminal: bash (node v22.14)
              </div>
            </div>

            {/* Output Contents */}
            <div className="flex-1 overflow-y-auto p-3 font-mono text-xs text-slate-300">
              {activeOutputTab === 'tests' && (
                <div className="space-y-1">
                  {testOutputLogs.length > 0 ? (
                    testOutputLogs.map((log, i) => (
                      <div
                        key={i}
                        className={
                          log.includes('✓') || log.includes('PASS')
                            ? 'text-emerald-400'
                            : log.includes('✕') || log.includes('FAIL')
                            ? 'text-rose-400'
                            : log.includes('$')
                            ? 'text-slate-400 font-bold'
                            : 'text-slate-300'
                        }
                      >
                        {log}
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500">
                      Click "Run Test Suite" to execute simulated Jest test assertions against your code.
                    </div>
                  )}
                </div>
              )}

              {activeOutputTab === 'pr' && (
                <div>
                  {latestReview ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className={`font-bold uppercase font-mono px-2 py-0.5 rounded text-[11px] ${
                          latestReview.verdict === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {latestReview.verdict.replace('_', ' ')} · Overall {latestReview.overallScore}/100
                        </span>
                        <span className="text-[11px] text-slate-400 font-sans">{latestReview.summary}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        <button
                          onClick={() => setReviewModalOpen(true)}
                          className="text-emerald-400 underline font-semibold font-sans"
                        >
                          View Full Multi-Dimensional Rubric & Proof-of-Work Badge →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-500">
                      Submit your pull request to receive line-by-line code review comments and multi-dimensional rubric scoring.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Socratic AI Tech Lead Mentorship (Alex Vance) (340px) */}
        <div className="w-80 lg:w-96 border-l border-slate-800 bg-slate-950 flex flex-col overflow-hidden shrink-0">
          {/* Mentor Profile Header */}
          <div className="p-3 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={currentTask.seniorLead.avatar}
                alt={currentTask.seniorLead.name}
                className="h-8 w-8 rounded-full border border-emerald-500/40 object-cover"
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{currentTask.seniorLead.name}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[10px] text-slate-400">{currentTask.seniorLead.role}</div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Socratic Mode
            </span>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {taskProg.chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-lg p-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="mt-1 text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
              </div>
            ))}

            {isMentorTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-spin" />
                <span>Alex is reviewing architectural implications...</span>
              </div>
            )}
          </div>

          {/* Quick Socratic Prompt Prompts */}
          <div className="p-2 border-t border-slate-800/80 bg-slate-900/40">
            <div className="text-[10px] text-slate-500 uppercase font-mono mb-1.5 px-1">
              Ask Senior Tech Lead:
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleQuickPrompt("How should I handle the Redis socket timeout without crashing?")}
                className="text-[10px] text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white px-2 py-1 rounded transition-colors text-left"
              >
                Fail-Open Posture?
              </button>
              <button
                onClick={() => handleQuickPrompt("Review my calculation for the Retry-After header.")}
                className="text-[10px] text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white px-2 py-1 rounded transition-colors text-left"
              >
                Retry-After Math?
              </button>
              <button
                onClick={() => handleQuickPrompt("Are there concurrency race conditions in my token deduction?")}
                className="text-[10px] text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white px-2 py-1 rounded transition-colors text-left"
              >
                Race Condition Check?
              </button>
            </div>
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMentor} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
            <input
              type="text"
              value={mentorInput}
              onChange={(e) => setMentorInput(e.target.value)}
              placeholder="Ask Alex for guidance or edge case hints..."
              className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!mentorInput.trim() || isMentorTyping}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition-colors shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. MULTI-DIMENSIONAL RUBRIC REVIEW MODAL */}
      {reviewModalOpen && latestReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl rounded-xl border border-slate-700 bg-slate-900 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                    latestReview.verdict === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {latestReview.verdict.replace('_', ' ')}
                  </span>
                  <span className="text-xl font-bold text-white">
                    Overall Score: {latestReview.overallScore}/100
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Evaluated against 4 enterprise dimensions for {currentTask.ticketId}
                </p>
              </div>

              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕ Close
              </button>
            </div>

            {/* Rubric 4-Dimension Scores */}
            <div className="my-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800">
                <div className="text-[11px] text-slate-400">Technical Soundness</div>
                <div className="text-xl font-bold font-mono text-emerald-400">{latestReview.technicalScore}%</div>
                <div className="mt-1 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: `${latestReview.technicalScore}%` }} />
                </div>
              </div>

              <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800">
                <div className="text-[11px] text-slate-400">Business Specs</div>
                <div className="text-xl font-bold font-mono text-teal-400">{latestReview.businessScore}%</div>
                <div className="mt-1 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400" style={{ width: `${latestReview.businessScore}%` }} />
                </div>
              </div>

              <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800">
                <div className="text-[11px] text-slate-400">Error Resilience</div>
                <div className="text-xl font-bold font-mono text-cyan-400">{latestReview.resilienceScore}%</div>
                <div className="mt-1 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${latestReview.resilienceScore}%` }} />
                </div>
              </div>

              <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800">
                <div className="text-[11px] text-slate-400">Documentation & Types</div>
                <div className="text-xl font-bold font-mono text-blue-400">{latestReview.documentationScore}%</div>
                <div className="mt-1 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400" style={{ width: `${latestReview.documentationScore}%` }} />
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 text-xs text-slate-300 leading-relaxed mb-6">
              <span className="font-mono font-semibold text-emerald-400 block mb-1">EXECUTIVE EVALUATION SUMMARY</span>
              {latestReview.summary}
            </div>

            {/* Line-by-Line PR Comments */}
            {latestReview.lineComments && latestReview.lineComments.length > 0 && (
              <div className="mb-6">
                <div className="text-xs font-mono uppercase text-slate-400 mb-2">Line-by-Line Pull Request Comments</div>
                <div className="space-y-2">
                  {latestReview.lineComments.map((comment, i) => (
                    <div key={i} className="rounded bg-slate-950 p-3 border border-slate-800 text-xs">
                      <div className="flex items-center justify-between text-slate-400 font-mono mb-1 text-[11px]">
                        <span className="text-emerald-400">{comment.file} : Line {comment.line}</span>
                        <span className="uppercase text-[10px]">{comment.severity}</span>
                      </div>
                      <p className="text-slate-300">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cryptographic Proof-of-Work Verification Badge */}
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
                  <ShieldCheck className="h-4 w-4" />
                  <span>TAMPER-PROOF PROOF-OF-WORK HASH GENERATED</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(latestReview.verificationHash);
                    setCopiedHash(true);
                    setTimeout(() => setCopiedHash(false), 2000);
                  }}
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white"
                >
                  {copiedHash ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                </button>
              </div>
              <p className="font-mono text-[11px] text-slate-400 break-all select-all bg-slate-950/80 p-2 rounded border border-slate-800">
                {latestReview.verificationHash}
              </p>
            </div>

            {/* Modal Footer CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Continue Iterating in Simulator
              </button>

              <button
                onClick={() => {
                  setReviewModalOpen(false);
                  setCurrentView('portfolio');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <span>Inspect Public Proof-of-Work Dossier</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
