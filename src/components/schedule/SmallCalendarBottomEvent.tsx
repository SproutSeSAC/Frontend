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
      <span className="text-mainGray-active">{date}</span>
      <span className="mx-2 text-mainGray-active">|</span>
      <span className="">{title}</span>
    </li>
  );
}
