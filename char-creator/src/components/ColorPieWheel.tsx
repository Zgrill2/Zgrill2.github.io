import { useCharacter } from '../hooks/useCharacter';
import { useCalculations } from '../hooks/useCalculations';

interface ColorSegment {
  id: 'w' | 'u' | 'b' | 'r' | 'g';
  name: string;
  displayName: string;
  color: string;
  angle: number; // Degrees from top, going clockwise
}

const COLOR_SEGMENTS: ColorSegment[] = [
  { id: 'w', name: 'White', displayName: 'W', color: '#FFF8DC', angle: -90 }, // Top
  { id: 'u', name: 'Blue', displayName: 'U', color: '#4A90E2', angle: -18 }, // Top-right
  { id: 'b', name: 'Black', displayName: 'B', color: '#A9A9A9', angle: 54 }, // Bottom-right
  { id: 'r', name: 'Red', displayName: 'R', color: '#E74C3C', angle: 126 }, // Bottom-left
  { id: 'g', name: 'Green', displayName: 'G', color: '#27AE60', angle: 198 }, // Top-left
];

export default function ColorPieWheel() {
  const { character, setAffinity } = useCharacter();
  const { affinityPoints } = useCalculations();

  const totalAllocated = Object.values(character.affinities).reduce((sum, val) => sum + val, 0);
  const pointsRemaining = affinityPoints - totalAllocated;

  const handleIncrement = (colorId: ColorSegment['id']) => {
    if (pointsRemaining > 0) {
      const currentValue = character.affinities[colorId] || 0;
      setAffinity(colorId, currentValue + 1);
    }
  };

  const handleDecrement = (colorId: ColorSegment['id']) => {
    const currentValue = character.affinities[colorId] || 0;
    if (currentValue > 0) {
      setAffinity(colorId, currentValue - 1);
    }
  };

  // Calculate position for each segment label
  const getSegmentPosition = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: 200 + radius * Math.cos(rad),
      y: 200 + radius * Math.sin(rad),
    };
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Color Pie Wheel SVG */}
      <div className="relative">
        <svg
          width="400"
          height="400"
          viewBox="0 0 400 400"
          className="drop-shadow-lg"
        >
          {/* Background circle with constellation pattern */}
          <defs>
            <pattern
              id="wheel-constellation"
              x="0"
              y="0"
              width="200"
              height="200"
              patternUnits="userSpaceOnUse"
            >
              <image
                href="/constellation-pattern.svg"
                x="0"
                y="0"
                width="200"
                height="200"
              />
            </pattern>

            {/* Radial gradient for depth */}
            <radialGradient id="wheel-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1A2942" stopOpacity="1" />
              <stop offset="100%" stopColor="#0A1628" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx="200"
            cy="200"
            r="180"
            fill="url(#wheel-bg)"
            stroke="#2A3F5F"
            strokeWidth="3"
          />

          {/* Constellation overlay */}
          <circle
            cx="200"
            cy="200"
            r="180"
            fill="url(#wheel-constellation)"
            opacity="0.1"
          />

          {/* Pentagon shape connecting the 5 colors - outline */}
          <polygon
            points={COLOR_SEGMENTS.map((seg) => {
              const pos = getSegmentPosition(seg.angle, 140);
              return `${pos.x},${pos.y}`;
            }).join(' ')}
            fill="none"
            stroke="#00E5FF"
            strokeWidth="2"
            opacity="0.3"
          />

          {/* Filled pentagon areas for each color segment */}
          {COLOR_SEGMENTS.map((segment, idx) => {
            const value = character.affinities[segment.id] || 0;
            if (value === 0) return null;

            const intensity = value / 10; // Max 10 points per color
            const nextIdx = (idx + 1) % COLOR_SEGMENTS.length;
            const nextSegment = COLOR_SEGMENTS[nextIdx];

            // Calculate positions for the triangle from center
            const pos1 = getSegmentPosition(segment.angle, 140 * intensity);
            const pos2 = getSegmentPosition(nextSegment.angle, 140 * intensity);

            // Create a filled area from center to the two adjacent vertices
            const pathData = `M 200 200 L ${pos1.x} ${pos1.y} L ${pos2.x} ${pos2.y} Z`;

            // Create gradient ID for this segment
            const gradientId = `gradient-${segment.id}`;

            return (
              <g key={segment.id}>
                <defs>
                  <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={segment.color} stopOpacity="0.05" />
                    <stop offset="100%" stopColor={segment.color} stopOpacity={0.2 + intensity * 0.3} />
                  </radialGradient>
                </defs>
                <path
                  d={pathData}
                  fill={`url(#${gradientId})`}
                  className="transition-all duration-300"
                />
              </g>
            );
          })}

          {/* Lines from center to each point */}
          {COLOR_SEGMENTS.map((segment) => {
            const pos = getSegmentPosition(segment.angle, 140);
            const value = character.affinities[segment.id] || 0;
            const intensity = value / 10; // Max 10 points per color

            return (
              <g key={segment.id}>
                {/* Line from center */}
                <line
                  x1="200"
                  y1="200"
                  x2={pos.x}
                  y2={pos.y}
                  stroke={segment.color}
                  strokeWidth="2"
                  opacity={0.2 + intensity * 0.5}
                />

                {/* Filled segment (pie slice) based on allocation */}
                {value > 0 && (
                  <path
                    d={`M 200 200 L ${pos.x} ${pos.y} A 140 140 0 0 1 ${pos.x} ${pos.y} Z`}
                    fill={segment.color}
                    opacity={0.1 + intensity * 0.3}
                  />
                )}

                {/* Color circle at point */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={15 + value * 2}
                  fill={segment.color}
                  stroke={value > 0 ? '#00E5FF' : '#4A5F7A'}
                  strokeWidth="2"
                  opacity={0.8}
                  className="transition-all duration-300"
                  style={{
                    filter: value > 0 ? `drop-shadow(0 0 ${5 + value * 2}px ${segment.color})` : 'none',
                  }}
                />

                {/* Display symbol (W, U, B, R, G) */}
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={segment.id === 'b' ? '#E8F4F8' : '#0A1628'}
                  fontSize="16"
                  fontWeight="bold"
                  className="pointer-events-none select-none"
                >
                  {segment.displayName}
                </text>
              </g>
            );
          })}

          {/* Center circle showing remaining points */}
          <circle
            cx="200"
            cy="200"
            r="60"
            fill="#1A2942"
            stroke="#00E5FF"
            strokeWidth="3"
            opacity="0.9"
          />

          {/* Remaining points text */}
          <text
            x="200"
            y="190"
            textAnchor="middle"
            fill="#8BA3B8"
            fontSize="14"
            fontWeight="600"
            className="select-none"
          >
            Affinity Points
          </text>
          <text
            x="200"
            y="215"
            textAnchor="middle"
            fill={pointsRemaining === 0 ? '#00FFB8' : '#00E5FF'}
            fontSize="28"
            fontWeight="bold"
            className="select-none"
          >
            {pointsRemaining}/{affinityPoints}
          </text>
        </svg>
      </div>

      {/* Color controls below the wheel */}
      <div className="grid grid-cols-5 gap-4 w-full max-w-2xl">
        {COLOR_SEGMENTS.map((segment) => {
          const value = character.affinities[segment.id] || 0;
          return (
            <div
              key={segment.id}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-navy-mid border-2 border-navy-light hover:border-cyan-electric transition-all"
              style={{
                borderColor: value > 0 ? segment.color : undefined,
              }}
            >
              {/* Color name */}
              <div
                className="text-sm font-semibold"
                style={{ color: segment.color }}
              >
                {segment.name}
              </div>

              {/* Current value */}
              <div className="text-2xl font-bold text-cosmic-white">
                {value}
              </div>

              {/* Increment/Decrement buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDecrement(segment.id)}
                  disabled={value === 0}
                  className="w-8 h-8 rounded-lg bg-navy-light text-cosmic-white font-bold hover:bg-error hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title={`Decrease ${segment.name}`}
                >
                  −
                </button>
                <button
                  onClick={() => handleIncrement(segment.id)}
                  disabled={pointsRemaining === 0}
                  className="w-8 h-8 rounded-lg bg-cyan-electric text-navy-deep font-bold hover:bg-cyan-bright hover:shadow-glow-cyan-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                  title={`Increase ${segment.name}`}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Helper text */}
      <p className="text-sm text-cosmic-grey text-center max-w-lg">
        Click the <span className="text-cyan-bright font-semibold">+</span> buttons to allocate affinity points to each color.
        Your affinity determines which abilities you can learn.
      </p>
    </div>
  );
}
