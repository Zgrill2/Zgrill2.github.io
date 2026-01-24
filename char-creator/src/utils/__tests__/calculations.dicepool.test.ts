import { describe, it, expect } from 'vitest';
import { calculateSkillDicepool, calculateWeaponDicepool, calculateDefenseStats } from '../calculations';
import { standardAttributes, lightSword, heavyAxe } from '../../test/mockData';
import type { Attributes, Weapon } from '../../types/character';

describe('calculateSkillDicepool', () => {
  describe('basic calculation', () => {
    it('should calculate dicepool with tradition bonus', () => {
      // Formula: rank + attribute + Min(rank, ceil(tradition/2))
      // tradition=6, rank=3, attribute=4
      // Expected: 3 + 4 + min(3, 3) = 10
      const result = calculateSkillDicepool(6, 3, 4);
      expect(result).toBe(10);
    });

    it('should calculate dicepool with zero tradition', () => {
      // tradition=0, rank=5, attribute=4
      // Expected: 5 + 4 + min(5, 0) = 9
      const result = calculateSkillDicepool(0, 5, 4);
      expect(result).toBe(9);
    });

    it('should calculate dicepool with zero rank', () => {
      // tradition=10, rank=0, attribute=5
      // Expected: 0 + 5 + min(0, 5) = 5
      const result = calculateSkillDicepool(10, 0, 5);
      expect(result).toBe(5);
    });
  });

  describe('tradition bonus capping', () => {
    it('should cap tradition bonus by rank when tradition is high', () => {
      // tradition=10, rank=2, attribute=5
      // ceil(10/2) = 5, but min(2, 5) = 2
      // Expected: 2 + 5 + 2 = 9
      const result = calculateSkillDicepool(10, 2, 5);
      expect(result).toBe(9);
    });

    it('should use full rank when tradition bonus is higher', () => {
      // tradition=4, rank=5, attribute=3
      // ceil(4/2) = 2, min(5, 2) = 2
      // Expected: 5 + 3 + 2 = 10
      const result = calculateSkillDicepool(4, 5, 3);
      expect(result).toBe(10);
    });
  });

  describe('odd tradition values', () => {
    it('should ceil odd tradition correctly (tradition=5)', () => {
      // tradition=5, rank=4, attribute=3
      // ceil(5/2) = 3, min(4, 3) = 3
      // Expected: 4 + 3 + 3 = 10
      const result = calculateSkillDicepool(5, 4, 3);
      expect(result).toBe(10);
    });

    it('should ceil odd tradition correctly (tradition=7)', () => {
      // tradition=7, rank=5, attribute=4
      // ceil(7/2) = 4, min(5, 4) = 4
      // Expected: 5 + 4 + 4 = 13
      const result = calculateSkillDicepool(7, 5, 4);
      expect(result).toBe(13);
    });

    it('should handle tradition=1 (rounds up to 1)', () => {
      // tradition=1, rank=3, attribute=4
      // ceil(1/2) = 1, min(3, 1) = 1
      // Expected: 3 + 4 + 1 = 8
      const result = calculateSkillDicepool(1, 3, 4);
      expect(result).toBe(8);
    });
  });

  describe('edge cases', () => {
    it('should handle maximum values', () => {
      // tradition=10, rank=20, attribute=10
      // floor(10/2) = 5, min(20, 5) = 5
      // Expected: 20 + 10 + 5 = 35
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
      // Weapon: light, reach=1, skillName='Blades'
      // Character: AGI=5, STR=3, skills={'Blades': 4}, tradition=6
      // Expected: 5 (AGI) + 4 (skill) + 1 (reach) + min(4, 3) = 13
      const weapon: Weapon = lightSword;
      const attrs: Attributes = { ...standardAttributes, agi: 5, str: 3 };
      const skills = { 'Blades': 4 };
      const tradition = 6;

      const result = calculateWeaponDicepool(weapon, attrs, skills, tradition);
      expect(result).toBe(13);
    });

    it('should calculate dicepool for light weapon without skill ranks', () => {
      // Weapon: light, reach=1, skillName='Blades'
      // Character: AGI=5, skills={}, tradition=6
      // Expected: 5 (AGI) + 0 (skill) + 1 (reach) + min(0, 3) = 6
      const weapon: Weapon = lightSword;
      const attrs: Attributes = { ...standardAttributes, agi: 5 };
      const skills = {};
      const tradition = 6;

      const result = calculateWeaponDicepool(weapon, attrs, skills, tradition);
      expect(result).toBe(6);
    });

    it('should calculate dicepool with high tradition capped by skill', () => {
      // Weapon: light, reach=0, skillName='Blades'
      // Character: AGI=4, skills={'Blades': 2}, tradition=10
      // floor(10/2) = 5, but capped by skill rank 2
      // Expected: 4 (AGI) + 2 (skill) + 0 (reach) + min(2, 5) = 8
      const weapon: Weapon = { ...lightSword, reach: 0 };
      const attrs: Attributes = { ...standardAttributes, agi: 4 };
      const skills = { 'Blades': 2 };
      const tradition = 10;

      const result = calculateWeaponDicepool(weapon, attrs, skills, tradition);
      expect(result).toBe(8);
    });
  });

  describe('heavy weapons (use STR)', () => {
    it('should calculate dicepool for heavy weapon with skill', () => {
      // Weapon: 2h (heavy), reach=2, skillName='Axes'
      // Character: STR=6, AGI=3, skills={'Axes': 3}, tradition=8
      // Expected: 6 (STR) + 3 (skill) + 2 (reach) + min(3, 4) = 14
      const weapon: Weapon = heavyAxe;
      const attrs: Attributes = { ...standardAttributes, str: 6, agi: 3 };
      const skills = { 'Axes': 3 };
      const tradition = 8;

      const result = calculateWeaponDicepool(weapon, attrs, skills, tradition);
      expect(result).toBe(14);
    });

    it('should calculate dicepool for 1h weapon (uses STR)', () => {
      // Weapon: 1h, reach=1, skillName='Blades'
      // Character: STR=5, AGI=3, skills={'Blades': 4}, tradition=6
      // Expected: 5 (STR) + 4 (skill) + 1 (reach) + min(4, 3) = 13
      const weapon: Weapon = {
        id: 'test-1h',
        name: 'Sword',
        type: '1h',
        power: 5,
        reach: 1,
        shield: 'none',
        skillName: 'Blades',
      };
      const attrs: Attributes = { ...standardAttributes, str: 5, agi: 3 };
      const skills = { 'Blades': 4 };
      const tradition = 6;

      const result = calculateWeaponDicepool(weapon, attrs, skills, tradition);
      expect(result).toBe(13);
    });
  });

  describe('tradition bonus', () => {
    it('should add tradition bonus correctly', () => {
      // Weapon: light, reach=1, skillName='Blades'
      // Character: AGI=4, skills={'Blades': 5}, tradition=7
      // ceil(7/2) = 4, min(5, 4) = 4
      // Expected: 4 + 5 + 1 + 4 = 14
      const weapon: Weapon = lightSword;
      const attrs: Attributes = { ...standardAttributes, agi: 4 };
      const skills = { 'Blades': 5 };
      const tradition = 7;

      const result = calculateWeaponDicepool(weapon, attrs, skills, tradition);
      expect(result).toBe(14);
    });

    it('should handle zero tradition', () => {
      // Weapon: light, reach=2, skillName='Blades'
      // Character: AGI=5, skills={'Blades': 3}, tradition=0
      // Expected: 5 + 3 + 2 + min(3, 0) = 10
      const weapon: Weapon = { ...lightSword, reach: 2 };
      const attrs: Attributes = { ...standardAttributes, agi: 5 };
      const skills = { 'Blades': 3 };
      const tradition = 0;

      const result = calculateWeaponDicepool(weapon, attrs, skills, tradition);
      expect(result).toBe(10);
    });
  });

  describe('edge cases', () => {
    it('should handle weapon without skillName', () => {
      const weapon: Weapon = {
        id: 'test-unskilled',
        name: 'Improvised Weapon',
        type: 'light',
        power: 2,
        reach: 0,
        shield: 'none',
      };
      const attrs: Attributes = { ...standardAttributes, agi: 4 };
      const skills = { 'Blades': 5 };
      const tradition = 6;

      // Expected: 4 (AGI) + 0 (no skill) + 0 (reach) + min(0, 3) = 4
      const result = calculateWeaponDicepool(weapon, attrs, skills, tradition);
      expect(result).toBe(4);
    });
  });
});

describe('calculateDefenseStats', () => {
  describe('dodge passive (no skill bonus)', () => {
    it('should calculate passive dodge correctly', () => {
      // Formula: INT + REA
      // INT=5, REA=4
      // Expected: 9
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const result = calculateDefenseStats(attrs, 0, {}, {});
      expect(result.dodgePassive).toBe(9);
    });

    it('should not include skill ranks in passive dodge', () => {
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const skills = { 'Dodge': 10 }; // High dodge skill
      const result = calculateDefenseStats(attrs, 6, skills, {});
      expect(result.dodgePassive).toBe(9); // Still just INT + REA
    });
  });

  describe('dodge active with skill', () => {
    it('should calculate active dodge with skill and tradition', () => {
      // Formula: INT + REA + dodgeSkill + Min(dodgeSkill, ceil(tradition/2))
      // INT=5, REA=4, Dodge=3, tradition=6
      // Expected: 9 + 3 + min(3, 3) = 15
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const skills = { 'Dodge': 3 };
      const tradition = 6;

      const result = calculateDefenseStats(attrs, tradition, skills, {});
      expect(result.dodgeActive).toBe(15);
    });

    it('should calculate active dodge with light armor bonus', () => {
      // INT=5, REA=4, Dodge=2, tradition=6, lightArmorBonus=1
      // Expected: 9 + 2 + min(2, 3) + 1 = 14
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const skills = { 'Dodge': 2 };
      const tradition = 6;
      const modifiers = { lightArmorBonus: 1 };

      const result = calculateDefenseStats(attrs, tradition, skills, modifiers);
      expect(result.dodgeActive).toBe(14);
    });

    it('should handle zero dodge skill', () => {
      // INT=5, REA=4, Dodge=0, tradition=6
      // Expected: 9 + 0 + min(0, 3) = 9 (same as passive)
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const skills = {};
      const tradition = 6;

      const result = calculateDefenseStats(attrs, tradition, skills, {});
      expect(result.dodgeActive).toBe(9);
      expect(result.dodgeActive).toBe(result.dodgePassive);
    });

    it('should calculate dodge correctly with tradition=3, dodge=6 (user scenario)', () => {
      // INT=5, REA=5, Dodge=6, tradition=3
      // ceil(3/2) = 2, min(6, 2) = 2
      // Expected: 5 + 5 + 6 + 2 = 18
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 5 };
      const skills = { 'Dodge': 6 };
      const tradition = 3;

      const result = calculateDefenseStats(attrs, tradition, skills, {});
      expect(result.dodgeActive).toBe(18);
    });
  });

  describe('parry defense', () => {
    it('should calculate parry correctly', () => {
      // Formula: INT + REA + parrySkill + Min(parrySkill, ceil(tradition/2))
      // INT=5, REA=4, Parry=3, tradition=6
      // Expected: 9 + 3 + min(3, 3) = 15
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const skills = { 'Parry': 3 };
      const tradition = 6;

      const result = calculateDefenseStats(attrs, tradition, skills, {});
      expect(result.parry).toBe(15);
    });

    it('should handle odd tradition correctly', () => {
      // INT=5, REA=4, Parry=5, tradition=5
      // ceil(5/2) = 3, min(5, 3) = 3
      // Expected: 9 + 5 + 3 = 17
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const skills = { 'Parry': 5 };
      const tradition = 5;

      const result = calculateDefenseStats(attrs, tradition, skills, {});
      expect(result.parry).toBe(17);
    });
  });

  describe('block defense', () => {
    it('should calculate block correctly', () => {
      // Formula: INT + REA + blockSkill + Min(blockSkill, ceil(tradition/2))
      // INT=5, REA=4, Block=2, tradition=7
      // ceil(7/2) = 4, min(2, 4) = 2
      // Expected: 9 + 2 + 2 = 13
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const skills = { 'Block': 2 };
      const tradition = 7;

      const result = calculateDefenseStats(attrs, tradition, skills, {});
      expect(result.block).toBe(13);
    });
  });

  describe('multiple defenses at once', () => {
    it('should calculate all defense types correctly', () => {
      // INT=4, REA=5, tradition=7
      // ceil(7/2) = 4
      const attrs: Attributes = { ...standardAttributes, int: 4, rea: 5 };
      const skills = {
        'Dodge': 4, // 9 + 4 + min(4, 4) = 17
        'Parry': 3, // 9 + 3 + min(3, 4) = 15
        'Block': 2, // 9 + 2 + min(2, 4) = 13
      };
      const tradition = 7;

      const result = calculateDefenseStats(attrs, tradition, skills, {});

      expect(result.dodgePassive).toBe(9);
      expect(result.dodgeActive).toBe(17);
      expect(result.parry).toBe(15);
      expect(result.block).toBe(13);
    });
  });

  describe('with modifiers', () => {
    it('should apply dodge modifier', () => {
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const skills = { 'Dodge': 3 };
      const tradition = 6;
      const modifiers = { dodge: 2 };

      const result = calculateDefenseStats(attrs, tradition, skills, modifiers);
      // 9 + 3 + 3 + 2 = 17
      expect(result.dodgeActive).toBe(17);
    });

    it('should apply parry modifier', () => {
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const skills = { 'Parry': 3 };
      const tradition = 6;
      const modifiers = { parry: 1 };

      const result = calculateDefenseStats(attrs, tradition, skills, modifiers);
      // 9 + 3 + 3 + 1 = 16
      expect(result.parry).toBe(16);
    });

    it('should apply block modifier', () => {
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const skills = { 'Block': 2 };
      const tradition = 6;
      const modifiers = { block: 2 };

      const result = calculateDefenseStats(attrs, tradition, skills, modifiers);
      // 9 + 2 + 2 + 2 = 15
      expect(result.block).toBe(15);
    });
  });

  describe('edge cases', () => {
    it('should handle zero tradition', () => {
      const attrs: Attributes = { ...standardAttributes, int: 5, rea: 4 };
      const skills = {
        'Dodge': 4,
        'Parry': 3,
        'Block': 2,
      };
      const tradition = 0;

      const result = calculateDefenseStats(attrs, tradition, skills, {});

      // No tradition bonus
      expect(result.dodgeActive).toBe(13); // 9 + 4 + 0
      expect(result.parry).toBe(12); // 9 + 3 + 0
      expect(result.block).toBe(11); // 9 + 2 + 0
    });

    it('should handle maximum values', () => {
      const attrs: Attributes = { ...standardAttributes, int: 10, rea: 10 };
      const skills = {
        'Dodge': 20,
        'Parry': 20,
        'Block': 20,
      };
      const tradition = 10;

      const result = calculateDefenseStats(attrs, tradition, skills, {});

      // floor(10/2) = 5
      expect(result.dodgePassive).toBe(20);
      expect(result.dodgeActive).toBe(45); // 20 + 20 + 5
      expect(result.parry).toBe(45); // 20 + 20 + 5
      expect(result.block).toBe(45); // 20 + 20 + 5
    });
  });
});
