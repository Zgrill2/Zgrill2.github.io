import { Character } from '../types/character';

const STORAGE_KEY = 'shimmering-reach-character';

// Skill name renames: old -> new
const SKILL_RENAMES: Record<string, string> = {
  'Running': 'Marathoner',
  'Swimming': 'Traversal',
  'Deception': 'Con',
  'Persuasion': 'Negotiation',
  'Sleight of Hand': 'Legerdemain',
  'Lockpicking': 'Thievery',
};

// Skills that no longer exist (should be removed)
const REMOVED_SKILLS = new Set([
  'Athletics', 'Influence', 'Subterfuge',
  'Tracking', 'Outdoorsmanship', 'Leadership',
  'Investigation', 'First Aid', 'Parry', 'Block',
  'Melee Weapons', 'Ranged Weapons', 'Unarmed Combat',
  'Light Weapons', 'Heavy Weapons',
  // Predefined knowledge skills
  'Knowledge: Arcana', 'Knowledge: History', 'Knowledge: Nature',
  'Knowledge: Religion', 'Knowledge: Geography', 'Knowledge: Politics',
  'Knowledge: Engineering', 'Knowledge: Planes',
]);

// Weapon skill names that should map to 'Weapon'
const WEAPON_SKILL_RENAMES = new Set([
  'Blades', 'Axes', 'Melee Weapons', 'Ranged Weapons',
  'Unarmed Combat', 'Light Weapons', 'Heavy Weapons',
]);

/**
 * Migrate old skill data to new skill names
 */
export function migrateSkills(character: Character): Character {
  const newSkills: Record<string, number> = {};

  for (const [skillName, rank] of Object.entries(character.skills)) {
    // Check for renames
    if (SKILL_RENAMES[skillName]) {
      const newName = SKILL_RENAMES[skillName];
      // Keep highest rank if collision
      newSkills[newName] = Math.max(newSkills[newName] || 0, rank);
    } else if (REMOVED_SKILLS.has(skillName)) {
      // Skip removed skills
      continue;
    } else {
      newSkills[skillName] = rank;
    }
  }

  // Migrate weapon skillNames on weapons
  const migratedWeapons = character.weapons?.map(w => {
    if (w.skillName && WEAPON_SKILL_RENAMES.has(w.skillName)) {
      return { ...w, skillName: 'Weapon' };
    }
    return w;
  }) || [];

  // Ensure knowledgeSkills array exists
  const knowledgeSkills = character.knowledgeSkills || [];

  return {
    ...character,
    skills: newSkills,
    weapons: migratedWeapons,
    knowledgeSkills,
  };
}

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

    const character = JSON.parse(json) as Character;
    return migrateSkills(character);
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
