export const dateFormat = (
  date: string | undefined | Date | null,
  format: string = 'YYYY.MM.DD',
): string | null => {
  if (!date) {
    console.warn('Invalid date', { date, format });
    return null;
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    console.warn('Invalid Date object', { date, format });
    return null;
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');

  switch (format) {
    case 'YYYY.MM.DD':
      return `${year}.${month}.${day}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    default:
      console.warn('Unsupported format', { format });
      return null;
  }
};
