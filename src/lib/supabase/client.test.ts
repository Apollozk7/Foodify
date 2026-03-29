import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createClient } from './client';
import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/env';

// Mock the dependencies
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(),
}));

vi.mock('@/env', () => ({
  env: {
    NEXT_PUBLIC_SUPABASE_URL: undefined,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: undefined,
  },
}));

describe('Supabase Client - createClient', () => {
  const originalConsoleWarn = console.warn;
  let mockConsoleWarn: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleWarn = vi.fn();
    console.warn = mockConsoleWarn;

    // Reset env vars to undefined before each test
    env.NEXT_PUBLIC_SUPABASE_URL = undefined as any;
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = undefined as any;
  });

  afterEach(() => {
    console.warn = originalConsoleWarn;
  });

  it('should create a client with real credentials when provided', () => {
    // Arrange
    env.NEXT_PUBLIC_SUPABASE_URL = 'https://real.supabase.co';
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = 'real-key';

    // Act
    createClient();

    // Assert
    expect(createBrowserClient).toHaveBeenCalledWith(
      'https://real.supabase.co',
      'real-key'
    );
    expect(mockConsoleWarn).not.toHaveBeenCalled();
  });

  it('should fallback to placeholder and warn if URL is missing', () => {
    // Arrange
    env.NEXT_PUBLIC_SUPABASE_URL = undefined as any;
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = 'real-key';

    // Act
    createClient();

    // Assert
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      'Supabase credentials missing. Some features will be disabled.'
    );
    expect(createBrowserClient).toHaveBeenCalledWith(
      'https://placeholder.supabase.co',
      'real-key'
    );
  });

  it('should fallback to placeholder and warn if key is missing', () => {
    // Arrange
    env.NEXT_PUBLIC_SUPABASE_URL = 'https://real.supabase.co';
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = undefined as any;

    // Act
    createClient();

    // Assert
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      'Supabase credentials missing. Some features will be disabled.'
    );
    expect(createBrowserClient).toHaveBeenCalledWith(
      'https://real.supabase.co',
      'placeholder'
    );
  });

  it('should fallback to placeholders and warn if both are missing', () => {
    // Arrange
    env.NEXT_PUBLIC_SUPABASE_URL = undefined as any;
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = undefined as any;

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
