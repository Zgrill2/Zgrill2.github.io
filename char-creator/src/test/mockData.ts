import type { Character, Attributes, Affinities, Weapon } from '../types/character';
import type { Ability } from '../types/ability';

/**
 * Mock data for testing
 */

// ============================================================================
// Mock Attributes
// ============================================================================

export const minAttributes: Attributes = {
  bod: 1,
  agi: 1,
  rea: 1,
  str: 1,
  wil: 1,
  int: 1,
  log: 1,
  cha: 1,
  luk: 1,
};

export const maxAttributes: Attributes = {
  bod: 10,
  agi: 10,
  rea: 10,
  str: 10,
  wil: 10,
  int: 10,
  log: 10,
  cha: 10,
  luk: 10,
};

export const standardAttributes: Attributes = {
  bod: 4,
  agi: 5,
  rea: 4,
  str: 3,
  wil: 6,
  int: 5,
  log: 4,
  cha: 3,
  luk: 2,
};

// ============================================================================
// Mock Affinities
// ============================================================================

export const emptyAffinities: Affinities = {
  w: 0,
  u: 0,
  b: 0,
  r: 0,
  g: 0,
};

export const balancedAffinities: Affinities = {
  w: 3,
  u: 3,
  b: 3,
  r: 3,
  g: 3,
};

export const highBlackAffinities: Affinities = {
  w: 2,
  u: 2,
  b: 8,
  r: 2,
  g: 2,
};

export const highWhiteAffinities: Affinities = {
  w: 10,
  u: 2,
  b: 2,
  r: 2,
  g: 2,
};

// ============================================================================
// Mock Weapons
// ============================================================================

export const lightSword: Weapon = {
  id: 'light-sword-1',
  name: 'Light Sword',
  type: 'light',
  power: 4,
  reach: 1,
  shield: 'none',
  skillName: 'Weapon',
};

export const heavyAxe: Weapon = {
  id: 'heavy-axe-1',
  name: 'Heavy Axe',
  type: '2h',
  power: 8,
  reach: 2,
  shield: 'none',
  skillName: 'Weapon',
};

export const swordAndBoard: Weapon = {
  id: 'sword-shield-1',
  name: 'Sword & Shield',
  type: '1h',
  power: 5,
  reach: 1,
  shield: 'medium',
  skillName: 'Weapon',
};

// ============================================================================
// Mock Abilities
// ============================================================================

export const singleRankAbility: Ability = {
  category: 'Combat',
  name: 'Test Single Rank',
  description: 'A test ability with single BP cost',
  rulesText: 'Does something interesting',
  bpCost: 15,
  affinityReq: '7B,(9)',
  colorContributions: {
    w: 0,
    u: 0,
    b: 3,
    r: 0,
    g: 0,
  },
};

export const multiRankAbility: Ability = {
  category: 'Magic',
  name: 'Test Multi Rank',
  description: 'A test ability with multiple ranks',
  rulesText: 'Gets better with each rank',
  bpCost: [0, 10, 20, 30],
  affinityReq: '12W,(15)\r\n16W,(21)\r\n20W,(27)',
  colorContributions: {
    w: 4,
    u: 0,
    b: 0,
    r: 0,
    g: 0,
  },
};

export const orRequirementAbility: Ability = {
  category: 'Utility',
  name: 'Test OR Requirement',
  description: 'Requires either Black or Red affinity',
  rulesText: 'Flexible affinity requirement',
  bpCost: 20,
  affinityReq: '9R|G,(12)',
  colorContributions: {
    w: 0,
    u: 0,
    b: 0,
    r: 2,
    g: 2,
  },
};

export const complexRequirementAbility: Ability = {
  category: 'Advanced',
  name: 'Test Complex Requirement',
  description: 'Multiple affinity requirements',
  rulesText: 'Very specific affinities needed',
  bpCost: 35,
  affinityReq: '4R,5(B|R),(12)',
  colorContributions: {
    w: 0,
    u: 0,
    b: 1,
    r: 3,
    g: 0,
  },
};

export const mockAbilities: Ability[] = [
  singleRankAbility,
  multiRankAbility,
  orRequirementAbility,
  complexRequirementAbility,
];

// ============================================================================
// Mock Characters
// ============================================================================

export const basicCharacter: Character = {
  id: 'char-1',
  name: 'Test Character',
  version: '1.0',
  attributes: standardAttributes,
  tradition: 5,
  castStat: 'wil',
  affinities: balancedAffinities,
  skills: {
    'Weapon': 3,
    'Strongman': 2,
    'Dodge': 4,
  },
  knowledgeSkills: [],
  abilities: [
    { name: 'Test Single Rank', rank: 1 },
  ],
  weapons: [lightSword],
  armorType: 'light',
  notes: '',
  inventory: '',
  bpBudget: 500,
};

export const minimalCharacter: Character = {
  id: 'char-2',
  name: 'Minimal Character',
  version: '1.0',
  attributes: minAttributes,
  tradition: 0,
  castStat: 'wil',
  affinities: emptyAffinities,
  skills: {},
  knowledgeSkills: [],
  abilities: [],
  weapons: [],
  armorType: 'none',
  notes: '',
  inventory: '',
  bpBudget: 500,
};

export const maxedCharacter: Character = {
  id: 'char-3',
  name: 'Maxed Character',
  version: '1.0',
  attributes: maxAttributes,
  tradition: 10,
  castStat: 'wil',
  affinities: {
    w: 6,
    u: 6,
    b: 6,
    r: 6,
    g: 6,
  },
  skills: {
    'Weapon': 10,
    'Dodge': 10,
    'Stealth': 10,
  },
  knowledgeSkills: [],
  abilities: [
    { name: 'Test Multi Rank', rank: 3 },
  ],
  weapons: [heavyAxe, swordAndBoard],
  armorType: 'normal',
  notes: '',
  inventory: '',
  bpBudget: 500,
};

export const highSkillCharacter: Character = {
  id: 'char-4',
  name: 'High Skill Character',
  version: '1.0',
  attributes: {
    bod: 4,
    agi: 5,
    rea: 4,
    str: 6,
    wil: 5,
    int: 4,
    log: 3,
    cha: 3,
    luk: 2,
  },
  tradition: 7,
  castStat: 'wil',
  affinities: {
    w: 3,
    u: 4,
    b: 5,
    r: 6,
    g: 3,
  },
  skills: {
    'Weapon': 5,
    'Dodge': 4,
    'Strongman': 3,
    'Stealth': 3,
    'Perception': 2,
  },
  knowledgeSkills: [],
  abilities: [
    { name: 'Test Single Rank', rank: 1 },
    { name: 'Test Multi Rank', rank: 2 },
  ],
  weapons: [lightSword, heavyAxe],
  armorType: 'light',
  notes: '',
  inventory: '',
  bpBudget: 500,
};

// ============================================================================
// Mock Skills Data
// ============================================================================

export const mockSkills = {
  'Weapon': { category: 'Ungrouped', multiplier: 1.0 },
  'Dodge': { category: 'Ungrouped', multiplier: 1.0 },
  'Stealth': { category: 'Subterfuge', multiplier: 1.0 },
  'Strongman': { category: 'Athletics', multiplier: 1.0 },
  'Perception': { category: 'Ungrouped', multiplier: 1.0 },
  'Spellcasting': { category: 'Ungrouped', multiplier: 1.0 },
};

// ============================================================================
// Test Helper Functions
// ============================================================================

/**
 * Create a character with specific attribute values
 */
export function createCharacterWithAttributes(attrs: Partial<Attributes>): Character {
  return {
    ...basicCharacter,
    id: 'test-char-' + Math.random(),
    attributes: {
      ...standardAttributes,
      ...attrs,
    },
  };
}

/**
 * Create a character with specific skills
 */
export function createCharacterWithSkills(skills: Record<string, number>): Character {
  return {
    ...basicCharacter,
    id: 'test-char-' + Math.random(),
    skills,
  };
}

/**
 * Create a character with specific tradition
 */
export function createCharacterWithTradition(tradition: number, affinities?: Affinities): Character {
  return {
    ...basicCharacter,
    id: 'test-char-' + Math.random(),
    tradition,
    affinities: affinities || emptyAffinities,
  };
}
