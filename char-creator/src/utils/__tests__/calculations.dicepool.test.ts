import { describe, it, expect } from 'vitest';
import { calculateSkillDicepool, calculateWeaponDicepool, calculateDefenseStats } from '../calculations';
import { standardAttributes, lightSword, heavyAxe } from '../../test/mockData';
import type { Attributes, Weapon } from '../../types/character';

describe('calculateSkillDicepool', () => {
  describe('basic calculation', () => {
    it('should calculate dicepool with tradition bonus', () => {
      const result = calculateSkillDicepool(6, 3, 4);
      expect(result).toBe(10);
    });

    it('should calculate dicepool with zero tradition', () => {
      const result = calculateSkillDicepool(0, 5, 4);
      expect(result).toBe(9);
    });

    it('should calculate dicepool with zero rank', () => {
      const result = calculateSkillDicepool(10, 0, 5);
      expect(result).toBe(5);
    });
  });

  describe('tradition bonus capping', () => {
    it('should cap tradition bonus by rank when tradition is high', () => {
      const result = calculateSkillDicepool(10, 2, 5);
      expect(result).toBe(9);
    });

    it('should use full rank when tradition bonus is higher', () => {
      const result = calculateSkillDicepool(4, 5, 3);
      expect(result).toBe(10);
    });
  });

  describe('odd tradition values', () => {
    it('should ceil odd tradition correctly (tradition=5)', () => {
      const result = calculateSkillDicepool(5, 4, 3);
      expect(result).toBe(10);
    });

    it('should ceil odd tradition correctly (tradition=7)', () => {
      const result = calculateSkillDicepool(7, 5, 4);
      expect(result).toBe(13);
    });

    it('should handle tradition=1 (rounds up to 1)', () => {
      const result = calculateSkillDicepool(1, 3, 4);
      expect(result).toBe(8);
    });
  });

  describe('edge cases', () => {
    it('should handle maximum values', () => {
      const result = calculateSkillDicepool(10, 20, 10);
      expect(result).toBe(35);
    });

    it('should handle all zeros', () => {
      const result = calculateSkillDicepool(0, 0, 0);
      expect(result).toBe(0);
    });
  });
});

describe('calculateWeaponDicepool', () => {
  describe('light weapons (use AGI)', () => {
    it('should calculate dicepool for light weapon with skill', () => {
      const weapon: Weapon = lightSword;
      const attrs: Attributes = { ...standardAttributes, agi: 5, str: 3 };
      const skills = { 'Weapon': 4 };
      const tradition = 6;
      // Expected: 5 (AGI) + 4 (skill) + 1 (reach) + min(4, 3) = 13
      const result = calculateWeaponDicepool(weapon, attrs, skills, tradition);
      expect(result).toBe(13);
    });

    it('should calculate dicepool for light weapon without skill ranks', () => {
      const weapon: Weapon = lightSword;
      const attrs: Attributes = { ...standardAttributes, agi: 5 };
      const skills = {};
      const tradition = 6;
      // Expected: 5 (AGI) + 0 (skill) + 1 (reach) + min(0, 3) = 6
      const result = calculateWeaponDicepool(weapon, attrs, skills, tradition);
      expect(result).toBe(6);
    });

    it('should calculate dicepool with high tradition capped by skill', () => {
      const weapon: Weapon = { ...lightSword, reach: 0 };
      const attrs: Attributes = { ...standardAttributes, agi: 4 };
      const skills = { 'Weapon': 2 };
      const tradition = 10;
      // Expected: 4 (AGI) + 2 (skill) + 0 (reach) + min(2, 5) = 8
      const result = calculateWeaponDicepool(weapon, attrs, skills, tradition);
      expect(result).toBe(8);
    });
  });

  describe('heavy weapons (use STR)', () => {
    it('should calculate dicepool for heavy weapon with skill', () => {
      const weapon: Weapon = heavyAxe;
      const attrs: Attributes = { ...standardAttributes, str: 6, agi: 3 };
      const skills = { 'Weapon': 3 };
      const tradition = 8;
      // Expected: 6 (STR) + 3 (skill) + 2 (reach) + min(3, 4) = 14
      const result = calculateWeaponDicepool(weapon, attrs, skills, tradition);
      expect(result).toBe(14);
    });

    it('should calculate dicepool for 1h weapon (uses STR)', () => {
      const weapon: Weapon = {
        id: 'test-1h',
        name: 'Sword',
        type: '1h',
        power: 5,
        reach: 1,
        shield: 'none',
        skillName: 'Weapon',
      };
      const attrs: Attributes = { ...standardAttributes, str: 5, agi: 3 };
      const skills = { 'Weapon': 4 };
      const tradition = 6;
      // Expected: 5 (STR) + 4 (skill) + 1 (reach) + min(4, 3) = 13
      const result = calculateWeaponDicepool(weapon, attrs, skills, tradition);
      expect(result).toBe(13);
    });
  });

  describe('tradition bonus', () => {
    it('should add tradition bonus correctly', () => {
      const weapon: Weapon = lightSword;
      const attrs: Attributes = { ...standardAttributes, agi: 4 };
      const skills = { 'Weapon': 5 };
      const tradition = 7;
      // ceil(7/2) = 4, min(5, 4) = 4
      // Expected: 4 + 5 + 1 + 4 = 14
      const result = calculateWeaponDicepool(weapon, attrs, skills, tradition);
      expect(result).toBe(14);
    });

    it('should handle zero tradition', () => {
      const weapon: Weapon = { ...lightSword, reach: 2 };
      const attrs: Attributes = { ...standardAttributes, agi: 5 };
      const skills = { 'Weapon': 3 };
      const tradition = 0;
      // Expected: 5 + 3 + 2 + min(3, 0) = 10
      const result = calculateWeaponDicepool(weapon, attrs, skills, tradition);
      expect(result).toBe(10);
    });
  });

  describe('edge cases', () => {
    it('should default to Weapon skill when no skillName set', () => {
      const weapon: Weapon = {
        id: 'test-unskilled',
        name: 'Improvised Weapon',
        type: 'light',
        power: 2,
        reach: 0,
        shield: 'none',
      };
      const attrs: Attributes = { ...standardAttributes, agi: 4 };
      const skills = { 'Weapon': 5 };
      const tradition = 6;
      // Expected: 4 (AGI) + 5 (Weapon skill) + 0 (reach) + min(5, 3) = 12
      const result = calculateWeaponDicepool(weapon, attrs, skills, tradition);
      expect(result).toBe(12);
    });
  });
});

describe('calculateDefenseStats', () => {
  describe('dodge passive (no skill bonus)', () => {
    it('should calculate passive dodge correctly', () => {
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const result = calculateDefenseStats(attrs, 0, {}, {});
      expect(result.dodgePassive).toBe(9);
    });

    it('should not include skill ranks in passive dodge', () => {
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const skills = { 'Dodge': 10 };
      const result = calculateDefenseStats(attrs, 6, skills, {});
      expect(result.dodgePassive).toBe(9);
    });
  });

  describe('dodge active with skill', () => {
    it('should calculate active dodge with skill and tradition', () => {
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const skills = { 'Dodge': 3 };
      const tradition = 6;
      const result = calculateDefenseStats(attrs, tradition, skills, {});
      expect(result.dodgeActive).toBe(15);
    });

    it('should calculate active dodge with light armor bonus', () => {
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const skills = { 'Dodge': 2 };
      const tradition = 6;
      const modifiers = { lightArmorBonus: 1 };
      const result = calculateDefenseStats(attrs, tradition, skills, modifiers);
      expect(result.dodgeActive).toBe(14);
    });

    it('should handle zero dodge skill', () => {
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const skills = {};
      const tradition = 6;
      const result = calculateDefenseStats(attrs, tradition, skills, {});
      expect(result.dodgeActive).toBe(9);
      expect(result.dodgeActive).toBe(result.dodgePassive);
    });

    it('should calculate dodge correctly with tradition=3, dodge=6 (user scenario)', () => {
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 5 };
      const skills = { 'Dodge': 6 };
      const tradition = 3;
      const result = calculateDefenseStats(attrs, tradition, skills, {});
      expect(result.dodgeActive).toBe(18);
    });
  });

  describe('with modifiers', () => {
    it('should apply dodge modifier', () => {
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const skills = { 'Dodge': 3 };
      const tradition = 6;
      const modifiers = { dodge: 2 };
      const result = calculateDefenseStats(attrs, tradition, skills, modifiers);
      expect(result.dodgeActive).toBe(17);
    });
  });

  describe('edge cases', () => {
    it('should handle zero tradition', () => {
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const skills = { 'Dodge': 4 };
      const tradition = 0;
      const result = calculateDefenseStats(attrs, tradition, skills, {});
      expect(result.dodgeActive).toBe(13); // 9 + 4 + 0
    });

    it('should handle maximum values', () => {
      const attrs: Attributes = { ...standardAttributes, int: 10, rea: 10 };
      const skills = { 'Dodge': 20 };
      const tradition = 10;
      const result = calculateDefenseStats(attrs, tradition, skills, {});
      expect(result.dodgePassive).toBe(20);
      expect(result.dodgeActive).toBe(45); // 20 + 20 + 5
    });

    it('should not have parry or block properties', () => {
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const result = calculateDefenseStats(attrs, 6, {}, {});
      expect(result).not.toHaveProperty('parry');
      expect(result).not.toHaveProperty('block');
    });
  });
});
