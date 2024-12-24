export const isInThisWeek = (dateToCheck: string | Date): boolean => {
  const inputDate = new Date(dateToCheck);
  const today = new Date();

  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  const sunday = new Date(today);

  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  sunday.setDate(monday.getDate() + 6);

  return inputDate >= monday && inputDate <= sunday;
};
