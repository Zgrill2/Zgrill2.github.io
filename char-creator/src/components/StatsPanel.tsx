import { useCalculations } from '../hooks/useCalculations';

export default function StatsPanel() {
  const { healthPools, defenseStats, resistStats, soakStats } = useCalculations();

  const StatDisplay = ({
    label,
    value,
    suffix = '',
    color = '#00E5FF',
    maxValue = 100,
    showBar = false,
  }: {
    label: string;
    value: number;
    suffix?: string;
    color?: string;
    maxValue?: number;
    showBar?: boolean;
  }) => (
    <div className="py-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-cosmic-white">{label}</span>
        <span className="text-xl font-bold text-cyan-bright">
          {value}
          {suffix}
        </span>
      </div>
      {showBar && (
        <div className="h-2 rounded-full bg-navy-deep border border-navy-light overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${Math.min((value / maxValue) * 100, 100)}%`,
              background: `linear-gradient(to right, ${color}80, ${color})`,
              boxShadow: `0 0 8px ${color}`,
            }}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Character Stats</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Health Pools */}
        <div className="bg-navy-deep p-4 rounded-lg border-2 border-cyan-electric">
          <h3 className="text-sm font-bold text-cyan-bright uppercase mb-4 pb-2 border-b-2 border-cyan-electric tracking-wider">
            Health Pools
          </h3>
          <div className="space-y-2">
            <StatDisplay label="HP" value={healthPools.hp} color="#E74C3C" maxValue={50} showBar />
            <StatDisplay label="Stamina" value={healthPools.stam} color="#FFB800" maxValue={50} showBar />
            <StatDisplay label="Drain" value={healthPools.drain} color="#4A90E2" maxValue={50} showBar />
            <StatDisplay label="Luck" value={healthPools.luk} color="#27AE60" />
          </div>
        </div>

        {/* Defense Stats */}
        <div className="bg-navy-deep p-4 rounded-lg border-2 border-success">
          <h3 className="text-sm font-bold text-success uppercase mb-4 pb-2 border-b-2 border-success tracking-wider">
            Defense
          </h3>
          <div className="space-y-2">
            <StatDisplay label="Dodge (Passive)" value={defenseStats.dodgePassive} color="#00FFB8" />
            <StatDisplay label="Dodge (Active)" value={defenseStats.dodgeActive} color="#00FFB8" />
          </div>
        </div>

        {/* Resist Stats */}
        <div className="bg-navy-deep p-4 rounded-lg border-2 border-affinity-blue">
          <h3 className="text-sm font-bold uppercase mb-4 pb-2 border-b-2 tracking-wider" style={{ color: '#4A90E2', borderColor: '#4A90E2' }}>
            Resist
          </h3>
          <div className="space-y-2">
            <StatDisplay label="Physical Resist" value={resistStats.physical} color="#4A90E2" />
            <StatDisplay label="Mental Resist" value={resistStats.mental} color="#4A90E2" />
            <StatDisplay label="DV Threshold" value={resistStats.dvThreshold} color="#4A90E2" />
          </div>
        </div>

        {/* Soak Stats */}
        <div className="bg-navy-deep p-4 rounded-lg border-2 border-warning">
          <h3 className="text-sm font-bold text-warning uppercase mb-4 pb-2 border-b-2 border-warning tracking-wider">
            Soak
          </h3>
          <div className="space-y-2">
            <StatDisplay label="Armor Soak" value={soakStats.armor} color="#FFB800" />
            <StatDisplay label="Physical Soak" value={soakStats.physical} color="#FFB800" />
            <StatDisplay label="Mental Soak" value={soakStats.mental} color="#FFB800" />
            <StatDisplay label="Drain Soak" value={soakStats.drain} color="#FFB800" />
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-cosmic-grey bg-navy-deep p-5 rounded-lg border-2 border-navy-light space-y-2">
        <h4 className="font-bold text-cosmic-white mb-3 text-center">Calculation Formulas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-cyan-bright font-semibold">HP:</span> 16 + BOD
          </div>
          <div>
            <span className="text-cyan-bright font-semibold">STAM:</span> 16 + WIL
          </div>
          <div>
            <span className="text-cyan-bright font-semibold">DRAIN:</span> 16 + Cast Stat
          </div>
          <div>
            <span className="text-cyan-bright font-semibold">Dodge:</span> INT + REA (+ skill + Min(skill, ⌈tradition/2⌉) for active)
          </div>
          <div>
            <span className="text-cyan-bright font-semibold">Physical Resist:</span> BOD + AGI
          </div>
          <div>
            <span className="text-cyan-bright font-semibold">Mental Resist:</span> WIL + CHA
          </div>
          <div>
            <span className="text-cyan-bright font-semibold">Armor Soak:</span> BOD + ⌊LOG/2⌋
          </div>
          <div>
            <span className="text-cyan-bright font-semibold">Physical Soak:</span> STR + ⌊AGI/2⌋
          </div>
          <div>
            <span className="text-cyan-bright font-semibold">Mental Soak:</span> WIL + ⌊CHA/2⌋
          </div>
          <div>
            <span className="text-cyan-bright font-semibold">Drain Soak:</span> 2×WIL
          </div>
        </div>
      </div>
    </div>
  );
}
