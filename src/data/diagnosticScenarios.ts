export interface DiagnosticQuestion {
  id: string;
  category: string;
  title: string;
  scenario: string;
  codeSnippet?: string;
  options: {
    id: string;
    text: string;
    explanation: string;
    points: number; // 1 to 3
    levelSignal: 'Junior I' | 'Junior II' | 'Mid-level';
  }[];
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'diag-1',
    category: 'Concurrency & State Safety',
    title: 'Race Condition in User Balance Check',
    scenario: 'Two concurrent payment requests arrive within 3 milliseconds for an account holding $50. Both attempt to deduct $40. The current code executes: `const balance = await getBalance(id); if (balance >= amount) { await setBalance(id, balance - amount); }` In production, both requests succeed and the balance goes negative. How do you resolve this?',
    codeSnippet: `// Vulnerable non-atomic read-modify-write
async function deductBalance(accountId: string, amount: number) {
  const current = await db.account.find(accountId);
  if (current.balance >= amount) {
    await db.account.update(accountId, { balance: current.balance - amount });
    return true;
  }
  return false;
}`,
    options: [
      {
        id: 'opt-1a',
        text: 'Add a JavaScript setTimeout delay of 50ms before the second request executes.',
        explanation: 'Timers in Node.js event loop cannot prevent concurrent async I/O interleaving across processes.',
        points: 1,
        levelSignal: 'Junior I',
      },
      {
        id: 'opt-1b',
        text: 'Wrap the balance check inside a client-side try/catch block.',
        explanation: 'Try/catch only handles thrown runtime errors, not logical race conditions between concurrent database queries.',
        points: 1,
        levelSignal: 'Junior I',
      },
      {
        id: 'opt-1c',
        text: 'Use atomic SQL queries with conditional write locks: `UPDATE account SET balance = balance - :amt WHERE id = :id AND balance >= :amt` or distributed Redis Redlock.',
        explanation: 'Atomic single-statement conditional updates guarantee consistency at the database engine level without multi-step race vulnerability.',
        points: 3,
        levelSignal: 'Mid-level',
      },
      {
        id: 'opt-1d',
        text: 'Store the balance in an in-memory global variable so read-writes happen synchronously.',
        explanation: 'In-memory variables break as soon as your app runs more than 1 server container or pod.',
        points: 2,
        levelSignal: 'Junior II',
      },
    ],
  },
  {
    id: 'diag-2',
    category: 'Fault Tolerance & Upstream Fallbacks',
    title: 'Handling Redis Downtime in Core Path',
    scenario: 'Your rate limiter relies on a Redis cluster. During a network partition, the Redis client starts throwing `ETIMEDOUT` errors with 5-second socket delays. What should your middleware do?',
    codeSnippet: `// What is the appropriate enterprise posture?
try {
  return await redisClient.eval(luaScript, ...);
} catch (err) {
  // ???
}`,
    options: [
      {
        id: 'opt-2a',
        text: 'Fail closed: return HTTP 500 Internal Server Error immediately to all incoming traffic until Redis recovers.',
        explanation: 'Failing closed takes down the entire customer-facing product just because the rate limiter auxiliary cache had a hiccup.',
        points: 1,
        levelSignal: 'Junior I',
      },
      {
        id: 'opt-2b',
        text: 'Fail open with localized in-memory fallback, circuit trip, and high-priority telemetry warning.',
        explanation: 'Enterprise services must degrade gracefully: legitimate customers continue working, while internal telemetry alerts on-call engineers.',
        points: 3,
        levelSignal: 'Mid-level',
      },
      {
        id: 'opt-2c',
        text: 'Loop in an infinite while loop attempting to reconnect every 100ms.',
        explanation: 'Blocking or tight retry loops cause thread starvation and memory leaks during outages.',
        points: 1,
        levelSignal: 'Junior I',
      },
      {
        id: 'opt-2d',
        text: 'Drop the rate limit headers completely and restart the Node server process.',
        explanation: 'Restarting the container creates a restart-loop storm that exacerbates gateway downtime.',
        points: 2,
        levelSignal: 'Junior II',
      },
    ],
  },
  {
    id: 'diag-3',
    category: 'Data Integrity & Edge Nulls',
    title: 'Uncleaned Ingestion Stream Reconciliation',
    scenario: 'A third-party exchange data feed occasionally sends trade batches with null timestamps, negative volume, or scientific notation numbers like `1.4e-6`. How do you design the ingest parser?',
    options: [
      {
        id: 'opt-3a',
        text: 'Cast all fields to strings and let the downstream database convert them when it wants.',
        explanation: 'Defers corrupt data downstream where debugging is 10x harder and corrupts historical analytics.',
        points: 1,
        levelSignal: 'Junior I',
      },
      {
        id: 'opt-3b',
        text: 'Implement a strict schema validation boundary (e.g. Zod/Pydantic) with dead-letter queue (DLQ) quarantine for corrupt records and metric counter alerts.',
        explanation: 'Strict boundary parsing stops corrupted data at the gates while preserving the dirty payload in a quarantine DLQ for forensics.',
        points: 3,
        levelSignal: 'Mid-level',
      },
      {
        id: 'opt-3c',
        text: 'Filter out all records that have an error and ignore them silently.',
        explanation: 'Silently discarding financial trade events without audit logs violates compliance and ledger accuracy.',
        points: 2,
        levelSignal: 'Junior II',
      },
    ],
  },
];
