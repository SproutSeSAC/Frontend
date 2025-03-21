interface SmallCalendarBottomEventProps {
  title: string;
  date: string;
}

export default function SmallCalendarBottomEvent({
  date,
  title,
}: SmallCalendarBottomEventProps) {
  return (
    <li className="line-clamp-1">
      <span className="tracking-tight text-mainGray-active">{date}</span>
      <span className="mx-2 text-mainGray-active">|</span>
      <span className="tracking-tight">{title}</span>
    </li>
  );
}
