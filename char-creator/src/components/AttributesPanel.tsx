import { useCharacter } from '../hooks/useCharacter';
import { useCalculations } from '../hooks/useCalculations';
import { AttributeName } from '../types/character';
import { calculateAttributeCost } from '../utils/calculations';
import SnapSlider from './SnapSlider';

const ATTRIBUTE_LABELS: Record<AttributeName, string> = {
  bod: 'Body',
  agi: 'Agility',
  rea: 'Reaction',
  str: 'Strength',
  wil: 'Willpower',
  int: 'Intuition',
  log: 'Logic',
  cha: 'Charisma',
  luk: 'Luck',
};

export default function AttributesPanel() {
  const { character, setAttribute } = useCharacter();
  const { attributeCost } = useCalculations();

  const renderAttributeSlider = (attr: AttributeName) => {
    const value = character.attributes[attr];
    const cost = calculateAttributeCost(value);

    return (
      <div
        key={attr}
        className="py-4 border-b border-navy-light last:border-0"
      >
        <SnapSlider
          label={ATTRIBUTE_LABELS[attr]}
          value={value}
          min={1}
          max={10}
          step={1}
          onChange={(newValue) => setAttribute(attr, newValue)}
          cost={cost}
          showCost={true}
        />
      </div>
    );
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Attributes</h2>
        <span className="text-lg font-semibold text-cyan-bright">Total: {attributeCost} BP</span>
      </div>
      <div className="space-y-2">
        {(Object.keys(ATTRIBUTE_LABELS) as AttributeName[]).map(renderAttributeSlider)}
      </div>
      <div className="mt-6 p-4 bg-navy-deep rounded-lg border border-navy-light">
        <p className="text-sm text-cosmic-grey text-center">
          Cost formula: (value² + value - 2) × 2.5
        </p>
      </div>
    </div>
  );
}
