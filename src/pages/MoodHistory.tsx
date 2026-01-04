import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { WeekView } from '../components/WeekView';
import { MonthView } from '../components/MonthView';
import { getMoodsByDateRange } from '../services/moodService';
import { getWeekRange, getMonthRange, formatMonthYear, formatShortDate } from '../utils/dateHelpers';
import type { Mood } from '../types';
import './MoodHistory.css';

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
      <main className="history-container">
        <h1 className="history-title">Mood History</h1>

        <div className="view-controls">
          <button
            onClick={() => setViewType('week')}
            className={`toggle-btn ${viewType === 'week' ? 'active' : ''}`}
          >
            Week
          </button>
          <button
            onClick={() => setViewType('month')}
            className={`toggle-btn ${viewType === 'month' ? 'active' : ''}`}
          >
            Month
          </button>
        </div>

        <div className="navigation-controls">
          <button onClick={goToPrevious} className="nav-btn">
            ← Previous
          </button>

          <div className="current-date-display">
            <h2 className="current-date-title">{getTitle()}</h2>
            <button onClick={goToToday} className="today-btn">
              Today
            </button>
          </div>

          <button onClick={goToNext} className="nav-btn">
            Next →
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
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
          <div className="empty-state">
            No mood entries for this period
          </div>
        )}
      </main>
    </div>
  );
};