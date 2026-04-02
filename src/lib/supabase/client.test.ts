import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createBrowserClient } from '@supabase/ssr';

// Use vi.hoisted to ensure the variable is available to the hoisted vi.mock
const { mockEnv } = vi.hoisted(() => ({
  mockEnv: {
    NEXT_PUBLIC_SUPABASE_URL: undefined as string | undefined,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: undefined as string | undefined,
  },
}));

// Mock the dependencies
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(),
}));

vi.mock('@/env', () => ({
  env: mockEnv,
}));

// Import after mocks are established
import { createClient } from './client';

describe('Supabase Client - createClient', () => {
  const originalConsoleWarn = console.warn;
  let mockConsoleWarn: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleWarn = vi.fn();
    console.warn = mockConsoleWarn as any;

    // Reset mockEnv vars to undefined before each test
    mockEnv.NEXT_PUBLIC_SUPABASE_URL = undefined;
    mockEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = undefined;
  });

  afterEach(() => {
    console.warn = originalConsoleWarn;
  });

  it('should create a client with real credentials when provided', () => {
    // Arrange
    mockEnv.NEXT_PUBLIC_SUPABASE_URL = 'https://real.supabase.co';
    mockEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = 'real-key';

    // Act
    createClient();

    // Assert
    expect(createBrowserClient).toHaveBeenCalledWith('https://real.supabase.co', 'real-key');
    expect(mockConsoleWarn).not.toHaveBeenCalled();
  });

  it('should fallback to placeholder and warn if URL is missing', () => {
    // Arrange
    mockEnv.NEXT_PUBLIC_SUPABASE_URL = undefined;
    mockEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = 'real-key';

    // Act
    createClient();

    // Assert
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      'Supabase credentials missing. Some features will be disabled.'
    );
    expect(createBrowserClient).toHaveBeenCalledWith('https://placeholder.supabase.co', 'real-key');
  });

  it('should fallback to placeholder and warn if key is missing', () => {
    // Arrange
    mockEnv.NEXT_PUBLIC_SUPABASE_URL = 'https://real.supabase.co';
    mockEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = undefined;

    // Act
    createClient();

    // Assert
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      'Supabase credentials missing. Some features will be disabled.'
    );
    expect(createBrowserClient).toHaveBeenCalledWith('https://real.supabase.co', 'placeholder');
  });

  it('should fallback to placeholders and warn if both are missing', () => {
    // Arrange
    mockEnv.NEXT_PUBLIC_SUPABASE_URL = undefined;
    mockEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = undefined;

    // Act
    createClient();

    // Assert
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      'Supabase credentials missing. Some features will be disabled.'
    );
    expect(createBrowserClient).toHaveBeenCalledWith(
      'https://placeholder.supabase.co',
      'placeholder'
    );
  });
});
