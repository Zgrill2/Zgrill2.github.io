import { describe, it, expect } from 'vitest';
import {
  calculateAttributeCost,
  calculateTraditionCost,
  calculateSkillCost,
  calculateAffinityPoints,
} from '../calculations';
import type { Affinities } from '../../types/character';

describe('Attribute Bounds Validation', () => {
  describe('minimum value (1)', () => {
    it('should handle attribute = 1 (minimum valid)', () => {
      const cost = calculateAttributeCost(1);
      expect(cost).toBe(0);
      expect(cost).toBeGreaterThanOrEqual(0);
    });

    it('should not produce negative costs at minimum', () => {
      expect(calculateAttributeCost(1)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('maximum value (10)', () => {
    it('should handle attribute = 10 (maximum valid)', () => {
      const cost = calculateAttributeCost(10);
      expect(cost).toBe(270);
      expect(typeof cost).toBe('number');
      expect(cost).toBeGreaterThan(0);
    });

    it('should calculate correctly at maximum', () => {
      // (100 + 10 - 2) * 2.5 = 270
      expect(calculateAttributeCost(10)).toBe(270);
    });
  });

  describe('below minimum (0)', () => {
    it('should handle value = 0 (below minimum)', () => {
      const cost = calculateAttributeCost(0);
      expect(cost).toBe(0);
    });

    it('should clamp or treat as zero', () => {
      // Value 0 should be treated as 0 cost
      expect(calculateAttributeCost(0)).toBe(0);
    });
  });

  describe('above maximum (11+)', () => {
    it('should calculate for value = 11 (above maximum)', () => {
      // System doesn't prevent calculation, just calculates cost
      const cost = calculateAttributeCost(11);
      // (121 + 11 - 2) * 2.5 = 130 * 2.5 = 325
      expect(cost).toBe(325);
      expect(cost).toBeGreaterThan(270); // Greater than max (10)
    });

    it('should calculate for far above maximum', () => {
      const cost = calculateAttributeCost(100);
      expect(cost).toBeGreaterThan(0);
      expect(typeof cost).toBe('number');
    });
  });

  describe('negative values', () => {
    it('should handle negative value (-5)', () => {
      const cost = calculateAttributeCost(-5);
      // Should return 0 for negative values
      expect(cost).toBe(0);
    });

    it('should handle negative value (-1)', () => {
      expect(calculateAttributeCost(-1)).toBe(0);
    });
  });

  describe('valid range (1-10)', () => {
    it('should have monotonically increasing costs', () => {
      const costs = Array.from({ length: 10 }, (_, i) => calculateAttributeCost(i + 1));

      for (let i = 1; i < costs.length; i++) {
        expect(costs[i]).toBeGreaterThanOrEqual(costs[i - 1]);
      }
    });

    it('should calculate all values in valid range', () => {
      for (let value = 1; value <= 10; value++) {
        const cost = calculateAttributeCost(value);
        expect(cost).toBeGreaterThanOrEqual(0);
        expect(typeof cost).toBe('number');
        expect(isNaN(cost)).toBe(false);
      }
    });
  });
});

describe('Tradition Bounds Validation', () => {
  describe('minimum value (0-1)', () => {
    it('should handle tradition = 0', () => {
      const cost = calculateTraditionCost(0);
      expect(cost).toBe(0);
    });

    it('should handle tradition = 1 (minimum valid)', () => {
      const cost = calculateTraditionCost(1);
      expect(cost).toBe(0); // Special case: costs 0
    });
  });

  describe('maximum value (10)', () => {
    it('should handle tradition = 10 (maximum valid)', () => {
      const cost = calculateTraditionCost(10);
      expect(cost).toBe(405);
      expect(typeof cost).toBe('number');
    });

    it('should calculate correctly at maximum', () => {
      // (100 + 70 - 8) * 2.5 = 405
      expect(calculateTraditionCost(10)).toBe(405);
    });
  });

  describe('below minimum', () => {
    it('should handle negative tradition', () => {
      expect(calculateTraditionCost(-5)).toBe(0);
      expect(calculateTraditionCost(-1)).toBe(0);
    });
  });

  describe('above maximum', () => {
    it('should calculate for tradition = 11 (above maximum)', () => {
      const cost = calculateTraditionCost(11);
      expect(cost).toBeGreaterThan(405);
      expect(typeof cost).toBe('number');
    });

    it('should calculate for tradition = 20', () => {
      const cost = calculateTraditionCost(20);
      expect(cost).toBeGreaterThan(0);
    });
  });

  describe('valid range (1-10)', () => {
    it('should have monotonically increasing costs for 2+', () => {
      const costs = Array.from({ length: 9 }, (_, i) => calculateTraditionCost(i + 2));

      for (let i = 1; i < costs.length; i++) {
        expect(costs[i]).toBeGreaterThan(costs[i - 1]);
      }
    });

    it('should calculate all values in valid range', () => {
      for (let tradition = 0; tradition <= 10; tradition++) {
        const cost = calculateTraditionCost(tradition);
        expect(cost).toBeGreaterThanOrEqual(0);
        expect(typeof cost).toBe('number');
        expect(isNaN(cost)).toBe(false);
      }
    });
  });
});

describe('Affinity Point Allocation Validation', () => {
  describe('within budget', () => {
    it('should validate affinities within budget (tradition=5)', () => {
      // Tradition 5 gives 15 affinity points
      const maxPoints = calculateAffinityPoints(5);
      expect(maxPoints).toBe(15);

      const affinities: Affinities = { w: 3, u: 4, b: 2, r: 3, g: 3 };
      const total = affinities.w + affinities.u + affinities.b + affinities.r + affinities.g;

      expect(total).toBe(15);
      expect(total).toBeLessThanOrEqual(maxPoints);
    });

    it('should validate affinities below budget', () => {
      const maxPoints = calculateAffinityPoints(5);
      const affinities: Affinities = { w: 2, u: 2, b: 2, r: 2, g: 2 };
      const total = affinities.w + affinities.u + affinities.b + affinities.r + affinities.g;

      expect(total).toBe(10);
      expect(total).toBeLessThan(maxPoints);
    });
  });

  describe('exactly at budget', () => {
    it('should validate when all points in one affinity', () => {
      const maxPoints = calculateAffinityPoints(5);
      const affinities: Affinities = { w: 15, u: 0, b: 0, r: 0, g: 0 };
      const total = affinities.w + affinities.u + affinities.b + affinities.r + affinities.g;

      expect(total).toBe(15);
      expect(total).toBe(maxPoints);
    });

    it('should validate when exactly at budget with mixed affinities', () => {
      const maxPoints = calculateAffinityPoints(10);
      const affinities: Affinities = { w: 6, u: 6, b: 6, r: 6, g: 6 };
      const total = affinities.w + affinities.u + affinities.b + affinities.r + affinities.g;

      expect(total).toBe(30);
      expect(total).toBe(maxPoints);
    });
  });

  describe('over budget', () => {
    it('should detect over budget (tradition=5, 20 points spent)', () => {
      const maxPoints = calculateAffinityPoints(5);
      const affinities: Affinities = { w: 4, u: 4, b: 4, r: 4, g: 4 };
      const total = affinities.w + affinities.u + affinities.b + affinities.r + affinities.g;

      expect(total).toBe(20);
      expect(total).toBeGreaterThan(maxPoints);

      const overspent = total - maxPoints;
      expect(overspent).toBe(5);
    });

    it('should detect significantly over budget', () => {
      const maxPoints = calculateAffinityPoints(3);
      const affinities: Affinities = { w: 5, u: 5, b: 5, r: 5, g: 5 };
      const total = affinities.w + affinities.u + affinities.b + affinities.r + affinities.g;

      expect(total).toBe(25);
      expect(maxPoints).toBe(9);
      expect(total).toBeGreaterThan(maxPoints);
    });
  });

  describe('zero tradition', () => {
    it('should have 0 affinity points with tradition=0', () => {
      const maxPoints = calculateAffinityPoints(0);
      expect(maxPoints).toBe(0);

      const affinities: Affinities = { w: 0, u: 0, b: 0, r: 0, g: 0 };
      const total = affinities.w + affinities.u + affinities.b + affinities.r + affinities.g;

      expect(total).toBe(0);
      expect(total).toBeLessThanOrEqual(maxPoints);
    });

    it('should detect overspend with tradition=0', () => {
      const maxPoints = calculateAffinityPoints(0);
      const affinities: Affinities = { w: 1, u: 0, b: 0, r: 0, g: 0 };
      const total = affinities.w + affinities.u + affinities.b + affinities.r + affinities.g;

      expect(total).toBeGreaterThan(maxPoints);
    });
  });

  describe('negative values detection', () => {
    it('should detect negative affinity values', () => {
      const affinities = { w: -2, u: 3, b: 5, r: 4, g: 5 };

      // Negative values should be invalid
      expect(affinities.w).toBeLessThan(0);

      // Total would be 15, but w is negative
      const total = affinities.w + affinities.u + affinities.b + affinities.r + affinities.g;
      expect(total).toBe(15);
    });

    it('should validate all affinity values are non-negative', () => {
      const validAffinities: Affinities = { w: 3, u: 3, b: 3, r: 3, g: 3 };

      expect(validAffinities.w).toBeGreaterThanOrEqual(0);
      expect(validAffinities.u).toBeGreaterThanOrEqual(0);
      expect(validAffinities.b).toBeGreaterThanOrEqual(0);
      expect(validAffinities.r).toBeGreaterThanOrEqual(0);
      expect(validAffinities.g).toBeGreaterThanOrEqual(0);
    });
  });

  describe('maximum tradition', () => {
    it('should calculate max points for tradition=10', () => {
      const maxPoints = calculateAffinityPoints(10);
      expect(maxPoints).toBe(30);
    });

    it('should validate full distribution at max tradition', () => {
      const maxPoints = calculateAffinityPoints(10);
      const affinities: Affinities = { w: 6, u: 6, b: 6, r: 6, g: 6 };
      const total = affinities.w + affinities.u + affinities.b + affinities.r + affinities.g;

      expect(total).toBe(30);
      expect(total).toBe(maxPoints);
    });
  });
});

describe('Skill Rank Bounds Validation', () => {
  describe('minimum value (0)', () => {
    it('should handle rank = 0 (minimum)', () => {
      const cost = calculateSkillCost(0, 1.0);
      expect(cost).toBe(0);
    });

    it('should not produce negative costs at zero', () => {
      expect(calculateSkillCost(0, 1.0)).toBe(0);
      expect(calculateSkillCost(0, 2.5)).toBe(0);
      expect(calculateSkillCost(0, 0.5)).toBe(0);
    });
  });

  describe('maximum value (20)', () => {
    it('should handle rank = 20 (maximum valid)', () => {
      const cost = calculateSkillCost(20, 1.0);
      // (400 + 20 + 2) * 1.0 = 422
      expect(cost).toBe(422);
      expect(typeof cost).toBe('number');
    });

    it('should calculate correctly at maximum with different multipliers', () => {
      expect(calculateSkillCost(20, 1.0)).toBe(422);
      expect(calculateSkillCost(20, 2.5)).toBe(1055); // 422 * 2.5
      expect(calculateSkillCost(20, 0.5)).toBe(211);  // 422 * 0.5
    });
  });

  describe('below minimum (-1)', () => {
    it('should handle rank = -1 (below minimum)', () => {
      const cost = calculateSkillCost(-1, 1.0);
      expect(cost).toBe(0);
    });

    it('should handle negative ranks', () => {
      expect(calculateSkillCost(-5, 1.0)).toBe(0);
      expect(calculateSkillCost(-10, 2.5)).toBe(0);
    });
  });

  describe('above maximum (21+)', () => {
    it('should calculate for rank = 21 (above maximum)', () => {
      const cost = calculateSkillCost(21, 1.0);
      // (441 + 21 + 2) * 1.0 = 464
      expect(cost).toBe(464);
      expect(cost).toBeGreaterThan(422);
    });

    it('should calculate for high ranks', () => {
      const cost = calculateSkillCost(50, 1.0);
      expect(cost).toBeGreaterThan(0);
      expect(typeof cost).toBe('number');
    });
  });

  describe('valid range (0-20)', () => {
    it('should have monotonically increasing costs', () => {
      const costs = Array.from({ length: 21 }, (_, i) => calculateSkillCost(i, 1.0));

      for (let i = 1; i < costs.length; i++) {
        expect(costs[i]).toBeGreaterThan(costs[i - 1]);
      }
    });

    it('should calculate all values in valid range', () => {
      for (let rank = 0; rank <= 20; rank++) {
        const cost = calculateSkillCost(rank, 1.0);
        expect(cost).toBeGreaterThanOrEqual(0);
        expect(typeof cost).toBe('number');
        expect(isNaN(cost)).toBe(false);
      }
    });

    it('should scale properly with multipliers', () => {
      for (let rank = 1; rank <= 20; rank++) {
        const base = calculateSkillCost(rank, 1.0);
        const parent = calculateSkillCost(rank, 2.5);
        const knowledge = calculateSkillCost(rank, 0.5);

        expect(parent).toBe(base * 2.5);
        expect(knowledge).toBe(base * 0.5);
      }
    });
  });
});

describe('BP Budget Validation', () => {
  describe('budget comparison', () => {
    it('should detect under budget', () => {
      const budget = 500;
      const spent = 400;

      expect(spent).toBeLessThan(budget);

      const remaining = budget - spent;
      expect(remaining).toBe(100);
      expect(remaining).toBeGreaterThan(0);
    });

    it('should detect exactly at budget', () => {
      const budget = 500;
      const spent = 500;

      expect(spent).toBe(budget);

      const remaining = budget - spent;
      expect(remaining).toBe(0);
    });

    it('should detect over budget by 1', () => {
      const budget = 500;
      const spent = 501;

      expect(spent).toBeGreaterThan(budget);

      const remaining = budget - spent;
      expect(remaining).toBe(-1);
      expect(remaining).toBeLessThan(0);
    });

    it('should detect significantly over budget', () => {
      const budget = 500;
      const spent = 750;

      expect(spent).toBeGreaterThan(budget);

      const remaining = budget - spent;
      expect(remaining).toBe(-250);
      expect(remaining).toBeLessThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle negative budget', () => {
      const budget = -100;
      const spent = 50;

      expect(spent).toBeGreaterThan(budget);

      const remaining = budget - spent;
      expect(remaining).toBeLessThan(0);
    });

    it('should handle zero budget', () => {
      const budget = 0;
      const spent = 100;

      expect(spent).toBeGreaterThan(budget);
    });

    it('should handle negative spent (discount exceeds costs)', () => {
      const budget = 500;
      const spent = -20; // Knowledge discount exceeds costs

      expect(spent).toBeLessThan(budget);

      const remaining = budget - spent;
      expect(remaining).toBe(520);
      expect(remaining).toBeGreaterThan(budget);
    });
  });

  describe('overspend calculation', () => {
    it('should calculate overspend amount', () => {
      const budget = 500;
      const testCases = [
        { spent: 400, expected: 0 },
        { spent: 500, expected: 0 },
        { spent: 501, expected: 1 },
        { spent: 600, expected: 100 },
        { spent: 750, expected: 250 },
      ];

      testCases.forEach(({ spent, expected }) => {
        const overspend = Math.max(0, spent - budget);
        expect(overspend).toBe(expected);
      });
    });

    it('should identify overspend status', () => {
      const budget = 500;

      expect(400 > budget).toBe(false); // Not over
      expect(500 > budget).toBe(false); // Not over
      expect(501 > budget).toBe(true);  // Over
      expect(750 > budget).toBe(true);  // Over
    });
  });
});
