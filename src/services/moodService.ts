import { collection, addDoc, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import type { Mood, MoodData, MoodLevel } from "../types";
import { db } from "../config/firebase";

export const addMood = async (userId: string, moodLevel: MoodLevel, note?: string): Promise<string> => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];

  const existingMood = await getMoodByDate(userId, dateStr);
  if (existingMood) {
    throw new Error('You already logged your mood today');
  }
  const moodData: MoodData = {
    userId,
    moodLevel,
    note,
    date: dateStr,
    createdAt: Date.now()
  }

  const docRef = await addDoc(collection(db, 'moods'), moodData);
  return docRef.id
}

export const updateMood = async (docId: string, moodLevel: MoodLevel, note?: string): Promise<void> => {
  const moodRef = doc(db, 'moods', docId);
  await updateDoc(moodRef, {
    moodLevel,
    note
  });
}

export const getMoodByDate = async (userId: string, date: string): Promise<Mood | null> => {
  const q = query(
    collection(db, 'moods'),
    where('userId', '==', userId),
    where('date', '==', date)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const data = doc.data() as MoodData;

  return {
    id: doc.id,
    ...data,
    date: new Date(data.date),
    createdAt: new Date(data.createdAt)
  };
}

export const getMoodsByDateRange = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<Mood[]> => {
  const q = query(
    collection(db, 'moods'),
    where('userId', '==', userId),
    where('date', '>=', startDate),
    where('date', '<=', endDate)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data() as MoodData;
    return {
      id: doc.id,
      ...data,
      date: new Date(data.date),
      createdAt: new Date(data.createdAt)
    };
  });
};