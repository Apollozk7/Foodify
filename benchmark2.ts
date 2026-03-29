import { performance } from 'perf_hooks';

type GenerationStatus = 'idle' | 'pending' | 'processing' | 'done' | 'failed';

interface Message {
  role: 'user' | 'ai';
  content: string;
  status?: GenerationStatus;
}

// Generate a large array of messages
const prev: Message[] = Array.from({ length: 100 }, (_, i) => ({
  role: i % 2 === 0 ? 'user' : 'ai',
  content: `Message ${i}`,
  status: 'done',
}));

const NUM_ITER = 10000;

function runBaseline() {
  const start = performance.now();
  for (let iter = 0; iter < NUM_ITER; iter++) {
    const lastAi = [...prev].reverse().find(m => m.role === 'ai');
    if (lastAi) {
      prev.map(m => (m === lastAi ? { ...m, status: 'failed' } : m));
    }
  }
  return performance.now() - start;
}

function runOptimized() {
  const start = performance.now();
  for (let iter = 0; iter < NUM_ITER; iter++) {
    let lastAiIndex = -1;
    for (let i = prev.length - 1; i >= 0; i--) {
      if (prev[i].role === 'ai') {
        lastAiIndex = i;
        break;
      }
    }
    if (lastAiIndex !== -1) {
      // Create a copy of the array and modify the item
      const newPrev = [...prev];
      newPrev[lastAiIndex] = { ...newPrev[lastAiIndex], status: 'failed' };
    }
  }
  return performance.now() - start;
}

function runOptimizedMap() {
  const start = performance.now();
  for (let iter = 0; iter < NUM_ITER; iter++) {
    let lastAiIndex = -1;
    for (let i = prev.length - 1; i >= 0; i--) {
      if (prev[i].role === 'ai') {
        lastAiIndex = i;
        break;
      }
    }
    if (lastAiIndex !== -1) {
      // Instead of .map, just clone array and change one element
      prev.map((m, i) => (i === lastAiIndex ? { ...m, status: 'failed' } : m));
    }
  }
  return performance.now() - start;
}

const baselineTime = runBaseline();
const optimizedMapTime = runOptimizedMap();
const optimizedTime = runOptimized();

console.log(`Baseline: ${baselineTime.toFixed(2)} ms`);
console.log(`Optimized (Map): ${optimizedMapTime.toFixed(2)} ms`);
console.log(`Optimized (Array clone): ${optimizedTime.toFixed(2)} ms`);
console.log(`Improvement: ${(baselineTime / optimizedTime).toFixed(2)}x faster`);
