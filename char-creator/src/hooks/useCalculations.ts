import { useMemo } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import {
  calculateAttributeCosts,
  calculateTraditionCost,
  calculateSkillCosts,
  calculateKnowledgeDiscount,
  calculateAbilityCosts,
  calculateAffinityPoints,
  calculateHealthPools,
  calculateDefenseStats,
  calculateResistStats,
  calculateSoakStats,
  calculateSkillDicepool,
  calculateWeaponDicepool,
  calculateTotalBPSpent,
} from '../utils/calculations';

import skillsData from '../data/skills.json';
import abilitiesData from '../data/abilities.json';
import { SkillDefinition } from '../types/skill';
import { Ability } from '../types/ability';

/**
 * Hook that calculates all derived character stats
 */
export function useCalculations() {
  const { character } = useCharacterContext();

  const skills = skillsData as SkillDefinition[];
  const abilities = abilitiesData as Ability[];

  // BP Costs
  const attributeCost = useMemo(
    () => calculateAttributeCosts(character.attributes),
    [character.attributes]
  );

  const traditionCost = useMemo(
    () => calculateTraditionCost(character.tradition),
    [character.tradition]
  );

  const skillCosts = useMemo(
    () => calculateSkillCosts(character.skills, skills),
    [character.skills]
  );

  const knowledgeDiscount = useMemo(
    () => calculateKnowledgeDiscount(character.attributes.log, character.attributes.int),
    [character.attributes.log, character.attributes.int]
  );

  const abilityCosts = useMemo(
    () => calculateAbilityCosts(character.abilities, abilities),
    [character.abilities]
  );

  const bpSpent = useMemo(
    () => calculateTotalBPSpent(
      character.attributes,
      character.tradition,
      character.skills,
      skills,
      character.abilities,
      abilities
    ),
    [character.attributes, character.tradition, character.skills, character.abilities]
  );

  const bpRemaining = character.bpBudget - bpSpent;

  // Affinity Points
  const affinityPoints = useMemo(
    () => calculateAffinityPoints(character.tradition),
    [character.tradition]
  );

  const affinitiesUsed = useMemo(
    () => character.affinities.w + character.affinities.u + character.affinities.b +
          character.affinities.r + character.affinities.g,
    [character.affinities]
  );

  // Health Pools
  const healthPools = useMemo(
    () => calculateHealthPools(character.attributes, character.castStat),
    [character.attributes, character.castStat]
  );

  // Defense Stats
  const defenseStats = useMemo(
    () => calculateDefenseStats(
      character.attributes,
      character.tradition,
      character.skills,
      {
        lightArmorBonus: character.armorType === 'light' ? 1 : 0,
      }
    ),
    [character.attributes, character.tradition, character.skills, character.armorType]
  );

  // Resist Stats
  const resistStats = useMemo(
    () => calculateResistStats(character.attributes),
    [character.attributes]
  );

  // Soak Stats
  const soakStats = useMemo(
    () => calculateSoakStats(character.attributes),
    [character.attributes]
  );

  // Helper function to get skill dicepool
  const getSkillDicepool = (skillName: string) => {
    const skillDef = skills.find(s => s.name === skillName);
    if (!skillDef) return 0;

    const rank = character.skills[skillName] || 0;
    const attributeValue = character.attributes[skillDef.attribute];

    return calculateSkillDicepool(character.tradition, rank, attributeValue);
  };

  // Weapon dicepools
  const weaponDicepools = useMemo(
    () => character.weapons.map(weapon => ({
      weaponId: weapon.id,
      dicepool: calculateWeaponDicepool(weapon, character.attributes, character.skills, character.tradition),
    })),
    [character.weapons, character.attributes, character.skills, character.tradition]
  );

  return {
    // BP
    attributeCost,
    traditionCost,
    skillCosts,
    knowledgeDiscount,
    abilityCosts,
    bpSpent,
    bpRemaining,
    isOverBudget: bpSpent > character.bpBudget,

    // Affinity
    affinityPoints,
    affinitiesUsed,
    affinityPointsRemaining: affinityPoints - affinitiesUsed,

    // Stats
    healthPools,
    defenseStats,
    resistStats,
    soakStats,

    // Helpers
    getSkillDicepool,
    weaponDicepools,

    // Data
    skillDefinitions: skills,
    abilityDatabase: abilities,
  };
}
