import React, { useState } from 'react';
import type { SemesterConfig } from '../types';
import { generateDefaultSemesters } from '../utils/dateUtils';
import { SemesterAdjust } from './SemesterAdjust';

interface SetupFormProps {
  onSetup: (startDate: string, semesters?: SemesterConfig[]) => void;
  initialDate?: string;
}

export const SetupForm: React.FC<SetupFormProps> = ({ onSetup, initialDate }) => {
  const [startDate, setStartDate] = useState(initialDate ?? '');
  const [showAdjust, setShowAdjust] = useState(false);
  const [semesters, setSemesters] = useState<SemesterConfig[]>([]);

  const handleDateChange = (date: string) => {
    setStartDate(date);
    if (date) {
      setSemesters(generateDefaultSemesters(date));
    }
  };

  const handleSubmit = () => {
    if (!startDate) return;
    onSetup(startDate, showAdjust ? semesters : undefined);
  };

  return (
    <div className="max-w-2xl mx-auto mb-4">
      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <div className="flex-1">
            <label className="block text-xs tracking-widest uppercase text-stone-800 dark:text-stone-100 font-bold mb-3">
              First Day of Your UG
            </label>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-1">
              All 4 years and 8 semesters are calculated from this one date.
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              You can override individual semester dates below if needed.
            </p>
          </div>
          <div className="sm:w-64 flex flex-col gap-3">
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-400 text-sm"
            />
            <button
              onClick={handleSubmit}
              disabled={!startDate}
              className="w-full py-3 px-6 bg-stone-800 dark:bg-stone-200 text-stone-50 dark:text-stone-900 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-stone-700 dark:hover:bg-stone-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Build My Calendar →
            </button>
          </div>
        </div>

        {showAdjust && startDate && (
          <div className="mt-6 pt-6 border-t border-stone-200 dark:border-stone-700">
            <SemesterAdjust semesters={semesters} onChange={setSemesters} />
          </div>
        )}
      </div>

      <div className="flex justify-end mt-2">
        <button
          onClick={() => setShowAdjust(!showAdjust)}
          className="text-xs tracking-widest uppercase text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center gap-1.5 transition-colors"
        >
          <span className="text-base">{showAdjust ? '⊖' : '⊕'}</span>
          Adjust Individual Semester Dates
        </button>
      </div>
    </div>
  );
};
