import { describe, it, expect } from 'vitest';
import { calculateCompletionPercentage } from '@/lib/progress/progress-storage';

describe('Progress Calculations', () => {
  it('calculates completion percentage correctly', () => {
    expect(calculateCompletionPercentage(0, 5)).toBe(0);
    expect(calculateCompletionPercentage(1, 4)).toBe(25);
    expect(calculateCompletionPercentage(2, 3)).toBe(67);
    expect(calculateCompletionPercentage(5, 5)).toBe(100);
    expect(calculateCompletionPercentage(0, 0)).toBe(0);
  });
});
