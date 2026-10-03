import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CANDIDATE_PROFILES } from '../../data/mockData';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  GitPullRequest, 
  Copy, 
  Check, 
  Calendar, 
  Mail, 
  Share2, 
  Award, 
  Terminal, 
  Briefcase, 
  Users, 
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';

export const ProofOfWorkPortfolio: React.FC = () => {
  const { activeCandidateUsername, setActiveCandidateUsername, setCurrentView } = useApp();

  const [selectedCandidate, setSelectedCandidate] = useState<string>(activeCandidateUsername || 'elena-rostova');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState<boolean>(false);
  const [contactModalOpen, setContactModalOpen] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifiedStatus, setVerifiedStatus] = useState<boolean | null>(null);

  // Recruiter contact form state
  const [contactSubject, setContactSubject] = useState<string>('Interview Request: Distributed Systems Engineer');
  const [contactMessage, setContactMessage] = useState<string>('Hi Elena, I reviewed your verifiable proof-of-work on NextIntern AI for the CloudPulse token bucket rate limiter. The error resilience and failover logic were exceptional. We would love to discuss an interview for our backend infrastructure team.');
  const [contactSent, setContactSent] = useState<boolean>(false);

  const candidate = CANDIDATE_PROFILES.find((c) => c.username === selectedCandidate) || CANDIDATE_PROFILES[0];

  const handleVerifyIntegrity = async () => {
    setIsVerifying(true);
    setVerifiedStatus(null);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsVerifying(false);
    setVerifiedStatus(true);
  };

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactModalOpen(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-5xl">
        {/* Top Control Bar: Candidate Switcher & Share */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">Verified Candidate Dossier:</span>
            <select
              value={candidate.username}
              onChange={(e) => setSelectedCandidate(e.target.value)}
              className="rounded bg-slate-900 border border-slate-700 px-2.5 py-1.5 text-xs text-white outline-none font-medium cursor-pointer"
            >
              {CANDIDATE_PROFILES.map((c) => (
                <option key={c.username} value={c.username}>
                  {c.fullName} ({c.pathwayCompleted.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setVerifyModalOpen(true);
                handleVerifyIntegrity();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verify Ledger Integrity</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'Link Copied' : 'Share Proof Dossier'}</span>
            </button>
          </div>
        </div>

        {/* 1. CANDIDATE PROFILE HEADER */}
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <img
                src={candidate.avatarUrl}
                alt={candidate.fullName}
                className="h-20 w-20 rounded-full border-2 border-emerald-500/40 object-cover shrink-0"
              />
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl font-bold text-white">{candidate.fullName}</h1>
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400 font-mono">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Proof-of-Work
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-300">{candidate.headline}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                  <span>{candidate.location}</span>
                  <span>·</span>
                  <span className="font-mono text-emerald-400">{candidate.calibratedLevel}</span>
                </div>
              </div>
            </div>

            {/* Recruiter Action Buttons */}
            <div className="flex sm:flex-col gap-2">
              <button
                onClick={() => setContactModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Contact Candidate</span>
              </button>

              <button
                onClick={() => {
                  window.print();
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 hover:text-white transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Audit Dossier</span>
              </button>
            </div>
          </div>

          {/* Cryptographic Ledger Hash Bar */}
          <div className="mt-6 rounded-lg bg-slate-950 p-3 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-emerald-400 text-[11px]">LEDGER HASH:</span>
              <span className="font-mono text-slate-400 text-[11px] truncate max-w-md">
                {candidate.verificationHash}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono shrink-0">
              <span>Timestamp: {new Date(candidate.issuedAt).toLocaleDateString()}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(candidate.verificationHash);
                  setCopiedHash(true);
                  setTimeout(() => setCopiedHash(false), 2000);
                }}
                className="text-emerald-400 hover:underline flex items-center gap-1"
              >
                {copiedHash ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copiedHash ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. AGGREGATE PERFORMANCE METRICS & SKILLS RADAR */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Score Card */}
          <div className="lg:col-span-4 rounded-xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                Audited Simulation Score
              </span>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-white font-mono">
                  {candidate.aggregateScores.overall}
                </span>
                <span className="text-slate-500 font-mono text-lg">/ 100</span>
              </div>
              <div className="mt-2 text-xs text-emerald-400 font-medium font-mono">
                Top {100 - candidate.aggregateScores.percentile}% percentile of candidate pool
              </div>
              <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                Objective composite calculated across 4 automated rubric reviews, 
                8 production test suites, and 2 enterprise simulations.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Completed Pathway:</span>
                <span className="font-semibold text-white">{candidate.pathwayCompleted}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Host Company:</span>
                <span className="font-semibold text-emerald-400">{candidate.companySimulation}</span>
              </div>
            </div>
          </div>

          {/* Right: Demonstrated Competencies Matrix */}
          <div className="lg:col-span-8 rounded-xl border border-slate-800 bg-slate-900/80 p-6">
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider mb-4 block">
              Multi-Dimensional Competency Matrix
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {candidate.skillsRadar.map((skill, i) => (
                <div key={i} className="rounded-lg bg-slate-950 p-3.5 border border-slate-800/80">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-200">{skill.label}</span>
                    <span className="font-mono text-emerald-400 font-bold">{skill.score}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-500"
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. INSPECTABLE PRODUCTION ARTIFACTS & CODE DIFFS */}
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                Audited Work Product
              </span>
              <h2 className="text-lg font-bold text-white mt-1">
                Completed Simulation Tickets & Pull Request Diffs
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {candidate.completedTasks.length} Tickets Approved
            </span>
          </div>

          <div className="space-y-6">
            {candidate.completedTasks.map((task, i) => (
              <div key={i} className="rounded-lg border border-slate-800 bg-slate-950 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      {task.ticketId}
                    </span>
                    <span className="text-slate-600">·</span>
                    <h3 className="font-semibold text-white text-sm">{task.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-emerald-400">
                      Score: {task.evaluatedScore}/100
                    </span>
                    <span className="text-slate-400">
                      Tests: {task.testCasesPassed}/{task.totalTestCases} Passed
                    </span>
                  </div>
                </div>

                {/* Staff Lead Remarks */}
                <div className="mb-4 rounded bg-slate-900/80 p-3 text-xs text-slate-300 leading-relaxed border border-slate-800">
                  <strong className="text-emerald-400 block mb-1">Staff Architect Review Remarks:</strong>
                  "{task.mentorRemarks}"
                </div>

                {/* Inspectable Git Code Diff */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <GitPullRequest className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Audited Pull Request Diff</span>
                    </span>
                    <span>Commit Hash: {candidate.verificationHash.slice(0, 10)}</span>
                  </div>
                  <pre className="rounded bg-slate-900 p-3 text-[11px] font-mono text-emerald-300/90 overflow-x-auto border border-slate-800 leading-relaxed">
                    <code>{task.diffSnippet}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. SENIOR STAFF ARCHITECT ENDORSEMENT */}
        {candidate.endorsedByStaffLead && (
          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                  Technical Lead Endorsement
                </span>
                <p className="mt-2 text-sm text-slate-200 italic leading-relaxed">
                  "{candidate.endorsedByStaffLead.quote}"
                </p>
                <div className="mt-3 text-xs">
                  <span className="font-bold text-white">{candidate.endorsedByStaffLead.name}</span>
                  <span className="text-slate-500"> · </span>
                  <span className="text-slate-400">{candidate.endorsedByStaffLead.role}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. VERIFY INTEGRITY MODAL */}
      {verifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span>Consensus Ledger Verification</span>
              </div>
              <button
                onClick={() => setVerifyModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                NextIntern AI uses SHA-256 cryptographic hashing to bind candidate code commits, 
                test assertion outputs, and AI rubric evaluations into a tamper-proof ledger record.
              </p>

              <div className="rounded bg-slate-950 p-3 border border-slate-800 font-mono text-[11px] text-slate-400 break-all select-all">
                {candidate.verificationHash}
              </div>

              {isVerifying ? (
                <div className="flex items-center gap-2 text-emerald-400 font-mono py-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Querying decentralized verification ledger...</span>
                </div>
              ) : verifiedStatus ? (
                <div className="rounded-lg bg-emerald-950/30 border border-emerald-500/40 p-3 text-emerald-300">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Integrity Confirmed: 100% Match</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    No discrepancies detected. Artifact origin verified to candidate session on {new Date(candidate.issuedAt).toLocaleString()}.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setVerifyModalOpen(false)}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. CONTACT CANDIDATE MODAL */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Mail className="h-5 w-5 text-emerald-400" />
                <span>Contact {candidate.fullName}</span>
              </div>
              <button
                onClick={() => setContactModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            {contactSent ? (
              <div className="py-8 text-center text-emerald-400">
                <CheckCircle2 className="h-10 w-10 mx-auto mb-2" />
                <div className="font-bold text-white text-base">Interview Request Dispatched</div>
                <p className="text-xs text-slate-400 mt-1">
                  Candidate notified along with your direct recruiter credentials.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendContact} className="py-4 space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full rounded bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Message</label>
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full rounded bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 outline-none focus:border-emerald-500 resize-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">Response SLA: typically &lt; 24h</span>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Send Direct Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
