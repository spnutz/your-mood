import { type Mood } from '../types';
import { moodOptions } from '../config/moodOptions';
import './MoodCard.css';

interface MoodCardProps {
  date: Date;
  mood?: Mood | null;
  size?: 'mini' | 'normal';
  showDayName?: boolean;
}

export const MoodCard = ({ date, mood, size = 'normal', showDayName = true }: MoodCardProps) => {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNumber = date.getDate();
  const isToday = date.toDateString() === new Date().toDateString();

  const moodOption = mood ? moodOptions.find(m => m.level === mood.moodLevel) : null;
  const Icon = moodOption?.icon;

  // Inline style for dynamic background color
  const dynamicStyle = {
    backgroundColor: mood ? `${moodOption?.color}15` : '#f5f5f5',
    borderColor: isToday ? '#4CAF50' : (mood ? `${moodOption?.color}30` : '#eee'),
    borderWidth: isToday ? '2px' : '1px',
    borderStyle: 'solid'
  };

  return (
    <div
      className={`mood-card-base ${size === 'mini' ? 'mood-card-mini' : 'mood-card-full'}`}
      style={dynamicStyle}
    >
      {showDayName && (
        <div className="mood-day-name">{dayName}</div>
      )}

      <div className={`mood-date-number ${size === 'mini' ? 'date-mini' : ''}`}>
        {dayNumber}
      </div>

      {mood ? (
        <div className="mood-content">
          <div className="mood-icon-container">
            {Icon
              ? <Icon size={size === 'mini' ? 20 : 32} color={moodOption?.color} />
              : <span style={{ fontSize: size === 'mini' ? '1rem' : '2rem' }}>{mood.moodLevel}</span>
            }
          </div>

          {size === 'normal' && (
            <>
              <div className="mood-label" style={{ color: moodOption?.color }}>
                {moodOption?.label}
              </div>
              {mood.note && (
                <div className="mood-note-snippet">
                  {mood.note}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        // Empty state placeholder if needed, or just nothing
        null
      )}
    </div>
  )
}