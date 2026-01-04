import { Laugh, Smile, Meh, Frown, Angry } from 'lucide-react';
import type { MoodOption } from '../types';

export const moodOptions: MoodOption[] = [
  { level: 5, label: 'Very Happy', color: '#00C853', icon: Laugh },
  { level: 4, label: 'Happy', color: '#64DD17', icon: Smile },
  { level: 3, label: 'Neutral', color: '#FFC107', icon: Meh },
  { level: 2, label: 'Sad', color: '#FF9800', icon: Frown },
  { level: 1, label: 'Very Sad', color: '#F44336', icon: Angry },
];