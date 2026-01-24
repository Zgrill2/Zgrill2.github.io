import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

const MODES = [
  { id: 'light', name: 'Light', icon: Sun },
  { id: 'dark', name: 'Dark', icon: Moon },
  { id: 'system', name: 'System', icon: Monitor },
] as const;

export default function ThemeSwitcher() {
  const { mode, setMode } = useTheme();

  return (
    <div className="relative group">
      {/* Toggle Button - shows current mode icon */}
      <button className="btn-secondary">
        {mode === 'light' && <Sun size={16} />}
        {mode === 'dark' && <Moon size={16} />}
        {mode === 'system' && <Monitor size={16} />}
        <span className="hidden sm:inline">Mode</span>
      </button>

      {/* Dropdown Panel */}
      <div className="absolute right-0 top-full mt-2 w-48 bg-navy-mid rounded-xl shadow-glow-cyan-md border-2 border-cyan-electric opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] constellation-border">
        <div className="p-4">
          <label className="text-xs font-bold text-cosmic-grey uppercase tracking-wider mb-3 block">
            Display Mode
          </label>
          <div className="space-y-2">
            {MODES.map((m) => {
              const Icon = m.icon;
              const isActive = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-cyan-electric text-navy-deep shadow-glow-cyan-sm'
                      : 'hover:bg-navy-light text-cosmic-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
