import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CANDIDATE_PROFILES } from '../../data/mockData';
import { 
  UserCheck, 
  Search, 
  Filter, 
  ShieldCheck, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  GitPullRequest, 
  Code2, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  Mail,
  Scale
} from 'lucide-react';
import { CandidateDossier } from '../../types';

export const RecruiterDiscovery: React.FC = () => {
  const { 
    shortlistedUsernames, 
    toggleShortlistCandidate, 
    setActiveCandidateUsername, 
    setCurrentView 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<string>('all');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(90);
  const [compareCandidateA, setCompareCandidateA] = useState<CandidateDossier | null>(null);
  const [compareCandidateB, setCompareCandidateB] = useState<CandidateDossier | null>(null);
  const [compareModalOpen, setCompareModalOpen] = useState<boolean>(false);

  // Filter candidates
  const filteredCandidates = CANDIDATE_PROFILES.filter((c) => {
    const matchesSearch = 
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skillsRadar.some((s) => s.label.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTrack = 
      selectedTrackFilter === 'all' || 
      c.pathwayCompleted.toLowerCase().includes(selectedTrackFilter.toLowerCase());

    const matchesScore = c.aggregateScores.overall >= minScoreFilter;

    return matchesSearch && matchesTrack && matchesScore;
  });

  const handleOpenDossier = (username: string) => {
    setActiveCandidateUsername(username);
    setCurrentView('portfolio');
  };

  const handleStartCompare = (candidate: CandidateDossier) => {
    if (!compareCandidateA) {
      setCompareCandidateA(candidate);
    } else if (!compareCandidateB && compareCandidateA.username !== candidate.username) {
      setCompareCandidateB(candidate);
      setCompareModalOpen(true);
    } else {
      setCompareCandidateA(candidate);
      setCompareCandidateB(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 mb-2">
              <UserCheck className="h-4 w-4" />
              <span>Hiring Manager & Recruiter Discovery</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              Pre-Vetted Engineering Talent
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
              Inspect actual code quality, defensive edge case handling, and automated rubric audits. 
              No résumé buzzwords or unverified claims.
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="rounded bg-slate-900 border border-slate-800 px-3 py-2">
              <span className="text-slate-400">Total Pre-Vetted: </span>
              <span className="font-bold text-emerald-400">{CANDIDATE_PROFILES.length} Verified</span>
            </div>
            <div className="rounded bg-slate-900 border border-slate-800 px-3 py-2">
              <span className="text-slate-400">Shortlisted: </span>
              <span className="font-bold text-blue-400">{shortlistedUsernames.length} Candidates</span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by candidate name, skill, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          {/* Pathway Track Selector */}
          <div className="sm:col-span-4">
            <select
              value={selectedTrackFilter}
              onChange={(e) => setSelectedTrackFilter(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Verified Pathways</option>
              <option value="cloud">Cloud & Distributed Systems</option>
              <option value="data">Data Engineering & Reconcile</option>
              <option value="ai">AI & Retrieval Systems</option>
            </select>
          </div>

          {/* Minimum Rubric Score */}
          <div className="sm:col-span-3 flex items-center justify-between text-xs bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-mono">Min Score:</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={80}
                max={96}
                value={minScoreFilter}
                onChange={(e) => setMinScoreFilter(Number(e.target.value))}
                className="w-20 accent-blue-500"
              />
              <span className="font-mono font-bold text-blue-400">{minScoreFilter}%+</span>
            </div>
          </div>
        </div>

        {/* Candidate Cards Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => {
            const isShortlisted = shortlistedUsernames.includes(candidate.username);
            const isSelectedForCompare = compareCandidateA?.username === candidate.username;

            return (
              <div
                key={candidate.username}
                className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
              >
                <div>
                  {/* Card Top: Avatar, Name & Bookmark */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={candidate.avatarUrl}
                        alt={candidate.fullName}
                        className="h-12 w-12 rounded-full border border-slate-700 object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-white text-base leading-tight group-hover:text-blue-400 transition-colors">
                          {candidate.fullName}
                        </h3>
                        <span className="text-[11px] text-slate-400">{candidate.location}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleShortlistCandidate(candidate.username)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isShortlisted
                          ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                      title="Shortlist Candidate"
                    >
                      {isShortlisted ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 font-medium mb-3 line-clamp-2">
                    {candidate.headline}
                  </p>

                  {/* Micro-Internship Sponsorship Badge */}
                  <div className="rounded bg-slate-950 p-2.5 border border-slate-800/80 text-xs mb-4">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Simulated Production Sprint</div>
                    <div className="font-semibold text-slate-200 text-[11px] mt-0.5">
                      {candidate.pathwayCompleted}
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">
                      at {candidate.companySimulation}
                    </div>
                  </div>

                  {/* Scores Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center mb-4">
                    <div className="rounded bg-slate-950 p-2 border border-slate-800/80">
                      <div className="text-[10px] text-slate-500">Overall</div>
                      <div className="text-sm font-bold font-mono text-emerald-400">
                        {candidate.aggregateScores.overall}%
                      </div>
                    </div>
                    <div className="rounded bg-slate-950 p-2 border border-slate-800/80">
                      <div className="text-[10px] text-slate-500">Technical</div>
                      <div className="text-sm font-bold font-mono text-teal-400">
                        {candidate.aggregateScores.technical}%
                      </div>
                    </div>
                    <div className="rounded bg-slate-950 p-2 border border-slate-800/80">
                      <div className="text-[10px] text-slate-500">Resilience</div>
                      <div className="text-sm font-bold font-mono text-cyan-400">
                        {candidate.aggregateScores.resilience}%
                      </div>
                    </div>
                  </div>

                  {/* Key Highlights */}
                  <div className="text-xs text-slate-400 mb-4 line-clamp-2">
                    <span className="font-semibold text-slate-300">Staff Lead Endorsement: </span>
                    "{candidate.endorsedByStaffLead.quote}"
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleStartCompare(candidate)}
                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded transition-colors ${
                      isSelectedForCompare
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Scale className="h-3 w-3" />
                    <span>{isSelectedForCompare ? 'Selected to Compare' : 'Compare'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenDossier(candidate.username)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors shadow-sm"
                  >
                    <span>Inspect Code Diff</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Candidate Comparison Modal */}
      {compareModalOpen && compareCandidateA && compareCandidateB && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl rounded-xl border border-slate-700 bg-slate-900 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Scale className="h-5 w-5 text-blue-400" />
                <span>Side-by-Side Candidate Execution Comparison</span>
              </div>
              <button
                onClick={() => setCompareModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="py-6 grid grid-cols-2 gap-6">
              {/* Candidate A */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  <img src={compareCandidateA.avatarUrl} alt="" className="h-10 w-10 rounded-full" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{compareCandidateA.fullName}</h4>
                    <p className="text-[11px] text-slate-400">{compareCandidateA.pathwayCompleted}</p>
                  </div>
                </div>

                <div className="rounded bg-slate-950 p-3 text-xs space-y-2 border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Overall Score:</span>
                    <span className="font-mono font-bold text-emerald-400">{compareCandidateA.aggregateScores.overall}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Technical Soundness:</span>
                    <span className="font-mono text-teal-400">{compareCandidateA.aggregateScores.technical}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Error Resilience:</span>
                    <span className="font-mono text-cyan-400">{compareCandidateA.aggregateScores.resilience}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Test Pass Rate:</span>
                    <span className="font-mono text-emerald-400">100% (All Assertions)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCompareModalOpen(false);
                    handleOpenDossier(compareCandidateA.username);
                  }}
                  className="w-full rounded bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  View Full Dossier: {compareCandidateA.fullName}
                </button>
              </div>

              {/* Candidate B */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  <img src={compareCandidateB.avatarUrl} alt="" className="h-10 w-10 rounded-full" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{compareCandidateB.fullName}</h4>
                    <p className="text-[11px] text-slate-400">{compareCandidateB.pathwayCompleted}</p>
                  </div>
                </div>

                <div className="rounded bg-slate-950 p-3 text-xs space-y-2 border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Overall Score:</span>
                    <span className="font-mono font-bold text-emerald-400">{compareCandidateB.aggregateScores.overall}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Technical Soundness:</span>
                    <span className="font-mono text-teal-400">{compareCandidateB.aggregateScores.technical}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Error Resilience:</span>
                    <span className="font-mono text-cyan-400">{compareCandidateB.aggregateScores.resilience}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Test Pass Rate:</span>
                    <span className="font-mono text-emerald-400">100% (All Assertions)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCompareModalOpen(false);
                    handleOpenDossier(compareCandidateB.username);
                  }}
                  className="w-full rounded bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  View Full Dossier: {compareCandidateB.fullName}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
