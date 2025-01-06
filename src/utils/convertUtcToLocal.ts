/**
 * UTC 시간을 Local 시간으로 변환하는 함수입니다.
 * @param  utcTimeString - UTC 시간 문자열
 */
export const convertUtcToLocal = (utcTimeString: string) => {
  // UTC 시간을 구성하는 연, 월, 일, 시, 분, 초 값을 분리
  const [year, month, day, hour, minute, second] = utcTimeString
    .split(/[-T:]/)
    .map(Number);

  // Date.UTC를 사용하여 UTC 시간을 밀리초(Timestamp)로 변환
  const utcTimestamp = Date.UTC(year, month - 1, day, hour, minute, second);

  // 변환된 Timestamp 값으로 Date 객체 생성 (로컬 시간으로 변환됨)
  const localDate = new Date(utcTimestamp);

  return localDate;
};
