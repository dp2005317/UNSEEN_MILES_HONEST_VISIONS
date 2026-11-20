import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import type { Itinerary } from '../../types/travel';

interface BudgetPanelProps {
  itinerary: Itinerary;
  onOptimizeBudget?: (newBudget: number) => Promise<void> | void;
  optimizing?: boolean;
  lastChanges?: string[];
}

const CATEGORY_LABELS: Array<{ key: keyof Itinerary['budgetBreakdown']; label: string; color: string }> = [
  { key: 'flights', label: 'Flights', color: 'bg-blue-600' },
  { key: 'hotels', label: 'Hotels & Stays', color: 'bg-indigo-600' },
  { key: 'food', label: 'Food & Cafés', color: 'bg-sky-500' },
  { key: 'localTransport', label: 'Local Transport', color: 'bg-violet-500' },
  { key: 'sightseeing', label: 'Sightseeing', color: 'bg-slate-700' },
  { key: 'activities', label: 'Activities', color: 'bg-teal-600' },
  { key: 'shopping', label: 'Shopping', color: 'bg-amber-500' },
  { key: 'emergencyReserve', label: 'Emergency Reserve', color: 'bg-slate-400' },
];

export function BudgetPanel({
  itinerary,
  onOptimizeBudget,
  optimizing = false,
  lastChanges = [],
}: BudgetPanelProps) {
  const [targetInput, setTargetInput] = useState(String(itinerary.targetBudget));

  const perTraveller = Math.round(itinerary.estimatedTotal / Math.max(1, itinerary.travellers));
  const perDay = Math.round(itinerary.estimatedTotal / Math.max(1, itinerary.durationDays));
  const remaining = Math.max(0, itinerary.targetBudget - itinerary.estimatedTotal);
  const utilizationPct = Math.min(
    100,
    Math.round((itinerary.estimatedTotal / Math.max(1, itinerary.targetBudget)) * 100)
  );

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = Number(targetInput.replace(/[^\d]/g, ''));
    if (!Number.isNaN(numeric) && numeric >= 10000 && onOptimizeBudget) {
      await onOptimizeBudget(numeric);
    }
  };

  return (
    <div className="rounded-3xl liquid-glass p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Smart Budget Breakdown</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Estimated cost allocation across 8 travel categories · Indicative estimates only
          </p>
        </div>

        {onOptimizeBudget && (
          <form onSubmit={handleApply} className="flex items-center gap-2">
            <label htmlFor="budget-reopt-input" className="sr-only">
              Revise target budget
            </label>
            <input
              id="budget-reopt-input"
              type="number"
              min={15000}
              step={1000}
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              className="w-32 px-3 py-2 rounded-xl border border-white/80 text-sm font-sans font-semibold tabular-nums text-slate-900 bg-white/75"
            />
            <button
              type="submit"
              disabled={optimizing}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer pressable"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${optimizing ? 'animate-spin' : ''}`} />
              <span>{optimizing ? 'Optimizing…' : 'Optimize Budget'}</span>
            </button>
          </form>
        )}
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl liquid-glass-subtle p-4 card-interactive">
          <p className="text-xs text-slate-500">Estimated Total</p>
          <p className="text-xl font-bold text-slate-900 font-sans tabular-nums tracking-tight mt-1">
            {itinerary.currency} {itinerary.estimatedTotal.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl liquid-glass-subtle p-4 card-interactive">
          <p className="text-xs text-slate-500">Per Traveller</p>
          <p className="text-xl font-bold text-slate-900 font-sans tabular-nums tracking-tight mt-1">
            {itinerary.currency} {perTraveller.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl liquid-glass-subtle p-4 card-interactive">
          <p className="text-xs text-slate-500">Per Day</p>
          <p className="text-xl font-bold text-slate-900 font-sans tabular-nums tracking-tight mt-1">
            {itinerary.currency} {perDay.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl bg-blue-50/80 backdrop-blur-md p-4 border border-blue-200/70 card-interactive">
          <p className="text-xs text-blue-700 font-medium">Target Utilization</p>
          <p className="text-lg font-bold text-blue-950 font-sans tabular-nums tracking-tight mt-1">
            {utilizationPct}% · {itinerary.currency} {remaining.toLocaleString()} left
          </p>
        </div>
      </div>

      {/* Stacked Allocation Bar */}
      <div className="space-y-3">
        <div className="h-3.5 w-full rounded-full bg-slate-200/70 overflow-hidden flex">
          {CATEGORY_LABELS.map((cat) => {
            const val = itinerary.budgetBreakdown[cat.key];
            const pct = (val / Math.max(1, itinerary.estimatedTotal)) * 100;
            if (pct <= 0) return null;
            return (
              <motion.div
                key={cat.key}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                className={`${cat.color} h-full`}
                title={`${cat.label}: ${itinerary.currency} ${val.toLocaleString()}`}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {CATEGORY_LABELS.map((cat) => {
            const val = itinerary.budgetBreakdown[cat.key];
            const pct = Math.round((val / Math.max(1, itinerary.estimatedTotal)) * 100);
            return (
              <div
                key={cat.key}
                className="flex items-center justify-between gap-3 py-2.5 px-3.5 rounded-xl liquid-glass-subtle"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2.5 h-2.5 rounded-xs shrink-0 ${cat.color}`} />
                  <span className="text-xs font-medium text-slate-700">{cat.label}</span>
                </div>
                <span className="text-xs font-sans font-semibold text-slate-900 tabular-nums shrink-0">
                  {itinerary.currency} {val.toLocaleString()} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {lastChanges.length > 0 && (
        <div className="rounded-2xl liquid-glass-subtle p-4 space-y-1.5">
          <p className="text-xs font-semibold text-slate-800">Optimization Adjustments Applied</p>
          <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
            {lastChanges.map((c, idx) => (
              <li key={idx}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
