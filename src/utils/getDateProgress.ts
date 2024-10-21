export const getDateProgress = (
  startDate: string | Date,
  endDate: string | Date,
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (today.getTime() >= end.getTime()) return 100;

  if (today.getTime() <= start.getTime()) return 0;

  const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  const elapsedDays =
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  const progress = (elapsedDays / totalDays) * 100;

  return Math.round(progress);
};
