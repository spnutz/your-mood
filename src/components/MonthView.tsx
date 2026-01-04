import type { Mood } from '../types';
import { MoodCard } from './MoodCard';
import { getCalendarMonthDays } from '../utils/dateHelpers';
import './MonthView.css';

interface Props {
  month: Date;
  moods: Mood[];
}

export const MonthView = ({ month, moods }: Props) => {
  const calendarDays = getCalendarMonthDays(month);
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const moodByDate = new Map<string, Mood>();
  moods.forEach(mood => {
    const dateStr = mood.date.toISOString().split('T')[0];
    moodByDate.set(dateStr, mood);
  });

  return (
    <div className="month-view-container">
      {/* Header Row: Mon - Sun */}
      <div className="week-days-header">
        {weekDays.map(day => (
          <div key={day} className="week-day-label">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid-view">
        {calendarDays.map(({ date, isCurrentMonth }, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const mood = moodByDate.get(dateStr);

          // If we are in other month, maybe show empty card or dim it
          return (
            <div
              key={`${dateStr}-${index}`}
              className={`calendar-day-cell ${!isCurrentMonth ? 'day-other-month' : ''}`}
            >
              <MoodCard
                date={date}
                mood={mood}
                size="mini"
                showDayName={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};