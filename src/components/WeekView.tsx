import type { Mood } from '../types';
import { MoodCard } from './MoodCard';
import { getWeekDates } from '../utils/dateHelpers';
import './CalendarStyles.css';

interface Props {
  weekStart: Date;
  moods: Mood[];
}

export const WeekView = ({ weekStart, moods }: Props) => {
  const weekDates = getWeekDates(weekStart);

  const moodByDate = new Map<string, Mood>();
  moods.forEach(mood => {
    const dateStr = mood.date.toISOString().split('T')[0];
    moodByDate.set(dateStr, mood);
  });

  return (
    <div className="calendar-grid">
      {weekDates.map(date => {
        const dateStr = date.toISOString().split('T')[0];
        const mood = moodByDate.get(dateStr);

        return (
          <MoodCard
            key={dateStr}
            date={date}
            mood={mood}
          />
        );
      })}
    </div>
  );
};