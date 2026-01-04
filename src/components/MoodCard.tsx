import type { Mood } from '../types';
import { moodOptions } from '../config/moodOptions';

interface Props {
  date: Date;
  mood?: Mood | null;
}

export const MoodCard = ({ date, mood }: Props) => {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNumber = date.getDate();
  const isToday = date.toDateString() === new Date().toDateString();

  const moodOption = mood ? moodOptions.find(m => m.level === mood.moodLevel) : null;

  return (
    <div style={{
      border: isToday ? '2px solid #4CAF50' : '1px solid #ddd',
      borderRadius: '8px',
      padding: '1rem',
      textAlign: 'center',
      minHeight: '120px',
      backgroundColor: mood ? `${moodOption?.color}10` : '#777373ff',
      position: 'relative'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
        {dayName}
      </div>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
        {dayNumber}
      </div>

      {mood ? (
        <>
          <div style={{
            fontSize: '2rem',
            color: moodOption?.color,
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {moodOption?.icon
              ? <moodOption.icon size={32} color={moodOption.color} />
              : mood.moodLevel
            }
          </div>
          <div style={{ fontSize: '0.75rem', color: '#666' }}>
            {moodOption?.label}
          </div>
          {mood.note && (
            <div style={{
              fontSize: '0.75rem',
              color: '#999',
              marginTop: '0.5rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {mood.note}
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}