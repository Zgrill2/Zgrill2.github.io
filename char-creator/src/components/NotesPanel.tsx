import { useCharacter } from '../hooks/useCharacter';

export default function NotesPanel() {
  const { character, setNotes, setInventory } = useCharacter();

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Notes & Inventory</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Character Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Character Notes
          </label>
          <textarea
            value={character.notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={10}
            className="w-full input-standard font-mono text-sm border-purple-300 focus:ring-purple-500"
            placeholder="Add character notes, backstory, personality traits, goals, etc."
          />
        </div>

        {/* Inventory */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Inventory</label>
          <textarea
            value={character.inventory}
            onChange={(e) => setInventory(e.target.value)}
            rows={10}
            className="w-full input-standard font-mono text-sm border-green-300 focus:ring-green-500"
            placeholder="List equipment, items, potions, spell components, etc."
          />
        </div>
      </div>
    </div>
  );
}
