import { getDDay } from '@/utils';
import Chart from 'react-apexcharts';

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

  const options = {
    labels: ['교육과정 진행률'],
    colors: ['#ffffff'],
    plotOptions: {
      radialBar: {
        startAngle: -40,
        endAngle: 320,
        offsetX: 0,
        offsetY: 3,
        hollow: {
          size: '100%',
        },
        track: {
          show: true,
          background: '#d9d9d9',
          opacity: 0.4,
          strokeWidth: '134',
          margin: -28,
          dropShadow: {
            enabled: false,
          },
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: 10,
            show: true,
            fontSize: '24px',
            fontWeight: 600,
            color: '#ffffff',
            formatter(val: number) {
              return `${val}%`;
            },
          },
        },
      },
    },
  };

  const series = [45];

  return (
    <div className="slg:w-[380px] flex h-[190px] min-w-[330px] items-center gap-4 rounded-3xl bg-oliveGreen1 shadow-card md:w-full [&>div:first-child]:w-[180px]">
      <Chart
        type="radialBar"
        options={options}
        series={series}
        width={200}
        height={200}
      />

      <div className="flex flex-col py-4 pr-5">
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
