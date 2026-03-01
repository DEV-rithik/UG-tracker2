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
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        {!weeks[currentWeekIndex].isHoliday && settings.semesters[weeks[currentWeekIndex].semesterIndex] ? (
                          <>
                            <div className="font-serif text-2xl text-stone-800 dark:text-stone-100" style={{ fontFamily: "'DM Serif Display', serif" }}>
                              {settings.semesters[weeks[currentWeekIndex].semesterIndex].name}
                            </div>
                            <div className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mt-1">
                              Year {weeks[currentWeekIndex].yearIndex + 1} · Week {weeks[currentWeekIndex].weekNumber} of {weeks.filter(w => !w.isHoliday && w.semesterIndex === weeks[currentWeekIndex].semesterIndex).length}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="font-serif text-2xl text-blue-600 dark:text-blue-400" style={{ fontFamily: "'DM Serif Display', serif" }}>
                              Holiday Break
                            </div>
                            <div className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mt-1">
                              Year {weeks[currentWeekIndex].yearIndex + 1}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="text-right text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider space-y-1">
                        <div>Today: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        <div>Overall Week {weeks[currentWeekIndex].overallWeekNumber} of {weeks.length}</div>
                      </div>
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
