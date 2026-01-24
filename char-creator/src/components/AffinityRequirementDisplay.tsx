import { AffinityRequirement } from '../types/ability';
import { Fragment } from 'react';

interface Props {
  requirements: AffinityRequirement;
  meets: boolean;
}

const COLOR_CONFIG = {
  W: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-600',
    text: 'text-yellow-900',
    dot: 'bg-yellow-600',
  },
  U: {
    bg: 'bg-blue-100',
    border: 'border-blue-600',
    text: 'text-blue-900',
    dot: 'bg-blue-600',
  },
  B: {
    bg: 'bg-gray-700',
    border: 'border-gray-600',
    text: 'text-white',
    dot: 'bg-gray-800',
  },
  R: {
    bg: 'bg-red-100',
    border: 'border-red-600',
    text: 'text-red-900',
    dot: 'bg-red-600',
  },
  G: {
    bg: 'bg-green-100',
    border: 'border-green-600',
    text: 'text-green-900',
    dot: 'bg-green-600',
  },
};

export default function AffinityRequirementDisplay({ requirements, meets }: Props) {
  if (requirements.requirements.length === 0 && requirements.total === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-medium text-gray-600">Requires:</span>

      {requirements.requirements.map((req, idx) => {
        const colorKeys = req.colors as Array<keyof typeof COLOR_CONFIG>;
        const firstColor = COLOR_CONFIG[colorKeys[0]];

        return (
          <div
            key={idx}
            className={`
              inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border-2
              ${firstColor.bg} ${firstColor.border} ${firstColor.text}
              ${meets ? 'opacity-100' : 'opacity-50 grayscale'}
              transition-all duration-200
            `}
          >
            {req.isOr ? (
              // OR requirement: show multiple color dots with "or" between them
              <div className="flex items-center gap-1">
                {colorKeys.map((color, i) => (
                  <Fragment key={i}>
                    {i > 0 && (
                      <span className="text-[10px] text-gray-500 font-normal">or</span>
                    )}
                    <div
                      className={`w-3 h-3 rounded-full ${COLOR_CONFIG[color].dot} shadow-sm`}
                    />
                  </Fragment>
                ))}
              </div>
            ) : (
              // Single color
              <div className={`w-3 h-3 rounded-full ${firstColor.dot} shadow-sm`} />
            )}
            <span>{req.amount}</span>
          </div>
        );
      })}

      {requirements.total > 0 && (
        <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium border-2 border-gray-300">
          <span className="text-gray-500">Total:</span>
          <span className="font-bold text-gray-900">{requirements.total}</span>
        </div>
      )}
    </div>
  );
}
