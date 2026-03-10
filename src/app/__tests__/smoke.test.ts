import { describe, it, expect } from 'vitest';

describe('Smoke test', () => {
  it('should verify test setup works', () => {
    expect(true).toBe(true);
  });

  it('should resolve @ path alias', async () => {
    const types = await import('@/types');
    expect(types).toBeDefined();
  });
});
