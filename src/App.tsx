import { useState } from 'react';
import { Header } from './components/Header';
import { SetupForm } from './components/SetupForm';
import { Navigation } from './components/Navigation';
import { StatsBar } from './components/StatsBar';
import { Legend } from './components/Legend';
import { WeekGrid } from './components/WeekGrid';
import { WeekModal } from './components/WeekModal';
import { DataManager } from './components/DataManager';
import { LockScreen } from './components/LockScreen';
import { useWeeks } from './hooks/useWeeks';
import { useDarkMode } from './hooks/useDarkMode';
import { useAppLock } from './hooks/useAppLock';
import type { WeekData, AppView } from './types';

function App() {
  const { settings, weeks, loading, currentWeekIndex, setupCalendar, scoreWeek, resetApp, stats, reloadData } = useWeeks();
  const [selectedWeek, setSelectedWeek] = useState<WeekData | null>(null);
  const [view, setView] = useState<AppView>('dashboard');
  const { isDark, toggleDark } = useDarkMode();
  const { isLocked, hasPin, setPin, verifyPin, removePin, lock, unlock } = useAppLock();

  const handleReset = async () => {
    if (confirm('Are you sure? This will delete all your tracking data.')) {
      await resetApp();
      setView('dashboard');
    }
  };

  if (isLocked) {
    return (
      <LockScreen
        onUnlock={async (pin) => {
          const ok = await verifyPin(pin);
          if (ok) unlock();
          return ok;
        }}
        onForgotPin={() => {
          removePin();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-900">
        <div className="text-stone-400 text-sm uppercase tracking-widest">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor: isDark ? '#1C1917' : '#F5F0EB' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Header />
        
        <SetupForm onSetup={setupCalendar} initialDate={settings?.collegeStartDate} />

        {settings?.setupComplete && (
          <>
            <Navigation
              currentView={view}
              onViewChange={setView}
              onReset={handleReset}
              isDark={isDark}
              onToggleDark={toggleDark}
              hasPin={hasPin}
              onLock={lock}
            />

            {view === 'dashboard' && (
              <>
                {currentWeekIndex >= 0 && weeks[currentWeekIndex] && (
                  <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-4 mb-4 shadow-sm">
                    <div className="flex flex-wrap gap-4 items-center text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                      {!weeks[currentWeekIndex].isHoliday && settings.semesters[weeks[currentWeekIndex].semesterIndex] && (
                        <span className="font-medium text-stone-700 dark:text-stone-300">
                          {settings.semesters[weeks[currentWeekIndex].semesterIndex].name}
                        </span>
                      )}
                      {weeks[currentWeekIndex].isHoliday && (
                        <span className="font-medium text-blue-600 dark:text-blue-400">Holiday Break</span>
                      )}
                      <span>Today: {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      <span>Overall Week {weeks[currentWeekIndex].overallWeekNumber} of {weeks.length}</span>
                    </div>
                  </div>
                )}
                
                <StatsBar {...stats} />
                <Legend />
                <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-6 shadow-sm">
                  <WeekGrid
                    weeks={weeks}
                    settings={settings}
                    currentWeekIndex={currentWeekIndex}
                    onWeekClick={setSelectedWeek}
                  />
                </div>
              </>
            )}

            {view === 'data' && (
              <DataManager
                weeks={weeks}
                settings={settings}
                onImport={reloadData}
                hasPin={hasPin}
                onSetPin={setPin}
                onRemovePin={removePin}
              />
            )}
          </>
        )}
      </div>

      <WeekModal
        week={selectedWeek}
        onClose={() => setSelectedWeek(null)}
        onSave={scoreWeek}
      />
    </div>
  );
}

export default App;
