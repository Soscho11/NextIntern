import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PATHWAYS } from '../../data/mockData';
import { 
  Settings2, 
  Layers, 
  Sliders, 
  Plus, 
  CheckCircle2, 
  Users, 
  FileCode, 
  Award, 
  Activity,
  Save,
  Trash2,
  Edit3
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { setCurrentView, setActivePathwayId, setActiveTaskId } = useApp();

  // Rubric weights
  const [weights, setWeights] = useState({
    technical: 35,
    business: 35,
    resilience: 20,
    documentation: 10,
  });
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Active track selection
  const [selectedTrackId, setSelectedTrackId] = useState<string>('swe-cloud');
  const selectedTrack = PATHWAYS.find((p) => p.id === selectedTrackId) || PATHWAYS[0];

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 mb-2">
              <Settings2 className="h-4 w-4" />
              <span>Admin & Instructor Control Room</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              Simulation Scenario & Rubric Management
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Oversee enterprise tracks, tune AI Socratic guardrails, adjust rubric evaluation weights, and monitor candidate completion telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('workspace')}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Test as Candidate
            </button>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="text-xs text-slate-400">Active Simulated Interns</div>
            <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">1,248</div>
            <div className="mt-1 text-[11px] text-slate-500">Across 3 verified pathways</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="text-xs text-slate-400">PR Reviews Dispatched</div>
            <div className="mt-2 text-2xl font-bold font-mono text-cyan-400">4,912</div>
            <div className="mt-1 text-[11px] text-slate-500">Automated multi-rubric audits</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="text-xs text-slate-400">PR First-Attempt Pass Rate</div>
            <div className="mt-2 text-2xl font-bold font-mono text-blue-400">38.4%</div>
            <div className="mt-1 text-[11px] text-slate-500">Strict enterprise grading standards</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="text-xs text-slate-400">Avg Iterations to Approval</div>
            <div className="mt-2 text-2xl font-bold font-mono text-amber-400">2.6</div>
            <div className="mt-1 text-[11px] text-slate-500">Supported by Socratic scaffolding</div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Pathway & Task Scenario Manager */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-base">Enterprise Pathways & Sprints</h3>
                <select
                  value={selectedTrackId}
                  onChange={(e) => setSelectedTrackId(e.target.value)}
                  className="rounded bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 outline-none"
                >
                  {PATHWAYS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-slate-400 mb-4">{selectedTrack.description}</p>

              {/* Tickets List */}
              <div className="space-y-3">
                {selectedTrack.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-400 text-xs">
                          {task.ticketId}
                        </span>
                        <span className="text-xs font-semibold text-white">{task.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{task.priority}</span>
                    </div>

                    <p className="text-xs text-slate-400 mb-3">{task.briefDescription}</p>

                    <div className="text-[11px] text-slate-300 font-mono mb-2">
                      Acceptance Criteria ({task.acceptanceCriteria.length}):
                    </div>
                    <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                      {task.acceptanceCriteria.map((ac) => (
                        <li key={ac.id} className="truncate">{ac.title}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Rubric Weighting Customizer */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleSaveWeights} className="rounded-xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sliders className="h-5 w-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Automated Rubric Weights</h3>
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Configure how the NextIntern AI automated evaluation engine computes composite candidate scores. Must sum to 100%.
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-medium text-slate-300">Technical Soundness</span>
                    <span className="font-mono text-emerald-400 font-bold">{weights.technical}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    value={weights.technical}
                    onChange={(e) => setWeights({ ...weights, technical: Number(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-medium text-slate-300">Business Specs Compliance</span>
                    <span className="font-mono text-teal-400 font-bold">{weights.business}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    value={weights.business}
                    onChange={(e) => setWeights({ ...weights, business: Number(e.target.value) })}
                    className="w-full accent-teal-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-medium text-slate-300">Error Resilience & Defensiveness</span>
                    <span className="font-mono text-cyan-400 font-bold">{weights.resilience}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    value={weights.resilience}
                    onChange={(e) => setWeights({ ...weights, resilience: Number(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-medium text-slate-300">Documentation & Typing</span>
                    <span className="font-mono text-blue-400 font-bold">{weights.documentation}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    value={weights.documentation}
                    onChange={(e) => setWeights({ ...weights, documentation: Number(e.target.value) })}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Total: {weights.technical + weights.business + weights.resilience + weights.documentation}%
                </span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Update Grading Weights</span>
                </button>
              </div>

              {savedSuccess && (
                <div className="mt-3 rounded bg-emerald-950/40 border border-emerald-500/40 p-2.5 text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Rubric weights applied successfully to all active simulation pipelines.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
