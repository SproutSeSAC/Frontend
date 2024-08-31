const getKrDate = (date: Date) => {
  const krOffset = 9 * 60;
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return new Date(utcDate.getTime() + krOffset * 60000);
};

export const getDDay = (endDate: string) => {
  const krDate = getKrDate(new Date());

  const todayOfInitTime = krDate.setHours(0, 0, 0, 0);
  const endDateOfInitTime = new Date(endDate).setHours(0, 0, 0, 0);

  const diffTime = endDateOfInitTime - todayOfInitTime;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return `${diffDays < 0 ? '+' : '-'}${Math.abs(diffDays)}`;
};
