import { useState, useRef, useEffect } from 'react';

interface SnapSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label: string;
  cost?: number; // BP cost to display
  showCost?: boolean;
  disabled?: boolean;
}

export default function SnapSlider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  cost,
  showCost = false,
  disabled = false,
}: SnapSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    onChange(newValue);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleValueClick = () => {
    setShowInput(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue));
      onChange(clampedValue);
      setInputValue(clampedValue.toString());
    } else {
      setInputValue(value.toString());
    }
    setShowInput(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    } else if (e.key === 'Escape') {
      setInputValue(value.toString());
      setShowInput(false);
    }
  };


  // Calculate percentage for visual fill
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      {/* Label and Value */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-cosmic-white">{label}</label>
        <div className="flex items-center gap-2">
          {showInput ? (
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              min={min}
              max={max}
              className="w-16 px-2 py-1 text-center input-standard text-lg font-bold"
              autoFocus
            />
          ) : (
            <button
              onClick={handleValueClick}
              disabled={disabled}
              className="text-2xl font-bold text-cyan-bright hover:text-cyan-electric transition-colors min-w-[3rem] text-center"
            >
              {value}
            </button>
          )}
          {showCost && cost !== undefined && (
            <span className="text-sm font-semibold text-cosmic-grey">
              ({cost} BP)
            </span>
          )}
        </div>
      </div>

      {/* Slider Track */}
      <div className="relative pt-2 pb-1" ref={sliderRef}>
        {/* Background track with constellation */}
        <div className="relative h-3 rounded-full overflow-hidden bg-navy-deep border-2 border-navy-light">
          {/* Constellation pattern */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'url(/constellation-pattern.svg)',
              backgroundSize: '100px 100px',
            }}
          />

          {/* Filled portion */}
          <div
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-cyan-muted to-cyan-electric transition-all duration-200"
            style={{
              width: `${percentage}%`,
              boxShadow: isDragging ? '0 0 12px rgba(0, 229, 255, 0.6)' : '0 0 6px rgba(0, 229, 255, 0.3)',
            }}
          />

          {/* Snap point indicators */}
          <div className="absolute inset-0 flex items-center justify-between px-1">
            {Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => {
              const snapValue = min + i * step;
              const snapPercentage = ((snapValue - min) / (max - min)) * 100;
              return (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full bg-cosmic-dim opacity-40"
                  style={{
                    position: 'absolute',
                    left: `${snapPercentage}%`,
                    transform: 'translateX(-50%)',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Invisible input for slider functionality */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          disabled={disabled}
          className="absolute top-0 left-0 w-full h-8 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          style={{ zIndex: 10 }}
        />

        {/* Custom handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-cyan-electric border-3 border-navy-mid shadow-glow-cyan-md transition-all pointer-events-none"
          style={{
            left: `${percentage}%`,
            transform: `translate(-50%, -50%) scale(${isDragging ? 1.2 : 1})`,
            boxShadow: isDragging
              ? '0 0 20px rgba(0, 229, 255, 0.8)'
              : '0 0 10px rgba(0, 229, 255, 0.5)',
          }}
        />
      </div>

    </div>
  );
}
