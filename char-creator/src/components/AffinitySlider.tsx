import { useState, useRef, useEffect, useCallback } from 'react';

interface AffinitySliderProps {
  color: 'w' | 'u' | 'b' | 'r' | 'g';
  value: number;
  maxValue: number;
  onChange: (value: number) => void;
  label: string;
}

const AFFINITY_CONFIG = {
  w: {
    label: 'White',
    classes: 'bg-yellow-50 border-yellow-600 text-yellow-900',
    glow: 'rgba(217, 119, 6, 0.5)',
    track: 'from-yellow-100 to-yellow-300',
    dot: 'bg-yellow-600',
  },
  u: {
    label: 'Blue',
    classes: 'bg-blue-50 border-blue-600 text-blue-900',
    glow: 'rgba(59, 130, 246, 0.5)',
    track: 'from-blue-100 to-blue-400',
    dot: 'bg-blue-600',
  },
  b: {
    label: 'Black',
    classes: 'bg-gray-800 border-gray-600 text-white',
    glow: 'rgba(75, 85, 99, 0.5)',
    track: 'from-gray-600 to-gray-800',
    dot: 'bg-gray-800',
  },
  r: {
    label: 'Red',
    classes: 'bg-red-50 border-red-600 text-red-900',
    glow: 'rgba(220, 38, 38, 0.5)',
    track: 'from-red-100 to-red-400',
    dot: 'bg-red-600',
  },
  g: {
    label: 'Green',
    classes: 'bg-green-50 border-green-600 text-green-900',
    glow: 'rgba(16, 185, 129, 0.5)',
    track: 'from-green-100 to-green-400',
    dot: 'bg-green-600',
  },
};

const MAX_SCALE = 30; // Max possible affinity (tradition 10 × 3)

export default function AffinitySlider({
  color,
  value,
  maxValue,
  onChange,
}: AffinitySliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const config = AFFINITY_CONFIG[color];

  const handleMove = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const rawValue = Math.round(percentage * MAX_SCALE);
      const clampedValue = Math.max(0, Math.min(maxValue, rawValue));

      onChange(clampedValue);
    },
    [maxValue, onChange]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMove]);

  const valuePercentage = (value / MAX_SCALE) * 100;
  const maxPercentage = (maxValue / MAX_SCALE) * 100;

  return (
    <div className="flex items-center gap-3">
      {/* Color Badge */}
      <div
        className={`w-24 h-10 rounded-lg border-2 flex items-center justify-center font-bold text-xs uppercase tracking-wider ${config.classes}`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${config.dot}`} />
          {config.label}
        </div>
      </div>

      {/* Slider Track */}
      <div
        ref={trackRef}
        className={`relative flex-1 h-10 rounded-xl border-2 cursor-pointer ${
          isDragging ? 'ring-4 ring-opacity-30' : ''
        }`}
        style={{
          backgroundColor: config.classes.split(' ')[0].replace('bg-', ''),
          borderColor: config.classes.split(' ')[1].replace('border-', ''),
          boxShadow: isDragging ? `0 0 20px ${config.glow}` : undefined,
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Filled Track */}
        <div
          className={`absolute left-0 top-0 h-full rounded-l-xl bg-gradient-to-r ${config.track} transition-all duration-200`}
          style={{
            width: `${valuePercentage}%`,
            boxShadow: `0 0 15px ${config.glow}`,
          }}
        />

        {/* Unavailable Portion (Gray Stripes) */}
        {maxValue < MAX_SCALE && (
          <div
            className="absolute top-0 h-full bg-gray-200 bg-opacity-50 pointer-events-none"
            style={{
              left: `${maxPercentage}%`,
              width: `${100 - maxPercentage}%`,
              background: `repeating-linear-gradient(45deg, rgba(0,0,0,0.05), rgba(0,0,0,0.05) 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 16px)`,
              borderRadius:
                maxPercentage > 95 ? '0 0.75rem 0.75rem 0' : '0',
            }}
          />
        )}

        {/* Thumb */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-3 cursor-grab active:cursor-grabbing transition-transform ${
            isDragging ? 'scale-110' : 'hover:scale-110'
          }`}
          style={{
            left: `calc(${valuePercentage}% - 12px)`,
            borderColor: config.classes.split(' ')[1].replace('border-', ''),
            borderWidth: '3px',
            boxShadow: isDragging
              ? `0 0 20px ${config.glow}, 0 2px 8px rgba(0,0,0,0.3)`
              : '0 2px 8px rgba(0,0,0,0.2)',
          }}
        />

        {/* Scale Marks (every 5 points) */}
        <div className="absolute inset-0 pointer-events-none">
          {[5, 10, 15, 20, 25].map((mark) => (
            <div
              key={mark}
              className="absolute top-0 bottom-0 w-px bg-gray-300 opacity-30"
              style={{ left: `${(mark / MAX_SCALE) * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* Number Input */}
      <input
        type="number"
        min="0"
        max={maxValue}
        value={value}
        onChange={(e) => {
          const val = parseInt(e.target.value) || 0;
          onChange(Math.max(0, Math.min(maxValue, val)));
        }}
        className="w-16 px-2 py-1 border-2 rounded-lg text-center font-mono font-bold input-standard"
        style={{
          borderColor: config.classes.split(' ')[1].replace('border-', ''),
        }}
      />
    </div>
  );
}
