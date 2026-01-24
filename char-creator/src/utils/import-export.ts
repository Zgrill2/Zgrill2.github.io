import { Character } from '../types/character';

/**
 * Export character to JSON file
 */
export function exportCharacter(character: Character): void {
  const json = JSON.stringify(character, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${character.name.replace(/\s+/g, '-')}-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import character from JSON file
 */
export async function importCharacter(file: File): Promise<Character> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const character = JSON.parse(json) as Character;

        // Basic validation
        if (!character.id || !character.name || !character.attributes) {
          throw new Error('Invalid character file format');
        }

        resolve(character);
      } catch (error) {
        reject(new Error('Failed to parse character file: ' + (error as Error).message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}
