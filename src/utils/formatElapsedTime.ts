import { formatDate } from './formatDate';

export const formatElapsedTime = (timestamp: Date | string | number) => {
  const now = new Date();
  const past = new Date(timestamp); // start

  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 5) {
    return '방금';
  }
  if (diffMin < 60) {
    return `${diffMin}분전`;
  }
  if (diffHour < 24) {
    return `${diffHour}시간전`;
  }
  if (diffDay === 1) {
    return '어제';
  }
  return formatDate(timestamp, 'yyyy.MM.dd');
};
