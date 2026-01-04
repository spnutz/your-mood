import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { WeekView } from '../components/WeekView';
import { MonthView } from '../components/MonthView';
import { getMoodsByDateRange } from '../services/moodService';
import { getWeekRange, getMonthRange, formatMonthYear, formatShortDate } from '../utils/dateHelpers';
import type { Mood } from '../types';

type ViewType = 'week' | 'month';

export const MoodHistory = () => {
  const { user } = useAuth();
  const [viewType, setViewType] = useState<ViewType>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoods = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const range = viewType === 'week'
          ? getWeekRange(currentDate)
          : getMonthRange(currentDate);

        const fetchedMoods = await getMoodsByDateRange(
          user.uid,
          range.start,
          range.end
        );
        setMoods(fetchedMoods);
      } catch (error) {
        console.error('Failed to fetch moods:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoods();
  }, [user, currentDate, viewType]);

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewType === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewType === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getTitle = () => {
    if (viewType === 'week') {
      const range = getWeekRange(currentDate);
      const start = new Date(range.start);
      const end = new Date(range.end);
      return `${formatShortDate(start)} - ${formatShortDate(end)}`;
    } else {
      return formatMonthYear(currentDate);
    }
  };

  return (
    <div>
      <Header />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1>Mood History</h1>

        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setViewType('week')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: viewType === 'week' ? '#4CAF50' : '#eee',
              color: viewType === 'week' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Week
          </button>
          <button
            onClick={() => setViewType('month')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: viewType === 'month' ? '#4CAF50' : '#eee',
              color: viewType === 'month' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Month
          </button>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <button onClick={goToPrevious} style={{ padding: '0.5rem 1rem' }}>
            ← Previous
          </button>

          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: 0 }}>{getTitle()}</h2>
            <button
              onClick={goToToday}
              style={{
                padding: '0.25rem 0.75rem',
                fontSize: '0.875rem',
                marginTop: '0.5rem'
              }}
            >
              Today
            </button>
          </div>

          <button onClick={goToNext} style={{ padding: '0.5rem 1rem' }}>
            Next →
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading...
          </div>
        ) : (
          <>
            {viewType === 'week' ? (
              <WeekView
                weekStart={new Date(getWeekRange(currentDate).start)}
                moods={moods}
              />
            ) : (
              <MonthView
                month={currentDate}
                moods={moods}
              />
            )}
          </>
        )}

        {!loading && moods.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
            No mood entries for this period
          </div>
        )}
      </main>
    </div>
  );
};