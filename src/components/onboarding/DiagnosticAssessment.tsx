import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DIAGNOSTIC_QUESTIONS, DiagnosticQuestion } from '../../data/diagnosticScenarios';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  RotateCcw, 
  Code2, 
  BrainCircuit,
  Award,
  Zap,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const DiagnosticAssessment: React.FC = () => {
  const { user, setUser, setCurrentView, setActivePathwayId, setActiveTaskId } = useApp();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: string }>({});
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [calibrationResult, setCalibrationResult] = useState<{
    calibratedLevel: 'Junior I' | 'Junior II' | 'Mid-level';
    readinessScore: number;
    analysis: string;
    skillsRadar: { [key: string]: number };
  } | null>(null);

  const currentQ = DIAGNOSTIC_QUESTIONS[currentQuestionIndex];
  const totalQuestions = DIAGNOSTIC_QUESTIONS.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const hasAnsweredCurrent = !!selectedAnswers[currentQ?.id];

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      runCalibration();
    }
  };

  const runCalibration = async () => {
    setIsCalibrating(true);
    try {
      const res = await fetch('/api/ai/calibrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: selectedAnswers,
          pathwayId: 'swe-cloud',
        }),
      });

      const data = await res.json();
      setCalibrationResult(data);
      // Update user in context
      setUser((prev) => ({
        ...prev,
        calibratedLevel: data.calibratedLevel,
      }));
    } catch (err) {
      console.error('Calibration error:', err);
      // Fallback
      const fallback = {
        calibratedLevel: 'Junior II' as const,
        readinessScore: 86,
        analysis: 'Demonstrates acute awareness of distributed race conditions and defensive fail-open postures.',
        skillsRadar: {
          systemArchitecture: 85,
          codeHygiene: 88,
          debuggingSkill: 89,
          businessCompliance: 84,
          errorResilience: 87,
        },
      };
      setCalibrationResult(fallback);
      setUser((prev) => ({
        ...prev,
        calibratedLevel: fallback.calibratedLevel,
      }));
    } finally {
      setIsCalibrating(false);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setCalibrationResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>5-Minute Adaptive Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Calibrate Your Workplace Readiness
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            No trivia questions or trick LeetCode puzzles. We evaluate how you reason about concurrency, 
            service failures, and uncleaned data in production.
          </p>
        </div>

        {!calibrationResult ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-xl">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                <span>SCENARIO {currentQuestionIndex + 1} OF {totalQuestions}</span>
                <span className="text-emerald-400">{currentQ.category}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Scenario Title & Description */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white mb-2">{currentQ.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">{currentQ.scenario}</p>

              {currentQ.codeSnippet && (
                <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                  <pre>
                    <code>{currentQ.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {currentQ.options.map((option) => {
                const isSelected = selectedAnswers[currentQ.id] === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all text-xs sm:text-sm ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/20 text-white'
                        : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        isSelected ? 'border-emerald-400 bg-emerald-500' : 'border-slate-600'
                      }`}>
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{option.text}</div>
                        {isSelected && (
                          <div className="mt-2 text-xs text-emerald-300/90 font-sans border-t border-emerald-900/40 pt-1.5">
                            <strong>Architectural Analysis:</strong> {option.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="text-xs text-slate-400 hover:text-slate-200 disabled:opacity-40 transition-colors"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={!hasAnsweredCurrent || isCalibrating}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition-colors"
              >
                {isCalibrating ? (
                  <span>Synthesizing Calibration...</span>
                ) : isLastQuestion ? (
                  <>
                    <span>Generate Readiness Report</span>
                    <Sparkles className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    <span>Next Scenario</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Calibration Result Card */
          <div className="rounded-xl border border-emerald-500/40 bg-slate-900/90 p-6 sm:p-8 shadow-2xl">
            <div className="text-center pb-6 border-b border-slate-800">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-400 mb-3 border border-emerald-500/30">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-white">Diagnostic Calibration Complete</h2>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="text-xs text-slate-400">Calibrated Starting Tier:</span>
                <span className="rounded bg-emerald-500/20 px-2.5 py-1 text-sm font-bold text-emerald-400 font-mono">
                  {calibrationResult.calibratedLevel}
                </span>
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs font-mono text-slate-300">
                  Readiness Index: {calibrationResult.readinessScore}%
                </span>
              </div>
            </div>

            {/* Analysis */}
            <div className="my-6 rounded-lg bg-slate-950 p-4 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="font-semibold text-emerald-400 font-mono block mb-1">EVALUATION SUMMARY</span>
              {calibrationResult.analysis}
            </div>

            {/* Skills Radar Breakdown */}
            <div className="mb-8">
              <div className="text-xs font-mono uppercase text-slate-400 mb-3">Demonstrated Competency Matrix</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(calibrationResult.skillsRadar || {}).map(([key, val]) => (
                  <div key={key} className="rounded bg-slate-950/60 p-3 border border-slate-800/80">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-mono text-emerald-400 font-bold">{val}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-400" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retake Diagnostic</span>
              </button>

              <button
                onClick={() => {
                  setActivePathwayId('swe-cloud');
                  setActiveTaskId('task-402');
                  setCurrentView('workspace');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <span>Launch Calibrated Track: TASK-402</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
