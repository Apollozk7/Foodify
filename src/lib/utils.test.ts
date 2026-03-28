import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('should merge class strings', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional classes', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
  });

  it('should handle object inputs', () => {
    expect(cn({ 'class1': true, 'class2': false, 'class3': true })).toBe('class1 class3');
  });

  it('should handle nested array inputs', () => {
    expect(cn(['class1', ['class2', 'class3']])).toBe('class1 class2 class3');
  });

  it('should handle null, undefined, and boolean values', () => {
    expect(cn('class1', null, undefined, true, false, 'class2')).toBe('class1 class2');
  });

  it('should merge tailwind classes correctly (conflict resolution)', () => {
    // twMerge should resolve conflicts like padding
    expect(cn('p-2', 'p-4')).toBe('p-4');

    // twMerge should resolve conflicts like text color
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');

    // Complex tailwind merge
    expect(cn('px-2 py-1 bg-red-500', 'p-3', 'bg-blue-500')).toBe('p-3 bg-blue-500');
  });

  it('should handle mixed inputs', () => {
    expect(cn('base-class', { 'conditional-true': true, 'conditional-false': false }, ['array-class', 'another-array-class'], 'last-class')).toBe('base-class conditional-true array-class another-array-class last-class');
  });

  it('should return empty string for no inputs', () => {
    expect(cn()).toBe('');
  });
});
