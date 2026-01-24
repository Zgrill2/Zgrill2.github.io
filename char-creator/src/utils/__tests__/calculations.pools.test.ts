import { describe, it, expect } from 'vitest';
import {
  calculateHealthPools,
  calculateResistStats,
  calculateSoakStats,
} from '../calculations';
import { standardAttributes, minAttributes, maxAttributes } from '../../test/mockData';
import type { Attributes } from '../../types/character';

describe('calculateHealthPools', () => {
  describe('HP calculation', () => {
    it('should calculate HP correctly', () => {
      // Formula: 16 + BOD
      // BOD = 5
      const attrs: Attributes = { ...standardAttributes, bod: 5 };
      const result = calculateHealthPools(attrs, 'wil', {});

      expect(result.hp).toBe(21); // 16 + 5
    });

    it('should calculate HP with minimum BOD', () => {
      const attrs: Attributes = { ...standardAttributes, bod: 1 };
      const result = calculateHealthPools(attrs, 'wil', {});

      expect(result.hp).toBe(17); // 16 + 1
    });

    it('should calculate HP with maximum BOD', () => {
      const attrs: Attributes = { ...standardAttributes, bod: 10 };
      const result = calculateHealthPools(attrs, 'wil', {});

      expect(result.hp).toBe(26); // 16 + 10
    });

    it('should apply HP modifier', () => {
      const attrs: Attributes = { ...standardAttributes, bod: 4 };
      const modifiers = { hp: 5 };
      const result = calculateHealthPools(attrs, 'wil', modifiers);

      expect(result.hp).toBe(25); // 16 + 4 + 5
    });
  });

  describe('STAM calculation', () => {
    it('should calculate STAM correctly', () => {
      // Formula: 16 + WIL
      // WIL = 7
      const attrs: Attributes = { ...standardAttributes, wil: 7 };
      const result = calculateHealthPools(attrs, 'wil', {});

      expect(result.stam).toBe(23); // 16 + 7
    });

    it('should calculate STAM with minimum WIL', () => {
      const attrs: Attributes = { ...standardAttributes, wil: 1 };
      const result = calculateHealthPools(attrs, 'wil', {});

      expect(result.stam).toBe(17); // 16 + 1
    });

    it('should calculate STAM with maximum WIL', () => {
      const attrs: Attributes = { ...standardAttributes, wil: 10 };
      const result = calculateHealthPools(attrs, 'wil', {});

      expect(result.stam).toBe(26); // 16 + 10
    });

    it('should apply STAM modifier', () => {
      const attrs: Attributes = { ...standardAttributes, wil: 6 };
      const modifiers = { stam: 3 };
      const result = calculateHealthPools(attrs, 'wil', modifiers);

      expect(result.stam).toBe(25); // 16 + 6 + 3
    });
  });

  describe('DRAIN calculation', () => {
    it('should calculate DRAIN correctly with wil cast stat', () => {
      // Formula: 16 + Cast Stat
      // castStat = 'wil', WIL = 6
      const attrs: Attributes = { ...standardAttributes, wil: 6 };
      const result = calculateHealthPools(attrs, 'wil', {});

      expect(result.drain).toBe(22); // 16 + 6
    });

    it('should calculate DRAIN correctly with int cast stat', () => {
      const attrs: Attributes = { ...standardAttributes, int: 7 };
      const result = calculateHealthPools(attrs, 'int', {});

      expect(result.drain).toBe(23); // 16 + 7
    });

    it('should calculate DRAIN correctly with cha cast stat', () => {
      const attrs: Attributes = { ...standardAttributes, cha: 5 };
      const result = calculateHealthPools(attrs, 'cha', {});

      expect(result.drain).toBe(21); // 16 + 5
    });

    it('should apply DRAIN modifier', () => {
      const attrs: Attributes = { ...standardAttributes, wil: 5 };
      const modifiers = { drain: 4 };
      const result = calculateHealthPools(attrs, 'wil', modifiers);

      expect(result.drain).toBe(25); // 16 + 5 + 4
    });
  });

  describe('LUK calculation', () => {
    it('should set LUK to attribute value', () => {
      const attrs: Attributes = { ...standardAttributes, luk: 3 };
      const result = calculateHealthPools(attrs, 'wil', {});

      expect(result.luk).toBe(3);
    });

    it('should handle minimum LUK', () => {
      const attrs: Attributes = { ...standardAttributes, luk: 1 };
      const result = calculateHealthPools(attrs, 'wil', {});

      expect(result.luk).toBe(1);
    });

    it('should handle maximum LUK', () => {
      const attrs: Attributes = { ...standardAttributes, luk: 10 };
      const result = calculateHealthPools(attrs, 'wil', {});

      expect(result.luk).toBe(10);
    });
  });

  describe('all pools together', () => {
    it('should calculate all pools correctly', () => {
      const attrs: Attributes = {
        ...standardAttributes,
        bod: 5,
        wil: 6,
        luk: 3,
      };
      const result = calculateHealthPools(attrs, 'wil', {});

      expect(result.hp).toBe(21);    // 16 + 5
      expect(result.stam).toBe(22);  // 16 + 6
      expect(result.drain).toBe(22); // 16 + 6
      expect(result.luk).toBe(3);
    });

    it('should apply all modifiers', () => {
      const attrs: Attributes = {
        ...standardAttributes,
        bod: 4,
        wil: 5,
        luk: 2,
      };
      const modifiers = { hp: 2, stam: 3, drain: 1 };
      const result = calculateHealthPools(attrs, 'wil', modifiers);

      expect(result.hp).toBe(22);    // 16 + 4 + 2
      expect(result.stam).toBe(24);  // 16 + 5 + 3
      expect(result.drain).toBe(22); // 16 + 5 + 1
      expect(result.luk).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('should handle all minimum attributes', () => {
      const result = calculateHealthPools(minAttributes, 'wil', {});

      expect(result.hp).toBe(17);
      expect(result.stam).toBe(17);
      expect(result.drain).toBe(17);
      expect(result.luk).toBe(1);
    });

    it('should handle all maximum attributes', () => {
      const result = calculateHealthPools(maxAttributes, 'wil', {});

      expect(result.hp).toBe(26);
      expect(result.stam).toBe(26);
      expect(result.drain).toBe(26);
      expect(result.luk).toBe(10);
    });

    it('should handle negative modifiers', () => {
      const attrs: Attributes = { ...standardAttributes, bod: 5, wil: 5 };
      const modifiers = { hp: -2, stam: -1 };
      const result = calculateHealthPools(attrs, 'wil', modifiers);

      expect(result.hp).toBe(19);   // 16 + 5 - 2
      expect(result.stam).toBe(20); // 16 + 5 - 1
    });
  });
});

describe('calculateResistStats', () => {
  describe('physical resist', () => {
    it('should calculate physical resist correctly', () => {
      // Formula: BOD + AGI
      // BOD = 5, AGI = 4
      const attrs: Attributes = { ...standardAttributes, bod: 5, agi: 4 };
      const result = calculateResistStats(attrs);

      expect(result.physical).toBe(9);
    });

    it('should calculate with minimum values', () => {
      const attrs: Attributes = { ...standardAttributes, bod: 1, agi: 1 };
      const result = calculateResistStats(attrs);

      expect(result.physical).toBe(2);
    });

    it('should calculate with maximum values', () => {
      const attrs: Attributes = { ...standardAttributes, bod: 10, agi: 10 };
      const result = calculateResistStats(attrs);

      expect(result.physical).toBe(20);
    });
  });

  describe('mental resist', () => {
    it('should calculate mental resist correctly', () => {
      // Formula: WIL + CHA
      // WIL = 6, CHA = 3
      const attrs: Attributes = { ...standardAttributes, wil: 6, cha: 3 };
      const result = calculateResistStats(attrs);

      expect(result.mental).toBe(9);
    });

    it('should calculate with minimum values', () => {
      const attrs: Attributes = { ...standardAttributes, wil: 1, cha: 1 };
      const result = calculateResistStats(attrs);

      expect(result.mental).toBe(2);
    });

    it('should calculate with maximum values', () => {
      const attrs: Attributes = { ...standardAttributes, wil: 10, cha: 10 };
      const result = calculateResistStats(attrs);

      expect(result.mental).toBe(20);
    });
  });

  describe('DV threshold', () => {
    it('should set DV threshold to BOD', () => {
      // Formula: BOD
      const attrs: Attributes = { ...standardAttributes, bod: 7 };
      const result = calculateResistStats(attrs);

      expect(result.dvThreshold).toBe(7);
    });

    it('should handle minimum BOD', () => {
      const attrs: Attributes = { ...standardAttributes, bod: 1 };
      const result = calculateResistStats(attrs);

      expect(result.dvThreshold).toBe(1);
    });

    it('should handle maximum BOD', () => {
      const attrs: Attributes = { ...standardAttributes, bod: 10 };
      const result = calculateResistStats(attrs);

      expect(result.dvThreshold).toBe(10);
    });
  });

  describe('all stats together', () => {
    it('should calculate all resist stats correctly', () => {
      const attrs: Attributes = {
        ...standardAttributes,
        bod: 6,
        agi: 5,
        wil: 7,
        cha: 4,
      };
      const result = calculateResistStats(attrs);

      expect(result.physical).toBe(11);    // 6 + 5
      expect(result.mental).toBe(11);      // 7 + 4
      expect(result.dvThreshold).toBe(6);  // 6
    });
  });

  describe('edge cases', () => {
    it('should handle all minimum attributes', () => {
      const result = calculateResistStats(minAttributes);

      expect(result.physical).toBe(2);
      expect(result.mental).toBe(2);
      expect(result.dvThreshold).toBe(1);
    });

    it('should handle all maximum attributes', () => {
      const result = calculateResistStats(maxAttributes);

      expect(result.physical).toBe(20);
      expect(result.mental).toBe(20);
      expect(result.dvThreshold).toBe(10);
    });
  });
});

describe('calculateSoakStats', () => {
  describe('armor soak', () => {
    it('should calculate armor soak correctly', () => {
      // Formula: BOD + floor(LOG/2)
      // BOD = 4, LOG = 5
      const attrs: Attributes = { ...standardAttributes, bod: 4, log: 5 };
      const result = calculateSoakStats(attrs, {});

      expect(result.armor).toBe(6); // 4 + floor(5/2) = 4 + 2
    });

    it('should floor odd LOG correctly', () => {
      // BOD = 3, LOG = 3
      const attrs: Attributes = { ...standardAttributes, bod: 3, log: 3 };
      const result = calculateSoakStats(attrs, {});

      expect(result.armor).toBe(4); // 3 + floor(3/2) = 3 + 1
    });

    it('should handle even LOG', () => {
      // BOD = 5, LOG = 6
      const attrs: Attributes = { ...standardAttributes, bod: 5, log: 6 };
      const result = calculateSoakStats(attrs, {});

      expect(result.armor).toBe(8); // 5 + floor(6/2) = 5 + 3
    });

    it('should apply armor modifier', () => {
      const attrs: Attributes = { ...standardAttributes, bod: 4, log: 4 };
      const modifiers = { armor: 3 };
      const result = calculateSoakStats(attrs, modifiers);

      expect(result.armor).toBe(9); // 4 + 2 + 3
    });
  });

  describe('physical soak', () => {
    it('should calculate physical soak correctly', () => {
      // Formula: STR + floor(AGI/2)
      // STR = 6, AGI = 5
      const attrs: Attributes = { ...standardAttributes, str: 6, agi: 5 };
      const result = calculateSoakStats(attrs, {});

      expect(result.physical).toBe(8); // 6 + floor(5/2) = 6 + 2
    });

    it('should floor odd AGI correctly', () => {
      // STR = 5, AGI = 7
      const attrs: Attributes = { ...standardAttributes, str: 5, agi: 7 };
      const result = calculateSoakStats(attrs, {});

      expect(result.physical).toBe(8); // 5 + floor(7/2) = 5 + 3
    });

    it('should handle even AGI', () => {
      // STR = 4, AGI = 6
      const attrs: Attributes = { ...standardAttributes, str: 4, agi: 6 };
      const result = calculateSoakStats(attrs, {});

      expect(result.physical).toBe(7); // 4 + floor(6/2) = 4 + 3
    });

    it('should apply physical modifier', () => {
      const attrs: Attributes = { ...standardAttributes, str: 5, agi: 4 };
      const modifiers = { physical: 2 };
      const result = calculateSoakStats(attrs, modifiers);

      expect(result.physical).toBe(9); // 5 + 2 + 2
    });
  });

  describe('mental soak', () => {
    it('should calculate mental soak correctly', () => {
      // Formula: WIL + floor(CHA/2)
      // WIL = 5, CHA = 7
      const attrs: Attributes = { ...standardAttributes, wil: 5, cha: 7 };
      const result = calculateSoakStats(attrs, {});

      expect(result.mental).toBe(8); // 5 + floor(7/2) = 5 + 3
    });

    it('should floor odd CHA correctly', () => {
      // WIL = 6, CHA = 5
      const attrs: Attributes = { ...standardAttributes, wil: 6, cha: 5 };
      const result = calculateSoakStats(attrs, {});

      expect(result.mental).toBe(8); // 6 + floor(5/2) = 6 + 2
    });

    it('should handle even CHA', () => {
      // WIL = 4, CHA = 8
      const attrs: Attributes = { ...standardAttributes, wil: 4, cha: 8 };
      const result = calculateSoakStats(attrs, {});

      expect(result.mental).toBe(8); // 4 + floor(8/2) = 4 + 4
    });

    it('should apply mental modifier', () => {
      const attrs: Attributes = { ...standardAttributes, wil: 5, cha: 6 };
      const modifiers = { mental: 2 };
      const result = calculateSoakStats(attrs, modifiers);

      expect(result.mental).toBe(10); // 5 + 3 + 2
    });
  });

  describe('drain soak', () => {
    it('should calculate drain soak correctly', () => {
      // Formula: 2 * WIL
      // WIL = 6
      const attrs: Attributes = { ...standardAttributes, wil: 6 };
      const result = calculateSoakStats(attrs, {});

      expect(result.drain).toBe(12); // 2 * 6
    });

    it('should double WIL value', () => {
      const attrs: Attributes = { ...standardAttributes, wil: 5 };
      const result = calculateSoakStats(attrs, {});

      expect(result.drain).toBe(10); // 2 * 5
    });

    it('should handle minimum WIL', () => {
      const attrs: Attributes = { ...standardAttributes, wil: 1 };
      const result = calculateSoakStats(attrs, {});

      expect(result.drain).toBe(2); // 2 * 1
    });

    it('should handle maximum WIL', () => {
      const attrs: Attributes = { ...standardAttributes, wil: 10 };
      const result = calculateSoakStats(attrs, {});

      expect(result.drain).toBe(20); // 2 * 10
    });

    it('should apply drain modifier', () => {
      const attrs: Attributes = { ...standardAttributes, wil: 5 };
      const modifiers = { drain: 3 };
      const result = calculateSoakStats(attrs, modifiers);

      expect(result.drain).toBe(13); // 2 * 5 + 3
    });
  });

  describe('all stats together', () => {
    it('should calculate all soak stats correctly', () => {
      const attrs: Attributes = {
        ...standardAttributes,
        bod: 5,
        log: 6,
        str: 6,
        agi: 5,
        wil: 7,
        cha: 4,
      };
      const result = calculateSoakStats(attrs, {});

      expect(result.armor).toBe(8);      // 5 + floor(6/2) = 5 + 3
      expect(result.physical).toBe(8);   // 6 + floor(5/2) = 6 + 2
      expect(result.mental).toBe(9);     // 7 + floor(4/2) = 7 + 2
      expect(result.drain).toBe(14);     // 2 * 7
    });

    it('should apply all modifiers', () => {
      const attrs: Attributes = {
        ...standardAttributes,
        bod: 4,
        log: 4,
        str: 5,
        agi: 4,
        wil: 6,
        cha: 6,
      };
      const modifiers = { armor: 2, physical: 1, mental: 1, drain: 2 };
      const result = calculateSoakStats(attrs, modifiers);

      expect(result.armor).toBe(8);      // 4 + 2 + 2
      expect(result.physical).toBe(8);   // 5 + 2 + 1
      expect(result.mental).toBe(10);    // 6 + 3 + 1
      expect(result.drain).toBe(14);     // 2 * 6 + 2
    });
  });

  describe('edge cases', () => {
    it('should handle all minimum attributes', () => {
      const result = calculateSoakStats(minAttributes, {});

      expect(result.armor).toBe(1);      // 1 + floor(1/2) = 1 + 0
      expect(result.physical).toBe(1);   // 1 + floor(1/2) = 1 + 0
      expect(result.mental).toBe(1);     // 1 + floor(1/2) = 1 + 0
      expect(result.drain).toBe(2);      // 2 * 1
    });

    it('should handle all maximum attributes', () => {
      const result = calculateSoakStats(maxAttributes, {});

      expect(result.armor).toBe(15);     // 10 + floor(10/2) = 10 + 5
      expect(result.physical).toBe(15);  // 10 + floor(10/2) = 10 + 5
      expect(result.mental).toBe(15);    // 10 + floor(10/2) = 10 + 5
      expect(result.drain).toBe(20);     // 2 * 10
    });

    it('should handle odd values floor correctly', () => {
      const attrs: Attributes = {
        ...standardAttributes,
        bod: 3,
        log: 3,
        str: 3,
        agi: 3,
        wil: 3,
        cha: 3,
      };
      const result = calculateSoakStats(attrs, {});

      // All floor(3/2) = 1
      expect(result.armor).toBe(4);      // 3 + 1
      expect(result.physical).toBe(4);   // 3 + 1
      expect(result.mental).toBe(4);     // 3 + 1
      expect(result.drain).toBe(6);      // 2 * 3
    });

    it('should handle negative modifiers', () => {
      const attrs: Attributes = { ...standardAttributes, bod: 5, str: 5, wil: 5, cha: 4 };
      const modifiers = { armor: -1, physical: -2, mental: -1, drain: -3 };
      const result = calculateSoakStats(attrs, modifiers);

      expect(result.armor).toBeGreaterThanOrEqual(0);
      expect(result.physical).toBeGreaterThanOrEqual(0);
      expect(result.mental).toBeGreaterThanOrEqual(0);
      expect(result.drain).toBeGreaterThanOrEqual(0);
    });
  });
});
