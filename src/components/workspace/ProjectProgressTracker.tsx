import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Play, 
  GitPullRequest, 
  FileText, 
  ShieldCheck,
  Check,
  AlertCircle
} from 'lucide-react';
import { SimulationTask, RubricEvaluation } from '../../types';

export interface SubTaskItem {
  id: string;
  stepNumber: number;
  title: string;
  category: 'SPEC' | 'IMPLEMENTATION' | 'RESILIENCE' | 'TESTS' | 'AUDIT';
  description: string;
  completed: boolean;
  inProgress: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface ProjectProgressTrackerProps {
  task: SimulationTask;
  acceptanceCriteria: { id: string; completed: boolean }[];
  onToggleCriterion: (critId: string) => void;
  allTestsPassed: boolean;
  onRunTests: () => void;
  isTestRunning: boolean;
  review: RubricEvaluation | null;
  onSubmitPR: () => void;
  isEvaluating: boolean;
  onOpenTab: (tab: 'editor' | 'diff' | 'telemetry' | 'spec') => void;
}

export const ProjectProgressTracker: React.FC<ProjectProgressTrackerProps> = ({
  task,
  acceptanceCriteria,
  onToggleCriterion,
  allTestsPassed,
  onRunTests,
  isTestRunning,
  review,
  onSubmitPR,
  isEvaluating,
  onOpenTab,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Derive sub-task status
  const ac1Completed = !!acceptanceCriteria.find((c) => c.id === 'ac-1' || c.id === task.acceptanceCriteria[0]?.id)?.completed;
  const ac2Completed = !!acceptanceCriteria.find((c) => c.id === 'ac-2' || c.id === task.acceptanceCriteria[1]?.id)?.completed;
  const ac3Completed = !!acceptanceCriteria.find((c) => c.id === 'ac-3' || c.id === task.acceptanceCriteria[2]?.id)?.completed;
  const isPrApproved = review?.verdict === 'APPROVED';

  const subTasks: SubTaskItem[] = [
    {
      id: 'subtask-spec',
      stepNumber: 1,
      title: 'Context & RFC Protocol Ingestion',
      category: 'SPEC',
      description: `Review client ticket constraints, ${task.company.name} production SLAs, and RFC-6585 response headers.`,
      completed: true,
      inProgress: false,
      actionLabel: 'View Spec',
      onAction: () => onOpenTab('spec'),
    },
    {
      id: 'subtask-core-algo',
      stepNumber: 2,
      title: task.acceptanceCriteria[0]?.title || 'Core Algorithm & Token Bucket Math',
      category: 'IMPLEMENTATION',
      description: task.acceptanceCriteria[0]?.description || 'Replenish tokens based on sliding timestamp deltas.',
      completed: ac1Completed && ac2Completed,
      inProgress: !ac1Completed || !ac2Completed,
      actionLabel: 'Edit Code',
      onAction: () => onOpenTab('editor'),
    },
    {
      id: 'subtask-resilience',
      stepNumber: 3,
      title: task.acceptanceCriteria[2]?.title || 'Fail-Open Fault Tolerance & Fallback',
      category: 'RESILIENCE',
      description: task.acceptanceCriteria[2]?.description || 'Gracefully fallback to local memory when Redis connection drops.',
      completed: ac3Completed,
      inProgress: ac1Completed && ac2Completed && !ac3Completed,
      actionLabel: 'Inspect Fallback',
      onAction: () => onOpenTab('editor'),
    },
    {
      id: 'subtask-tests',
      stepNumber: 4,
      title: 'Automated Test Assertions Coverage',
      category: 'TESTS',
      description: 'Execute Jest test suites validating edge bursts, 429 Retry-After headers, and clock skew.',
      completed: allTestsPassed,
      inProgress: ac3Completed && !allTestsPassed,
      actionLabel: isTestRunning ? 'Running...' : 'Run Tests',
      onAction: onRunTests,
    },
    {
      id: 'subtask-audit',
      stepNumber: 5,
      title: 'Staff Architect PR Review & Hash Signature',
      category: 'AUDIT',
      description: 'Receive multi-dimensional rubric audit score >= 85 and generate tamper-proof verification hash.',
      completed: isPrApproved,
      inProgress: allTestsPassed && !isPrApproved,
      actionLabel: isEvaluating ? 'Evaluating...' : 'Submit PR',
      onAction: onSubmitPR,
    },
  ];

  const completedCount = subTasks.filter((st) => st.completed).length;
  const progressPercent = Math.round((completedCount / subTasks.length) * 100);

  return (
    <div className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      {/* Compact Tracker Strip */}
      <div className="mx-auto max-w-full px-4 py-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left: Overall Project Progress */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Sprint Milestone Progress
              </span>
              <span className="font-mono text-xs text-emerald-400 font-bold">
                {progressPercent}%
              </span>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-28 sm:w-36 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              {completedCount} of {subTasks.length} Sub-Tasks Done
            </span>
          </div>

          {/* Center: Step Indicators Ribbon */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
            {subTasks.map((step, idx) => {
              const isDone = step.completed;
              const isCurrent = step.inProgress;

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => {
                      if (step.onAction) step.onAction();
                      setIsExpanded(true);
                    }}
                    className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all text-left ${
                      isDone
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                        : isCurrent
                        ? 'bg-blue-500/10 border border-blue-500/40 text-blue-300 ring-1 ring-blue-500/30'
                        : 'bg-slate-900/60 border border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                    }`}
                    title={step.title}
                  >
                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950'
                        : isCurrent
                        ? 'bg-blue-500 text-white animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isDone ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : step.stepNumber}
                    </span>

                    <span className="truncate max-w-[110px] sm:max-w-[130px] font-medium text-[11px]">
                      {step.title.split(' ')[0]} {step.title.split(' ')[1] || ''}
                    </span>
                  </button>

                  {idx < subTasks.length - 1 && (
                    <div className={`h-0.5 w-2 sm:w-3 mx-1 shrink-0 ${
                      isDone ? 'bg-emerald-500/50' : 'bg-slate-800'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Expand / Collapse Toggle */}
          <div className="flex items-center gap-2 shrink-0 justify-end">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded border border-slate-800 bg-slate-900/80 hover:bg-slate-900 transition-colors"
            >
              <span>{isExpanded ? 'Hide Sub-Task Matrix' : 'Sub-Task Details'}</span>
              {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Detailed Expanded Sub-Tasks Drawer */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {subTasks.map((step) => {
                const isDone = step.completed;
                const isCurrent = step.inProgress;

                return (
                  <div
                    key={step.id}
                    className={`rounded-lg p-3 text-xs border transition-all flex flex-col justify-between ${
                      isDone
                        ? 'border-emerald-500/30 bg-emerald-950/20'
                        : isCurrent
                        ? 'border-blue-500/40 bg-blue-950/20'
                        : 'border-slate-800 bg-slate-900/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] text-slate-400 uppercase">
                          STEP 0{step.stepNumber} · {step.category}
                        </span>
                        {isDone ? (
                          <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400 font-semibold">
                            <CheckCircle2 className="h-3 w-3" />
                            VERIFIED
                          </span>
                        ) : isCurrent ? (
                          <span className="font-mono text-[10px] text-blue-400 font-semibold animate-pulse">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] text-slate-500">
                            PENDING
                          </span>
                        )}
                      </div>

                      <h4 className="font-semibold text-slate-100 text-[11px] mb-1 leading-snug">
                        {step.title}
                      </h4>
                      <p className="text-slate-400 text-[10px] leading-relaxed mb-3">
                        {step.description}
                      </p>
                    </div>

                    {step.actionLabel && (
                      <button
                        onClick={step.onAction}
                        className={`w-full py-1 px-2 rounded text-[10px] font-mono font-semibold transition-colors flex items-center justify-center gap-1 ${
                          isDone
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            : isCurrent
                            ? 'bg-blue-600 text-white hover:bg-blue-500'
                            : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {step.id === 'subtask-tests' && <Play className="h-2.5 w-2.5" />}
                        {step.id === 'subtask-audit' && <GitPullRequest className="h-2.5 w-2.5" />}
                        <span>{step.actionLabel}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
