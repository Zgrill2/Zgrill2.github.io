import { useCharacter } from '../hooks/useCharacter';
import { AttributeName } from '../types/character';
import { calculateTraditionCost } from '../utils/calculations';
import ColorPieWheel from './ColorPieWheel';
import SnapSlider from './SnapSlider';

const CAST_STAT_OPTIONS: { value: AttributeName; label: string }[] = [
  { value: 'log', label: 'Logic' },
  { value: 'int', label: 'Intuition' },
  { value: 'cha', label: 'Charisma' },
];

export default function MagicPanel() {
  const { character, setTradition, setCastStat } = useCharacter();

  const tradition = character.tradition;
  const cost = calculateTraditionCost(tradition);

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Magic</h2>
        <span className="text-lg font-semibold text-cyan-bright">{cost} BP</span>
      </div>

      {/* Tradition */}
      <div className="mb-8 p-4 bg-navy-deep rounded-lg border-2 border-navy-light">
        <SnapSlider
          label="Tradition Level"
          value={tradition}
          min={1}
          max={10}
          step={1}
          onChange={setTradition}
          cost={cost}
          showCost={true}
        />
        <div className="mt-4 text-sm text-cosmic-grey text-center">
          Cost formula: (tradition² + 7×tradition - 8) × 2.5
        </div>
      </div>

      {/* Cast Stat */}
      <div className="mb-6">
        <label className="text-base font-semibold text-cosmic-white mb-3 block">Cast Stat</label>
        <select
          value={character.castStat}
          onChange={(e) => setCastStat(e.target.value as AttributeName)}
          className="w-full input-standard text-lg"
        >
          {CAST_STAT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Color Pie Wheel - MTG-Style Affinity Allocator */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-cosmic-white mb-4 text-center">
          Color Affinity Wheel
        </h3>
        <ColorPieWheel />
        <div className="mt-4 text-sm text-cosmic-grey text-center">
          Affinity points = tradition × 3
        </div>
      </div>
    </div>
  );
}
