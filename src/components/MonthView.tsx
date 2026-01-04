import type { Mood } from '../types';
import { MoodCard } from './MoodCard';
import { getMonthDates } from '../utils/dateHelpers';
import './CalendarStyles.css';

interface Props {
  month: Date;
  moods: Mood[];
}

export const MonthView = ({ month, moods }: Props) => {
  const monthDates = getMonthDates(month);

  const moodByDate = new Map<string, Mood>();
  moods.forEach(mood => {
    const dateStr = mood.date.toISOString().split('T')[0];
    moodByDate.set(dateStr, mood);
  });

  return (
    <div className="calendar-grid">
      {monthDates.map(date => {
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