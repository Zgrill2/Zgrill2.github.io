import { describe, it, expect } from 'vitest';
import {
  parseAffinityReq,
  parseAffinityReqByRank,
  getAffinityReqForRank,
  meetsAffinityReq,
} from '../ability';
import type { AffinityRequirement } from '../ability';
import type { Affinities } from '../character';

describe('parseAffinityReq', () => {
  describe('simple single color requirements', () => {
    it('should parse "7B,(9)"', () => {
      const result = parseAffinityReq('7B,(9)');

      expect(result.requirements).toHaveLength(1);
      expect(result.requirements[0]).toEqual({
        colors: ['B'],
        isOr: false,
        amount: 7,
      });
      expect(result.total).toBe(9);
    });

    it('should parse "12W,(15)"', () => {
      const result = parseAffinityReq('12W,(15)');

      expect(result.requirements).toHaveLength(1);
      expect(result.requirements[0]).toEqual({
        colors: ['W'],
        isOr: false,
        amount: 12,
      });
      expect(result.total).toBe(15);
    });

    it('should parse "5R,(9)"', () => {
      const result = parseAffinityReq('5R,(9)');

      expect(result.requirements).toHaveLength(1);
      expect(result.requirements[0]).toEqual({
        colors: ['R'],
        isOr: false,
        amount: 5,
      });
      expect(result.total).toBe(9);
    });
  });

  describe('multiple AND requirements', () => {
    it('should parse "12W,12G,(30)"', () => {
      const result = parseAffinityReq('12W,12G,(30)');

      expect(result.requirements).toHaveLength(2);
      expect(result.requirements[0]).toEqual({
        colors: ['W'],
        isOr: false,
        amount: 12,
      });
      expect(result.requirements[1]).toEqual({
        colors: ['G'],
        isOr: false,
        amount: 12,
      });
      expect(result.total).toBe(30);
    });

    it('should parse "4R,5B,(12)"', () => {
      const result = parseAffinityReq('4R,5B,(12)');

      expect(result.requirements).toHaveLength(2);
      expect(result.requirements[0]).toEqual({
        colors: ['R'],
        isOr: false,
        amount: 4,
      });
      expect(result.requirements[1]).toEqual({
        colors: ['B'],
        isOr: false,
        amount: 5,
      });
      expect(result.total).toBe(12);
    });

    it('should parse "3W,4U,5B,(15)"', () => {
      const result = parseAffinityReq('3W,4U,5B,(15)');

      expect(result.requirements).toHaveLength(3);
      expect(result.requirements[0]).toEqual({
        colors: ['W'],
        isOr: false,
        amount: 3,
      });
      expect(result.requirements[1]).toEqual({
        colors: ['U'],
        isOr: false,
        amount: 4,
      });
      expect(result.requirements[2]).toEqual({
        colors: ['B'],
        isOr: false,
        amount: 5,
      });
      expect(result.total).toBe(15);
    });
  });

  describe('OR requirements with parentheses', () => {
    it('should parse "5(B|R),(9)"', () => {
      const result = parseAffinityReq('5(B|R),(9)');

      expect(result.requirements).toHaveLength(1);
      expect(result.requirements[0]).toEqual({
        colors: ['B', 'R'],
        isOr: true,
        amount: 5,
      });
      expect(result.total).toBe(9);
    });

    it('should parse "9(W|U),(12)"', () => {
      const result = parseAffinityReq('9(W|U),(12)');

      expect(result.requirements).toHaveLength(1);
      expect(result.requirements[0]).toEqual({
        colors: ['W', 'U'],
        isOr: true,
        amount: 9,
      });
      expect(result.total).toBe(12);
    });

    it('should parse "7(R|G|B),(15)"', () => {
      const result = parseAffinityReq('7(R|G|B),(15)');

      expect(result.requirements).toHaveLength(1);
      expect(result.requirements[0]).toEqual({
        colors: ['R', 'G', 'B'],
        isOr: true,
        amount: 7,
      });
      expect(result.total).toBe(15);
    });
  });

  describe('OR requirements without parentheses', () => {
    it('should parse "9R|G,(12)"', () => {
      const result = parseAffinityReq('9R|G,(12)');

      expect(result.requirements).toHaveLength(1);
      expect(result.requirements[0]).toEqual({
        colors: ['R', 'G'],
        isOr: true,
        amount: 9,
      });
      expect(result.total).toBe(12);
    });

    it('should parse "5W|B,(9)"', () => {
      const result = parseAffinityReq('5W|B,(9)');

      expect(result.requirements).toHaveLength(1);
      expect(result.requirements[0]).toEqual({
        colors: ['W', 'B'],
        isOr: true,
        amount: 5,
      });
      expect(result.total).toBe(9);
    });
  });

  describe('complex mixed requirements', () => {
    it('should parse "4R,5(B|R),(12)"', () => {
      const result = parseAffinityReq('4R,5(B|R),(12)');

      expect(result.requirements).toHaveLength(2);
      expect(result.requirements[0]).toEqual({
        colors: ['R'],
        isOr: false,
        amount: 4,
      });
      expect(result.requirements[1]).toEqual({
        colors: ['B', 'R'],
        isOr: true,
        amount: 5,
      });
      expect(result.total).toBe(12);
    });

    it('should parse "6W,4(U|B),3G,(18)"', () => {
      const result = parseAffinityReq('6W,4(U|B),3G,(18)');

      expect(result.requirements).toHaveLength(3);
      expect(result.requirements[0]).toEqual({
        colors: ['W'],
        isOr: false,
        amount: 6,
      });
      expect(result.requirements[1]).toEqual({
        colors: ['U', 'B'],
        isOr: true,
        amount: 4,
      });
      expect(result.requirements[2]).toEqual({
        colors: ['G'],
        isOr: false,
        amount: 3,
      });
      expect(result.total).toBe(18);
    });
  });

  describe('empty and edge cases', () => {
    it('should parse empty string', () => {
      const result = parseAffinityReq('');

      expect(result.requirements).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle whitespace', () => {
      const result = parseAffinityReq('  ');

      expect(result.requirements).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should parse requirement without total', () => {
      const result = parseAffinityReq('7B');

      expect(result.requirements).toHaveLength(1);
      expect(result.requirements[0]).toEqual({
        colors: ['B'],
        isOr: false,
        amount: 7,
      });
      expect(result.total).toBe(0);
    });

    it('should parse just total', () => {
      const result = parseAffinityReq('(15)');

      expect(result.requirements).toHaveLength(0);
      expect(result.total).toBe(15);
    });
  });

  describe('whitespace handling', () => {
    it('should handle spaces around commas', () => {
      const result = parseAffinityReq('12W, 12G, (30)');

      expect(result.requirements).toHaveLength(2);
      expect(result.total).toBe(30);
    });

    it('should handle spaces in requirement', () => {
      const result = parseAffinityReq(' 7B , (9) ');

      expect(result.requirements).toHaveLength(1);
      expect(result.requirements[0].amount).toBe(7);
      expect(result.total).toBe(9);
    });
  });
});

describe('parseAffinityReqByRank', () => {
  describe('single rank (no newlines)', () => {
    it('should parse single rank requirement', () => {
      const result = parseAffinityReqByRank('12W,(15)');

      expect(result).toHaveLength(1);
      expect(result[0].requirements).toHaveLength(1);
      expect(result[0].requirements[0]).toEqual({
        colors: ['W'],
        isOr: false,
        amount: 12,
      });
      expect(result[0].total).toBe(15);
    });

    it('should parse complex single rank', () => {
      const result = parseAffinityReqByRank('4R,5(B|R),(12)');

      expect(result).toHaveLength(1);
      expect(result[0].requirements).toHaveLength(2);
    });
  });

  describe('multiple ranks with \\r\\n', () => {
    it('should parse three ranks', () => {
      const input = '12W,(15)\r\n16W,(21)\r\n20W,(27)';
      const result = parseAffinityReqByRank(input);

      expect(result).toHaveLength(3);

      expect(result[0].requirements[0]).toEqual({
        colors: ['W'],
        isOr: false,
        amount: 12,
      });
      expect(result[0].total).toBe(15);

      expect(result[1].requirements[0]).toEqual({
        colors: ['W'],
        isOr: false,
        amount: 16,
      });
      expect(result[1].total).toBe(21);

      expect(result[2].requirements[0]).toEqual({
        colors: ['W'],
        isOr: false,
        amount: 20,
      });
      expect(result[2].total).toBe(27);
    });

    it('should parse two ranks with different requirements', () => {
      const input = '5B,(9)\r\n10B,5R,(18)';
      const result = parseAffinityReqByRank(input);

      expect(result).toHaveLength(2);

      expect(result[0].requirements).toHaveLength(1);
      expect(result[0].requirements[0].amount).toBe(5);
      expect(result[0].total).toBe(9);

      expect(result[1].requirements).toHaveLength(2);
      expect(result[1].requirements[0].amount).toBe(10);
      expect(result[1].requirements[1].amount).toBe(5);
      expect(result[1].total).toBe(18);
    });
  });

  describe('unix newlines (\\n)', () => {
    it('should parse with \\n instead of \\r\\n', () => {
      const input = '5B,(9)\n10B,(15)';
      const result = parseAffinityReqByRank(input);

      expect(result).toHaveLength(2);

      expect(result[0].total).toBe(9);
      expect(result[1].total).toBe(15);
    });

    it('should handle mixed newlines', () => {
      const input = '5B,(9)\r\n10B,(15)\n15B,(21)';
      const result = parseAffinityReqByRank(input);

      expect(result).toHaveLength(3);
    });
  });

  describe('empty and edge cases', () => {
    it('should handle empty string', () => {
      const result = parseAffinityReqByRank('');

      expect(result).toHaveLength(1);
      expect(result[0].requirements).toHaveLength(0);
      expect(result[0].total).toBe(0);
    });

    it('should filter empty lines', () => {
      const input = '5B,(9)\r\n\r\n10B,(15)';
      const result = parseAffinityReqByRank(input);

      expect(result).toHaveLength(2);
    });

    it('should handle trailing newline', () => {
      const input = '5B,(9)\r\n10B,(15)\r\n';
      const result = parseAffinityReqByRank(input);

      expect(result).toHaveLength(2);
    });
  });
});

describe('getAffinityReqForRank', () => {
  describe('single rank requirement', () => {
    it('should return the requirement for rank 0', () => {
      const result = getAffinityReqForRank('12W,(15)', 0);

      expect(result.total).toBe(15);
      expect(result.requirements[0].amount).toBe(12);
    });

    it('should return first rank when requesting higher rank', () => {
      const result = getAffinityReqForRank('12W,(15)', 5);

      expect(result.total).toBe(15);
    });
  });

  describe('multi-rank requirement', () => {
    it('should return correct requirement for rank 0', () => {
      const input = '12W,(15)\r\n16W,(21)\r\n20W,(27)';
      const result = getAffinityReqForRank(input, 0);

      expect(result.total).toBe(15);
      expect(result.requirements[0].amount).toBe(12);
    });

    it('should return correct requirement for rank 1', () => {
      const input = '12W,(15)\r\n16W,(21)\r\n20W,(27)';
      const result = getAffinityReqForRank(input, 1);

      expect(result.total).toBe(21);
      expect(result.requirements[0].amount).toBe(16);
    });

    it('should return correct requirement for rank 2', () => {
      const input = '12W,(15)\r\n16W,(21)\r\n20W,(27)';
      const result = getAffinityReqForRank(input, 2);

      expect(result.total).toBe(27);
      expect(result.requirements[0].amount).toBe(20);
    });

    it('should return first rank when requesting out of bounds', () => {
      const input = '12W,(15)\r\n16W,(21)';
      const result = getAffinityReqForRank(input, 5);

      expect(result.total).toBe(15);
    });
  });

  describe('empty string', () => {
    it('should return empty requirement for empty string', () => {
      const result = getAffinityReqForRank('', 0);

      expect(result.requirements).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle empty string for non-zero rank', () => {
      const result = getAffinityReqForRank('', 5);

      expect(result.requirements).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle undefined gracefully', () => {
      const result = getAffinityReqForRank(undefined as any, 0);

      expect(result.requirements).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle null gracefully', () => {
      const result = getAffinityReqForRank(null as any, 0);

      expect(result.requirements).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });
});

describe('meetsAffinityReq', () => {
  describe('total requirement only', () => {
    it('should pass when total is met', () => {
      const affinities: Affinities = { w: 5, u: 5, b: 5, r: 5, g: 5 };
      const requirement: AffinityRequirement = {
        requirements: [],
        total: 25,
      };

      expect(meetsAffinityReq(affinities, requirement)).toBe(true);
    });

    it('should pass when total is exceeded', () => {
      const affinities: Affinities = { w: 6, u: 6, b: 6, r: 6, g: 6 };
      const requirement: AffinityRequirement = {
        requirements: [],
        total: 25,
      };

      expect(meetsAffinityReq(affinities, requirement)).toBe(true);
    });

    it('should fail when total is not met', () => {
      const affinities: Affinities = { w: 2, u: 2, b: 2, r: 2, g: 2 };
      const requirement: AffinityRequirement = {
        requirements: [],
        total: 15,
      };

      expect(meetsAffinityReq(affinities, requirement)).toBe(false);
    });
  });

  describe('single color requirement (AND)', () => {
    it('should pass when color requirement is met', () => {
      const affinities: Affinities = { w: 10, u: 5, b: 8, r: 4, g: 3 };
      const requirement: AffinityRequirement = {
        requirements: [{ colors: ['B'], isOr: false, amount: 7 }],
        total: 25,
      };

      expect(meetsAffinityReq(affinities, requirement)).toBe(true);
    });

    it('should fail when color requirement is not met', () => {
      const affinities: Affinities = { w: 5, u: 5, b: 3, r: 5, g: 5 };
      const requirement: AffinityRequirement = {
        requirements: [{ colors: ['B'], isOr: false, amount: 7 }],
        total: 20,
      };

      expect(meetsAffinityReq(affinities, requirement)).toBe(false);
    });

    it('should fail when total is met but color is not', () => {
      const affinities: Affinities = { w: 10, u: 10, b: 2, r: 0, g: 0 };
      const requirement: AffinityRequirement = {
        requirements: [{ colors: ['B'], isOr: false, amount: 5 }],
        total: 15,
      };

      expect(meetsAffinityReq(affinities, requirement)).toBe(false);
    });
  });

  describe('OR requirement', () => {
    it('should pass when combined OR colors meet requirement', () => {
      const affinities: Affinities = { w: 2, u: 2, b: 8, r: 3, g: 2 };
      const requirement: AffinityRequirement = {
        requirements: [{ colors: ['B', 'R'], isOr: true, amount: 9 }],
        total: 15,
      };

      // 8B + 3R = 11 >= 9
      expect(meetsAffinityReq(affinities, requirement)).toBe(true);
    });

    it('should fail when combined OR colors do not meet requirement', () => {
      const affinities: Affinities = { w: 5, u: 5, b: 2, r: 2, g: 3 };
      const requirement: AffinityRequirement = {
        requirements: [{ colors: ['B', 'R'], isOr: true, amount: 9 }],
        total: 15,
      };

      // 2B + 2R = 4 < 9
      expect(meetsAffinityReq(affinities, requirement)).toBe(false);
    });

    it('should pass when one color in OR satisfies alone', () => {
      const affinities: Affinities = { w: 2, u: 2, b: 10, r: 1, g: 2 };
      const requirement: AffinityRequirement = {
        requirements: [{ colors: ['B', 'R'], isOr: true, amount: 9 }],
        total: 15,
      };

      // 10B alone >= 9
      expect(meetsAffinityReq(affinities, requirement)).toBe(true);
    });

    it('should handle three-color OR requirement', () => {
      const affinities: Affinities = { w: 2, u: 2, b: 3, r: 3, g: 3 };
      const requirement: AffinityRequirement = {
        requirements: [{ colors: ['B', 'R', 'G'], isOr: true, amount: 8 }],
        total: 12,
      };

      // 3B + 3R + 3G = 9 >= 8
      expect(meetsAffinityReq(affinities, requirement)).toBe(true);
    });
  });

  describe('multiple requirements (AND)', () => {
    it('should pass when all requirements are met', () => {
      const affinities: Affinities = { w: 12, u: 2, b: 4, r: 5, g: 2 };
      const requirement: AffinityRequirement = {
        requirements: [
          { colors: ['W'], isOr: false, amount: 12 },
          { colors: ['B'], isOr: false, amount: 4 },
        ],
        total: 25,
      };

      expect(meetsAffinityReq(affinities, requirement)).toBe(true);
    });

    it('should fail when one requirement is not met', () => {
      const affinities: Affinities = { w: 10, u: 5, b: 4, r: 5, g: 3 };
      const requirement: AffinityRequirement = {
        requirements: [
          { colors: ['W'], isOr: false, amount: 12 },
          { colors: ['B'], isOr: false, amount: 4 },
        ],
        total: 25,
      };

      // W is 10, needs 12
      expect(meetsAffinityReq(affinities, requirement)).toBe(false);
    });

    it('should fail when total is met but colors are not', () => {
      const affinities: Affinities = { w: 10, u: 10, b: 2, r: 3, g: 0 };
      const requirement: AffinityRequirement = {
        requirements: [
          { colors: ['W'], isOr: false, amount: 12 },
          { colors: ['B'], isOr: false, amount: 4 },
        ],
        total: 20,
      };

      expect(meetsAffinityReq(affinities, requirement)).toBe(false);
    });
  });

  describe('mixed AND and OR requirements', () => {
    it('should pass complex requirement', () => {
      const affinities: Affinities = { w: 2, u: 3, b: 6, r: 5, g: 2 };
      const requirement: AffinityRequirement = {
        requirements: [
          { colors: ['R'], isOr: false, amount: 4 },
          { colors: ['B', 'R'], isOr: true, amount: 5 },
        ],
        total: 12,
      };

      // R is 5 >= 4 (AND requirement met)
      // B + R = 6 + 5 = 11 >= 5 (OR requirement met)
      // Total = 18 >= 12
      expect(meetsAffinityReq(affinities, requirement)).toBe(true);
    });

    it('should fail when AND is met but OR is not', () => {
      const affinities: Affinities = { w: 5, u: 5, b: 1, r: 5, g: 2 };
      const requirement: AffinityRequirement = {
        requirements: [
          { colors: ['R'], isOr: false, amount: 4 },
          { colors: ['B', 'R'], isOr: true, amount: 10 },
        ],
        total: 15,
      };

      // R is 5 >= 4 (AND met)
      // B + R = 1 + 5 = 6 < 10 (OR not met)
      expect(meetsAffinityReq(affinities, requirement)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should pass with no requirements and zero total', () => {
      const affinities: Affinities = { w: 0, u: 0, b: 0, r: 0, g: 0 };
      const requirement: AffinityRequirement = {
        requirements: [],
        total: 0,
      };

      expect(meetsAffinityReq(affinities, requirement)).toBe(true);
    });

    it('should handle exact match on all values', () => {
      const affinities: Affinities = { w: 3, u: 3, b: 3, r: 3, g: 3 };
      const requirement: AffinityRequirement = {
        requirements: [{ colors: ['W'], isOr: false, amount: 3 }],
        total: 15,
      };

      expect(meetsAffinityReq(affinities, requirement)).toBe(true);
    });

    it('should handle zero requirement amount', () => {
      const affinities: Affinities = { w: 5, u: 5, b: 5, r: 5, g: 5 };
      const requirement: AffinityRequirement = {
        requirements: [{ colors: ['W'], isOr: false, amount: 0 }],
        total: 25,
      };

      expect(meetsAffinityReq(affinities, requirement)).toBe(true);
    });

    it('should handle high affinity values', () => {
      const affinities: Affinities = { w: 30, u: 0, b: 0, r: 0, g: 0 };
      const requirement: AffinityRequirement = {
        requirements: [{ colors: ['W'], isOr: false, amount: 20 }],
        total: 30,
      };

      expect(meetsAffinityReq(affinities, requirement)).toBe(true);
    });
  });

  describe('real-world ability examples', () => {
    it('should validate "7B,(9)" requirement', () => {
      const req = parseAffinityReq('7B,(9)');

      // Should pass
      expect(meetsAffinityReq(
        { w: 1, u: 1, b: 7, r: 0, g: 0 },
        req
      )).toBe(true);

      // Should fail - not enough B
      expect(meetsAffinityReq(
        { w: 3, u: 3, b: 3, r: 0, g: 0 },
        req
      )).toBe(false);

      // Should fail - not enough total
      expect(meetsAffinityReq(
        { w: 0, u: 0, b: 7, r: 0, g: 0 },
        req
      )).toBe(false);
    });

    it('should validate "12W,12G,(30)" requirement', () => {
      const req = parseAffinityReq('12W,12G,(30)');

      // Should pass
      expect(meetsAffinityReq(
        { w: 12, u: 3, b: 3, r: 0, g: 12 },
        req
      )).toBe(true);

      // Should fail - not enough W
      expect(meetsAffinityReq(
        { w: 10, u: 2, b: 2, r: 2, g: 14 },
        req
      )).toBe(false);
    });

    it('should validate "9R|G,(12)" requirement', () => {
      const req = parseAffinityReq('9R|G,(12)');

      // Should pass with R
      expect(meetsAffinityReq(
        { w: 1, u: 1, b: 1, r: 9, g: 0 },
        req
      )).toBe(true);

      // Should pass with G
      expect(meetsAffinityReq(
        { w: 1, u: 1, b: 1, r: 0, g: 9 },
        req
      )).toBe(true);

      // Should pass with combination
      expect(meetsAffinityReq(
        { w: 1, u: 1, b: 1, r: 5, g: 5 },
        req
      )).toBe(true);

      // Should fail - not enough R|G
      expect(meetsAffinityReq(
        { w: 3, u: 3, b: 3, r: 2, g: 2 },
        req
      )).toBe(false);
    });
  });
});
