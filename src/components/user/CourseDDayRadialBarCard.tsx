import { getDDay } from '@/utils';

interface Props {
  data: {
    course: string;
    campus: string;
    startDate: string;
    endDate: string;
  };
}

export default function MyCourseDDayRadialBarCard({
  data: { course, campus, startDate, endDate },
}: Props) {
  const DDay = getDDay(endDate);

  return (
    <div className="flex h-[190px] items-center gap-4 rounded-3xl bg-oliveGreen1 px-5 py-4 md:w-full lg:max-w-[380px]">
      {/* 차트로 변경 */}
      <div className="size-[150px] rounded-full bg-white" />

      <div className="flex flex-col">
        <div className="mb-4 self-start rounded-lg bg-white px-4">
          <span className="text-2xl font-bold text-oliveGreen1">D{DDay}</span>
        </div>

        <span className="font-semibold leading-7 text-white">{course}</span>

        <span className="text-sm leading-6 text-white opacity-40">
          {campus}
        </span>

        <span className="text-sm leading-4 text-white opacity-40">
          {startDate} ~ {endDate}
        </span>
      </div>
    </div>
  );
}
