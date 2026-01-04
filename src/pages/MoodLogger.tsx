import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { MoodSelector } from '../components/MoodSelector';
import { moodOptions } from '../config/moodOptions';
import { addMood, getMoodByDate, updateMood } from '../services/moodService';
import { type MoodLevel } from '../types';
import { Pencil } from 'lucide-react';
import './MoodLogger.css';

// Helper to convert hex to rgb for CSS variable usage (e.g., "255, 0, 0")
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
}

export const MoodLogger = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [alreadyLogged, setAlreadyLogged] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [moodId, setMoodId] = useState<string | null>(null);
  const [originalMood, setOriginalMood] = useState<MoodLevel | null>(null);
  const [originalNote, setOriginalNote] = useState('');

  // Check to already log yet
  useEffect(() => {
    const checkTodayMood = async () => {
      if (!user) return;
      const today = new Date().toISOString().split('T')[0];
      const mood = await getMoodByDate(user.uid, today);
      if (mood) {
        setAlreadyLogged(true);
        setMoodId(mood.id);
        setSelectedMood(mood.moodLevel);
        setNote(mood.note || '');
        // Store original values
        setOriginalMood(mood.moodLevel);
        setOriginalNote(mood.note || '');
      }
    }
    checkTodayMood();
  }, [user]);

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedMood(originalMood);
    setNote(originalNote);
  }

  const handleSubmit = async () => {
    if (!selectedMood || !user) return;

    try {
      setLoading(true);
      if (isEditing && moodId) {
        await updateMood(moodId, selectedMood, note);
        setIsEditing(false);
        // Update original values on successful update
        setOriginalMood(selectedMood);
        setOriginalNote(note);
      } else {
        const newId = await addMood(user.uid, selectedMood, note);
        setMoodId(newId);
        setOriginalMood(selectedMood);
        setOriginalNote(note);
      }

      setAlreadyLogged(true);
    } catch (error) {
      console.error(error);
      // Optional: Handle error visibility via another method or alert
      // alert((error as Error).message); 
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
      <main className="mood-logger-container">
        <div className="mood-header">
          <h1>How are you feeling today?</h1>
        </div>

        <p className="date-text">{today}</p>

        {(!alreadyLogged || isEditing) ? (
          <>
            <MoodSelector
              moodOptions={moodOptions}
              selectedMood={selectedMood}
              onSelect={setSelectedMood}
              disabled={alreadyLogged && !isEditing}
            />

            <div className="note-section">
              <label>Note (optional):</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={alreadyLogged && !isEditing}
                placeholder="How was your day?"
                rows={4}
                className="note-textarea"
              />
            </div>

            <div className="button-group">
              <button
                onClick={handleSubmit}
                disabled={!selectedMood || loading}
                type="submit"
                className="btn btn-primary"
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Mood' : 'Submit')}
              </button>

              {isEditing && (
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="btn btn-cancel"
                >
                  Cancel
                </button>
              )}
            </div>
          </>
        ) : (
          /* Large Summary View */
          <div className="summary-container">
            {selectedMood && (() => {
              const option = moodOptions.find(o => o.level === selectedMood);
              if (!option) return null;

              const Icon = option.icon;
              return (
                <div
                  className="big-mood-card"
                  style={{
                    '--mood-color': option.color,
                    '--mood-color-rgb': hexToRgb(option.color)
                  } as React.CSSProperties}
                >
                  <button
                    onClick={() => setIsEditing(true)}
                    className="edit-btn-absolute"
                    title="Edit Mood"
                  >
                    <Pencil size={24} />
                  </button>

                  <div className="mood-icon-wrapper">
                    {Icon && <Icon size={120} color={option.color} strokeWidth={2} />}
                  </div>
                  <h2 className="mood-label">
                    {option.label}
                  </h2>
                </div>
              );
            })()}

            {note && (
              <div className="cloud-note">
                <p className="cloud-text">
                  "{note}"
                </p>
                {/* Little circles for thought bubble effect */}
                <div className="cloud-bubble-1" />
                <div className="cloud-bubble-2" />
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  )
}