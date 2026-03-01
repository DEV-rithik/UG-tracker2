import React from 'react';

interface StatsBarProps {
  weeksElapsed: number;
  weeksScored: number;
  averageScore: number;
  weeksRemaining: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({ weeksElapsed, weeksScored, averageScore, weeksRemaining }) => {
  const stats = [
    { label: 'Weeks Elapsed', value: weeksElapsed },
    { label: 'Weeks Scored', value: weeksScored },
    { label: 'Average Score', value: averageScore > 0 ? averageScore.toFixed(1) : '—' },
    { label: 'Weeks Remaining', value: weeksRemaining },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-4 text-center shadow-sm">
          <div className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-1">{stat.value}</div>
          <div className="text-xs tracking-widest uppercase text-stone-400 dark:text-stone-500 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
