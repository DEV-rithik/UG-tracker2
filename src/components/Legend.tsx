import React from 'react';
import { SCORE_COLORS, HOLIDAY_SCORE_COLORS } from '../utils/constants';

export const Legend: React.FC = () => {
  return (
    <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-4 mb-4 shadow-sm">
      <div className="flex flex-wrap gap-4 items-center text-xs text-stone-500 dark:text-stone-400">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4, 5].map(score => (
            <div
              key={score}
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: SCORE_COLORS[score] }}
              title={score === 0 ? 'Unscored' : `Score ${score}`}
            />
          ))}
          <span className="text-xs tracking-widest uppercase font-medium text-stone-500 dark:text-stone-400 ml-1">Semester Week (Unscored → Score 1-5)</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4, 5].map(score => (
            <div
              key={score}
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: HOLIDAY_SCORE_COLORS[score] }}
              title={score === 0 ? 'Holiday (Unscored)' : `Holiday Score ${score}`}
            />
          ))}
          <span className="text-xs tracking-widest uppercase font-medium text-stone-500 dark:text-stone-400 ml-1">Holiday Week (Also Scoreable)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-sm bg-stone-900 ring-2 ring-stone-900 ring-offset-1" />
          <span className="text-xs tracking-widest uppercase font-medium text-stone-500 dark:text-stone-400">This Week</span>
        </div>
        <span className="text-xs text-stone-400 dark:text-stone-500 ml-auto">← Click any past week to score it</span>
      </div>
    </div>
  );
};
