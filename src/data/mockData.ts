import { Pathway, CandidateDossier, User } from '../types';

export const INITIAL_USER: User = {
  id: 'usr_candidate_01',
  name: 'Elena Rostova',
  email: 'elena.rostova@nextintern.dev',
  role: 'CANDIDATE',
  title: 'Full-Stack & Cloud Systems Candidate',
  bio: 'CS graduate passionate about distributed backend resilience, TypeScript, and high-throughput pipelines. Completed 3 enterprise micro-internships.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  calibratedLevel: 'Junior II',
  location: 'Toronto, ON (Remote-ready)',
  createdAt: '2026-03-15',
};

export const PATHWAYS: Pathway[] = [
  {
    id: 'swe-cloud',
    title: 'Full-Stack Cloud & Distributed Systems',
    slug: 'swe-cloud-systems',
    category: 'Software Engineering',
    companySponsor: 'CloudPulse Observability (Series B)',
    description: 'Work alongside a Senior Staff Architect to build enterprise-grade distributed infrastructure, sliding-window rate limiters, and resilient webhook dispatchers under real production SLAs.',
    difficultyLevel: 'Junior II',
    durationEst: '8-12 Hours',
    tasksCount: 3,
    highlight: 'RFC-6585 Rate Limiting · Redis Clustering · Circuit Breakers',
    skills: ['TypeScript', 'Node.js', 'Distributed Caching', 'Defensive Concurrency', 'Jest Test-Driven Dev'],
    tasks: [
      {
        id: 'task-402',
        pathwayId: 'swe-cloud',
        ticketId: 'TASK-402',
        title: 'Implement Token Bucket Rate-Limiter Middleware with Redis Fallback',
        company: {
          name: 'CloudPulse Observability',
          stage: 'Series B (Enterprise Tier)',
          domain: 'High-Throughput Telemetry Platform',
        },
        productManager: {
          name: 'Sarah Chen',
          role: 'VP of Platform Engineering',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        },
        seniorLead: {
          name: 'Alex Vance',
          role: 'Senior Staff Systems Architect',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        },
        sprint: 'Sprint 28 · Core Gateway Hardening',
        priority: 'CRITICAL',
        briefDescription: 'A sudden 400% spike in unauthenticated scraping on our `/v1/telemetry/query` endpoint is degrading core ingestion p99 latency. Build an enterprise token bucket rate limiter middleware that enforces tier quotas, returns standard RFC headers, and fails open gracefully if Redis drops.',
        clientContext: `From: Sarah Chen (VP Platform Eng)
To: Engineering Team, NextIntern Candidate
Subject: P1 Mitigation: Rate Limiter Gateway Middleware

Our public API telemetry endpoints experienced three minor brownouts this week due to unthrottled burst queries from third-party botnets. We need immediate, production-grade rate-limiting at the reverse proxy gateway layer.

You will implement the token bucket algorithm with sliding window replenishment. Ensure you handle Redis cluster disconnects cleanly without dropping legitimate high-value client requests.`,
        userStories: [
          'As an API consumer, I expect clear headers informing me of my remaining request quota and when my bucket resets.',
          'As an infrastructure engineer, I expect the gateway to fail-open with a warning metric rather than throwing 500s when Redis times out.',
          'As a security lead, I need IP-based and API-Key-based rate bucket keys so malicious callers cannot evade throttling.',
        ],
        acceptanceCriteria: [
          {
            id: 'ac-1',
            title: 'Token Bucket replenishment algorithm',
            description: 'Accurately replenish tokens based on time delta between requests up to max bucket capacity (default 60 requests/minute).',
            completed: true,
          },
          {
            id: 'ac-2',
            title: 'RFC-6585 compliance headers',
            description: 'Return X-RateLimit-Limit, X-RateLimit-Remaining, and Retry-After (in whole seconds) on HTTP 429 Too Many Requests.',
            completed: true,
          },
          {
            id: 'ac-3',
            title: 'Graceful Redis disconnect fallback',
            description: 'If the primary cache connection encounters an error or timeout (>150ms), fallback to in-memory local cache and log a warning without throwing 500.',
            completed: false,
          },
          {
            id: 'ac-4',
            title: 'Full unit test assertion coverage',
            description: 'Pass all 4 simulated edge-case test suites including concurrent burst exhaustion and clock skew scenarios.',
            completed: false,
          },
        ],
        activeFile: 'src/rate-limiter.ts',
        files: {
          'src/rate-limiter.ts': `/**
 * @file rate-limiter.ts
 * NextIntern AI · CloudPulse Systems Core Gateway Middleware
 * Ticket: TASK-402
 * Author: Candidate Submission
 */

export interface RateLimitConfig {
  maxTokens: number;        // Maximum burst capacity
  refillRatePerSec: number; // Tokens added per second
  windowSec: number;        // Rolling interval in seconds
}

export interface BucketState {
  tokens: number;
  lastRefillTimestamp: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
  headers: Record<string, string>;
}

// In-memory fallback cache for when Redis connection drops
const localMemoryStore = new Map<string, BucketState>();

/**
 * Evaluates whether a request with clientKey is allowed under the token bucket policy.
 */
export async function evaluateTokenBucket(
  clientKey: string,
  config: RateLimitConfig = { maxTokens: 60, refillRatePerSec: 1, windowSec: 60 },
  mockRedisAvailable: boolean = true
): Promise<RateLimitResult> {
  const now = Date.now();

  try {
    if (!mockRedisAvailable) {
      console.warn(\`[RateLimiter] Cache unavailable for key \${clientKey}, engaging local memory fallback.\`);
    }

    // Retrieve or initialize bucket state
    let state = localMemoryStore.get(clientKey);
    if (!state) {
      state = {
        tokens: config.maxTokens,
        lastRefillTimestamp: now,
      };
      localMemoryStore.set(clientKey, state);
    }

    // 1. Calculate time elapsed and refill tokens
    const elapsedSec = (now - state.lastRefillTimestamp) / 1000;
    const tokensToAdd = elapsedSec * config.refillRatePerSec;
    state.tokens = Math.min(config.maxTokens, state.tokens + tokensToAdd);
    state.lastRefillTimestamp = now;

    // 2. Check if request can consume 1 token
    if (state.tokens >= 1) {
      state.tokens -= 1;
      const remaining = Math.floor(state.tokens);

      return {
        allowed: true,
        remaining,
        retryAfterSec: 0,
        headers: {
          'X-RateLimit-Limit': String(config.maxTokens),
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(Math.ceil((now + ((config.maxTokens - state.tokens) / config.refillRatePerSec) * 1000) / 1000)),
        },
      };
    }

    // 3. Quota exceeded: calculate retry-after duration
    const missingTokens = 1 - state.tokens;
    const retryAfterSec = Math.max(1, Math.ceil(missingTokens / config.refillRatePerSec));

    return {
      allowed: false,
      remaining: 0,
      retryAfterSec,
      headers: {
        'X-RateLimit-Limit': String(config.maxTokens),
        'X-RateLimit-Remaining': '0',
        'Retry-After': String(retryAfterSec),
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    // Fail-open defensively so core traffic is not blackholed
    console.error('[RateLimiter] Fatal error during evaluation, failing open:', error);
    return {
      allowed: true,
      remaining: 1,
      retryAfterSec: 0,
      headers: {
        'X-RateLimit-Fallback': 'fail-open-emergency',
      },
    };
  }
}
`,
          'test/rate-limiter.test.ts': `import { evaluateTokenBucket } from '../src/rate-limiter';

describe('TASK-402: Token Bucket Rate Limiter', () => {
  const client = '198.51.100.42';

  test('TC-01: Permitted requests consume tokens and return remaining count', async () => {
    const res = await evaluateTokenBucket(client, { maxTokens: 5, refillRatePerSec: 1, windowSec: 5 });
    expect(res.allowed).toBe(true);
    expect(res.remaining).toBe(4);
    expect(res.headers['X-RateLimit-Limit']).toBe('5');
  });

  test('TC-02: Burst traffic beyond max capacity triggers HTTP 429 with Retry-After', async () => {
    // Consume remaining tokens
    for (let i = 0; i < 4; i++) {
      await evaluateTokenBucket(client, { maxTokens: 5, refillRatePerSec: 1, windowSec: 5 });
    }
    const blockedRes = await evaluateTokenBucket(client, { maxTokens: 5, refillRatePerSec: 1, windowSec: 5 });
    expect(blockedRes.allowed).toBe(false);
    expect(blockedRes.remaining).toBe(0);
    expect(blockedRes.retryAfterSec).toBeGreaterThanOrEqual(1);
  });

  test('TC-03: Graceful fallback fails open when Redis connectivity is severed', async () => {
    const res = await evaluateTokenBucket('failover-test', { maxTokens: 10, refillRatePerSec: 2, windowSec: 10 }, false);
    expect(res.allowed).toBe(true);
  });
});
`,
          'config/gateway-spec.json': `{
  "gatewayVersion": "2.4.0-enterprise",
  "defaultTier": {
    "tierName": "Standard Tier",
    "quotaPerMinute": 60,
    "burstAllowance": 15,
    "failOpenPolicy": true
  },
  "protectedEndpoints": [
    "/v1/telemetry/query",
    "/v1/ingest/batch",
    "/v1/auth/tokens"
  ]
}`,
        },
        testCases: [
          {
            id: 'tc-01',
            name: 'TC-01: Single Request Token Consumption',
            description: 'Verifies 1 token deducted from initial bucket of 60, returning 59 remaining.',
            command: 'npm test -- -t "Permitted requests consume tokens"',
            passed: true,
            output: '✓ TC-01: Permitted requests consume tokens and return remaining count (4ms)\n  Assert: X-RateLimit-Limit === "60" -> PASS\n  Assert: X-RateLimit-Remaining === "59" -> PASS',
            durationMs: 4,
          },
          {
            id: 'tc-02',
            name: 'TC-02: Burst Threshold & 429 Header Compliance',
            description: 'Floods bucket with 61 concurrent requests and inspects Retry-After presence.',
            command: 'npm test -- -t "Burst traffic beyond max capacity"',
            passed: true,
            output: '✓ TC-02: Burst traffic beyond max capacity triggers HTTP 429 (8ms)\n  Assert: res.allowed === false -> PASS\n  Assert: res.retryAfterSec >= 1 -> PASS\n  Assert: headers["Retry-After"] present -> PASS',
            durationMs: 8,
          },
          {
            id: 'tc-03',
            name: 'TC-03: Redis Disconnect Fail-Open Fallback',
            description: 'Simulates TCP drop on Redis socket and verifies zero 500 error propagation.',
            command: 'npm test -- -t "Graceful fallback fails open"',
            passed: true,
            output: '✓ TC-03: Graceful fallback fails open when Redis connectivity is severed (12ms)\n  Assert: res.allowed === true -> PASS\n  Warn: [RateLimiter] Cache unavailable, engaging local memory fallback.',
            durationMs: 12,
          },
          {
            id: 'tc-04',
            name: 'TC-04: Clock Skew & Sub-Millisecond Precision',
            description: 'Validates replenishment arithmetic under simulated clock drift and floating point bounds.',
            command: 'npm test -- -t "Clock drift arithmetic"',
            passed: true,
            output: '✓ TC-04: Clock drift arithmetic preserves integer boundary checks (6ms)\n  Assert: tokens <= maxTokens at all times -> PASS\n  Assert: Math.floor(remaining) integer invariant -> PASS',
            durationMs: 6,
          },
        ],
        resources: [
          {
            name: 'RFC-6585-RateLimit-Spec.md',
            type: 'spec',
            description: 'IETF RFC standard defining HTTP 429 Too Many Requests and header formats.',
            content: `# RFC 6585: Additional HTTP Status Codes
## 4. 429 Too Many Requests
The 429 status code indicates that the user has sent too many requests in a given amount of time ("rate limiting").
Required response headers:
- Retry-After: Indicates how long to wait before making a new request (seconds).
- X-RateLimit-Limit: The maximum number of requests allowed in current window.
- X-RateLimit-Remaining: The number of remaining requests allowed in current window.`,
          },
          {
            name: 'telemetry_sample.csv',
            type: 'csv',
            description: 'Sample burst log showing client query IPs hitting gateway.',
            content: `timestamp,client_ip,endpoint,status,response_ms
2026-03-31T14:20:00.120Z,198.51.100.42,/v1/telemetry/query,200,12
2026-03-31T14:20:00.180Z,198.51.100.42,/v1/telemetry/query,200,14
2026-03-31T14:20:00.240Z,198.51.100.42,/v1/telemetry/query,200,11
2026-03-31T14:20:00.310Z,203.0.113.19,/v1/telemetry/query,200,18
2026-03-31T14:20:00.390Z,198.51.100.42,/v1/telemetry/query,429,2`,
          },
        ],
        prTemplate: {
          title: 'feat(gateway): implement token-bucket rate limiter with failover',
          description: 'Fixes TASK-402. Introduces sliding window token replenishment, RFC-6585 response headers, and resilient local map fallback when Redis connection drops.',
          branch: 'feat/task-402-rate-limiter',
        },
      },
      {
        id: 'task-403',
        pathwayId: 'swe-cloud',
        ticketId: 'TASK-403',
        title: 'Circuit Breaker State Transition & Idempotency Key in Webhook Dispatcher',
        company: {
          name: 'CloudPulse Observability',
          stage: 'Series B (Enterprise Tier)',
          domain: 'High-Throughput Telemetry Platform',
        },
        productManager: {
          name: 'Sarah Chen',
          role: 'VP of Platform Engineering',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        },
        seniorLead: {
          name: 'Alex Vance',
          role: 'Senior Staff Systems Architect',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        },
        sprint: 'Sprint 28 · Core Gateway Hardening',
        priority: 'HIGH',
        briefDescription: 'Downstream customer webhook receivers often time out during network storms, causing cascading thread pool exhaustion. Implement a 3-state Circuit Breaker (CLOSED, OPEN, HALF_OPEN) with atomic idempotency locks.',
        clientContext: 'Customer webhook endpoints are failing during alert spikes. We need an automated circuit trip after 5 consecutive failures with a 30s reset cooldown.',
        userStories: [
          'As a webhook worker, I need immediate short-circuiting when a downstream target is dead to protect our thread pool.',
          'As an enterprise customer, I require zero duplicate deliveries using UUID idempotency keys.',
        ],
        acceptanceCriteria: [
          {
            id: 'ac-cb-1',
            title: 'Tri-state machine implementation',
            description: 'Transitions from CLOSED to OPEN after 5 consecutive 5xx failures or timeouts.',
          },
          {
            id: 'ac-cb-2',
            title: 'Half-Open probationary probe',
            description: 'Allows exactly 1 probe request through after reset timeout expires.',
          },
        ],
        activeFile: 'src/circuit-breaker.ts',
        files: {
          'src/circuit-breaker.ts': `export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly threshold = 5;
  private readonly resetTimeoutMs = 30000;

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    if (this.state === 'OPEN') {
      if (now - this.lastFailureTime > this.resetTimeoutMs) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('CircuitBreaker: OPEN - call short-circuited');
      }
    }

    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failureCount = 0;
      }
      return result;
    } catch (err) {
      this.failureCount++;
      this.lastFailureTime = now;
      if (this.failureCount >= this.threshold || this.state === 'HALF_OPEN') {
        this.state = 'OPEN';
      }
      throw err;
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}
`,
        },
        testCases: [
          {
            id: 'tc-cb-01',
            name: 'TC-01: Circuit trips after 5 consecutive failures',
            description: 'Simulates 5 consecutive socket timeouts.',
            command: 'npm test -- -t "trips after 5 failures"',
            passed: true,
            output: '✓ TC-01: Circuit trips after 5 failures and prevents downstream calls (5ms)',
            durationMs: 5,
          },
        ],
        resources: [],
        prTemplate: {
          title: 'feat(dispatcher): robust circuit breaker with half-open state',
          description: 'Fixes TASK-403.',
          branch: 'feat/task-403-circuit-breaker',
        },
      },
    ],
  },
  {
    id: 'data-eng',
    title: 'Data Engineering & Anomaly Reconciliation',
    slug: 'data-engineering-analytics',
    category: 'Data Analytics & Engineering',
    companySponsor: 'FinStream Global (Algorithmic Ledger)',
    description: 'Process millions of uncleaned financial trades, reconcile currency floating drift, detect high-frequency wash sales, and build automated data quality audit checks.',
    difficultyLevel: 'Junior II',
    durationEst: '10 Hours',
    tasksCount: 2,
    highlight: 'Data Cleansing · Polars/Pandas · Anomaly Scoring · Audit Trails',
    skills: ['Python/TypeScript', 'Data Cleansing', 'Statistical Outlier Detection', 'SQL/Aggregations'],
    tasks: [
      {
        id: 'task-data-101',
        pathwayId: 'data-eng',
        ticketId: 'DATA-118',
        title: 'High-Frequency Anomaly Cleansing & Ledger Reconciliation Engine',
        company: {
          name: 'FinStream Global',
          stage: 'Pre-IPO (Fintech)',
          domain: 'Algorithmic Settlement & Clearing',
        },
        productManager: {
          name: 'David K.',
          role: 'Head of Settlement Products',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        },
        seniorLead: {
          name: 'Maya Lin',
          role: 'Principal Data Architect',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        },
        sprint: 'Sprint 14 · Ledger Accuracy & Compliance',
        priority: 'CRITICAL',
        briefDescription: 'Raw trade logs from third-party broker pipes contain corrupted timestamps, duplicate execution hashes, and negative volume bugs. Build a deterministic reconciliation pipeline that extracts valid trades and quarantines anomalies.',
        clientContext: 'Our regulatory audit requires a zero-loss quarantine pipeline with tamper-proof checksum reconciliation.',
        userStories: [
          'As a compliance auditor, I need invalid or suspicious trades segregated with exact error codes.',
          'As a settlement clerk, I need currency conversions normalized to standard micro-cents.',
        ],
        acceptanceCriteria: [
          {
            id: 'ac-data-1',
            title: 'Deduplicate trade transactions by unique execution hash',
            description: 'Retain the earliest verified timestamp when hash collision occurs.',
          },
          {
            id: 'ac-data-2',
            title: 'Quarantine negative volume & inverted currency prices',
            description: 'Tag and write malformed records to an anomaly ledger with reason code.',
          },
        ],
        activeFile: 'src/reconcile.ts',
        files: {
          'src/reconcile.ts': `export interface RawTrade {
  tradeId: string;
  executionHash: string;
  timestamp: string;
  symbol: string;
  shares: number;
  priceUsd: number;
}

export interface ReconciledReport {
  validCount: number;
  quarantinedCount: number;
  totalVolumeUsd: number;
  anomalies: Array<{ tradeId: string; reason: string }>;
}

export function reconcileTrades(rawTrades: RawTrade[]): ReconciledReport {
  const seenHashes = new Set<string>();
  const anomalies: Array<{ tradeId: string; reason: string }> = [];
  let validCount = 0;
  let totalVolumeUsd = 0;

  for (const trade of rawTrades) {
    if (trade.shares <= 0 || trade.priceUsd <= 0) {
      anomalies.push({ tradeId: trade.tradeId, reason: 'INVALID_NON_POSITIVE_VALUE' });
      continue;
    }

    if (seenHashes.has(trade.executionHash)) {
      anomalies.push({ tradeId: trade.tradeId, reason: 'DUPLICATE_HASH_COLLISION' });
      continue;
    }

    seenHashes.add(trade.executionHash);
    validCount++;
    totalVolumeUsd += trade.shares * trade.priceUsd;
  }

  return {
    validCount,
    quarantinedCount: anomalies.length,
    totalVolumeUsd: Math.round(totalVolumeUsd * 100) / 100,
    anomalies,
  };
}
`,
        },
        testCases: [
          {
            id: 'tc-d-1',
            name: 'TC-01: Correctly segregates duplicate trade hashes',
            description: 'Verifies deduplication preserves only original trade.',
            command: 'npm test -- -t "segregates duplicate trade hashes"',
            passed: true,
            output: '✓ TC-01: Deduplication logic passed with 0 dropped valid records',
            durationMs: 7,
          },
        ],
        resources: [],
        prTemplate: {
          title: 'feat(reconcile): quarantine pipeline with hash collision guard',
          description: 'Addresses DATA-118.',
          branch: 'feat/data-118-reconcile',
        },
      },
    ],
  },
  {
    id: 'ai-ml',
    title: 'AI Engineering & Hybrid RAG Retrieval',
    slug: 'ai-rag-systems',
    category: 'AI & Retrieval Systems',
    companySponsor: 'VectorMind Enterprise (Knowledge Graph AI)',
    description: 'Implement a production Reciprocal Rank Fusion (RRF) search engine balancing dense vector embeddings with sparse BM25 keyword search, chunk reranking, and citation verifiers.',
    difficultyLevel: 'Mid-level',
    durationEst: '12 Hours',
    tasksCount: 2,
    highlight: 'Reciprocal Rank Fusion · Dense/Sparse Hybrid · Hallucination Filters',
    skills: ['Vector Search', 'Reciprocal Rank Fusion', 'Information Retrieval', 'Python/TS'],
    tasks: [
      {
        id: 'task-ml-1',
        pathwayId: 'ai-ml',
        ticketId: 'ML-301',
        title: 'Hybrid Dense/Sparse RAG Retriever with Reciprocal Rank Fusion',
        company: {
          name: 'VectorMind Enterprise',
          stage: 'Series A',
          domain: 'Enterprise Semantic Search',
        },
        productManager: {
          name: 'Kavita Rao',
          role: 'Director of AI Products',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        },
        seniorLead: {
          name: 'Dr. Lucas Tremblay',
          role: 'Principal AI Scientist',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        },
        sprint: 'Sprint 9 · Hybrid Retrieval Architecture',
        priority: 'CRITICAL',
        briefDescription: 'Dense semantic search often misses exact alphanumeric serial numbers and technical SKUs, while keyword search lacks semantic nuance. Implement the RRF algorithm with configurable k=60 constant to blend both rank lists seamlessly.',
        clientContext: 'Our Fortune 500 customers complain that searches for exact part IDs like "GPU-NV9-REV3" fail in pure dense search.',
        userStories: [
          'As an enterprise user, I expect exact code and SKU tokens to rank in top-3 even if embedding cosine similarity is low.',
        ],
        acceptanceCriteria: [
          {
            id: 'ac-ml-1',
            title: 'Reciprocal Rank Fusion formula implementation',
            description: 'Score(d) = sum(1 / (k + rank_i(d))) with default k=60.',
          },
        ],
        activeFile: 'src/hybrid-retriever.ts',
        files: {
          'src/hybrid-retriever.ts': `export interface SearchResult {
  docId: string;
  title: string;
  snippet: string;
}

export function reciprocalRankFusion(
  denseRanks: string[],
  sparseRanks: string[],
  k: number = 60
): Array<{ docId: string; score: number }> {
  const scores = new Map<string, number>();

  denseRanks.forEach((docId, rank) => {
    const current = scores.get(docId) || 0;
    scores.set(docId, current + 1 / (k + rank + 1));
  });

  sparseRanks.forEach((docId, rank) => {
    const current = scores.get(docId) || 0;
    scores.set(docId, current + 1 / (k + rank + 1));
  });

  return Array.from(scores.entries())
    .map(([docId, score]) => ({ docId, score: Math.round(score * 10000) / 10000 }))
    .sort((a, b) => b.score - a.score);
}
`,
        },
        testCases: [
          {
            id: 'tc-ml-1',
            name: 'TC-01: RRF properly elevates documents present in both ranked lists',
            description: 'Checks that consensus documents rank #1.',
            command: 'npm test -- -t "elevates consensus documents"',
            passed: true,
            output: '✓ TC-01: Consensus document DOC-042 correctly scored #1 with score 0.0328',
            durationMs: 3,
          },
        ],
        resources: [],
        prTemplate: {
          title: 'feat(retriever): reciprocal rank fusion hybrid search',
          description: 'Resolves ML-301.',
          branch: 'feat/ml-301-rrf',
        },
      },
    ],
  },
];

export const CANDIDATE_PROFILES: CandidateDossier[] = [
  {
    username: 'elena-rostova',
    fullName: 'Elena Rostova',
    headline: 'Distributed Systems & Cloud Infrastructure Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    calibratedLevel: 'Junior II · Calibrated Ready',
    verificationHash: '0x9e8a71f4c3b2d10984756312a0fbcde493827160594837261540eabcf1248039',
    issuedAt: '2026-03-28T18:32:00Z',
    location: 'Toronto, Canada (Open to Relocation & Remote)',
    bio: 'Self-directed engineer with deep curiosity for high-throughput distributed systems. Completed the intensive CloudPulse Systems micro-internship with a 96% aggregate score in concurrency safety and defensive error mitigation.',
    githubUrl: 'https://github.com/nextintern/elena-rostova-pow',
    linkedinUrl: 'https://linkedin.com/in/elena-rostova-swe',
    pathwayCompleted: 'Full-Stack Cloud & Distributed Systems',
    companySimulation: 'CloudPulse Observability (Series B)',
    aggregateScores: {
      overall: 94,
      technical: 96,
      business: 94,
      resilience: 95,
      documentation: 91,
      percentile: 98,
    },
    skillsRadar: [
      { label: 'Technical Soundness', score: 96 },
      { label: 'Business Specs', score: 94 },
      { label: 'Error Resilience', score: 95 },
      { label: 'Documentation', score: 91 },
      { label: 'System Design', score: 92 },
      { label: 'Test Coverage', score: 98 },
    ],
    completedTasks: [
      {
        ticketId: 'TASK-402',
        title: 'Token Bucket Rate-Limiter with Redis Fallback & RFC Headers',
        evaluatedScore: 95,
        testCasesPassed: 4,
        totalTestCases: 4,
        mentorRemarks: 'Exceptional architectural rigor. Instead of crashing when Redis socket dropped, Elena implemented zero-overhead in-memory local map fallbacks and clean integer rounding for Retry-After headers.',
        diffSnippet: `+  // 1. Calculate time elapsed and refill tokens
+  const elapsedSec = (now - state.lastRefillTimestamp) / 1000;
+  const tokensToAdd = elapsedSec * config.refillRatePerSec;
+  state.tokens = Math.min(config.maxTokens, state.tokens + tokensToAdd);
+  state.lastRefillTimestamp = now;
+  
+  // Fail-open defensively so core traffic is not blackholed
+  if (!mockRedisAvailable) {
+    console.warn('[RateLimiter] Cache unavailable, engaging local memory fallback.');
+  }`,
      },
      {
        ticketId: 'TASK-403',
        title: 'Circuit Breaker State Transition & Idempotency Key in Webhook Dispatcher',
        evaluatedScore: 93,
        testCasesPassed: 3,
        totalTestCases: 3,
        mentorRemarks: 'Elena prevented cascading thread pool deadlocks by cleanly implementing the probation probe in HALF_OPEN state with timeout decay.',
        diffSnippet: `+  if (this.state === 'OPEN') {
+    if (now - this.lastFailureTime > this.resetTimeoutMs) {
+      this.state = 'HALF_OPEN';
+    } else {
+      throw new Error('CircuitBreaker: OPEN - call short-circuited');
+    }
+  }`,
      },
    ],
    endorsedByStaffLead: {
      name: 'Alex Vance',
      role: 'Senior Staff Systems Architect @ CloudPulse Simulation',
      quote: 'Elena showed the kind of defensive instinct you rarely see even in candidates with 2-3 years on paper. She reasoned through millisecond clock skew and Redis split-brain scenarios proactively.',
    },
  },
  {
    username: 'marcus-chen',
    fullName: 'Marcus Chen',
    headline: 'Data Platform & Real-Time Pipeline Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    calibratedLevel: 'Junior II · Pre-Vetted',
    verificationHash: '0x3f1a94b8e2c07d591827463510efbcd284910375628194056123984710293847',
    issuedAt: '2026-03-24T11:15:00Z',
    location: 'Austin, TX (US Citizen, Remote)',
    bio: 'Specialized in high-volume trade reconciliation and automated data quality audits. Zero tolerance for unhandled edge-case nulls.',
    githubUrl: 'https://github.com/nextintern/marcus-chen-pow',
    linkedinUrl: 'https://linkedin.com/in/marcus-chen-data',
    pathwayCompleted: 'Data Engineering & Anomaly Reconciliation',
    companySimulation: 'FinStream Global (Algorithmic Ledger)',
    aggregateScores: {
      overall: 92,
      technical: 94,
      business: 91,
      resilience: 93,
      documentation: 89,
      percentile: 94,
    },
    skillsRadar: [
      { label: 'Technical Soundness', score: 94 },
      { label: 'Business Specs', score: 91 },
      { label: 'Error Resilience', score: 93 },
      { label: 'Documentation', score: 89 },
      { label: 'System Design', score: 90 },
      { label: 'Test Coverage', score: 95 },
    ],
    completedTasks: [
      {
        ticketId: 'DATA-118',
        title: 'High-Frequency Anomaly Cleansing & Ledger Reconciliation Engine',
        evaluatedScore: 92,
        testCasesPassed: 4,
        totalTestCases: 4,
        mentorRemarks: 'Marcus demonstrated sharp attention to currency micro-cent floating point precision errors.',
        diffSnippet: `+  seenHashes.add(trade.executionHash);
+  validCount++;
+  totalVolumeUsd += trade.shares * trade.priceUsd;`,
      },
    ],
    endorsedByStaffLead: {
      name: 'Maya Lin',
      role: 'Principal Data Architect @ FinStream Simulation',
      quote: 'Marcus tackled an intentionally messy 50,000 row transaction set and produced a clean, segregated quarantine ledger without losing a single valid transaction.',
    },
  },
  {
    username: 'aisha-mansoor',
    fullName: 'Aisha Al-Mansoor',
    headline: 'Applied AI & Hybrid Retrieval Systems Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    calibratedLevel: 'Mid-level · Enterprise Ready',
    verificationHash: '0x88b76c5d4e3f2a109876543210fedcba9876543210fedcba9876543210fedcba',
    issuedAt: '2026-03-29T14:45:00Z',
    location: 'London, UK (Hybrid / Remote)',
    bio: 'Passionate about bridging sparse keyword search with dense embedding models using reciprocal rank fusion and automated hallucination scoring.',
    githubUrl: 'https://github.com/nextintern/aisha-mansoor-pow',
    linkedinUrl: 'https://linkedin.com/in/aisha-mansoor-ai',
    pathwayCompleted: 'AI Engineering & Hybrid RAG Retrieval',
    companySimulation: 'VectorMind Enterprise',
    aggregateScores: {
      overall: 96,
      technical: 97,
      business: 95,
      resilience: 96,
      documentation: 94,
      percentile: 99,
    },
    skillsRadar: [
      { label: 'Technical Soundness', score: 97 },
      { label: 'Business Specs', score: 95 },
      { label: 'Error Resilience', score: 96 },
      { label: 'Documentation', score: 94 },
      { label: 'System Design', score: 98 },
      { label: 'Test Coverage', score: 97 },
    ],
    completedTasks: [
      {
        ticketId: 'ML-301',
        title: 'Hybrid Dense/Sparse RAG Retriever with Reciprocal Rank Fusion',
        evaluatedScore: 97,
        testCasesPassed: 3,
        totalTestCases: 3,
        mentorRemarks: 'Flawless mathematical formulation of RRF. Aisha proved her solution on both benchmark accuracy and latency.',
        diffSnippet: `+  scores.set(docId, current + 1 / (k + rank + 1));`,
      },
    ],
    endorsedByStaffLead: {
      name: 'Dr. Lucas Tremblay',
      role: 'Principal AI Scientist @ VectorMind Simulation',
      quote: 'Aisha combines practical engineering pragmatism with genuine academic depth. She is ready for immediate deployment on production retrieval teams.',
    },
  },
];
