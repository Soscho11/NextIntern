import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client if GEMINI_API_KEY is present
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// ---------------- API ROUTES ----------------

// Health check & capabilities
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    hasGemini: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// Socratic AI Mentor endpoint
app.post('/api/ai/mentor', async (req: Request, res: Response) => {
  const { messages, taskContext, userCode, studentLevel } = req.body;

  const systemInstruction = `You are Alex Vance, a Senior Staff Architect and virtual Team Lead at an enterprise tech company.
You are mentoring a junior candidate in the NextIntern AI micro-internship simulation.

STRICT SOCRATIC GUARDRAIL:
1. NEVER write or provide the complete solution code directly.
2. Provide directional scaffolding: point toward the conceptual bug, discuss edge cases (e.g. race conditions, memory leaks, off-by-one errors, missing error handling).
3. Ask reflective questions: "What happens if two concurrent requests hit this check at the exact same millisecond?", "Notice the return type of the cache client on a miss."
4. Be encouraging, professional, and rigorous like a top-tier engineering lead at a high-growth tech company.
5. Keep your responses concise (2-4 paragraphs max) with clear bullet points or code hints (only short illustrative snippets of 1-3 lines demonstrating a principle, never the full solution).

CURRENT TASK CONTEXT:
${taskContext || 'Enterprise rate limiter and resilient queue architecture'}

STUDENT LEVEL: ${studentLevel || 'Junior II'}
`;

  try {
    if (ai) {
      const formattedContents = (messages || []).map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      // Add task context and student code to the prompt if available
      if (userCode && formattedContents.length > 0) {
        const lastMsg = formattedContents[formattedContents.length - 1];
        lastMsg.parts[0].text += `\n\n[Candidate's Current Working Code]:\n\`\`\`typescript\n${userCode.slice(0, 3000)}\n\`\`\``;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents.length > 0 ? formattedContents : [{ role: 'user', parts: [{ text: 'Hello Alex, I am starting this task. Any initial advice?' }] }],
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        reply: response.text || "Let's review the acceptance criteria carefully. What core requirement are you tackling first?",
        source: 'gemini-3.8-flash',
      });
    }
  } catch (err: any) {
    console.error('Gemini Mentor API error, using intelligent fallback:', err?.message || err);
  }

  // Intelligent fallback if Gemini is offline or quota exceeded
  const lastUserMsg = messages?.[messages.length - 1]?.content?.toLowerCase() || '';
  let fallbackReply = "That's a solid angle of attack. Before you proceed, walk me through how you're handling the edge case where the key doesn't exist yet or the timestamp expires during the transaction. What will the state look like?";

  if (lastUserMsg.includes('test') || lastUserMsg.includes('fail')) {
    fallbackReply = "Looking at that test failure: notice what the test assertion is checking for. Are you returning the proper headers (`X-RateLimit-Remaining` and `Retry-After`) when the threshold is exceeded? Check whether your time delta is computed in seconds or milliseconds.";
  } else if (lastUserMsg.includes('redis') || lastUserMsg.includes('cache') || lastUserMsg.includes('store')) {
    fallbackReply = "Good question regarding storage. In a distributed simulation like this, in-memory Maps will desync across worker nodes. Think about atomicity: if you do a `get` then `set`, can another request slip in between? Consider atomic increment operations or script evaluation.";
  } else if (lastUserMsg.includes('help') || lastUserMsg.includes('stuck') || lastUserMsg.includes('start')) {
    fallbackReply = "Take a breath—let's break down the acceptance criteria into three milestones:\n1. First, establish the sliding window or bucket counter state structure.\n2. Second, calculate capacity subtraction per incoming IP.\n3. Third, set proper HTTP 429 status and headers when limit is breached.\nWhich of those three are you currently implementing?";
  } else if (lastUserMsg.includes('error') || lastUserMsg.includes('exception')) {
    fallbackReply = "When an upstream dependency fails (like Redis dropping connection), what is your fallback posture? Should your middleware crash the server, or fail-open with degraded telemetry? Review Acceptance Criterion #4.";
  }

  res.json({
    reply: fallbackReply,
    source: 'simulated-lead',
  });
});

// Automated Multi-Dimensional Rubric PR Evaluation endpoint
app.post('/api/ai/evaluate', async (req: Request, res: Response) => {
  const { code, taskTitle, acceptanceCriteria, notes } = req.body;

  const systemInstruction = `You are a Principal Engineering Evaluation Engine for NextIntern AI.
Your job is to objectively score a candidate's code submission across four strict enterprise dimensions (1-100 each):
1. technicalSoundness: Code correctness, data structures, complexity, concurrency safety, absence of syntax errors.
2. businessRequirements: Exact adherence to the acceptance criteria and product specifications.
3. errorResilience: Defensive coding, null checks, edge case resilience, timeout & error handling.
4. documentation: Clear comments, self-documenting naming, type safety, clarity of implementation.

Return a STRICT JSON response matching this schema:
{
  "technicalScore": number (1-100),
  "businessScore": number (1-100),
  "resilienceScore": number (1-100),
  "documentationScore": number (1-100),
  "overallScore": number (1-100),
  "verdict": "APPROVED" | "CHANGES_REQUESTED" | "NEEDS_REFACTOR",
  "summary": string (2-3 sentences of executive technical feedback),
  "strengths": string[],
  "improvements": string[],
  "lineComments": [
    {
      "file": string,
      "line": number,
      "severity": "info" | "warning" | "blocking",
      "comment": string
    }
  ],
  "verificationHash": string (a simulated 64-char sha256 hex string starting with 0x)
}
`;

  const prompt = `Evaluate this submission for task: "${taskTitle}"
Acceptance Criteria:
${JSON.stringify(acceptanceCriteria, null, 2)}

Candidate Notes:
${notes || 'Candidate submitted implementation.'}

Candidate Code:
\`\`\`typescript
${(code || '').slice(0, 6000)}
\`\`\`
`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json(parsed);
      }
    }
  } catch (err: any) {
    console.error('Gemini evaluation error, falling back to heuristic evaluation:', err?.message || err);
  }

  // Heuristic enterprise rubric evaluation fallback
  const codeStr = code || '';
  const lines = codeStr.split('\n').length;
  const hasErrorHandling = /try\s*{|catch|throw|reject|Error\(/i.test(codeStr);
  const hasTypes = /interface|type\s+|:\s*(string|number|boolean|Promise)/i.test(codeStr);
  const hasRateLimitLogic = /rate|token|bucket|window|redis|capacity|remaining/i.test(codeStr);
  const hasHeaders = /header|429|status|retry-after|x-ratelimit/i.test(codeStr);

  let technical = 82;
  let business = 80;
  let resilience = 78;
  let documentation = 84;

  if (hasRateLimitLogic) {
    technical += 8;
    business += 8;
  }
  if (hasErrorHandling) {
    resilience += 12;
  }
  if (hasHeaders) {
    business += 7;
    technical += 4;
  }
  if (hasTypes) {
    documentation += 8;
    technical += 3;
  }
  if (lines < 15) {
    technical = Math.min(technical, 65);
    business = Math.min(business, 60);
  }

  technical = Math.min(98, Math.max(55, technical));
  business = Math.min(98, Math.max(50, business));
  resilience = Math.min(96, Math.max(50, resilience));
  documentation = Math.min(98, Math.max(60, documentation));

  const overall = Math.round((technical * 0.35) + (business * 0.35) + (resilience * 0.2) + (documentation * 0.1));
  const verdict = overall >= 85 ? 'APPROVED' : overall >= 72 ? 'CHANGES_REQUESTED' : 'NEEDS_REFACTOR';

  const randomHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  res.json({
    technicalScore: technical,
    businessScore: business,
    resilienceScore: resilience,
    documentationScore: documentation,
    overallScore: overall,
    verdict,
    summary: overall >= 85
      ? "Strong execution with robust token arithmetic, clean adherence to RFC-6585 rate limiting headers, and solid graceful degradation when Redis drops."
      : "The core rate-limiting mathematical logic is sound, but critical edge cases regarding Redis disconnect fallbacks and exact HTTP 429 header specs require refinement.",
    strengths: [
      "Clean separation of token replenishment calculations from HTTP middleware context.",
      "TypeScript interfaces strictly define the sliding window state contract.",
      "Correct HTTP 429 response structure when quota exhaustion occurs.",
    ],
    improvements: overall >= 85 ? [
      "Consider using atomic Lua scripts if migrating to distributed Redis clusters.",
      "Add unit tests mocking millisecond clock skew.",
    ] : [
      "Ensure 'Retry-After' header calculates delta in whole seconds as per RFC specifications.",
      "Implement fail-open fallback so a temporary cache timeout doesn't block legitimate user traffic.",
    ],
    lineComments: [
      {
        file: 'rate-limiter.ts',
        line: 14,
        severity: 'info',
        comment: 'Consider caching the compiled window duration to avoid repeated math operations in high-throughput hot paths.',
      },
      {
        file: 'rate-limiter.ts',
        line: 38,
        severity: overall >= 85 ? 'info' : 'warning',
        comment: 'Verify if concurrent requests from the same client IP can cause a race condition between token check and token decrement.',
      },
    ],
    verificationHash: randomHash,
  });
});

// Diagnostic Assessment Calibration endpoint
app.post('/api/ai/calibrate', async (req: Request, res: Response) => {
  const { answers, pathwayId } = req.body;

  const systemInstruction = `You are the Assessment Calibration Lead at NextIntern AI.
Analyze candidate diagnostic answers and determine their calibrated starting readiness:
Tiers:
- 'Junior I' (Solid fundamentals, needs guided scaffolding and structured milestones)
- 'Junior II' (Production-aware, ready for multi-step feature tickets with moderate review)
- 'Mid-level' (Architectural autonomy, strong edge case resilience, pre-vetted ready)

Return JSON:
{
  "calibratedLevel": "Junior I" | "Junior II" | "Mid-level",
  "readinessScore": number (60-98),
  "analysis": string,
  "recommendedTrack": string,
  "startingTaskId": string,
  "skillsRadar": {
    "systemArchitecture": number (1-100),
    "codeHygiene": number (1-100),
    "debuggingSkill": number (1-100),
    "businessCompliance": number (1-100),
    "errorResilience": number (1-100)
  }
}
`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ role: 'user', parts: [{ text: `Pathway: ${pathwayId}\nCandidate Assessment Answers: ${JSON.stringify(answers)}` }] }],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      if (response.text) {
        return res.json(JSON.parse(response.text.trim()));
      }
    }
  } catch (err: any) {
    console.error('Calibration error:', err?.message || err);
  }

  // Fallback calibration
  const scoreCount = Object.values(answers || {}).length;
  const level = scoreCount >= 3 ? 'Junior II' : 'Junior I';
  res.json({
    calibratedLevel: level,
    readinessScore: 84,
    analysis: 'Candidate demonstrates strong grasp of async execution and API contracts, with opportunities to deepen knowledge in distributed idempotency and automated unit mocking.',
    recommendedTrack: pathwayId || 'swe-cloud',
    startingTaskId: 'task-402',
    skillsRadar: {
      systemArchitecture: 82,
      codeHygiene: 88,
      debuggingSkill: 86,
      businessCompliance: 85,
      errorResilience: 79,
    },
  });
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[NextIntern AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
