import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { Mood } from '../types';
import { getWeekDates } from '../utils/dateHelpers';
import { moodOptions } from '../config/moodOptions';
import './WeekView.css';

interface Props {
  weekStart: Date;
  moods: Mood[];
}

// Custom Dot Component to render Icons
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;

  if (!payload.moodLevel) return null; // No data for this point

  const option = moodOptions.find(o => o.level === payload.moodLevel);
  if (!option || !option.icon) return null;

  const Icon = option.icon;

  return (
    <g transform={`translate(${cx - 12},${cy - 12})`}>
      <circle cx="12" cy="12" r="16" fill="white" stroke={option.color} strokeWidth="2" />
      <Icon size={24} color={option.color} />
    </g>
  );
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const option = moodOptions.find(o => o.level === data.moodLevel);

    return (
      <div
        className="custom-tooltip"
        style={{ borderColor: option?.color }}
      >
        <p className="tooltip-label">
          {label}
        </p>
        <div className="tooltip-mood-row">
          <span className="tooltip-mood-text" style={{ color: option?.color }}>
            {option?.label}
          </span>
        </div>
        {data.note && (
          <p className="tooltip-note">
            "{data.note}"
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const WeekView = ({ weekStart, moods }: Props) => {
  const weekDates = getWeekDates(weekStart);

  const moodByDate = new Map<string, Mood>();
  moods.forEach(mood => {
    const dateStr = mood.date.toISOString().split('T')[0];
    moodByDate.set(dateStr, mood);
  });

  // Prepare data for Recharts
  const data = weekDates.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    const mood = moodByDate.get(dateStr);

    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue...
      fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      moodLevel: mood?.moodLevel || null, // Null helps break the line if needed, or we can use 0
      note: mood?.note,
      // For sorting/key usage
      dateStr
    };
  });

  return (
    <div className="week-graph-container">
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 20, // Reduced margin
            left: 20,  // Reduced margin
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#888', fontSize: 12 }}
            dy={10}
            interval="preserveStartEnd" // Helps show ticks on small screens
          />
          <YAxis
            hide={true}
            domain={[0, 6]} // 1-5 mood levels, adding padding
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ddd', strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="moodLevel"
            stroke="#ddd"
            strokeWidth={3}
            dot={<CustomDot />}
            activeDot={{ r: 8 }}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};