import { describe, it, expect } from 'vitest';
import {
  calculateAttributeCost,
  calculateAttributeCosts,
  calculateTraditionCost,
  calculateSkillCost,
  calculateKnowledgeDiscount,
  calculateKnowledgeSkillCosts,
  calculateAbilityCosts,
  calculateAffinityPoints,
  calculateTotalBPSpent,
  calculateGroupAwareSkillCosts,
  getEffectiveSkillRank,
} from '../calculations';
import {
  minAttributes,
  maxAttributes,
  standardAttributes,
  mockAbilities,
  singleRankAbility,
  multiRankAbility,
} from '../../test/mockData';
import type { Attributes } from '../../types/character';
import type { SkillDefinition } from '../../types/skill';

describe('calculateAttributeCost', () => {
  describe('basic calculations', () => {
    it('should return 0 for value = 1 (minimum)', () => {
      expect(calculateAttributeCost(1)).toBe(0);
    });

    it('should return 0 for value = 0', () => {
      expect(calculateAttributeCost(0)).toBe(0);
    });

    it('should calculate cost for value = 2', () => {
      expect(calculateAttributeCost(2)).toBe(10);
    });

    it('should calculate cost for value = 5', () => {
      expect(calculateAttributeCost(5)).toBe(70);
    });

    it('should calculate cost for value = 10 (maximum)', () => {
      expect(calculateAttributeCost(10)).toBe(270);
    });
  });

  describe('progressive cost increase', () => {
    it('should have increasing costs', () => {
      const costs = [1, 2, 3, 4, 5].map(calculateAttributeCost);
      for (let i = 1; i < costs.length; i++) {
        expect(costs[i]).toBeGreaterThan(costs[i - 1]);
      }
    });

    it('should verify specific progression', () => {
      expect(calculateAttributeCost(2)).toBe(10);
      expect(calculateAttributeCost(3)).toBe(25);
      expect(calculateAttributeCost(4)).toBe(45);
    });
  });

  describe('edge cases', () => {
    it('should handle negative values as zero', () => {
      expect(calculateAttributeCost(-5)).toBe(0);
    });
  });
});

describe('calculateAttributeCosts', () => {
  it('should return 0 for all attributes at 1 (minimum)', () => {
    expect(calculateAttributeCosts(minAttributes)).toBe(0);
  });

  it('should calculate total for mixed attributes', () => {
    const attrs: Attributes = {
      bod: 4,  // 45
      agi: 3,  // 25
      str: 5,  // 70
      wil: 4,  // 45
      log: 3,  // 25
      int: 4,  // 45
      cha: 2,  // 10
      rea: 3,  // 25
      luk: 2,  // 10
    };
    const expected = 45 + 25 + 70 + 45 + 25 + 45 + 10 + 25 + 10;
    expect(calculateAttributeCosts(attrs)).toBe(expected);
  });

  it('should calculate total for all attributes at 10 (maximum)', () => {
    expect(calculateAttributeCosts(maxAttributes)).toBe(2430);
  });

  it('should calculate correctly for standard attributes', () => {
    const result = calculateAttributeCosts(standardAttributes);
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe('number');
  });
});

describe('calculateTraditionCost', () => {
  describe('basic calculations', () => {
    it('should return 0 for tradition = 0', () => {
      expect(calculateTraditionCost(0)).toBe(0);
    });

    it('should return 0 for tradition = 1', () => {
      expect(calculateTraditionCost(1)).toBe(0);
    });

    it('should calculate cost for tradition = 5', () => {
      expect(calculateTraditionCost(5)).toBe(130);
    });

    it('should calculate cost for tradition = 10 (maximum)', () => {
      expect(calculateTraditionCost(10)).toBe(405);
    });
  });

  describe('progressive cost increase', () => {
    it('should have increasing costs', () => {
      const costs = [2, 3, 4, 5, 6].map(calculateTraditionCost);
      for (let i = 1; i < costs.length; i++) {
        expect(costs[i]).toBeGreaterThan(costs[i - 1]);
      }
    });

    it('should verify specific progression', () => {
      expect(calculateTraditionCost(2)).toBe(25);
      expect(calculateTraditionCost(3)).toBe(55);
      expect(calculateTraditionCost(4)).toBe(90);
    });
  });

  describe('edge cases', () => {
    it('should handle negative values', () => {
      expect(calculateTraditionCost(-5)).toBe(0);
    });
  });
});

describe('calculateSkillCost', () => {
  describe('basic calculations', () => {
    it('should return 0 for rank = 0', () => {
      expect(calculateSkillCost(0, 1.0)).toBe(0);
    });

    it('should calculate cost for rank = 1, multiplier = 1.0 (individual skill)', () => {
      expect(calculateSkillCost(1, 1.0)).toBe(4);
    });

    it('should calculate cost for rank = 5, multiplier = 2.5 (skill group)', () => {
      expect(calculateSkillCost(5, 2.5)).toBe(80);
    });

    it('should calculate cost for rank = 10, multiplier = 0.5 (knowledge skill)', () => {
      expect(calculateSkillCost(10, 0.5)).toBe(56);
    });
  });

  describe('different multipliers', () => {
    it('should scale cost with multiplier', () => {
      const rank = 5;
      const base = calculateSkillCost(rank, 1.0);
      expect(calculateSkillCost(rank, 2.5)).toBe(base * 2.5);
      expect(calculateSkillCost(rank, 0.5)).toBe(base * 0.5);
    });

    it('should calculate parent skill cost (multiplier 2.5)', () => {
      expect(calculateSkillCost(3, 2.5)).toBe(35);
    });

    it('should calculate knowledge skill cost (multiplier 0.5)', () => {
      expect(calculateSkillCost(4, 0.5)).toBe(11);
    });
  });

  describe('progressive cost increase', () => {
    it('should have increasing costs for same multiplier', () => {
      const costs = [1, 2, 3, 4, 5].map(rank => calculateSkillCost(rank, 1.0));
      for (let i = 1; i < costs.length; i++) {
        expect(costs[i]).toBeGreaterThan(costs[i - 1]);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle high rank values', () => {
      const result = calculateSkillCost(20, 1.0);
      expect(result).toBe(422);
    });

    it('should handle negative rank', () => {
      expect(calculateSkillCost(-5, 1.0)).toBe(0);
    });

    it('should handle zero multiplier', () => {
      expect(calculateSkillCost(5, 0)).toBe(0);
    });
  });
});

describe('calculateKnowledgeDiscount', () => {
  it('should calculate discount with LOG=3, INT=4', () => {
    expect(calculateKnowledgeDiscount(3, 4)).toBe(70);
  });

  it('should calculate discount with LOG=10, INT=10 (maximum)', () => {
    expect(calculateKnowledgeDiscount(10, 10)).toBe(200);
  });

  it('should calculate discount with LOG=1, INT=1 (minimum)', () => {
    expect(calculateKnowledgeDiscount(1, 1)).toBe(20);
  });

  it('should scale linearly', () => {
    expect(calculateKnowledgeDiscount(5, 5)).toBe(100);
    expect(calculateKnowledgeDiscount(6, 6)).toBe(120);
    expect(calculateKnowledgeDiscount(7, 7)).toBe(140);
  });

  it('should handle asymmetric values', () => {
    expect(calculateKnowledgeDiscount(2, 8)).toBe(100);
    expect(calculateKnowledgeDiscount(8, 2)).toBe(100);
  });
});

describe('calculateKnowledgeSkillCosts', () => {
  it('should return 0 with no knowledge skills', () => {
    expect(calculateKnowledgeSkillCosts([], 5, 5)).toBe(0);
  });

  it('should calculate cost for dynamic knowledge skills', () => {
    const ks = [
      { name: 'Arcana', rank: 5 },  // (25+5+2)*0.5 = 16
      { name: 'History', rank: 3 }, // (9+3+2)*0.5 = 7
    ];
    // Total: 23, discount: (5+5)*10 = 100
    // After discount: max(0, 23 - 100) = 0
    expect(calculateKnowledgeSkillCosts(ks, 5, 5)).toBe(0);
  });

  it('should not go below 0 after discount', () => {
    const ks = [{ name: 'Test', rank: 1 }]; // (1+1+2)*0.5 = 2
    // Discount: (5+5)*10 = 100
    expect(calculateKnowledgeSkillCosts(ks, 5, 5)).toBe(0);
  });

  it('should charge when cost exceeds discount', () => {
    const ks = [
      { name: 'A', rank: 10 }, // (100+10+2)*0.5 = 56
      { name: 'B', rank: 10 }, // 56
    ];
    // Total: 112, discount: (1+1)*10 = 20
    // After discount: 112 - 20 = 92
    expect(calculateKnowledgeSkillCosts(ks, 1, 1)).toBe(92);
  });

  it('should skip rank 0 entries', () => {
    const ks = [
      { name: 'Empty', rank: 0 },
      { name: 'Has Rank', rank: 3 }, // (9+3+2)*0.5 = 7
    ];
    // Total: 7, discount: (1+1)*10 = 20
    expect(calculateKnowledgeSkillCosts(ks, 1, 1)).toBe(0);
  });
});

describe('calculateGroupAwareSkillCosts', () => {
  const mockDefs: SkillDefinition[] = [
    { name: 'ATHLETICS', type: 'parent', attribute: 'str', costMultiplier: 2.5, category: 'Athletics' },
    { name: 'Strongman', type: 'individual', attribute: 'str', costMultiplier: 1, category: 'Athletics', parentGroup: 'ATHLETICS' },
    { name: 'Gymnastics', type: 'individual', attribute: 'agi', costMultiplier: 1, category: 'Athletics', parentGroup: 'ATHLETICS' },
    { name: 'Weapon', type: 'individual', attribute: 'agi', costMultiplier: 1 },
    { name: 'Dodge', type: 'individual', attribute: 'rea', costMultiplier: 1 },
  ];

  it('should charge individual costs when no group purchased', () => {
    const skills = { 'Strongman': 3, 'Gymnastics': 2 };
    // Strongman: (9+3+2)*1 = 14, Gymnastics: (4+2+2)*1 = 8
    expect(calculateGroupAwareSkillCosts(skills, mockDefs)).toBe(22);
  });

  it('should charge group cost when parent has rank', () => {
    const skills = { 'ATHLETICS': 3 };
    // Group: (9+3+2)*2.5 = 35
    expect(calculateGroupAwareSkillCosts(skills, mockDefs)).toBe(35);
  });

  it('should not double-charge children when group is purchased', () => {
    // Even if children somehow have ranks (shouldn't happen via UI), group cost covers them
    const skills = { 'ATHLETICS': 3, 'Strongman': 2 };
    // Only group cost: 35 (children covered)
    expect(calculateGroupAwareSkillCosts(skills, mockDefs)).toBe(35);
  });

  it('should charge ungrouped skills normally', () => {
    const skills = { 'Weapon': 5, 'Dodge': 3 };
    // Weapon: (25+5+2)*1 = 32, Dodge: (9+3+2)*1 = 14
    expect(calculateGroupAwareSkillCosts(skills, mockDefs)).toBe(46);
  });

  it('should handle mix of group and ungrouped', () => {
    const skills = { 'ATHLETICS': 2, 'Weapon': 4 };
    // Athletics group: (4+2+2)*2.5 = 20, Weapon: (16+4+2)*1 = 22
    expect(calculateGroupAwareSkillCosts(skills, mockDefs)).toBe(42);
  });

  it('should return 0 for empty skills', () => {
    expect(calculateGroupAwareSkillCosts({}, mockDefs)).toBe(0);
  });
});

describe('getEffectiveSkillRank', () => {
  const mockDefs: SkillDefinition[] = [
    { name: 'ATHLETICS', type: 'parent', attribute: 'str', costMultiplier: 2.5, category: 'Athletics' },
    { name: 'Strongman', type: 'individual', attribute: 'str', costMultiplier: 1, category: 'Athletics', parentGroup: 'ATHLETICS' },
    { name: 'Weapon', type: 'individual', attribute: 'agi', costMultiplier: 1 },
  ];

  it('should return parent rank for grouped child when parent has rank', () => {
    const skills = { 'ATHLETICS': 5 };
    expect(getEffectiveSkillRank('Strongman', skills, mockDefs)).toBe(5);
  });

  it('should return individual rank when parent has no rank', () => {
    const skills = { 'Strongman': 3 };
    expect(getEffectiveSkillRank('Strongman', skills, mockDefs)).toBe(3);
  });

  it('should return 0 when neither parent nor individual has rank', () => {
    expect(getEffectiveSkillRank('Strongman', {}, mockDefs)).toBe(0);
  });

  it('should return ungrouped skill rank normally', () => {
    const skills = { 'Weapon': 4 };
    expect(getEffectiveSkillRank('Weapon', skills, mockDefs)).toBe(4);
  });

  it('should return 0 for unknown skill', () => {
    expect(getEffectiveSkillRank('Unknown', {}, mockDefs)).toBe(0);
  });
});

describe('calculateAbilityCosts', () => {
  describe('single-rank abilities', () => {
    it('should calculate cost for single-rank ability', () => {
      const charAbilities = [{ name: 'Test Single Rank', rank: 1 }];
      const database = [singleRankAbility];
      expect(calculateAbilityCosts(charAbilities, database)).toBe(15);
    });

    it('should handle multiple single-rank abilities', () => {
      const charAbilities = [
        { name: 'Test Single Rank', rank: 1 },
        { name: 'Test OR Requirement', rank: 1 },
      ];
      expect(calculateAbilityCosts(charAbilities, mockAbilities)).toBe(35);
    });
  });

  describe('multi-rank abilities', () => {
    it('should calculate cost for multi-rank ability at rank 1', () => {
      const charAbilities = [{ name: 'Test Multi Rank', rank: 1 }];
      expect(calculateAbilityCosts(charAbilities, [multiRankAbility])).toBe(10);
    });

    it('should calculate cost for multi-rank ability at rank 2', () => {
      const charAbilities = [{ name: 'Test Multi Rank', rank: 2 }];
      expect(calculateAbilityCosts(charAbilities, [multiRankAbility])).toBe(20);
    });

    it('should calculate cost for multi-rank ability at rank 3', () => {
      const charAbilities = [{ name: 'Test Multi Rank', rank: 3 }];
      expect(calculateAbilityCosts(charAbilities, [multiRankAbility])).toBe(30);
    });

    it('should handle rank 0', () => {
      const charAbilities = [{ name: 'Test Multi Rank', rank: 0 }];
      expect(calculateAbilityCosts(charAbilities, [multiRankAbility])).toBe(0);
    });
  });

  describe('multiple abilities', () => {
    it('should calculate total cost for multiple abilities', () => {
      const charAbilities = [
        { name: 'Test Single Rank', rank: 1 },
        { name: 'Test Multi Rank', rank: 2 },
        { name: 'Test OR Requirement', rank: 1 },
      ];
      expect(calculateAbilityCosts(charAbilities, mockAbilities)).toBe(55);
    });
  });

  describe('error handling', () => {
    it('should skip ability not in database', () => {
      const charAbilities = [
        { name: 'Unknown Ability', rank: 1 },
        { name: 'Test Single Rank', rank: 1 },
      ];
      expect(calculateAbilityCosts(charAbilities, mockAbilities)).toBe(15);
    });

    it('should handle empty character abilities', () => {
      expect(calculateAbilityCosts([], mockAbilities)).toBe(0);
    });

    it('should handle empty database', () => {
      const charAbilities = [{ name: 'Test', rank: 1 }];
      expect(calculateAbilityCosts(charAbilities, [])).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should cap rank at array length for multi-rank abilities', () => {
      const charAbilities = [{ name: 'Test Multi Rank', rank: 10 }];
      expect(calculateAbilityCosts(charAbilities, [multiRankAbility])).toBe(30);
    });
  });
});

describe('calculateAffinityPoints', () => {
  it('should return 0 for tradition = 0', () => {
    expect(calculateAffinityPoints(0)).toBe(0);
  });

  it('should calculate points for tradition = 5', () => {
    expect(calculateAffinityPoints(5)).toBe(15);
  });

  it('should calculate points for tradition = 10', () => {
    expect(calculateAffinityPoints(10)).toBe(30);
  });

  it('should scale linearly', () => {
    expect(calculateAffinityPoints(1)).toBe(3);
    expect(calculateAffinityPoints(2)).toBe(6);
    expect(calculateAffinityPoints(3)).toBe(9);
    expect(calculateAffinityPoints(4)).toBe(12);
  });

  it('should handle high tradition values', () => {
    expect(calculateAffinityPoints(20)).toBe(60);
  });
});

describe('calculateTotalBPSpent', () => {
  const mockSkillDefinitions: SkillDefinition[] = [
    { name: 'Weapon', costMultiplier: 1.0, type: 'individual', attribute: 'agi' },
    { name: 'Strongman', costMultiplier: 1.0, type: 'individual', attribute: 'str', parentGroup: 'ATHLETICS' },
    { name: 'ATHLETICS', costMultiplier: 2.5, type: 'parent', attribute: 'str', category: 'Athletics' },
  ];

  describe('integration tests', () => {
    it('should calculate total for starting character (all 1s, no skills/abilities)', () => {
      const result = calculateTotalBPSpent(minAttributes, 0, {}, mockSkillDefinitions, [], []);
      expect(result).toBe(0);
    });

    it('should calculate total for mid-level character', () => {
      const attrs: Attributes = {
        bod: 4,  // 45
        agi: 3,  // 25
        str: 4,  // 45
        wil: 5,  // 70
        log: 4,  // 45
        int: 4,  // 45
        cha: 3,  // 25
        rea: 3,  // 25
        luk: 2,  // 10
      };
      // Attribute total: 335
      const tradition = 5; // 130
      const skills = {
        'Weapon': 3,     // (9 + 3 + 2) * 1.0 = 14
        'Strongman': 2,  // (4 + 2 + 2) * 1.0 = 8
      };
      // Skill total: 22

      const abilities = [{ name: 'Test Single Rank', rank: 1 }]; // 15
      const database = [singleRankAbility];

      const result = calculateTotalBPSpent(attrs, tradition, skills, mockSkillDefinitions, abilities, database);
      // Total: 335 + 130 + 22 + 15 = 502
      expect(result).toBe(502);
    });

    it('should calculate total for high-BP character', () => {
      const skills = {
        'Weapon': 10,    // (100 + 10 + 2) * 1.0 = 112
        'Strongman': 10, // 112
      };

      const abilities = [
        { name: 'Test Single Rank', rank: 1 },  // 15
        { name: 'Test Multi Rank', rank: 3 },   // 30
      ];

      const result = calculateTotalBPSpent(maxAttributes, 10, skills, mockSkillDefinitions, abilities, mockAbilities);
      // 2430 + 405 + 224 + 45 = 3104
      expect(result).toBe(3104);
    });

    it('should include knowledge skill costs', () => {
      const knowledgeSkills = [
        { name: 'Arcana', rank: 5 }, // (25+5+2)*0.5 = 16
      ];
      // Discount: (1+1)*10 = 20 -> max(0, 16-20) = 0
      const result = calculateTotalBPSpent(minAttributes, 0, {}, mockSkillDefinitions, [], [], knowledgeSkills);
      expect(result).toBe(0);
    });

    it('should charge knowledge when cost exceeds discount', () => {
      const knowledgeSkills = [
        { name: 'A', rank: 10 }, // 56
        { name: 'B', rank: 10 }, // 56
      ];
      // Total: 112, discount: (1+1)*10 = 20 -> 92
      const result = calculateTotalBPSpent(minAttributes, 0, {}, mockSkillDefinitions, [], [], knowledgeSkills);
      expect(result).toBe(92);
    });

    it('should handle group skill costs in total', () => {
      const skills = { 'ATHLETICS': 3 };
      // Group cost: (9+3+2)*2.5 = 35
      const result = calculateTotalBPSpent(minAttributes, 0, skills, mockSkillDefinitions, [], []);
      expect(result).toBe(35);
    });
  });

  describe('component verification', () => {
    it('should include all cost components', () => {
      const attrs: Attributes = { ...standardAttributes, log: 5, int: 5 };
      const tradition = 3;
      const skills = { 'Weapon': 2 };
      const abilities = [{ name: 'Test Single Rank', rank: 1 }];
      const database = [singleRankAbility];

      const total = calculateTotalBPSpent(attrs, tradition, skills, mockSkillDefinitions, abilities, database);

      const attrCost = calculateAttributeCosts(attrs);
      const tradCost = calculateTraditionCost(tradition);
      const skillCost = calculateSkillCost(2, 1.0);
      const abilityCost = 15;

      const expected = attrCost + tradCost + skillCost + abilityCost;
      expect(total).toBe(expected);
    });
  });

  describe('edge cases', () => {
    it('should handle all zeros', () => {
      const result = calculateTotalBPSpent(minAttributes, 0, {}, mockSkillDefinitions, [], []);
      expect(result).toBe(0);
    });
  });
});
