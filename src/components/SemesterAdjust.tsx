import React from 'react';
import type { SemesterConfig } from '../types';

interface SemesterAdjustProps {
  semesters: SemesterConfig[];
  onChange: (semesters: SemesterConfig[]) => void;
}

export const SemesterAdjust: React.FC<SemesterAdjustProps> = ({ semesters, onChange }) => {
  const updateSemester = (index: number, field: keyof SemesterConfig, value: string) => {
    const updated = semesters.map((sem, i) =>
      i === index ? { ...sem, [field]: value } : sem
    );
    onChange(updated);
  };

  return (
    <div className="mb-6 space-y-3 max-h-64 overflow-y-auto">
      {semesters.map((sem, i) => (
        <div key={i} className="bg-stone-50 dark:bg-stone-700 rounded-xl p-4 border border-stone-100 dark:border-stone-600">
          <p className="text-xs tracking-widest uppercase text-stone-600 dark:text-stone-300 font-medium mb-3">{sem.name}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-stone-400 dark:text-stone-500 mb-1 block">Start</label>
              <input
                type="date"
                value={sem.startDate}
                onChange={(e) => updateSemester(i, 'startDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="text-xs text-stone-400 dark:text-stone-500 mb-1 block">End</label>
              <input
                type="date"
                value={sem.endDate}
                onChange={(e) => updateSemester(i, 'endDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
