const { performance } = require('perf_hooks');

const messages = Array.from({ length: 100000 }).map((_, i) => ({
  role: 'ai',
}));

let memoizedValue;
let lastDeps;
function useMemo(factory, deps) {
  if (!lastDeps || lastDeps[0] !== deps[0]) {
    memoizedValue = factory();
    lastDeps = deps;
  }
  return memoizedValue;
}

function renderWithoutMemo() {
  let lastUserImage;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user' && messages[i].imageUrl) {
      lastUserImage = messages[i].imageUrl;
      break;
    }
  }
  return lastUserImage;
}

function renderWithMemo() {
  return useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user' && messages[i].imageUrl) {
        return messages[i].imageUrl;
      }
    }
    return undefined;
  }, [messages]);
}

function runBench() {
  const startUnmemoized = performance.now();
  for (let i = 0; i < 1000; i++) {
    renderWithoutMemo();
  }
  const endUnmemoized = performance.now();
  console.log(`Unmemoized (1000 re-renders): ${endUnmemoized - startUnmemoized} ms`);

  const startMemoized = performance.now();
  for (let i = 0; i < 1000; i++) {
    renderWithMemo();
  }
  const endMemoized = performance.now();
  console.log(`Memoized (1000 re-renders): ${endMemoized - startMemoized} ms`);
}

runBench();
