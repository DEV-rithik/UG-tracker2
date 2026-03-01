import type { SemesterConfig, WeekData } from '../types';

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function generateDefaultSemesters(startDate: string): SemesterConfig[] {
  const start = new Date(startDate + 'T00:00:00');
  const semesters: SemesterConfig[] = [];
  const semNames = [
    'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4',
    'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'
  ];

  let current = new Date(start);
  
  for (let i = 0; i < 8; i++) {
    const semStart = formatDate(current);
    const semEnd = formatDate(addDays(current, 17 * 7 - 1));
    semesters.push({
      name: semNames[i],
      startDate: semStart,
      endDate: semEnd,
      yearIndex: Math.floor(i / 2),
    });
    // Move past semester + holiday break (3 weeks)
    current = addDays(current, 17 * 7 + 3 * 7);
  }
  
  return semesters;
}

export function generateWeeks(startDate: string, semesters: SemesterConfig[]): WeekData[] {
  const weeks: WeekData[] = [];
  const start = new Date(startDate + 'T00:00:00');
  const totalWeeks = 210;
  
  let overallWeek = 1;
  
  for (let i = 0; i < totalWeeks; i++) {
    const weekStart = addDays(start, i * 7);
    const weekEnd = addDays(weekStart, 6);
    const weekStartStr = formatDate(weekStart);
    const weekEndStr = formatDate(weekEnd);
    
    // Determine which semester this week belongs to
    let semesterIndex = -1;
    let yearIndex = 0;
    let isHoliday = true;
    let weekNumberInSem = 0;
    
    for (let s = 0; s < semesters.length; s++) {
      const sem = semesters[s];
      const semStart = new Date(sem.startDate + 'T00:00:00');
      const semEnd = new Date(sem.endDate + 'T00:00:00');
      
      if (weekStart >= semStart && weekStart <= semEnd) {
        semesterIndex = s;
        yearIndex = sem.yearIndex;
        isHoliday = false;
        // Calculate week number within semester
        const diffTime = weekStart.getTime() - semStart.getTime();
        weekNumberInSem = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000)) + 1;
        break;
      }
    }
    
    if (isHoliday && semesterIndex === -1) {
      // Find closest semester to determine yearIndex
      for (let s = 0; s < semesters.length; s++) {
        const semEnd = new Date(semesters[s].endDate + 'T00:00:00');
        if (weekStart > semEnd) {
          yearIndex = semesters[s].yearIndex;
        }
      }
    }
    
    weeks.push({
      weekNumber: isHoliday ? i + 1 : weekNumberInSem,
      overallWeekNumber: overallWeek++,
      startDate: weekStartStr,
      endDate: weekEndStr,
      score: null,
      remarks: '',
      goal: '',
      semesterIndex: semesterIndex === -1 ? (isHoliday ? -1 : 0) : semesterIndex,
      yearIndex,
      isHoliday,
      scoredAt: null,
    });
  }
  
  return weeks;
}

export function getCurrentWeekIndex(weeks: WeekData[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < weeks.length; i++) {
    const start = new Date(weeks[i].startDate + 'T00:00:00');
    const end = new Date(weeks[i].endDate + 'T00:00:00');
    if (today >= start && today <= end) return i;
  }
  return -1;
}

export function getYearLabel(yearIndex: number, startDate: string): string {
  const start = new Date(startDate + 'T00:00:00');
  const yearStart = start.getFullYear() + yearIndex;
  const yearEnd = yearStart + 1;
  return `YEAR ${yearIndex + 1} · ${yearStart}-${yearEnd}`;
}
