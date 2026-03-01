import React, { useRef, useState } from 'react';
import type { WeekData, AppSettings } from '../types';
import { saveSettings, saveWeeks } from '../db/database';

interface DataManagerProps {
  weeks: WeekData[];
  settings: AppSettings | null;
  onImport: () => void;
  hasPin: boolean;
  onSetPin: (pin: string) => Promise<void>;
  onRemovePin: () => void;
}

export const DataManager: React.FC<DataManagerProps> = ({ weeks, settings, onImport, hasPin, onSetPin, onRemovePin }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pinStep, setPinStep] = useState<'idle' | 'enter' | 'confirm'>('idle');
  const [pinInput, setPinInput] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinError, setPinError] = useState('');

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

  const handlePinSave = async () => {
    if (pinInput.length !== 4 || !/^\d{4}$/.test(pinInput)) {
      setPinError('PIN must be exactly 4 digits.');
      return;
    }
    if (pinStep === 'enter') {
      setPinStep('confirm');
      setPinError('');
      return;
    }
    if (pinInput !== pinConfirm) {
      setPinError('PINs do not match. Try again.');
      setPinStep('enter');
      setPinInput('');
      setPinConfirm('');
      return;
    }
    await onSetPin(pinInput);
    setPinStep('idle');
    setPinInput('');
    setPinConfirm('');
    setPinError('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-6 shadow-sm">
        <h3 className="text-xs tracking-widest uppercase text-stone-500 dark:text-stone-400 font-medium mb-4">Export Data</h3>
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">Download all your tracking data as a JSON file for backup.</p>
        <button
          onClick={handleExport}
          disabled={!settings}
          className="w-full py-3 bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 rounded-xl font-medium text-sm hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors disabled:opacity-40"
        >
          ↓ Export Backup
        </button>
      </div>

      <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-6 shadow-sm">
        <h3 className="text-xs tracking-widest uppercase text-stone-500 dark:text-stone-400 font-medium mb-4">Import Data</h3>
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">Restore your data from a previously exported JSON backup.</p>
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full py-3 bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-xl font-medium text-sm hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
        >
          ↑ Import Backup
        </button>
        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      </div>

      {/* PIN Management */}
      <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-6 shadow-sm">
        <h3 className="text-xs tracking-widest uppercase text-stone-500 dark:text-stone-400 font-medium mb-4">🔐 App Lock</h3>
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
          {hasPin ? 'A PIN is currently set. You can change or remove it below.' : 'Set a 4-digit PIN to lock the app on launch.'}
        </p>

        {pinStep === 'idle' && (
          <div className="flex gap-2">
            <button
              onClick={() => { setPinStep('enter'); setPinError(''); }}
              className="flex-1 py-2.5 bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-xl font-medium text-sm hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
            >
              {hasPin ? 'Change PIN' : 'Set PIN'}
            </button>
            {hasPin && (
              <button
                onClick={() => { if (confirm('Remove PIN? The app will no longer be locked on launch.')) onRemovePin(); }}
                className="flex-1 py-2.5 bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 rounded-xl font-medium text-sm hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
              >
                Remove PIN
              </button>
            )}
          </div>
        )}

        {pinStep !== 'idle' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-stone-500 dark:text-stone-400 block mb-1">
                {pinStep === 'enter' ? 'Enter new 4-digit PIN' : 'Confirm PIN'}
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pinStep === 'enter' ? pinInput : pinConfirm}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                  if (pinStep === 'enter') setPinInput(val);
                  else setPinConfirm(val);
                }}
                placeholder="••••"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 text-center tracking-widest"
              />
            </div>
            {pinError && <p className="text-xs text-red-500">{pinError}</p>}
            <div className="flex gap-2">
              <button
                onClick={handlePinSave}
                className="flex-1 py-2.5 bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 rounded-xl font-medium text-sm hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors"
              >
                {pinStep === 'enter' ? 'Next →' : 'Save PIN'}
              </button>
              <button
                onClick={() => { setPinStep('idle'); setPinInput(''); setPinConfirm(''); setPinError(''); }}
                className="px-4 py-2.5 bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-xl font-medium text-sm hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 p-4">
        <p className="text-xs text-stone-400 dark:text-stone-500 text-center">
          All data is stored locally in your browser. No data leaves your device.
        </p>
      </div>
    </div>
  );
};
