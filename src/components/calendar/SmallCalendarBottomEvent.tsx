interface SmallCalendarBottomEventProps {
  title: string;
  date: string;
}

export default function SmallCalendarBottomEvent({
  date,
  title,
}: SmallCalendarBottomEventProps) {
  return (
    <li className="line-clamp-1 flex items-center">
      <span className="min-w-[142px] tracking-tight text-mainGray-active">
        {date}
      </span>
      <span className="ml-1.5 mr-2 text-mainGray-active">|</span>
      <span className="truncate tracking-tight">{title}</span>
    </li>
  );
}
