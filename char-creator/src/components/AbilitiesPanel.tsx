import { useState, useMemo } from 'react';
import { useCharacter } from '../hooks/useCharacter';
import { useCalculations } from '../hooks/useCalculations';
import { Ability } from '../types/ability';
import {
  parseAffinityReqByRank,
  getAffinityReqForRank,
  meetsAffinityReq,
} from '../types/ability';
import { Search, X, Plus, Trash2 } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

export default function AbilitiesPanel() {
  const { character, addAbility, updateAbility, removeAbility } = useCharacter();
  const { abilityDatabase, abilityCosts } = useCalculations();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(abilityDatabase.map(a => a.category));
    return ['all', ...Array.from(cats).sort()];
  }, [abilityDatabase]);

  // Filter abilities
  const filteredAbilities = useMemo(() => {
    return abilityDatabase.filter(ability => {
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (
          !ability.name.toLowerCase().includes(term) &&
          !ability.description.toLowerCase().includes(term) &&
          !ability.rulesText.toLowerCase().includes(term)
        ) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && ability.category !== selectedCategory) {
        return false;
      }

      // Affinity filter - for multi-rank abilities, check if ANY rank is available
      if (showOnlyAvailable) {
        const reqs = parseAffinityReqByRank(ability.affinityReq);
        const canTakeAnyRank = reqs.some(req =>
          meetsAffinityReq(character.affinities, req)
        );
        if (!canTakeAnyRank) {
          return false;
        }
      }

      return true;
    });
  }, [abilityDatabase, searchTerm, selectedCategory, showOnlyAvailable, character.affinities]);

  const handleAddAbilityAtRank = (ability: Ability, rank: number) => {
    // Check if already added
    if (character.abilities.some(a => a.name === ability.name)) {
      alert('Ability already added!');
      return;
    }

    addAbility({ name: ability.name, rank });
  };

  // Helper to get dominant affinity color for border
  const getDominantAffinityColor = (reqs: ReturnType<typeof parseAffinityReqByRank>[0]): string => {
    if (!reqs.requirements || reqs.requirements.length === 0) return '#4A5F7A'; // neutral

    const colorMap: Record<string, string> = {
      w: '#FFF8DC',
      u: '#4A90E2',
      b: '#8BA3B8',
      r: '#E74C3C',
      g: '#27AE60',
    };

    // If single color
    if (reqs.requirements.length === 1) {
      const firstColor = reqs.requirements[0].colors[0]?.toLowerCase();
      return colorMap[firstColor] || '#4A5F7A';
    }

    // If two colors (OR or AND), use gradient
    if (reqs.requirements.length === 2) {
      return '#FFB800'; // Gold for multi-color
    }

    // Three+ colors: gold
    return '#FFB800';
  };

  const renderAbilityCard = (ability: Ability) => {
    const isAdded = character.abilities.some((a) => a.name === ability.name);
    const isMultiRank = Array.isArray(ability.bpCost);

    // For determining card background color, check if ANY rank can be taken
    // Defensive: handle empty/undefined affinityReq
    let reqs: ReturnType<typeof parseAffinityReqByRank> = [{ requirements: [], total: 0 }];
    try {
      reqs = parseAffinityReqByRank(ability.affinityReq || '');
    } catch (e) {
      console.error('Error parsing affinity requirements for', ability.name, e);
    }
    const canTakeAnyRank = reqs.some((req) =>
      meetsAffinityReq(character.affinities, req)
    );

    // Get border/accent color based on affinity requirements
    const accentColor = getDominantAffinityColor(reqs[0]);

    return (
      <div
        key={ability.name}
        className={`relative rounded-xl overflow-hidden transition-all duration-300 group ${
          isAdded
            ? 'ring-2 ring-cyan-electric shadow-glow-cyan-md'
            : canTakeAnyRank
              ? 'hover:shadow-panel-hover hover:-translate-y-1'
              : 'opacity-70'
        }`}
        style={{
          background: 'linear-gradient(135deg, #1A2942 0%, #0A1628 100%)',
        }}
      >
        {/* Constellation pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'url(/constellation-pattern.svg)',
            backgroundSize: '200px 200px',
          }}
        />

        {/* Left accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{
            background: accentColor,
            boxShadow: `0 0 8px ${accentColor}`,
          }}
        />

        {/* Card content */}
        <div className="relative z-10 p-5 border-2 border-navy-light rounded-xl" style={{ borderLeftColor: accentColor }}>
          {/* Header: Name + Affinity Costs */}
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-bold text-lg text-cosmic-white flex-1">{ability.name}</h4>

            {/* Affinity cost circles (MTG-style mana symbols) */}
            {ability.affinityReq && ability.affinityReq.trim() && (
              <div className="flex gap-1">
                {reqs[0].requirements?.map((req, idx) => {
                  const colorMap: Record<string, string> = {
                    w: '#FFF8DC',
                    u: '#4A90E2',
                    b: '#8BA3B8',
                    r: '#E74C3C',
                    g: '#27AE60',
                  };
                  const symbolMap: Record<string, string> = {
                    w: 'W',
                    u: 'U',
                    b: 'B',
                    r: 'R',
                    g: 'G',
                  };
                  const colorId = req.colors[0]?.toLowerCase();
                  return (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2"
                      style={{
                        backgroundColor: colorMap[colorId] || '#4A5F7A',
                        borderColor: '#2A3F5F',
                        color: colorId === 'b' ? '#E8F4F8' : '#0A1628',
                      }}
                      title={`${symbolMap[colorId]}: ${req.amount}`}
                    >
                      {req.amount}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Category + BP Cost */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-navy-deep border border-cyan-electric text-cyan-bright">
              {ability.category}
            </span>
            <span className="text-sm font-mono font-semibold text-cosmic-grey">
              {isMultiRank
                ? `${(ability.bpCost as number[]).join('/')} BP`
                : `${ability.bpCost as number} BP`}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-cosmic-white leading-relaxed mb-3">
            {ability.description}
          </p>

          {/* Rules Text (if present) */}
          {ability.rulesText && (
            <div className="p-3 bg-navy-deep rounded-lg border border-navy-light mb-4">
              <p className="text-xs text-cosmic-grey italic leading-relaxed">
                {ability.rulesText}
              </p>
            </div>
          )}

          {/* Multi-rank requirements (if applicable) */}
          {isMultiRank && reqs.length > 1 && (
            <div className="mb-4 space-y-2">
              {reqs.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-cyan-bright">Rank {idx + 1}:</span>
                  <div className="flex gap-1">
                    {req.requirements?.map((r, i) => (
                      <span key={i} className="text-cosmic-grey">
                        {r.colors.map(c => c.toUpperCase()).join('|')}:{r.amount}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Buttons */}
          {!isAdded && (
            <div className="flex gap-2 mt-4">
              {isMultiRank ? (
                (ability.bpCost as number[]).map((_cost, idx) => {
                  const rankReq = getAffinityReqForRank(ability.affinityReq || '', idx);
                  const meetsReq = meetsAffinityReq(character.affinities, rankReq);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAddAbilityAtRank(ability, idx)}
                      disabled={!meetsReq}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        meetsReq
                          ? 'bg-cyan-electric text-navy-deep hover:bg-cyan-bright hover:shadow-glow-cyan-sm'
                          : 'bg-navy-light text-cosmic-dim cursor-not-allowed opacity-50'
                      }`}
                    >
                      Rank {idx + 1}
                    </button>
                  );
                })
              ) : (
                <button
                  onClick={() => handleAddAbilityAtRank(ability, 0)}
                  disabled={!canTakeAnyRank}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    canTakeAnyRank
                      ? 'bg-cyan-electric text-navy-deep hover:bg-cyan-bright hover:shadow-glow-cyan-sm'
                      : 'bg-navy-light text-cosmic-dim cursor-not-allowed opacity-50'
                  }`}
                >
                  <Plus size={16} />
                  Add Ability
                </button>
              )}
            </div>
          )}

          {/* Selected indicator */}
          {isAdded && (
            <div className="mt-4 flex items-center gap-2 text-cyan-bright font-semibold text-sm">
              <div className="w-2 h-2 rounded-full bg-cyan-electric animate-pulse-glow" />
              Selected
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary fallbackMessage="There was an error loading the abilities. Please try refreshing the page or report this issue if it persists.">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Filters (1 column) */}
      <div className="lg:col-span-1 space-y-4">
        <div className="panel">
          <h3 className="font-bold text-lg mb-4 text-cosmic-white">Filters</h3>

          {/* Search */}
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-cosmic-grey"
              size={16}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search abilities..."
              className="w-full pl-9 pr-3 py-2 input-standard"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cosmic-grey hover:text-cyan-electric transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-cosmic-white">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full input-standard"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Toggle */}
          <label className="flex items-center gap-2 mt-4 cursor-pointer group">
            <input
              type="checkbox"
              checked={showOnlyAvailable}
              onChange={(e) => setShowOnlyAvailable(e.target.checked)}
              className="rounded bg-navy-deep border-navy-light checked:bg-cyan-electric checked:border-cyan-electric"
            />
            <span className="text-sm text-cosmic-white group-hover:text-cyan-bright transition-colors">
              Show only available
            </span>
          </label>
        </div>

        {/* Selected Abilities Summary */}
        <div className="panel">
          <h3 className="font-bold text-lg mb-4 text-cosmic-white">Selected</h3>
          <div className="text-4xl font-bold text-center py-6 text-cyan-bright">
            {character.abilities.length}
          </div>
          <div className="text-sm text-cosmic-grey text-center font-semibold">
            {abilityCosts} BP Total
          </div>
        </div>
      </div>

      {/* Main Content (3 columns) */}
      <div className="lg:col-span-3 space-y-6">
        {/* Selected Abilities List */}
        {character.abilities.length > 0 && (
          <div className="panel">
            <h3 className="font-bold text-xl mb-4 text-cosmic-white">
              Your Abilities <span className="text-cyan-bright">({character.abilities.length})</span>
            </h3>
            <div className="space-y-3">
              {character.abilities.map((charAbility) => {
                const abilityDef = abilityDatabase.find(
                  (a) => a.name === charAbility.name
                );
                if (!abilityDef) return null;

                const isMultiRank = Array.isArray(abilityDef.bpCost);
                const bpCost = isMultiRank
                  ? (abilityDef.bpCost as number[])[charAbility.rank] || 0
                  : (abilityDef.bpCost as number);

                return (
                  <div
                    key={charAbility.name}
                    className="flex items-center justify-between p-4 bg-navy-deep rounded-lg border-2 border-cyan-electric hover:shadow-glow-cyan-sm transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-2 h-2 rounded-full bg-cyan-electric animate-pulse-glow" />
                      <span className="font-semibold text-cosmic-white">{charAbility.name}</span>

                      {isMultiRank && (
                        <select
                          value={charAbility.rank}
                          onChange={(e) =>
                            updateAbility(charAbility.name, parseInt(e.target.value))
                          }
                          className="px-3 py-1 text-sm rounded-lg input-standard font-semibold"
                        >
                          {(abilityDef.bpCost as number[]).map((cost, idx) => {
                            const rankReq = abilityDef.affinityReq
                              ? getAffinityReqForRank(abilityDef.affinityReq, idx)
                              : { requirements: [], total: 0 };
                            const meetsReq = meetsAffinityReq(
                              character.affinities,
                              rankReq
                            );
                            return (
                              <option key={idx} value={idx} disabled={!meetsReq}>
                                Rank {idx + 1} ({cost} BP)
                                {!meetsReq && ' - Need affinity'}
                              </option>
                            );
                          })}
                        </select>
                      )}

                      <span className="text-sm text-cosmic-grey">
                        {abilityDef.category}
                      </span>
                      <span className="text-sm font-bold text-cyan-bright ml-auto">{bpCost} BP</span>
                    </div>
                    <button
                      onClick={() => removeAbility(charAbility.name)}
                      className="p-2 hover:bg-error hover:bg-opacity-20 rounded-lg transition-all ml-3"
                      title="Remove ability"
                    >
                      <Trash2 size={18} className="text-error" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Ability Cards Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredAbilities.length === 0 ? (
            <div className="col-span-2 text-center py-16 panel">
              <p className="text-xl text-cosmic-grey font-semibold">
                No abilities found matching your criteria
              </p>
              <p className="text-sm text-cosmic-dim mt-2">
                Try adjusting your filters or search term
              </p>
            </div>
          ) : (
            filteredAbilities.map(renderAbilityCard)
          )}
        </div>

        <div className="text-sm text-cosmic-grey text-center font-semibold">
          Showing <span className="text-cyan-bright">{filteredAbilities.length}</span> of <span className="text-cyan-bright">{abilityDatabase.length}</span> abilities
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
