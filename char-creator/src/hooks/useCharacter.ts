import { useCharacterContext } from '../context/CharacterContext';
import { AttributeName, Weapon, ArmorType, CharacterAbility } from '../types/character';

/**
 * Custom hook that provides convenient functions to update character state
 */
export function useCharacter() {
  const { character, dispatch } = useCharacterContext();

  return {
    character,

    // Character name
    setName: (name: string) => {
      dispatch({ type: 'SET_NAME', payload: name });
    },

    // Attributes
    setAttribute: (attribute: AttributeName, value: number) => {
      dispatch({ type: 'SET_ATTRIBUTE', payload: { attribute, value } });
    },

    // Magic
    setTradition: (value: number) => {
      dispatch({ type: 'SET_TRADITION', payload: value });
    },

    setCastStat: (stat: AttributeName) => {
      dispatch({ type: 'SET_CAST_STAT', payload: stat });
    },

    setAffinity: (color: 'w' | 'u' | 'b' | 'r' | 'g', value: number) => {
      dispatch({ type: 'SET_AFFINITY', payload: { color, value } });
    },

    // Skills
    setSkill: (skillName: string, rank: number) => {
      dispatch({ type: 'SET_SKILL', payload: { skillName, rank } });
    },

    setGroupSkill: (groupName: string, rank: number, childNames: string[]) => {
      dispatch({ type: 'SET_GROUP_SKILL', payload: { groupName, rank, childNames } });
    },

    // Knowledge Skills
    addKnowledgeSkill: () => {
      dispatch({ type: 'ADD_KNOWLEDGE_SKILL' });
    },

    updateKnowledgeSkill: (index: number, name?: string, rank?: number) => {
      dispatch({ type: 'UPDATE_KNOWLEDGE_SKILL', payload: { index, name, rank } });
    },

    removeKnowledgeSkill: (index: number) => {
      dispatch({ type: 'REMOVE_KNOWLEDGE_SKILL', payload: index });
    },

    // Abilities
    addAbility: (ability: CharacterAbility) => {
      dispatch({ type: 'ADD_ABILITY', payload: ability });
    },

    updateAbility: (name: string, rank: number) => {
      dispatch({ type: 'UPDATE_ABILITY', payload: { name, rank } });
    },

    removeAbility: (abilityName: string) => {
      dispatch({ type: 'REMOVE_ABILITY', payload: abilityName });
    },

    // Weapons
    addWeapon: (weapon: Weapon) => {
      dispatch({ type: 'ADD_WEAPON', payload: weapon });
    },

    updateWeapon: (weapon: Weapon) => {
      dispatch({ type: 'UPDATE_WEAPON', payload: weapon });
    },

    removeWeapon: (weaponId: string) => {
      dispatch({ type: 'REMOVE_WEAPON', payload: weaponId });
    },

    // Misc
    setArmorType: (armorType: ArmorType) => {
      dispatch({ type: 'SET_ARMOR_TYPE', payload: armorType });
    },

    setNotes: (notes: string) => {
      dispatch({ type: 'SET_NOTES', payload: notes });
    },

    setInventory: (inventory: string) => {
      dispatch({ type: 'SET_INVENTORY', payload: inventory });
    },

    setBPBudget: (budget: number) => {
      dispatch({ type: 'SET_BP_BUDGET', payload: budget });
    },

    // Load/Reset
    loadCharacter: (char: any) => {
      dispatch({ type: 'LOAD_CHARACTER', payload: char });
    },

    resetCharacter: () => {
      dispatch({ type: 'RESET_CHARACTER' });
    },
  };
}
