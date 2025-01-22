function DateOption({ name, date }: { name: string; date: string }) {
  return (
    <div className="flex items-center justify-between text-lg">
      <div className="font-semibold text-darkGreen">{name}</div>
      <div className="text-darkGray-active">{date}</div>
    </div>
  );
}

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  return date.toLocaleDateString('ko-KR', options);
};

const createDateOption = (dayOffset: number, name: string) => {
  const date = new Date(Date.now() + dayOffset * 24 * 60 * 60 * 1000);
  return {
    id: formatDate(date),
    name: DateOption({ name, date: formatDate(date) }),
    value: date,
  };
};

// 날짜선택 option
export const dateOptions = [
  createDateOption(0, '오늘'),
  createDateOption(1, '내일'),
  createDateOption(2, '모레'),
];
