import { Attributes, AttributeName, Weapon } from '../types/character';
import { SkillDefinition } from '../types/skill';
import { Ability } from '../types/ability';

/**
 * Calculate the BP cost for a single attribute value
 * Formula: (value^2 + value - 2) * 2.5
 */
export function calculateAttributeCost(value: number): number {
  if (value <= 1) return 0;
  return (value * value + value - 2) * 2.5;
}

/**
 * Calculate total BP cost for all attributes
 */
export function calculateAttributeCosts(attributes: Attributes): number {
  let total = 0;
  for (const key in attributes) {
    total += calculateAttributeCost(attributes[key as AttributeName]);
  }
  return total;
}

/**
 * Calculate the BP cost for a tradition level
 * Formula: (tradition^2 + 7*tradition - 8) * 2.5
 */
export function calculateTraditionCost(tradition: number): number {
  if (tradition <= 0) return 0;
  return (tradition * tradition + 7 * tradition - 8) * 2.5;
}

/**
 * Calculate the BP cost for a skill rank
 * Formula: (rank^2 + rank + 2) * costMultiplier
 * - Parent skills: multiplier = 2.5
 * - Individual skills: multiplier = 1
 * - Knowledge skills: multiplier = 0.5
 */
export function calculateSkillCost(rank: number, costMultiplier: number): number {
  if (rank <= 0) return 0;
  return (rank * rank + rank + 2) * costMultiplier;
}

/**
 * Calculate total BP cost for all skills (legacy, kept for backward compat)
 */
export function calculateSkillCosts(
  skills: Record<string, number>,
  skillDefinitions: SkillDefinition[]
): number {
  let total = 0;

  for (const [skillName, rank] of Object.entries(skills)) {
    const skillDef = skillDefinitions.find(s => s.name === skillName);
    if (skillDef && rank > 0) {
      total += calculateSkillCost(rank, skillDef.costMultiplier);
    }
  }

  return total;
}

/**
 * Calculate knowledge discount
 * Formula: (LOG + INT) * 10
 */
export function calculateKnowledgeDiscount(log: number, int: number): number {
  return (log + int) * 10;
}

/**
 * Calculate BP cost for abilities
 */
export function calculateAbilityCosts(
  characterAbilities: { name: string; rank: number }[],
  abilityDatabase: Ability[]
): number {
  let total = 0;

  for (const charAbility of characterAbilities) {
    const abilityDef = abilityDatabase.find(a => a.name === charAbility.name);
    if (!abilityDef) continue;

    if (Array.isArray(abilityDef.bpCost)) {
      // Multi-rank ability
      const rank = Math.min(charAbility.rank, abilityDef.bpCost.length - 1);
      total += abilityDef.bpCost[rank] || 0;
    } else {
      // Single-rank ability
      total += abilityDef.bpCost || 0;
    }
  }

  return total;
}

/**
 * Calculate total affinity points available
 */
export function calculateAffinityPoints(tradition: number): number {
  return tradition * 3;
}

/**
 * Calculate skill dicepool
 * Formula: rank + attribute + Min(rank, ceil(tradition/2))
 */
export function calculateSkillDicepool(
  tradition: number,
  rank: number,
  attributeValue: number
): number {
  return rank + attributeValue + Math.min(rank, Math.ceil(tradition / 2));
}

/**
 * Calculate health pools
 */
export interface HealthPools {
  hp: number;
  stam: number;
  drain: number;
  luk: number;
}

export function calculateHealthPools(
  attributes: Attributes,
  castStat: AttributeName,
  modifiers: { hp?: number; stam?: number; drain?: number } = {}
): HealthPools {
  return {
    hp: 16 + attributes.bod + (modifiers.hp || 0),
    stam: 16 + attributes.wil + (modifiers.stam || 0),
    drain: 16 + attributes[castStat] + (modifiers.drain || 0),
    luk: attributes.luk,
  };
}

/**
 * Calculate defense stats (Parry and Block removed)
 */
export interface DefenseStats {
  dodgePassive: number;
  dodgeActive: number;
}

export function calculateDefenseStats(
  attributes: Attributes,
  tradition: number,
  skills: Record<string, number>,
  modifiers: { dodge?: number; lightArmorBonus?: number } = {}
): DefenseStats {
  const intReaBase = attributes.int + attributes.rea;
  const halfTradition = Math.ceil(tradition / 2);

  const dodgeSkillRank = skills['Dodge'] || 0;

  return {
    dodgePassive: intReaBase,
    dodgeActive: intReaBase + dodgeSkillRank + Math.min(dodgeSkillRank, halfTradition) + (modifiers.dodge || 0) + (modifiers.lightArmorBonus || 0),
  };
}

/**
 * Calculate resist stats
 */
export interface ResistStats {
  physical: number;
  mental: number;
  dvThreshold: number;
}

export function calculateResistStats(attributes: Attributes): ResistStats {
  return {
    physical: attributes.bod + attributes.agi,
    mental: attributes.wil + attributes.cha,
    dvThreshold: attributes.bod,
  };
}

/**
 * Calculate soak stats
 */
export interface SoakStats {
  armor: number;
  physical: number;
  mental: number;
  drain: number;
}

export function calculateSoakStats(
  attributes: Attributes,
  modifiers: { armor?: number; physical?: number; mental?: number; drain?: number } = {}
): SoakStats {
  return {
    armor: attributes.bod + Math.floor(attributes.log / 2) + (modifiers.armor || 0),
    physical: attributes.str + Math.floor(attributes.agi / 2) + (modifiers.physical || 0),
    mental: attributes.wil + Math.floor(attributes.cha / 2) + (modifiers.mental || 0),
    drain: 2 * attributes.wil + (modifiers.drain || 0),
  };
}

/**
 * Calculate weapon dicepool
 * Default skill is 'Weapon'
 */
export function calculateWeaponDicepool(
  weapon: Weapon,
  attributes: Attributes,
  skills: Record<string, number>,
  tradition: number
): number {
  let attributeValue = 0;
  if (weapon.type === 'light') {
    attributeValue = attributes.agi;
  } else {
    attributeValue = attributes.str;
  }

  // Get skill rank, defaulting to 'Weapon' skill
  const skillName = weapon.skillName || 'Weapon';
  const skillRank = skills[skillName] || 0;

  // Base dicepool
  let dicepool = attributeValue + skillRank + weapon.reach;

  // Add tradition bonus
  dicepool += Math.min(skillRank, Math.ceil(tradition / 2));

  return dicepool;
}

/**
 * Get shield bonus value
 */
export function getShieldBonus(shieldType: string): number {
  const bonuses: Record<string, number> = {
    'none': 0,
    'buckler': 1,
    'medium': 2,
    'heavy': 3,
    'tower': 4,
  };
  return bonuses[shieldType] || 0;
}

/**
 * Get the effective skill rank considering group purchases.
 * If the parent group has a rank, all children use that rank.
 * Otherwise, use the individual skill's rank.
 */
export function getEffectiveSkillRank(
  skillName: string,
  skills: Record<string, number>,
  skillDefinitions: SkillDefinition[]
): number {
  const skillDef = skillDefinitions.find(s => s.name === skillName);
  if (!skillDef) return skills[skillName] || 0;

  // If this is a child skill with a parent group, check the parent's rank
  if (skillDef.parentGroup) {
    const parentRank = skills[skillDef.parentGroup] || 0;
    if (parentRank > 0) {
      return parentRank;
    }
  }

  return skills[skillName] || 0;
}

/**
 * Calculate group-aware skill costs.
 * - When a parent group has a rank, charge group cost (2.5x) for the parent only;
 *   individual children are covered by the group purchase.
 * - When parent has no rank, charge individual children at 1x each.
 * - Ungrouped skills are always charged individually.
 */
export function calculateGroupAwareSkillCosts(
  skills: Record<string, number>,
  skillDefinitions: SkillDefinition[]
): number {
  let total = 0;
  const processedGroups = new Set<string>();

  for (const skillDef of skillDefinitions) {
    if (skillDef.type === 'parent') {
      const parentRank = skills[skillDef.name] || 0;
      if (parentRank > 0) {
        // Charge group cost for parent
        total += calculateSkillCost(parentRank, skillDef.costMultiplier);
        processedGroups.add(skillDef.name);
      }
    }
  }

  for (const skillDef of skillDefinitions) {
    if (skillDef.type === 'individual') {
      if (skillDef.parentGroup && processedGroups.has(skillDef.parentGroup)) {
        // This child is covered by group purchase, skip
        continue;
      }
      const rank = skills[skillDef.name] || 0;
      if (rank > 0) {
        total += calculateSkillCost(rank, skillDef.costMultiplier);
      }
    }
  }

  return total;
}

/**
 * Calculate knowledge skill costs (with discount applied)
 * Now accepts dynamic knowledge skills array instead of scanning skill definitions
 */
export function calculateKnowledgeSkillCosts(
  knowledgeSkills: Array<{ name: string; rank: number }>,
  log: number,
  int: number
): number {
  let knowledgeTotal = 0;

  for (const ks of knowledgeSkills) {
    if (ks.rank > 0) {
      knowledgeTotal += calculateSkillCost(ks.rank, 0.5);
    }
  }

  const discount = calculateKnowledgeDiscount(log, int);
  return Math.max(0, knowledgeTotal - discount);
}

/**
 * Calculate total BP spent
 */
export function calculateTotalBPSpent(
  attributes: Attributes,
  tradition: number,
  skills: Record<string, number>,
  skillDefinitions: SkillDefinition[],
  abilities: { name: string; rank: number }[],
  abilityDatabase: Ability[],
  knowledgeSkills: Array<{ name: string; rank: number }> = []
): number {
  const attributeCost = calculateAttributeCosts(attributes);
  const traditionCost = calculateTraditionCost(tradition);

  // Calculate group-aware skill costs (handles parent groups and ungrouped)
  const skillCosts = calculateGroupAwareSkillCosts(skills, skillDefinitions);

  // Calculate knowledge skill costs with discount
  const knowledgeSkillCosts = calculateKnowledgeSkillCosts(knowledgeSkills, attributes.log, attributes.int);

  const abilityCosts = calculateAbilityCosts(abilities, abilityDatabase);

  return attributeCost + traditionCost + skillCosts + knowledgeSkillCosts + abilityCosts;
}
