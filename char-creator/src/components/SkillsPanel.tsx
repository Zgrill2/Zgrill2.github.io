import { useCharacter } from '../hooks/useCharacter';
import { useCalculations } from '../hooks/useCalculations';
import { SkillDefinition } from '../types/skill';
import { calculateSkillCost } from '../utils/calculations';

export default function SkillsPanel() {
  const { character, setSkill } = useCharacter();
  const { skillCosts, getSkillDicepool, skillDefinitions } = useCalculations();

  // Group skills by category
  const skillsByCategory = skillDefinitions.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, SkillDefinition[]>);

  const renderSkill = (skill: SkillDefinition) => {
    const rank = character.skills[skill.name] || 0;
    const dicepool = getSkillDicepool(skill.name);
    const cost = calculateSkillCost(rank, skill.costMultiplier);
    const isParent = skill.type === 'parent';
    const isKnowledge = skill.type === 'knowledge';

    return (
      <div
        key={skill.name}
        className={`flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 ${
          isParent ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 rounded px-2' : ''
        }`}
      >
        <div className="flex-1">
          <label
            className={`text-sm ${
              isParent ? 'font-bold text-blue-900 dark:text-blue-300' : 'font-medium text-gray-700 dark:text-gray-300'
            }`}
          >
            {skill.name}
          </label>
          {isKnowledge && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(50% cost)</span>
          )}
          {isParent && <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(250% cost)</span>}
        </div>
        <div className="flex items-center gap-3">
          <div className="stat-chip border-gray-200 text-gray-600 text-xs">
            {skill.attribute.toUpperCase()}
          </div>
          <input
            type="number"
            min="0"
            max="20"
            value={rank}
            onChange={(e) =>
              setSkill(skill.name, Math.max(0, parseInt(e.target.value) || 0))
            }
            className="w-16 input-standard text-center border-blue-300 focus:ring-blue-500"
            placeholder="0"
          />
          <div className="w-16 text-center">
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{dicepool}d6</span>
          </div>
          <div className="w-20 text-right">
            <span className="stat-chip border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs">
              {cost} BP
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderCategory = (category: string, skills: SkillDefinition[]) => {
    return (
      <div key={category} className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 border-b-2 border-blue-200 dark:border-blue-800 pb-2">
          {category}
        </h3>
        <div className="space-y-1">{skills.map(renderSkill)}</div>
      </div>
    );
  };

  // Sort categories: parent skills first, then alphabetical
  const categoryOrder = ['Athletics', 'Survival', 'Influence', 'Subterfuge', 'Combat', 'General', 'Knowledge'];
  const sortedCategories = Object.keys(skillsByCategory).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Skills</h2>
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Total: {skillCosts} BP</span>
      </div>

      <div className="mb-4 text-xs text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="font-medium mb-1">
          Dicepool = Rank + Attribute + Min(Rank, ⌊Tradition/2⌋)
        </div>
        <div>Cost = (Rank² + Rank + 2) × Multiplier</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedCategories.map((category) =>
          renderCategory(category, skillsByCategory[category])
        )}
      </div>
    </div>
  );
}
