export type Role = 'CANDIDATE' | 'RECRUITER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string;
  title: string;
  bio: string;
  calibratedLevel?: 'Junior I' | 'Junior II' | 'Mid-level';
  location?: string;
  createdAt: string;
}

export interface AcceptanceCriterion {
  id: string;
  title: string;
  description: string;
  completed?: boolean;
}

export interface TaskAsset {
  name: string;
  type: 'code' | 'json' | 'csv' | 'spec' | 'markdown';
  content: string;
  description: string;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  command: string;
  passed: boolean;
  output: string;
  durationMs: number;
}

export interface SimulationTask {
  id: string;
  pathwayId: string;
  ticketId: string; // e.g. "TASK-402"
  title: string;
  company: {
    name: string;
    stage: string;
    domain: string;
    logoUrl?: string;
  };
  productManager: {
    name: string;
    role: string;
    avatar: string;
  };
  seniorLead: {
    name: string;
    role: string;
    avatar: string;
  };
  sprint: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  briefDescription: string;
  clientContext: string;
  userStories: string[];
  acceptanceCriteria: AcceptanceCriterion[];
  files: {
    [filename: string]: string;
  };
  activeFile: string;
  testCases: TestCase[];
  resources: TaskAsset[];
  prTemplate: {
    title: string;
    description: string;
    branch: string;
  };
}

export interface Pathway {
  id: string;
  title: string;
  slug: string;
  category: 'Software Engineering' | 'Data Analytics & Engineering' | 'AI & Retrieval Systems' | 'Product Growth';
  description: string;
  companySponsor: string;
  difficultyLevel: 'Junior I' | 'Junior II' | 'Mid-level';
  durationEst: string;
  skills: string[];
  tasksCount: number;
  highlight: string;
  tasks: SimulationTask[];
}

export interface RubricLineComment {
  file: string;
  line: number;
  severity: 'info' | 'warning' | 'blocking';
  comment: string;
}

export interface RubricEvaluation {
  technicalScore: number;
  businessScore: number;
  resilienceScore: number;
  documentationScore: number;
  overallScore: number;
  verdict: 'APPROVED' | 'CHANGES_REQUESTED' | 'NEEDS_REFACTOR';
  summary: string;
  strengths: string[];
  improvements: string[];
  lineComments: RubricLineComment[];
  verificationHash: string;
  evaluatedAt: string;
}

export interface MentorChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  codeSnippetHint?: string;
}

export interface CandidateDossier {
  username: string;
  fullName: string;
  headline: string;
  avatarUrl: string;
  calibratedLevel: string;
  verificationHash: string;
  issuedAt: string;
  location: string;
  bio: string;
  githubUrl: string;
  linkedinUrl: string;
  pathwayCompleted: string;
  companySimulation: string;
  aggregateScores: {
    overall: number;
    technical: number;
    business: number;
    resilience: number;
    documentation: number;
    percentile: number;
  };
  completedTasks: {
    ticketId: string;
    title: string;
    evaluatedScore: number;
    diffSnippet: string;
    testCasesPassed: number;
    totalTestCases: number;
    mentorRemarks: string;
  }[];
  skillsRadar: {
    label: string;
    score: number;
  }[];
  endorsedByStaffLead: {
    name: string;
    role: string;
    quote: string;
  };
}
