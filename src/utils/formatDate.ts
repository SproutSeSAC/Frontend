import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatDate = (
  date?: string | number | Date,
  formatStr:
    | 'MM.dd'
    | 'MM.dd HH:mm'
    | 'yy.MM.dd'
    | 'yyyy.MM.dd'
    | 'yyyy년 MM월 dd일'
    | 'yyyy.MM.dd HH:mm'
    | 'HH:mm'
    | 'a h시 mm분'
    | 'yyyy년 M월 d일 EEEE'
    | 'yyyy.MM.dd a h시'
    | 'yyyy.MM.dd a h시 mm분'
    | 'yyyy-MM-dd HH:mm:ss'
    | "yyyy-MM-dd'T'HH:mm:ss" = 'yyyy.MM.dd',
): string => {
  try {
    const dateToFormat = date ? new Date(date) : new Date();

    if (Number.isNaN(dateToFormat.getTime())) {
      throw new Error('Invalid date');
    }
    return format(dateToFormat, formatStr, { locale: ko });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};
