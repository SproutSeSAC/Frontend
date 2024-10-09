interface SmallCalendarBottomEventProps {
  title: string;
}

export default function SmallCalendarBottomEvent({
  title,
}: SmallCalendarBottomEventProps) {
  return (
    <li key={title} className="leading-3 text-gray1">
      <span className="border-r-2 border-gray2 pr-1.5 text-xs text-gray2">
        11:00 ~ 13:00
      </span>
      <span className="pl-1.5 text-[13px] font-medium">{title}</span>
    </li>
  );
}
