export const isInThisWeek = (dateToCheck: string | Date): boolean => {
  const inputDate = new Date(dateToCheck);
  const today = new Date();

  // 시간 정보 제거 (오전 0시 기준으로 비교)
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // 오늘 날짜 기준으로 월요일과 일요일 계산
  const dayOfWeek = today.getDay(); // 0 (일요일) ~ 6 (토요일)
  const monday = new Date(today);
  const sunday = new Date(today);

  // 월요일 (현재 주의 첫날)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  // 일요일 (현재 주의 마지막 날)
  sunday.setDate(monday.getDate() + 6);

  // inputDate가 이번 주 범위에 속하는지 확인
  return inputDate >= monday && inputDate <= sunday;
};
