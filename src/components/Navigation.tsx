import React from 'react';
import type { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onReset: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  hasPin: boolean;
  onLock: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, onReset, isDark, onToggleDark, hasPin, onLock }) => {
  const tabs = [
    { id: 'dashboard' as AppView, label: '📅 Tracker' },
    { id: 'data' as AppView, label: '💾 Data' },
  ];

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-1 bg-stone-100 dark:bg-stone-800 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === tab.id
                ? 'bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDark}
          className="text-base text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors p-1"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        {hasPin && (
          <button
            onClick={onLock}
            className="text-base text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors p-1"
            title="Lock app"
          >
            🔒
          </button>
        )}
        <button
          onClick={onReset}
          className="text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 uppercase tracking-wider transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
