import React, { useRef } from 'react';
import type { WeekData, AppSettings } from '../types';
import { saveSettings, saveWeeks } from '../db/database';

interface DataManagerProps {
  weeks: WeekData[];
  settings: AppSettings | null;
  onImport: () => void;
}

export const DataManager: React.FC<DataManagerProps> = ({ weeks, settings, onImport }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = { settings, weeks };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ug-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.settings) await saveSettings(data.settings);
      if (data.weeks) await saveWeeks(data.weeks);
      
      onImport();
      alert('Data imported successfully!');
    } catch {
      alert('Failed to import data. Please check the file format.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
        <h3 className="text-xs tracking-widest uppercase text-stone-500 font-medium mb-4">Export Data</h3>
        <p className="text-sm text-stone-600 mb-4">Download all your tracking data as a JSON file for backup.</p>
        <button
          onClick={handleExport}
          disabled={!settings}
          className="w-full py-3 bg-stone-800 text-white rounded-xl font-medium text-sm hover:bg-stone-700 transition-colors disabled:opacity-40"
        >
          ↓ Export Backup
        </button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
        <h3 className="text-xs tracking-widest uppercase text-stone-500 font-medium mb-4">Import Data</h3>
        <p className="text-sm text-stone-600 mb-4">Restore your data from a previously exported JSON backup.</p>
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full py-3 bg-stone-100 text-stone-700 rounded-xl font-medium text-sm hover:bg-stone-200 transition-colors"
        >
          ↑ Import Backup
        </button>
        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      </div>

      <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
        <p className="text-xs text-stone-400 text-center">
          All data is stored locally in your browser. No data leaves your device.
        </p>
      </div>
    </div>
  );
};
