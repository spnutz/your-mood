import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { MoodSelector } from '../components/MoodSelector';
import { moodOptions } from '../config/moodOptions';
import { addMood, getMoodByDate, updateMood } from '../services/moodService';
import { type MoodLevel } from '../types';
import { Pencil } from 'lucide-react';

export const MoodLogger = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [alreadyLogged, setAlreadyLogged] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [moodId, setMoodId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
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
        setMessage(`You already logged your mood today: Level ${mood.moodLevel}`);
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
      setMessage('');

      if (isEditing && moodId) {
        await updateMood(moodId, selectedMood, note);
        setMessage('Mood updated successfully! ✨');
        setIsEditing(false);
        // Update original values on successful update
        setOriginalMood(selectedMood);
        setOriginalNote(note);
      } else {
        const newId = await addMood(user.uid, selectedMood, note);
        setMoodId(newId);
        setMessage('Mood logged successfully! ✨');
        setOriginalMood(selectedMood);
        setOriginalNote(note);
      }

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>How are you feeling today?</h1>
        </div>

        <p style={{ color: '#666', marginBottom: '2rem' }}>{today}</p>

        {(!alreadyLogged || isEditing) ? (
          <>
            <MoodSelector
              moodOptions={moodOptions}
              selectedMood={selectedMood}
              onSelect={setSelectedMood}
              disabled={alreadyLogged && !isEditing}
            />

            <div style={{ marginTop: '2rem' }}>
              <label>Note (optional):</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={alreadyLogged && !isEditing}
                placeholder="How was your day?"
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginTop: '0.5rem',
                  fontSize: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={handleSubmit}
                disabled={!selectedMood || loading}
                type="submit"
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: (!selectedMood || loading) ? 'not-allowed' : 'pointer',
                  flex: 1
                }}
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Mood' : 'Submit')}
              </button>

              {isEditing && (
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  style={{
                    padding: '0.75rem 2rem',
                    fontSize: '1rem',
                    backgroundColor: '#9e9e9e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </>
        ) : (
          /* Large Summary View */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '2rem',
            animation: 'fadeIn 0.5s ease-in'
          }}>
            {selectedMood && (() => {
              const option = moodOptions.find(o => o.level === selectedMood);
              if (!option) return null;

              const Icon = option.icon;
              return (
                <div style={{
                  position: 'relative',
                  backgroundColor: 'white',
                  padding: '3rem',
                  borderRadius: '3rem',
                  boxShadow: `0 0 60px ${option.color}60, 0 20px 40px rgba(0,0,0,0.1)`, // Neon glow
                  textAlign: 'center',
                  marginBottom: '3rem',
                  border: `4px solid ${option.color}20`,
                  transition: 'transform 0.3s ease',
                  cursor: 'default',
                  minWidth: '280px'
                }}>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      position: 'absolute',
                      top: '1.5rem',
                      right: '1.5rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#ddd',
                      padding: '0.5rem',
                      transition: 'color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#888'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#ddd'}
                    title="Edit Mood"
                  >
                    <Pencil size={24} />
                  </button>

                  <div style={{
                    transform: 'scale(1.5)',
                    marginBottom: '1.5rem',
                    filter: `drop-shadow(0 0 10px ${option.color})` // Icon inner glow
                  }}>
                    {Icon && <Icon size={120} color={option.color} strokeWidth={2} />}
                  </div>
                  <h2 style={{
                    color: option.color,
                    margin: 0,
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    textShadow: `0 0 10px ${option.color}40`
                  }}>
                    {option.label}
                  </h2>
                </div>
              );
            })()}

            {note && (
              <div style={{
                position: 'relative',
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', // Cloud-like organic shape
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                maxWidth: '400px',
                width: '100%',
                textAlign: 'center',
                border: '2px solid #f0f0f0'
              }}>
                <p style={{
                  fontSize: '1.25rem',
                  color: '#555',
                  margin: 0,
                  fontStyle: 'italic',
                  lineHeight: '1.6'
                }}>
                  "{note}"
                </p>
                {/* Little circles for thought bubble effect */}
                <div style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                  transform: 'translate(-50%, 0)'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '-25px',
                  left: '45%',
                  width: '12px',
                  height: '12px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                }} />
              </div>
            )}
          </div>
        )}

        {/* {message && (
          <p style={{
            marginTop: '1rem',
            color: message.includes('success') ? 'green' : 'red',
            textAlign: 'center'
          }}>
            {message}
          </p>
        )} */}
      </main>
    </div>
  )
}