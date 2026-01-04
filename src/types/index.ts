export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface Mood {
  id: string;
  userId: string;
  moodLevel: MoodLevel;
  note?: string;
  date: Date;
  createdAt: Date;
}

export interface MoodData {
  userId: string;
  moodLevel: MoodLevel;
  note?: string;
  date: string;           // YYYY-MM-DD
  createdAt: number;      // timestamp
}

export interface MoodOption {
  level: MoodLevel;
  label: string;
  icon?: any;
  color: string;
}