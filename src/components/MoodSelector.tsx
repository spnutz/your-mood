import type { MoodOption, MoodLevel } from "../types";

interface Props {
  moodOptions: MoodOption[];
  selectedMood: MoodLevel | null;
  onSelect: (level: MoodLevel) => void;
  disabled?: boolean;
}

export const MoodSelector = ({
  moodOptions,
  selectedMood,
  onSelect,
  disabled
}: Props) => {
  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center'
    }}>
      {moodOptions.map(option => (
        <button
          key={option.level}
          onClick={() => onSelect(option.level)}
          disabled={disabled}
          style={{
            flex: 1,
            width: 0,
            padding: '1rem', // Reduced padding slightly to fit better
            fontSize: '1.5rem',
            // minWidth: '80px', // Removed to allow equal sizing
            border: selectedMood === option.level
              ? `3px solid ${option.color}`
              : '1px solid #ddd',
            backgroundColor: selectedMood === option.level
              ? `${option.color}20`
              : 'white',
            color: option.color,
            borderRadius: '12px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '2rem', display: 'flex', alignItems: 'center' }}>
              {option.icon ? <option.icon size={32} /> : null}
            </span>
            <span style={{ fontSize: '0.875rem' }}>{option.label}</span>
          </div>
        </button>
      ))}
    </div>
  )
}