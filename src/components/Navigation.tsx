import React from 'react';
import type { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onReset: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, onReset }) => {
  const tabs = [
    { id: 'dashboard' as AppView, label: '📅 Tracker' },
    { id: 'stats' as AppView, label: '📊 Statistics' },
    { id: 'data' as AppView, label: '💾 Data' },
  ];

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === tab.id
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <button
        onClick={onReset}
        className="text-xs text-stone-400 hover:text-stone-600 uppercase tracking-wider transition-colors"
      >
        Reset
      </button>
    </div>
  );
};
