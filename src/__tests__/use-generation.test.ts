import { renderHook, act } from '@testing-library/react';
import { useGeneration } from '../hooks/use-generation';
import { expect, test, vi, beforeEach, afterEach } from 'vitest';

// Mock fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

beforeEach(() => {
  vi.useFakeTimers();
  fetchMock.mockClear();
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

test('useGeneration exponential backoff', async () => {
  // Mock POST to /api/generate
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ generationId: 'gen-123', aiMessage: 'Generating...' }),
  });

  // Setup multiple polling responses, all pending
  const pendingResponse = {
    ok: true,
    json: () => Promise.resolve({ status: 'pending' }),
  };

  fetchMock.mockResolvedValue(pendingResponse); // all subsequent calls

  const { result } = renderHook(() => useGeneration());

  // Call generate
  await act(async () => {
    await result.current.generate({ prompt: 'Test prompt', imageUrl: 'test.jpg' });
  });

  expect(fetchMock).toHaveBeenCalledTimes(1);

  // Advance 2s (1 interval)
  await act(async () => {
    vi.advanceTimersByTime(2000);
  });

  expect(fetchMock).toHaveBeenCalledTimes(2);

  // Advance 4s (next backoff should trigger at 2+4=6s, so +4s from previous)
  await act(async () => {
    vi.advanceTimersByTime(4000);
  });

  expect(fetchMock).toHaveBeenCalledTimes(3);

  // Advance 8s (next at 6+8=14s)
  await act(async () => {
    vi.advanceTimersByTime(8000);
  });

  expect(fetchMock).toHaveBeenCalledTimes(4);

  // Advance 10s (max interval capped at 10s)
  await act(async () => {
    vi.advanceTimersByTime(10000);
  });

  expect(fetchMock).toHaveBeenCalledTimes(5);

  const count = fetchMock.mock.calls.length;
  console.log(`Fetch calls after 24s: ${count}`);
});
