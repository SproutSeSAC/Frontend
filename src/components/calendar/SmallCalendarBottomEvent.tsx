import { Link } from 'react-router-dom';

interface SmallCalendarBottomEventProps {
  title: string;
  date: string;
  time: string;
  to: string;
}

export default function SmallCalendarBottomEvent({
  date,
  title,
  time,
  to,
}: SmallCalendarBottomEventProps) {
  return (
    <Link to={to} className="line-clamp-1 flex w-full items-center py-1">
      <div className="min-w-[154px]">
        <span className="inline-block w-[50px] text-justify text-mainGray-active">
          {date}
        </span>
        <span className="text-mainGray-active">{time}</span>
      </div>

      <span className="ml-1.5 mr-2 text-mainGray-active">|</span>
      <span className="truncate tracking-tight">{title}</span>
    </Link>
  );
}
