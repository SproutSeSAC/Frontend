import SquareButton from '@/components/common/button/SquareButton';

export default function SubscribeCalendar() {
  const onSubscribeClick = () => {
    console.log('캘린더 구독하기');
  };

  return (
    <SquareButton
      name="일정 구독하기"
      onClick={onSubscribeClick}
      className=""
    />
  );
}
