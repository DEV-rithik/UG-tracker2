export interface WeekData {
  id?: number;
  weekNumber: number;
  overallWeekNumber: number;
  startDate: string; // ISO date string
  endDate: string;
  score: number | null; // 1-5
  remarks: string;
  goal: string;
  semesterIndex: number;
  yearIndex: number;
  isHoliday: boolean;
  scoredAt: string | null; // ISO timestamp
  photos?: string[]; // base64 encoded images, max 3
}

export interface SemesterConfig {
  name: string;
  startDate: string;
  endDate: string;
  yearIndex: number;
}

export interface AppSettings {
  id?: number;
  collegeStartDate: string;
  semesters: SemesterConfig[];
  setupComplete: boolean;
}

export type AppView = 'setup' | 'dashboard' | 'stats' | 'data';
