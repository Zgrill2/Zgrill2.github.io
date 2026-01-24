import { Character } from '../types/character';

const STORAGE_KEY = 'shimmering-reach-character';

/**
 * Save character to localStorage
 */
export function saveCharacter(character: Character): void {
  try {
    const json = JSON.stringify(character);
    localStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error('Failed to save character:', error);
    throw new Error('Failed to save character to browser storage');
  }
}

/**
 * Load character from localStorage
 */
export function loadCharacter(): Character | null {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return null;

    return JSON.parse(json) as Character;
  } catch (error) {
    console.error('Failed to load character:', error);
    return null;
  }
}

/**
 * Clear character from localStorage
 */
export function clearCharacter(): void {
  localStorage.removeItem(STORAGE_KEY);
}
