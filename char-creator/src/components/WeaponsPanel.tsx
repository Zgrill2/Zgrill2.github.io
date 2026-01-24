import { useState } from 'react';
import { useCharacter } from '../hooks/useCharacter';
import { useCalculations } from '../hooks/useCalculations';
import { Weapon, WeaponType, ShieldType } from '../types/weapon';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function WeaponsPanel() {
  const { character, addWeapon, updateWeapon, removeWeapon } = useCharacter();
  const { weaponDicepools } = useCalculations();
  const [expandedWeaponId, setExpandedWeaponId] = useState<string | null>(null);
  const [editingWeapon, setEditingWeapon] = useState<Weapon | null>(null);

  const handleAdd = () => {
    const newWeapon: Weapon = {
      id: crypto.randomUUID(),
      name: 'New Weapon',
      type: '1h',
      power: 0,
      reach: 0,
      shield: 'none',
      element: '',
      skillName: 'Melee Weapons',
    };
    setEditingWeapon(newWeapon);
    setExpandedWeaponId(newWeapon.id);
  };

  const handleEdit = (weapon: Weapon) => {
    setEditingWeapon({ ...weapon });
    setExpandedWeaponId(weapon.id);
  };

  const handleSave = () => {
    if (!editingWeapon) return;

    if (character.weapons.some(w => w.id === editingWeapon.id)) {
      updateWeapon(editingWeapon);
    } else {
      addWeapon(editingWeapon);
    }

    setExpandedWeaponId(null);
    setEditingWeapon(null);
  };

  const handleCancel = () => {
    setExpandedWeaponId(null);
    setEditingWeapon(null);
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Weapons</h2>
        <button
          onClick={handleAdd}
          className="btn-primary bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus size={16} />
          <span>Add Weapon</span>
        </button>
      </div>

      {/* New Weapon Inline Editor (shown when adding) */}
      {editingWeapon && !character.weapons.some(w => w.id === editingWeapon.id) && expandedWeaponId === editingWeapon.id && (
        <div className="mb-6 rounded-xl overflow-hidden bg-navy-mid border-2 border-cyan-electric shadow-glow-cyan-md">
          <div className="p-5">
            <h3 className="text-xl font-bold text-cosmic-white mb-4">Add New Weapon</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-cosmic-white mb-2">Name</label>
                <input
                  type="text"
                  value={editingWeapon.name}
                  onChange={(e) => setEditingWeapon({ ...editingWeapon, name: e.target.value })}
                  className="w-full input-standard"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-cosmic-white mb-2">Type</label>
                  <select
                    value={editingWeapon.type}
                    onChange={(e) => setEditingWeapon({ ...editingWeapon, type: e.target.value as WeaponType })}
                    className="w-full input-standard"
                  >
                    <option value="light">Light</option>
                    <option value="1h">1-Handed</option>
                    <option value="2h">2-Handed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-cosmic-white mb-2">Shield</label>
                  <select
                    value={editingWeapon.shield}
                    onChange={(e) => setEditingWeapon({ ...editingWeapon, shield: e.target.value as ShieldType })}
                    className="w-full input-standard"
                  >
                    <option value="none">None</option>
                    <option value="buckler">Buckler</option>
                    <option value="medium">Medium</option>
                    <option value="heavy">Heavy</option>
                    <option value="tower">Tower</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-cosmic-white mb-2">Power</label>
                  <input
                    type="number"
                    value={editingWeapon.power}
                    onChange={(e) => setEditingWeapon({ ...editingWeapon, power: parseInt(e.target.value) || 0 })}
                    className="w-full input-standard"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-cosmic-white mb-2">Reach</label>
                  <input
                    type="number"
                    value={editingWeapon.reach}
                    onChange={(e) => setEditingWeapon({ ...editingWeapon, reach: parseInt(e.target.value) || 0 })}
                    className="w-full input-standard"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-cosmic-white mb-2">Element (optional)</label>
                <input
                  type="text"
                  value={editingWeapon.element || ''}
                  onChange={(e) => setEditingWeapon({ ...editingWeapon, element: e.target.value })}
                  className="w-full input-standard"
                  placeholder="e.g., Fire, Ice, Lightning"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-cosmic-white mb-2">Skill (optional)</label>
                <input
                  type="text"
                  value={editingWeapon.skillName || ''}
                  onChange={(e) => setEditingWeapon({ ...editingWeapon, skillName: e.target.value })}
                  className="w-full input-standard"
                  placeholder="e.g., Melee Weapons, Ranged Weapons"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 btn-primary bg-cyan-electric hover:bg-cyan-bright text-navy-deep justify-center">
                Save Weapon
              </button>
              <button onClick={handleCancel} className="flex-1 btn-primary bg-navy-light hover:bg-navy-deep text-cosmic-white justify-center">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Weapons List */}
      {character.weapons.length === 0 && !editingWeapon ? (
        <div className="text-center py-8 text-cosmic-grey">
          No weapons added yet. Click "Add Weapon" to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {character.weapons.map(weapon => {
            const dicepoolInfo = weaponDicepools.find(w => w.weaponId === weapon.id);
            const dicepool = dicepoolInfo?.dicepool || 0;
            const isExpanded = expandedWeaponId === weapon.id;

            return (
              <div
                key={weapon.id}
                className="rounded-xl overflow-hidden bg-navy-mid border-2 border-navy-light hover:border-cyan-electric transition-all"
              >
                {!isExpanded ? (
                  // Collapsed view
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-cosmic-white">{weapon.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-navy-deep border border-cyan-muted text-cyan-bright">
                            {weapon.type}
                          </span>
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-navy-deep border border-error text-error">
                            Power: {weapon.power}
                          </span>
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-navy-deep border border-success text-success">
                            Reach: {weapon.reach}
                          </span>
                          {weapon.shield !== 'none' && (
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-navy-deep border border-cosmic-grey text-cosmic-grey">
                              {weapon.shield}
                            </span>
                          )}
                          {weapon.element && (
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-navy-deep border border-warning text-warning">
                              {weapon.element}
                            </span>
                          )}
                          {weapon.skillName && (
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-navy-deep border border-cosmic-dim text-cosmic-grey">
                              {weapon.skillName}
                            </span>
                          )}
                        </div>
                        <div className="mt-3">
                          <span className="text-2xl font-bold text-cyan-bright">{dicepool}d6</span>
                          <span className="text-sm text-cosmic-grey ml-2">dicepool</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(weapon)}
                          className="p-2 text-cyan-electric hover:bg-cyan-electric hover:bg-opacity-20 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this weapon?')) {
                              removeWeapon(weapon.id);
                            }
                          }}
                          className="p-2 text-error hover:bg-error hover:bg-opacity-20 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Expanded edit view
                  <div className="p-5 border-2 border-cyan-electric bg-navy-deep">
                    <h3 className="text-xl font-bold text-cosmic-white mb-4">Edit Weapon</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-cosmic-white mb-2">Name</label>
                        <input
                          type="text"
                          value={editingWeapon?.name || weapon.name}
                          onChange={(e) => setEditingWeapon({ ...(editingWeapon || weapon), name: e.target.value })}
                          className="w-full input-standard"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-cosmic-white mb-2">Type</label>
                          <select
                            value={editingWeapon?.type || weapon.type}
                            onChange={(e) => setEditingWeapon({ ...(editingWeapon || weapon), type: e.target.value as WeaponType })}
                            className="w-full input-standard"
                          >
                            <option value="light">Light</option>
                            <option value="1h">1-Handed</option>
                            <option value="2h">2-Handed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-cosmic-white mb-2">Shield</label>
                          <select
                            value={editingWeapon?.shield || weapon.shield}
                            onChange={(e) => setEditingWeapon({ ...(editingWeapon || weapon), shield: e.target.value as ShieldType })}
                            className="w-full input-standard"
                          >
                            <option value="none">None</option>
                            <option value="buckler">Buckler</option>
                            <option value="medium">Medium</option>
                            <option value="heavy">Heavy</option>
                            <option value="tower">Tower</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-cosmic-white mb-2">Power</label>
                          <input
                            type="number"
                            value={editingWeapon?.power ?? weapon.power}
                            onChange={(e) => setEditingWeapon({ ...(editingWeapon || weapon), power: parseInt(e.target.value) || 0 })}
                            className="w-full input-standard"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-cosmic-white mb-2">Reach</label>
                          <input
                            type="number"
                            value={editingWeapon?.reach ?? weapon.reach}
                            onChange={(e) => setEditingWeapon({ ...(editingWeapon || weapon), reach: parseInt(e.target.value) || 0 })}
                            className="w-full input-standard"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-cosmic-white mb-2">Element (optional)</label>
                        <input
                          type="text"
                          value={editingWeapon?.element ?? weapon.element ?? ''}
                          onChange={(e) => setEditingWeapon({ ...(editingWeapon || weapon), element: e.target.value })}
                          className="w-full input-standard"
                          placeholder="e.g., Fire, Ice, Lightning"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-cosmic-white mb-2">Skill (optional)</label>
                        <input
                          type="text"
                          value={editingWeapon?.skillName ?? weapon.skillName ?? ''}
                          onChange={(e) => setEditingWeapon({ ...(editingWeapon || weapon), skillName: e.target.value })}
                          className="w-full input-standard"
                          placeholder="e.g., Melee Weapons, Ranged Weapons"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button onClick={handleSave} className="flex-1 btn-primary bg-cyan-electric hover:bg-cyan-bright text-navy-deep justify-center">
                        Save Changes
                      </button>
                      <button onClick={handleCancel} className="flex-1 btn-primary bg-navy-light hover:bg-navy-deep text-cosmic-white justify-center">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 text-xs text-cosmic-grey bg-navy-deep p-3 rounded-lg border border-navy-light">
        <span className="font-semibold text-cyan-bright">Formula:</span> Weapon dicepool = attribute + skill_rank + reach + Min(skill_rank, ⌊tradition/2⌋)
      </div>
    </div>
  );
}
