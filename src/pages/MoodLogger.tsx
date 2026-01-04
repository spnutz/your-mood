import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { MoodSelector } from '../components/MoodSelector';
import { moodOptions } from '../config/moodOptions';
import { addMood, getMoodByDate } from '../services/moodService';
import { type MoodLevel } from '../types';

export const MoodLogger = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [alreadyLogged, setAlreadyLogged] = useState(false);
  const [message, setMessage] = useState('');

  // Check to already log yet
  useEffect(() => {
    const checkTodayMood = async () => {
      if (!user) return;
      const today = new Date().toISOString().split('T')[0];
      const mood = await getMoodByDate(user.uid, today);
      if (mood) {
        setAlreadyLogged(true);
        setSelectedMood(mood.moodLevel);
        setNote(mood.note || '');
        setMessage(`You already logged your mood today: Level ${mood.moodLevel}`);
      }
    }
    checkTodayMood();
  }, [user]);

  const handleSubmit = async () => {
    if (!selectedMood || !user) return;

    try {
      setLoading(true);
      setMessage('');
      await addMood(user.uid, selectedMood, note);
      setMessage('Mood logged successfully! ✨');
      setAlreadyLogged(true);
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div>
      <Header />
      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        <h1>How are you feeling today?</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>{today}</p>
        <MoodSelector
          moodOptions={moodOptions}
          selectedMood={selectedMood}
          onSelect={setSelectedMood}
          disabled={alreadyLogged}
        />
        <div style={{ marginTop: '2rem' }}>
          <label>Note (optional):</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={alreadyLogged}
            placeholder="How was your day?"
            rows={4}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.5rem',
              fontSize: '1rem'
            }}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!selectedMood || loading || alreadyLogged}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: (!selectedMood || loading || alreadyLogged)
              ? 'not-allowed'
              : 'pointer'
          }}
        >
          {loading ? 'Saving...' : 'Submit'}
        </button>
        {message && (
          <p style={{
            marginTop: '1rem',
            color: message.includes('success') ? 'green' : 'red'
          }}>
            {message}
          </p>
        )}
      </main>
    </div>
  )
}