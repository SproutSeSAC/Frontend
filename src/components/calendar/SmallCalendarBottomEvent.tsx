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
    <Link to={to} className="group relative flex w-full items-center py-1">
      <div className="min-w-[154px]">
        <span className="inline-block w-[50px] text-justify text-mainGray-active">
          {date}
        </span>
        <span className="text-mainGray-active">{time}</span>
      </div>

      <span className="ml-1.5 mr-2 text-mainGray-active">|</span>
      <span className="truncate tracking-tight">{title}</span>

      <div className="absolute -bottom-8 right-0 z-40 hidden rounded-lg bg-black px-3 py-1 group-hover:block">
        <span className="text-white">{title}</span>
      </div>
    </Link>
  );
}
