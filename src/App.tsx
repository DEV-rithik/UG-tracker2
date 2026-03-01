import { useState } from 'react';
import { Header } from './components/Header';
import { SetupForm } from './components/SetupForm';
import { Navigation } from './components/Navigation';
import { StatsBar } from './components/StatsBar';
import { Legend } from './components/Legend';
import { WeekGrid } from './components/WeekGrid';
import { WeekModal } from './components/WeekModal';
import { StatsDashboard } from './components/StatsDashboard';
import { DataManager } from './components/DataManager';
import { useWeeks } from './hooks/useWeeks';
import type { WeekData, AppView } from './types';

function App() {
  const { settings, weeks, loading, currentWeekIndex, setupCalendar, scoreWeek, resetApp, stats, reloadData } = useWeeks();
  const [selectedWeek, setSelectedWeek] = useState<WeekData | null>(null);
  const [view, setView] = useState<AppView>('dashboard');

  const handleReset = async () => {
    if (confirm('Are you sure? This will delete all your tracking data.')) {
      await resetApp();
      setView('dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F0EB' }}>
        <div className="text-stone-400 text-sm uppercase tracking-widest">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F0EB' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Header />
        
        {!settings?.setupComplete ? (
          <SetupForm onSetup={setupCalendar} />
        ) : (
          <>
            <Navigation currentView={view} onViewChange={setView} onReset={handleReset} />

            {view === 'dashboard' && (
              <>
                {currentWeekIndex >= 0 && weeks[currentWeekIndex] && (
                  <div className="bg-white rounded-xl border border-stone-200 p-4 mb-4 shadow-sm">
                    <div className="flex flex-wrap gap-4 items-center text-xs text-stone-500 uppercase tracking-wider">
                      {!weeks[currentWeekIndex].isHoliday && settings.semesters[weeks[currentWeekIndex].semesterIndex] && (
                        <span className="font-medium text-stone-700">
                          {settings.semesters[weeks[currentWeekIndex].semesterIndex].name}
                        </span>
                      )}
                      {weeks[currentWeekIndex].isHoliday && (
                        <span className="font-medium text-blue-600">Holiday Break</span>
                      )}
                      <span>Today: {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      <span>Overall Week {weeks[currentWeekIndex].overallWeekNumber} of {weeks.length}</span>
                    </div>
                  </div>
                )}
                
                <StatsBar {...stats} />
                <Legend />
                <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
                  <WeekGrid
                    weeks={weeks}
                    settings={settings}
                    currentWeekIndex={currentWeekIndex}
                    onWeekClick={setSelectedWeek}
                  />
                </div>
              </>
            )}

            {view === 'stats' && (
              <StatsDashboard weeks={weeks} settings={settings} />
            )}

            {view === 'data' && (
              <DataManager weeks={weeks} settings={settings} onImport={reloadData} />
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
