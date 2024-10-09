export const dateFormat = (
  date: string | undefined | Date | null,
  format: 'YYYY.MM.DD' | 'MM/DD/YYYY' = 'YYYY.MM.DD',
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

export const timeFormat = (
  time: string | undefined | Date | null,
  format: 'HH:mm:ss' | 'HH:mm' = 'HH:mm:ss',
): string | null => {
  if (!time) {
    console.warn('Invalid time', { time, format });
    return null;
  }

  const parsedTime = new Date(time);
  if (Number.isNaN(parsedTime.getTime())) {
    console.warn('Invalid Date object', { time, format });
    return null;
  }

  const hours = String(parsedTime.getHours()).padStart(2, '0');
  const minutes = String(parsedTime.getMinutes()).padStart(2, '0');
  const seconds = String(parsedTime.getSeconds()).padStart(2, '0');

  switch (format) {
    case 'HH:mm:ss': {
      return `${hours}:${minutes}:${seconds}`;
    }
    case 'HH:mm': {
      return `${hours}:${minutes}`;
    }

    default: {
      console.warn('Unsupported format', { format });
      return null;
    }
  }
};
