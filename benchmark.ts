import { performance } from 'perf_hooks';

type GenerationStatus = 'idle' | 'pending' | 'processing' | 'done' | 'failed';

interface Message {
  role: 'user' | 'ai';
  content: string;
  status?: GenerationStatus;
}

// Generate a large array of messages
const prev: Message[] = Array.from({ length: 10000 }, (_, i) => ({
  role: i % 2 === 0 ? 'user' : 'ai',
  content: `Message ${i}`,
  status: 'done',
}));

// Add one AI message at the very end to test best case, or maybe it's the last one anyway.
// Let's test the worst case where there are no AI messages, or the AI message is at the beginning.
// Actually if it's alternating, the last AI message is at the end. Let's make the last AI message at the end.

function runBaseline() {
  const start = performance.now();
  for (let iter = 0; iter < 1000; iter++) {
    const lastAi = [...prev].reverse().find(m => m.role === 'ai');
    if (lastAi) {
      prev.map(m => (m === lastAi ? { ...m, status: 'failed' } : m));
    }
  }
  return performance.now() - start;
}

function runOptimized() {
  const start = performance.now();
  for (let iter = 0; iter < 1000; iter++) {
    let lastAiIndex = -1;
    for (let i = prev.length - 1; i >= 0; i--) {
      if (prev[i].role === 'ai') {
        lastAiIndex = i;
        break;
      }
    }
    if (lastAiIndex !== -1) {
      const newPrev = [...prev];
      newPrev[lastAiIndex] = { ...newPrev[lastAiIndex], status: 'failed' };
    }
  }
  return performance.now() - start;
}

const baselineTime = runBaseline();
const optimizedTime = runOptimized();

console.log(`Baseline: ${baselineTime.toFixed(2)} ms`);
console.log(`Optimized: ${optimizedTime.toFixed(2)} ms`);
console.log(`Improvement: ${(baselineTime / optimizedTime).toFixed(2)}x faster`);
