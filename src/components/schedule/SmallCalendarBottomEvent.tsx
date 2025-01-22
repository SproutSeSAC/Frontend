interface SmallCalendarBottomEventProps {
  title: string;
  date: string;
}

export default function SmallCalendarBottomEvent({
  date,
  title,
}: SmallCalendarBottomEventProps) {
  return (
    <li key={title} className="text-darkGray-active">
      <span className="text-[13px] font-medium">{title}</span>
      <span className="block text-xs text-mainGray">{date}</span>
    </li>
  );
}
