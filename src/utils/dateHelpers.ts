export const getWeekRange = (date: Date): { start: string; end: string } => {
  const current = new Date(date);
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);

  const monday = new Date(current.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0]
  };
};

export const getMonthRange = (date: Date): { start: string; end: string } => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  return {
    start: firstDay.toISOString().split('T')[0],
    end: lastDay.toISOString().split('T')[0]
  };
};

export const formatShortDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
};

export const getWeekDates = (startDate: Date): Date[] => {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    date.setHours(12, 0, 0, 0);  // Set to noon to avoid timezone issues
    dates.push(date);
  }
  return dates;
};

export const getCalendarMonthDays = (date: Date): { date: Date; isCurrentMonth: boolean }[] => {
  const year = date.getFullYear();
  const month = date.getMonth();

  // Set to noon (12:00) to avoid timezone issues when converting to ISO string (UTC)
  const firstDayOfMonth = new Date(year, month, 1, 12, 0, 0, 0);

  // 0 = Sunday, 1 = Monday, ...
  const startDay = firstDayOfMonth.getDay();

  // Calculate start date (Monday of the first week)
  // If startDay is 0 (Sunday), we go back 6 days.
  // If startDay is 1 (Monday), we start on that day (offset 0).
  // Otherwise we subtract (day - 1).
  const daysToSubtract = startDay === 0 ? 6 : startDay - 1;
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - daysToSubtract);

  const days: { date: Date; isCurrentMonth: boolean }[] = [];

  // We need 6 weeks to cover all possible months (e.g. 1st is Sunday on a 31 day month)
  // 6 * 7 = 42 days
  const current = new Date(startDate);

  // Just generate 42 days to be safe and consistent
  for (let i = 0; i < 42; i++) {
    days.push({
      date: new Date(current),
      isCurrentMonth: current.getMonth() === month
    });
    current.setDate(current.getDate() + 1);
  }

  return days;
};