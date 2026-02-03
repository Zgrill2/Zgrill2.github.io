import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Character, AttributeName, Weapon, CharacterAbility, ArmorType } from '../types/character';

// Initial character state
const createInitialCharacter = (): Character => ({
  id: crypto.randomUUID(),
  name: 'New Character',
  version: '1.0',
  attributes: {
    bod: 1,
    agi: 1,
    rea: 1,
    str: 1,
    wil: 1,
    int: 1,
    log: 1,
    cha: 1,
    luk: 1,
  },
  tradition: 1,
  castStat: 'log',
  affinities: {
    w: 0,
    u: 0,
    b: 0,
    r: 0,
    g: 0,
  },
  skills: {},
  knowledgeSkills: [],
  abilities: [],
  weapons: [],
  armorType: 'none',
  notes: '',
  inventory: '',
  bpBudget: 1620,
});

// Action types
type CharacterAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_ATTRIBUTE'; payload: { attribute: AttributeName; value: number } }
  | { type: 'SET_TRADITION'; payload: number }
  | { type: 'SET_CAST_STAT'; payload: AttributeName }
  | { type: 'SET_AFFINITY'; payload: { color: 'w' | 'u' | 'b' | 'r' | 'g'; value: number } }
  | { type: 'SET_SKILL'; payload: { skillName: string; rank: number } }
  | { type: 'SET_GROUP_SKILL'; payload: { groupName: string; rank: number; childNames: string[] } }
  | { type: 'ADD_KNOWLEDGE_SKILL' }
  | { type: 'UPDATE_KNOWLEDGE_SKILL'; payload: { index: number; name?: string; rank?: number } }
  | { type: 'REMOVE_KNOWLEDGE_SKILL'; payload: number }
  | { type: 'ADD_ABILITY'; payload: CharacterAbility }
  | { type: 'UPDATE_ABILITY'; payload: { name: string; rank: number } }
  | { type: 'REMOVE_ABILITY'; payload: string } // ability name
  | { type: 'ADD_WEAPON'; payload: Weapon }
  | { type: 'UPDATE_WEAPON'; payload: Weapon }
  | { type: 'REMOVE_WEAPON'; payload: string } // weapon id
  | { type: 'SET_ARMOR_TYPE'; payload: ArmorType }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'SET_INVENTORY'; payload: string }
  | { type: 'SET_BP_BUDGET'; payload: number }
  | { type: 'LOAD_CHARACTER'; payload: Character }
  | { type: 'RESET_CHARACTER' };

// Reducer
function characterReducer(state: Character, action: CharacterAction): Character {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };

    case 'SET_ATTRIBUTE':
      return {
        ...state,
        attributes: {
          ...state.attributes,
          [action.payload.attribute]: action.payload.value,
        },
      };

    case 'SET_TRADITION':
      return { ...state, tradition: action.payload };

    case 'SET_CAST_STAT':
      return { ...state, castStat: action.payload };

    case 'SET_AFFINITY':
      return {
        ...state,
        affinities: {
          ...state.affinities,
          [action.payload.color]: action.payload.value,
        },
      };

    case 'SET_SKILL': {
      const newSkills = { ...state.skills };
      if (action.payload.rank === 0) {
        delete newSkills[action.payload.skillName];
      } else {
        newSkills[action.payload.skillName] = action.payload.rank;
      }
      return { ...state, skills: newSkills };
    }

    case 'SET_GROUP_SKILL': {
      const newSkills = { ...state.skills };
      const { groupName, rank, childNames } = action.payload;
      if (rank === 0) {
        delete newSkills[groupName];
      } else {
        newSkills[groupName] = rank;
      }
      // When setting a group rank, clear all child individual ranks
      for (const childName of childNames) {
        delete newSkills[childName];
      }
      return { ...state, skills: newSkills };
    }

    case 'ADD_KNOWLEDGE_SKILL':
      return {
        ...state,
        knowledgeSkills: [...state.knowledgeSkills, { name: '', rank: 0 }],
      };

    case 'UPDATE_KNOWLEDGE_SKILL': {
      const { index, name, rank } = action.payload;
      const updatedKS = [...state.knowledgeSkills];
      if (index >= 0 && index < updatedKS.length) {
        updatedKS[index] = {
          ...updatedKS[index],
          ...(name !== undefined ? { name } : {}),
          ...(rank !== undefined ? { rank } : {}),
        };
      }
      return { ...state, knowledgeSkills: updatedKS };
    }

    case 'REMOVE_KNOWLEDGE_SKILL':
      return {
        ...state,
        knowledgeSkills: state.knowledgeSkills.filter((_, i) => i !== action.payload),
      };

    case 'ADD_ABILITY':
      return {
        ...state,
        abilities: [...state.abilities, action.payload],
      };

    case 'UPDATE_ABILITY':
      return {
        ...state,
        abilities: state.abilities.map(a =>
          a.name === action.payload.name
            ? { ...a, rank: action.payload.rank }
            : a
        ),
      };

    case 'REMOVE_ABILITY':
      return {
        ...state,
        abilities: state.abilities.filter(a => a.name !== action.payload),
      };

    case 'ADD_WEAPON':
      return {
        ...state,
        weapons: [...state.weapons, action.payload],
      };

    case 'UPDATE_WEAPON':
      return {
        ...state,
        weapons: state.weapons.map(w =>
          w.id === action.payload.id ? action.payload : w
        ),
      };

    case 'REMOVE_WEAPON':
      return {
        ...state,
        weapons: state.weapons.filter(w => w.id !== action.payload),
      };

    case 'SET_ARMOR_TYPE':
      return { ...state, armorType: action.payload };

    case 'SET_NOTES':
      return { ...state, notes: action.payload };

    case 'SET_INVENTORY':
      return { ...state, inventory: action.payload };

    case 'SET_BP_BUDGET':
      return { ...state, bpBudget: action.payload };

    case 'LOAD_CHARACTER':
      return action.payload;

    case 'RESET_CHARACTER':
      return createInitialCharacter();

    default:
      return state;
  }
}

// Context type
interface CharacterContextType {
  character: Character;
  dispatch: React.Dispatch<CharacterAction>;
}

// Create context
const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

// Provider component
export function CharacterProvider({ children }: { children: ReactNode }) {
  const [character, dispatch] = useReducer(characterReducer, createInitialCharacter());

  return (
    <CharacterContext.Provider value={{ character, dispatch }}>
      {children}
    </CharacterContext.Provider>
  );
}

// Hook to use character context
export function useCharacterContext() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacterContext must be used within CharacterProvider');
  }
  return context;
}
