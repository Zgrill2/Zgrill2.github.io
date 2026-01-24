import { useCalculations } from '../hooks/useCalculations';
import { AlertCircle } from 'lucide-react';

export default function BPDisplay() {
  const { bpSpent, bpRemaining, isOverBudget } = useCalculations();

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">
        <span className="text-base font-medium text-cosmic-grey">BP Spent:</span>
        <span
          className={`text-2xl font-bold ${
            isOverBudget ? 'text-error' : 'text-cyan-bright'
          }`}
        >
          {bpSpent}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-base font-medium text-cosmic-grey">BP Remaining:</span>
        <span
          className={`text-2xl font-bold ${
            isOverBudget ? 'text-error' : 'text-success'
          }`}
        >
          {bpRemaining}
        </span>
      </div>
      {isOverBudget && (
        <div className="flex items-center gap-2 text-error bg-error bg-opacity-20 px-3 py-2 rounded-lg border-2 border-error">
          <AlertCircle size={18} />
          <span className="text-sm font-semibold">Over budget!</span>
        </div>
      )}
    </div>
  );
}
