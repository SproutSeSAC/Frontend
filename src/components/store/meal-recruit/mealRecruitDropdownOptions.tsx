function DateOption({ name, date }: { name: string; date: string }) {
  return (
    <div className="flex items-center justify-between text-lg">
      <div className="font-semibold text-vividGreen1">{name}</div>
      <div className="text-gray1">{date}</div>
    </div>
  );
}

const today = new Date();

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  return date.toLocaleDateString('ko-KR', options);
};

// 날짜선택 option
export const dateOptions = [
  {
    id: formatDate(today),
    name: DateOption({ name: '오늘', date: formatDate(today) }),
    value: today,
  },
  {
    id: formatDate(new Date(today.setDate(today.getDate() + 1))),
    name: DateOption({
      name: '내일',
      date: formatDate(new Date(today.setDate(today.getDate() + 1))),
    }),
    value: new Date(today.setDate(today.getDate() + 1)),
  },
  {
    id: formatDate(new Date(today.setDate(today.getDate() + 2))),
    name: DateOption({
      name: '모레',
      date: formatDate(new Date(today.setDate(today.getDate() + 2))),
    }),
    value: new Date(today.setDate(today.getDate() + 2)),
  },
];
