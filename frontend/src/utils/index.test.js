import { expect, test, describe } from 'vitest';
import { capitalize, riskFromOccupancy, formatPercent } from './index';
import { RISK_LEVELS } from '../constants/index';

describe('Utility Functions', () => {
  test('capitalize should properly format strings', () => {
    expect(capitalize('hElLo')).toBe('Hello');
    expect(capitalize('')).toBe('');
  });

  test('riskFromOccupancy should return correct risk levels', () => {
    expect(riskFromOccupancy(96)).toBe(RISK_LEVELS.CRITICAL);
    expect(riskFromOccupancy(85)).toBe(RISK_LEVELS.HIGH);
    expect(riskFromOccupancy(70)).toBe(RISK_LEVELS.MEDIUM);
    expect(riskFromOccupancy(50)).toBe(RISK_LEVELS.LOW);
  });

  test('formatPercent should format numbers correctly', () => {
    expect(formatPercent(50)).toBe('50%');
    expect(formatPercent(50.555, 1)).toBe('50.6%');
    expect(formatPercent(null)).toBe('—');
  });
});
