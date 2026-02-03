export type AttributeName = 'bod' | 'agi' | 'rea' | 'str' | 'wil' | 'int' | 'log' | 'cha' | 'luk';

export interface Attributes {
  bod: number;
  agi: number;
  rea: number;
  str: number;
  wil: number;
  int: number;
  log: number;
  cha: number;
  luk: number;
}

export interface Affinities {
  w: number;
  u: number;
  b: number;
  r: number;
  g: number;
}

export type ArmorType = 'none' | 'light' | 'normal';

export interface CharacterAbility {
  name: string;
  rank: number; // For multi-rank abilities, 0-indexed
}

export interface Character {
  id: string;
  name: string;
  version: string;

  // Attributes (1-10)
  attributes: Attributes;

  // Magic
  tradition: number; // 1-10
  castStat: AttributeName;
  affinities: Affinities;

  // Skills: skill name -> rank
  skills: Record<string, number>;

  // Knowledge Skills: dynamic free-form entries
  knowledgeSkills: Array<{ name: string; rank: number }>;

  // Abilities
  abilities: CharacterAbility[];

  // Weapons
  weapons: Weapon[];

  // Misc
  armorType: ArmorType;
  notes: string;
  inventory: string;

  // BP
  bpBudget: number;
}

export type WeaponType = 'light' | '1h' | '2h';
export type ShieldType = 'none' | 'buckler' | 'medium' | 'heavy' | 'tower';

export interface Weapon {
  id: string;
  name: string;
  type: WeaponType;
  power: number;
  reach: number;
  shield: ShieldType;
  element?: string;
  skillName?: string; // Which skill to use for this weapon
}
