import { useCharacter } from '../hooks/useCharacter';
import { useCalculations } from '../hooks/useCalculations';
import { SkillDefinition } from '../types/skill';
import { calculateSkillCost, getEffectiveSkillRank } from '../utils/calculations';
import { Plus, Trash2 } from 'lucide-react';

export default function SkillsPanel() {
  const {
    character,
    setSkill,
    setGroupSkill,
    addKnowledgeSkill,
    updateKnowledgeSkill,
    removeKnowledgeSkill,
  } = useCharacter();
  const { skillCosts, knowledgeSkillCosts, knowledgeDiscount, getSkillDicepool, skillDefinitions } = useCalculations();

  // Organize skills
  const parentSkills = skillDefinitions.filter(s => s.type === 'parent');
  const ungroupedSkills = skillDefinitions.filter(
    s => s.type === 'individual' && !s.parentGroup
  );

  const getChildrenForParent = (parentName: string): SkillDefinition[] =>
    skillDefinitions.filter(s => s.parentGroup === parentName);

  const hasChildRanks = (parentName: string): boolean => {
    const children = getChildrenForParent(parentName);
    return children.some(c => (character.skills[c.name] || 0) > 0);
  };

  const renderGroupSection = (parent: SkillDefinition) => {
    const children = getChildrenForParent(parent.name);
    const parentRank = character.skills[parent.name] || 0;
    const childHasRanks = hasChildRanks(parent.name);
    const groupActive = parentRank > 0;
    const groupCost = calculateSkillCost(parentRank, parent.costMultiplier);
    const childNames = children.map(c => c.name);

    return (
      <div key={parent.name} className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 border-b-2 border-blue-200 dark:border-blue-800 pb-2">
          {parent.category}
        </h3>

        {/* Parent group row */}
        <div className="flex items-center justify-between py-2 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 rounded px-2 mb-1">
          <div className="flex-1">
            <label className="text-sm font-bold text-blue-900 dark:text-blue-300">
              {parent.name} <span className="text-xs font-normal">(Group)</span>
            </label>
            <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(250% cost)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="stat-chip border-gray-200 text-gray-600 text-xs">
              {parent.attribute.toUpperCase()}
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="20"
                value={parentRank}
                onChange={(e) =>
                  setGroupSkill(parent.name, Math.max(0, parseInt(e.target.value) || 0), childNames)
                }
                disabled={childHasRanks}
                className={`w-16 input-standard text-center border-blue-300 focus:ring-blue-500 ${
                  childHasRanks ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                placeholder="0"
              />
            </div>
            <div className="w-16 text-center">
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {parentRank > 0 ? `${getSkillDicepool(parent.name)}d6` : '-'}
              </span>
            </div>
            <div className="w-20 text-right">
              <span className="stat-chip border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs">
                {groupCost} BP
              </span>
            </div>
          </div>
        </div>

        {childHasRanks && parentRank === 0 && (
          <div className="text-xs text-amber-600 dark:text-amber-400 px-2 mb-1">
            Zero individual skills to enable group purchase
          </div>
        )}

        {/* Child skill rows */}
        {children.map(child => {
          const individualRank = character.skills[child.name] || 0;
          const effectiveRank = getEffectiveSkillRank(child.name, character.skills, skillDefinitions);
          const dicepool = getSkillDicepool(child.name);
          const childCost = groupActive ? 0 : calculateSkillCost(individualRank, child.costMultiplier);

          return (
            <div
              key={child.name}
              className="flex items-center justify-between py-2 pl-6 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {child.name}
                </label>
              </div>
              <div className="flex items-center gap-3">
                <div className="stat-chip border-gray-200 text-gray-600 text-xs">
                  {child.attribute.toUpperCase()}
                </div>
                {groupActive ? (
                  <input
                    type="number"
                    value={effectiveRank}
                    readOnly
                    className="w-16 input-standard text-center border-gray-300 bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-70"
                  />
                ) : (
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={individualRank}
                    onChange={(e) =>
                      setSkill(child.name, Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-16 input-standard text-center border-blue-300 focus:ring-blue-500"
                    placeholder="0"
                  />
                )}
                <div className="w-16 text-center">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{dicepool}d6</span>
                </div>
                <div className="w-20 text-right">
                  <span className="stat-chip border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs">
                    {childCost} BP
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderUngroupedSkill = (skill: SkillDefinition) => {
    const rank = character.skills[skill.name] || 0;
    const dicepool = getSkillDicepool(skill.name);
    const cost = calculateSkillCost(rank, skill.costMultiplier);

    return (
      <div
        key={skill.name}
        className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
      >
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {skill.name}
          </label>
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

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Skills</h2>
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Skills: {skillCosts} BP | Knowledge: {knowledgeSkillCosts} BP
        </span>
      </div>

      <div className="mb-4 text-xs text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="font-medium mb-1">
          Dicepool = Rank + Attribute + Min(Rank, ⌈Tradition/2⌉)
        </div>
        <div>Individual Cost = (Rank² + Rank + 2)</div>
        <div>Group Cost = (Rank² + Rank + 2) × 2.5</div>
        <div>Knowledge Cost = (Rank² + Rank + 2) × 0.5, discount = (LOG + INT) × 10</div>
      </div>

      {/* Skill Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {parentSkills.map(renderGroupSection)}
      </div>

      {/* Ungrouped Skills */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 border-b-2 border-blue-200 dark:border-blue-800 pb-2">
          Ungrouped
        </h3>
        <div className="space-y-1">
          {ungroupedSkills.map(renderUngroupedSkill)}
        </div>
      </div>

      {/* Knowledge Skills */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 border-b-2 border-blue-200 dark:border-blue-800 pb-2">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            Knowledge Skills
          </h3>
          <button
            onClick={addKnowledgeSkill}
            className="btn-primary bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
          >
            <Plus size={14} />
            <span>Add</span>
          </button>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          50% cost | Discount: {knowledgeDiscount} BP (LOG + INT) × 10
        </div>
        {character.knowledgeSkills.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
            No knowledge skills added. Click "Add" to create one.
          </div>
        ) : (
          <div className="space-y-1">
            {character.knowledgeSkills.map((ks, index) => {
              const cost = calculateSkillCost(ks.rank, 0.5);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="flex-1 mr-3">
                    <input
                      type="text"
                      value={ks.name}
                      onChange={(e) => updateKnowledgeSkill(index, e.target.value, undefined)}
                      className="w-full input-standard text-sm"
                      placeholder="e.g., Magic Knowledge, Criminal Organizations"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="stat-chip border-gray-200 text-gray-600 text-xs">
                      LOG
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={ks.rank}
                      onChange={(e) =>
                        updateKnowledgeSkill(index, undefined, Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className="w-16 input-standard text-center border-blue-300 focus:ring-blue-500"
                      placeholder="0"
                    />
                    <div className="w-20 text-right">
                      <span className="stat-chip border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs">
                        {cost} BP
                      </span>
                    </div>
                    <button
                      onClick={() => removeKnowledgeSkill(index)}
                      className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {character.knowledgeSkills.length > 0 && (
          <div className="mt-2 text-xs text-right text-gray-600 dark:text-gray-400">
            Total after discount: {knowledgeSkillCosts} BP
          </div>
        )}
      </div>
    </div>
  );
}
