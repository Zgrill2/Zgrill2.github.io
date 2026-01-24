import { useState } from 'react';
import { useCharacterContext } from '../context/CharacterContext';
import { useCalculations } from '../hooks/useCalculations';
import { ChevronUp, Heart, Shield, Sparkles, Coins } from 'lucide-react';
import StatsPanel from './StatsPanel';

export default function StickyStatsSummary() {
  const [expanded, setExpanded] = useState(false);
  const { character } = useCharacterContext();
  const { healthPools, defenseStats, bpSpent, isOverBudget } = useCalculations();

  const hp = healthPools.hp;
  const dodgeActive = defenseStats.dodgeActive;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-navy-mid border-t-4 border-cyan-electric shadow-glow-cyan-lg z-50 no-print constellation-border">
      {/* Collapsed Summary Bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-navy-light transition-all relative z-10"
      >
        <div className="flex items-center gap-6">
          <div className="stat-chip border-error" style={{ borderColor: '#E74C3C' }}>
            <Heart size={18} style={{ color: '#E74C3C' }} />
            <span className="text-lg font-bold">HP: {hp}</span>
          </div>
          <div className="stat-chip border-success">
            <Shield size={18} className="text-success" />
            <span className="text-lg font-bold">Dodge: {dodgeActive}</span>
          </div>
          <div className="stat-chip border-affinity-blue" style={{ borderColor: '#4A90E2' }}>
            <Sparkles size={18} style={{ color: '#4A90E2' }} />
            <span className="text-lg font-bold">Tradition {character.tradition}</span>
          </div>
          <div
            className={`stat-chip ${
              isOverBudget
                ? 'border-error bg-error bg-opacity-20'
                : 'border-success bg-success bg-opacity-20'
            }`}
          >
            <Coins size={18} className={isOverBudget ? 'text-error' : 'text-success'} />
            <span className="text-lg font-bold">
              {bpSpent} / {character.bpBudget} BP
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-cosmic-grey font-semibold">
            {expanded ? 'Hide Details' : 'Show Details'}
          </span>
          <ChevronUp
            className={`transition-transform text-cyan-bright ${expanded ? 'rotate-180' : ''}`}
            size={24}
          />
        </div>
      </button>

      {/* Expanded Stats Grid */}
      {expanded && (
        <div className="border-t-2 border-navy-light p-6 max-h-[70vh] overflow-y-auto bg-navy-deep">
          <StatsPanel />
        </div>
      )}
    </div>
  );
}
