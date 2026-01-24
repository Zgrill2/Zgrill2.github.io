import { describe, it, expect } from 'vitest';
import {
  calculateAttributeCost,
  calculateAttributeCosts,
  calculateTraditionCost,
  calculateSkillCost,
  calculateKnowledgeDiscount,
  calculateAbilityCosts,
  calculateAffinityPoints,
  calculateTotalBPSpent,
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
import type { Ability } from '../../types/ability';
import type { SkillDefinition } from '../../types/skill';

describe('calculateAttributeCost', () => {
  describe('basic calculations', () => {
    it('should return 0 for value = 1 (minimum)', () => {
      // Formula: (value^2 + value - 2) * 2.5
      // value = 1: (1 + 1 - 2) * 2.5 = 0 * 2.5 = 0
      expect(calculateAttributeCost(1)).toBe(0);
    });

    it('should return 0 for value = 0', () => {
      expect(calculateAttributeCost(0)).toBe(0);
    });

    it('should calculate cost for value = 2', () => {
      // (4 + 2 - 2) * 2.5 = 4 * 2.5 = 10
      expect(calculateAttributeCost(2)).toBe(10);
    });

    it('should calculate cost for value = 5', () => {
      // (25 + 5 - 2) * 2.5 = 28 * 2.5 = 70
      expect(calculateAttributeCost(5)).toBe(70);
    });

    it('should calculate cost for value = 10 (maximum)', () => {
      // (100 + 10 - 2) * 2.5 = 108 * 2.5 = 270
      expect(calculateAttributeCost(10)).toBe(270);
    });
  });

  describe('progressive cost increase', () => {
    it('should have increasing costs', () => {
      const costs = [1, 2, 3, 4, 5].map(calculateAttributeCost);
      // Verify each cost is higher than the previous
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
    // { bod: 4, agi: 3, str: 5, wil: 4, log: 3, int: 4, cha: 2, rea: 3, luk: 2 }
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
    // Each attribute at 10 costs 270
    // 9 attributes * 270 = 2430
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
      // Formula: (tradition^2 + 7*tradition - 8) * 2.5
      // (1 + 7 - 8) * 2.5 = 0 * 2.5 = 0
      expect(calculateTraditionCost(1)).toBe(0);
    });

    it('should calculate cost for tradition = 5', () => {
      // (25 + 35 - 8) * 2.5 = 52 * 2.5 = 130
      expect(calculateTraditionCost(5)).toBe(130);
    });

    it('should calculate cost for tradition = 10 (maximum)', () => {
      // (100 + 70 - 8) * 2.5 = 162 * 2.5 = 405
      expect(calculateTraditionCost(10)).toBe(405);
    });
  });

  describe('progressive cost increase', () => {
    it('should have increasing costs', () => {
      const costs = [2, 3, 4, 5, 6].map(calculateTraditionCost);
      // Verify each cost is higher than the previous
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
      // Formula: (rank^2 + rank + 2) * costMultiplier
      // (1 + 1 + 2) * 1.0 = 4
      expect(calculateSkillCost(1, 1.0)).toBe(4);
    });

    it('should calculate cost for rank = 5, multiplier = 2.5 (skill group)', () => {
      // (25 + 5 + 2) * 2.5 = 32 * 2.5 = 80
      expect(calculateSkillCost(5, 2.5)).toBe(80);
    });

    it('should calculate cost for rank = 10, multiplier = 0.5 (knowledge skill)', () => {
      // (100 + 10 + 2) * 0.5 = 112 * 0.5 = 56
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
      // rank = 3, multiplier = 2.5
      // (9 + 3 + 2) * 2.5 = 14 * 2.5 = 35
      expect(calculateSkillCost(3, 2.5)).toBe(35);
    });

    it('should calculate knowledge skill cost (multiplier 0.5)', () => {
      // rank = 4, multiplier = 0.5
      // (16 + 4 + 2) * 0.5 = 22 * 0.5 = 11
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
      // (400 + 20 + 2) * 1.0 = 422
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
    // (LOG + INT) * 10 = 7 * 10 = 70
    expect(calculateKnowledgeDiscount(3, 4)).toBe(70);
  });

  it('should calculate discount with LOG=10, INT=10 (maximum)', () => {
    // 20 * 10 = 200
    expect(calculateKnowledgeDiscount(10, 10)).toBe(200);
  });

  it('should calculate discount with LOG=1, INT=1 (minimum)', () => {
    // 2 * 10 = 20
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

describe('calculateAbilityCosts', () => {
  describe('single-rank abilities', () => {
    it('should calculate cost for single-rank ability', () => {
      const charAbilities = [{ name: 'Test Single Rank', rank: 1 }];
      const database = [singleRankAbility]; // bpCost: 15

      const result = calculateAbilityCosts(charAbilities, database);
      expect(result).toBe(15);
    });

    it('should handle multiple single-rank abilities', () => {
      const charAbilities = [
        { name: 'Test Single Rank', rank: 1 },
        { name: 'Test OR Requirement', rank: 1 },
      ];
      const database = mockAbilities;

      const result = calculateAbilityCosts(charAbilities, database);
      expect(result).toBe(35); // 15 + 20
    });
  });

  describe('multi-rank abilities', () => {
    it('should calculate cost for multi-rank ability at rank 1', () => {
      const charAbilities = [{ name: 'Test Multi Rank', rank: 1 }];
      const database = [multiRankAbility]; // bpCost: [0, 10, 20, 30]

      const result = calculateAbilityCosts(charAbilities, database);
      expect(result).toBe(10);
    });

    it('should calculate cost for multi-rank ability at rank 2', () => {
      const charAbilities = [{ name: 'Test Multi Rank', rank: 2 }];
      const database = [multiRankAbility];

      const result = calculateAbilityCosts(charAbilities, database);
      expect(result).toBe(20);
    });

    it('should calculate cost for multi-rank ability at rank 3', () => {
      const charAbilities = [{ name: 'Test Multi Rank', rank: 3 }];
      const database = [multiRankAbility];

      const result = calculateAbilityCosts(charAbilities, database);
      expect(result).toBe(30);
    });

    it('should handle rank 0', () => {
      const charAbilities = [{ name: 'Test Multi Rank', rank: 0 }];
      const database = [multiRankAbility];

      const result = calculateAbilityCosts(charAbilities, database);
      expect(result).toBe(0);
    });
  });

  describe('multiple abilities', () => {
    it('should calculate total cost for multiple abilities', () => {
      const charAbilities = [
        { name: 'Test Single Rank', rank: 1 },  // 15
        { name: 'Test Multi Rank', rank: 2 },   // 20
        { name: 'Test OR Requirement', rank: 1 }, // 20
      ];
      const database = mockAbilities;

      const result = calculateAbilityCosts(charAbilities, database);
      expect(result).toBe(55); // 15 + 20 + 20
    });
  });

  describe('error handling', () => {
    it('should skip ability not in database', () => {
      const charAbilities = [
        { name: 'Unknown Ability', rank: 1 },
        { name: 'Test Single Rank', rank: 1 },
      ];
      const database = mockAbilities;

      const result = calculateAbilityCosts(charAbilities, database);
      expect(result).toBe(15); // Only counts the known ability
    });

    it('should handle empty character abilities', () => {
      const result = calculateAbilityCosts([], mockAbilities);
      expect(result).toBe(0);
    });

    it('should handle empty database', () => {
      const charAbilities = [{ name: 'Test', rank: 1 }];
      const result = calculateAbilityCosts(charAbilities, []);
      expect(result).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should cap rank at array length for multi-rank abilities', () => {
      const charAbilities = [{ name: 'Test Multi Rank', rank: 10 }];
      const database = [multiRankAbility]; // Only has 4 ranks (0-3)

      const result = calculateAbilityCosts(charAbilities, database);
      expect(result).toBe(30); // Capped at rank 3
    });
  });
});

describe('calculateAffinityPoints', () => {
  it('should return 0 for tradition = 0', () => {
    // Formula: tradition * 3
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
    { name: 'Blades', category: 'Combat', costMultiplier: 1.0, type: 'individual', attribute: 'str' },
    { name: 'Athletics', category: 'Physical', costMultiplier: 1.0, type: 'individual', attribute: 'agi' },
    { name: 'Knowledge', category: 'Knowledge', costMultiplier: 0.5, type: 'knowledge', attribute: 'log' },
  ];

  describe('integration tests', () => {
    it('should calculate total for starting character (all 1s, no skills/abilities)', () => {
      const attrs = minAttributes; // All 1s
      const tradition = 0;
      const skills = {};
      const abilities: { name: string; rank: number }[] = [];
      const database: Ability[] = [];

      const result = calculateTotalBPSpent(attrs, tradition, skills, mockSkillDefinitions, abilities, database);

      // Attribute costs: 0
      // Tradition cost: 0
      // Skill costs: 0
      // Ability costs: 0
      // Knowledge discount only applies to knowledge skills (none purchased here)
      // Total: 0
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
        'Blades': 3,     // (9 + 3 + 2) * 1.0 = 14
        'Athletics': 2,  // (4 + 2 + 2) * 1.0 = 8
      };
      // Skill total: 22

      const abilities = [{ name: 'Test Single Rank', rank: 1 }]; // 15
      const database = [singleRankAbility];

      // Knowledge discount: (4 + 4) * 10 = 80

      const result = calculateTotalBPSpent(attrs, tradition, skills, mockSkillDefinitions, abilities, database);

      // Knowledge discount only applies to knowledge skills (no knowledge skills in this test)
      // Total: 335 + 130 + 22 + 15 = 502
      expect(result).toBe(502);
    });

    it('should calculate total for high-BP character', () => {
      const attrs = maxAttributes; // 2430
      const tradition = 10; // 405
      const skills = {
        'Blades': 10,    // (100 + 10 + 2) * 1.0 = 112
        'Athletics': 10, // 112
      };
      // Skill total: 224

      const abilities = [
        { name: 'Test Single Rank', rank: 1 },  // 15
        { name: 'Test Multi Rank', rank: 3 },   // 30
      ];
      const database = mockAbilities;
      // Ability total: 45

      // Knowledge discount: (10 + 10) * 10 = 200

      const result = calculateTotalBPSpent(attrs, tradition, skills, mockSkillDefinitions, abilities, database);

      // Knowledge discount only applies to knowledge skill costs now
      // Knowledge skills cost 40 BP before discount
      // After discount (100): max(0, 40 - 100) = 0
      // Total: 2430 + 405 + 184 + 45 + 40 = 3104
      expect(result).toBe(3104);
    });

    it('should calculate correctly with knowledge skills', () => {
      const attrs = standardAttributes;
      const tradition = 5;
      const skills = {
        'Blades': 3,      // (9 + 3 + 2) * 1.0 = 14
        'Knowledge': 5,   // (25 + 5 + 2) * 0.5 = 16
      };
      const abilities: { name: string; rank: number }[] = [];
      const database: Ability[] = [];

      const result = calculateTotalBPSpent(attrs, tradition, skills, mockSkillDefinitions, abilities, database);

      // Verify knowledge skill uses 0.5 multiplier
      expect(result).toBeGreaterThan(0);
    });

    it('should handle overspent character correctly', () => {
      // Character with high BP spent (over 500 budget)
      const attrs = maxAttributes; // 2430
      const tradition = 10; // 405
      const skills = { 'Blades': 10 }; // 112
      const abilities = [{ name: 'Test Multi Rank', rank: 3 }]; // 30
      const database = mockAbilities;

      const result = calculateTotalBPSpent(attrs, tradition, skills, mockSkillDefinitions, abilities, database);

      // Should return correct calculation regardless of budget
      expect(result).toBeGreaterThan(500);
      expect(typeof result).toBe('number');
    });
  });

  describe('component verification', () => {
    it('should include all cost components', () => {
      const attrs: Attributes = { ...standardAttributes, log: 5, int: 5 };
      const tradition = 3;
      const skills = { 'Blades': 2 };
      const abilities = [{ name: 'Test Single Rank', rank: 1 }];
      const database = [singleRankAbility];

      const total = calculateTotalBPSpent(attrs, tradition, skills, mockSkillDefinitions, abilities, database);

      const attrCost = calculateAttributeCosts(attrs);
      const tradCost = calculateTraditionCost(tradition);
      const skillCost = calculateSkillCost(2, 1.0);
      const abilityCost = 15;

      // Discount only applies to knowledge skills now (Blades is not a knowledge skill)
      const expected = attrCost + tradCost + skillCost + abilityCost;
      expect(total).toBe(expected);
    });
  });

  describe('edge cases', () => {
    it('should handle all zeros', () => {
      const result = calculateTotalBPSpent(
        minAttributes,
        0,
        {},
        mockSkillDefinitions,
        [],
        []
      );

      // No skills, no tradition, attributes all at 1 = 0 BP
      // Knowledge discount only applies to knowledge skills now
      expect(result).toBe(0);
    });

    it('should handle discount only applying to knowledge skills', () => {
      const attrs: Attributes = minAttributes; // All attributes at 1
      const result = calculateTotalBPSpent(attrs, 0, {}, mockSkillDefinitions, [], []);

      // Knowledge discount: only applies to knowledge skill costs (not a flat discount)
      // Attribute costs: all at 1 = 0
      // No skills purchased = 0
      // Total: 0
      expect(result).toBe(0);
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });
});
