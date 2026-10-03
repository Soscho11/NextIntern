import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, Pathway, SimulationTask, RubricEvaluation, MentorChatMessage, CandidateDossier } from '../types';
import { INITIAL_USER, PATHWAYS, CANDIDATE_PROFILES } from '../data/mockData';

interface TaskProgress {
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED';
  code: { [filename: string]: string };
  activeFile: string;
  testCases: SimulationTask['testCases'];
  rubric?: RubricEvaluation;
  chatHistory: MentorChatMessage[];
  acceptanceCriteria: { id: string; completed: boolean }[];
  currentIteration: number;
}

interface AppContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  activePathwayId: string;
  setActivePathwayId: (id: string) => void;
  activeTaskId: string;
  setActiveTaskId: (id: string) => void;
  activeCandidateUsername: string;
  setActiveCandidateUsername: (username: string) => void;
  
  // Progress
  progress: { [taskId: string]: TaskProgress };
  updateTaskCode: (taskId: string, filename: string, newCode: string) => void;
  setActiveFile: (taskId: string, filename: string) => void;
  toggleAcceptanceCriterion: (taskId: string, critId: string) => void;
  runTests: (taskId: string) => Promise<boolean>;
  sendMentorMessage: (taskId: string, message: string) => Promise<void>;
  submitForReview: (taskId: string, notes?: string) => Promise<RubricEvaluation>;
  isEvaluating: boolean;
  isMentorTyping: boolean;

  // Recruiter
  shortlistedUsernames: string[];
  toggleShortlistCandidate: (username: string) => void;

  // Helpers
  currentPathway: Pathway;
  currentTask: SimulationTask;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('nextintern_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [currentRole, setCurrentRole] = useState<Role>(user.role);
  const [currentView, setCurrentView] = useState<string>('landing');
  const [activePathwayId, setActivePathwayId] = useState<string>('swe-cloud');
  const [activeTaskId, setActiveTaskId] = useState<string>('task-402');
  const [activeCandidateUsername, setActiveCandidateUsername] = useState<string>('elena-rostova');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isMentorTyping, setIsMentorTyping] = useState<boolean>(false);
  const [shortlistedUsernames, setShortlistedUsernames] = useState<string[]>(['elena-rostova']);

  // Initialize progress for each task
  const [progress, setProgress] = useState<{ [taskId: string]: TaskProgress }>(() => {
    const initial: { [taskId: string]: TaskProgress } = {};
    for (const pathway of PATHWAYS) {
      for (const task of pathway.tasks) {
        initial[task.id] = {
          status: task.id === 'task-402' ? 'IN_PROGRESS' : 'NOT_STARTED',
          code: { ...task.files },
          activeFile: task.activeFile,
          testCases: [...task.testCases],
          acceptanceCriteria: task.acceptanceCriteria.map((ac) => ({
            id: ac.id,
            completed: !!ac.completed,
          })),
          currentIteration: 1,
          chatHistory: [
            {
              id: 'init-1',
              sender: 'assistant',
              content: `Welcome to the sprint team! I'm Alex Vance, your Senior Staff Systems Architect. We have an active P1 ticket regarding burst query scraping on \`/v1/telemetry/query\`.\n\nTake a look at the Acceptance Criteria and the starter token-bucket in \`${task.activeFile}\`. Let me know if you want to walk through the edge cases or race condition defenses before writing your patch.`,
              timestamp: '10:04 AM',
            },
          ],
        };
      }
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('nextintern_user', JSON.stringify(user));
  }, [user]);

  const currentPathway = PATHWAYS.find((p) => p.id === activePathwayId) || PATHWAYS[0];
  const currentTask = currentPathway.tasks.find((t) => t.id === activeTaskId) || currentPathway.tasks[0];

  const updateTaskCode = (taskId: string, filename: string, newCode: string) => {
    setProgress((prev) => {
      const current = prev[taskId];
      if (!current) return prev;
      return {
        ...prev,
        [taskId]: {
          ...current,
          code: {
            ...current.code,
            [filename]: newCode,
          },
        },
      };
    });
  };

  const setActiveFile = (taskId: string, filename: string) => {
    setProgress((prev) => {
      const current = prev[taskId];
      if (!current) return prev;
      return {
        ...prev,
        [taskId]: {
          ...current,
          activeFile: filename,
        },
      };
    });
  };

  const toggleAcceptanceCriterion = (taskId: string, critId: string) => {
    setProgress((prev) => {
      const current = prev[taskId];
      if (!current) return prev;
      return {
        ...prev,
        [taskId]: {
          ...current,
          acceptanceCriteria: current.acceptanceCriteria.map((c) =>
            c.id === critId ? { ...c, completed: !c.completed } : c
          ),
        },
      };
    });
  };

  const runTests = async (taskId: string): Promise<boolean> => {
    const taskProg = progress[taskId];
    if (!taskProg) return false;

    // Simulate running test cases with progressive status
    const updatedTestCases = taskProg.testCases.map((tc) => ({
      ...tc,
      passed: true,
    }));

    setProgress((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        testCases: updatedTestCases,
      },
    }));

    return true;
  };

  const sendMentorMessage = async (taskId: string, text: string) => {
    const userMsg: MentorChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setProgress((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        chatHistory: [...prev[taskId].chatHistory, userMsg],
      },
    }));

    setIsMentorTyping(true);

    try {
      const task = currentPathway.tasks.find((t) => t.id === taskId) || currentTask;
      const currentCode = progress[taskId]?.code[progress[taskId]?.activeFile] || '';

      const res = await fetch('/api/ai/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...(progress[taskId]?.chatHistory || []), userMsg].map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.content,
          })),
          taskContext: `${task.ticketId}: ${task.title}\nBrief: ${task.briefDescription}`,
          userCode: currentCode,
          studentLevel: user.calibratedLevel || 'Junior II',
        }),
      });

      const data = await res.json();
      const replyMsg: MentorChatMessage = {
        id: 'ast-' + Date.now(),
        sender: 'assistant',
        content: data.reply || "Let's review the acceptance criteria carefully. What core requirement are you tackling first?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setProgress((prev) => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          chatHistory: [...prev[taskId].chatHistory, replyMsg],
        },
      }));
    } catch (err) {
      console.error('Failed to get mentor response:', err);
    } finally {
      setIsMentorTyping(false);
    }
  };

  const submitForReview = async (taskId: string, notes?: string): Promise<RubricEvaluation> => {
    setIsEvaluating(true);
    const taskProg = progress[taskId];
    const task = currentPathway.tasks.find((t) => t.id === taskId) || currentTask;
    const currentCode = taskProg?.code[taskProg?.activeFile] || '';

    try {
      const res = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentCode,
          taskTitle: `${task.ticketId} - ${task.title}`,
          acceptanceCriteria: task.acceptanceCriteria,
          notes,
        }),
      });

      const evaluation: RubricEvaluation = await res.json();
      evaluation.evaluatedAt = new Date().toISOString();

      setProgress((prev) => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          status: evaluation.verdict === 'APPROVED' ? 'COMPLETED' : 'IN_REVIEW',
          rubric: evaluation,
          currentIteration: prev[taskId].currentIteration + 1,
        },
      }));

      return evaluation;
    } catch (err) {
      console.error('Evaluation failed:', err);
      throw err;
    } finally {
      setIsEvaluating(false);
    }
  };

  const toggleShortlistCandidate = (username: string) => {
    setShortlistedUsernames((prev) =>
      prev.includes(username) ? prev.filter((u) => u !== username) : [...prev, username]
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        currentRole,
        setCurrentRole: (role) => {
          setCurrentRole(role);
          setUser((prev) => ({ ...prev, role }));
        },
        currentView,
        setCurrentView,
        activePathwayId,
        setActivePathwayId,
        activeTaskId,
        setActiveTaskId,
        activeCandidateUsername,
        setActiveCandidateUsername,
        progress,
        updateTaskCode,
        setActiveFile,
        toggleAcceptanceCriterion,
        runTests,
        sendMentorMessage,
        submitForReview,
        isEvaluating,
        isMentorTyping,
        shortlistedUsernames,
        toggleShortlistCandidate,
        currentPathway,
        currentTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
