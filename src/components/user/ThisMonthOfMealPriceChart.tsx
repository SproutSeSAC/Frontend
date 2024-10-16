import { useMemo, useState } from 'react';

import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

function ChartDataControlButton({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) {
  const chevronIconStyle = 'size-5 stroke-2 text-gray3';

  return (
    <button
      type="button"
      aria-label={`${direction === 'left' ? '왼쪽' : '오른쪽'}으로 이동`}
      className="flex items-center justify-center self-center px-1 py-2"
      onClick={onClick}
    >
      {direction === 'right' ? (
        <BsChevronRight className={chevronIconStyle} />
      ) : (
        <BsChevronLeft className={chevronIconStyle} />
      )}
    </button>
  );
}

const SHOW_NUM = 8;

export default function ThisMonthOfMealPriceChart() {
  const [showData, setShowData] = useState(0);

  const data = useMemo(
    () => [
      { x: new Date('2024-10-01').getTime(), y: 10000 },
      { x: new Date('2024-10-02').getTime(), y: 11000 },
      { x: new Date('2024-10-03').getTime(), y: 9200 },
      { x: new Date('2024-10-04').getTime(), y: 9600 },
      { x: new Date('2024-10-05').getTime(), y: 10100 },
      { x: new Date('2024-10-06').getTime(), y: 10100 },
      { x: new Date('2024-10-07').getTime(), y: 10100 },
      { x: new Date('2024-10-08').getTime(), y: 10100 },
      { x: new Date('2024-10-09').getTime(), y: 10000 },
      { x: new Date('2024-10-10').getTime(), y: 9500 },

      { x: new Date('2024-10-11').getTime(), y: 10000 },
      { x: new Date('2024-10-12').getTime(), y: 11000 },
      { x: new Date('2024-10-13').getTime(), y: 9200 },
      { x: new Date('2024-10-14').getTime(), y: 9600 },
      { x: new Date('2024-10-15').getTime(), y: 10100 },
      { x: new Date('2024-10-16').getTime(), y: 10100 },
      { x: new Date('2024-10-17').getTime(), y: 10100 },
      { x: new Date('2024-10-18').getTime(), y: 10100 },
      { x: new Date('2024-10-19').getTime(), y: 10000 },
      { x: new Date('2024-10-20').getTime(), y: 9500 },

      { x: new Date('2024-10-21').getTime(), y: 9500 },
      { x: new Date('2024-10-22').getTime(), y: 9500 },
      { x: new Date('2024-10-23').getTime(), y: 9500 },
      { x: new Date('2024-10-24').getTime(), y: 9500 },
      { x: new Date('2024-10-25').getTime(), y: 9500 },
      { x: new Date('2024-10-26').getTime(), y: 9500 },
      { x: new Date('2024-10-27').getTime(), y: 9500 },
      { x: new Date('2024-10-28').getTime(), y: 9500 },
      { x: new Date('2024-10-29').getTime(), y: 9500 },
      { x: new Date('2024-10-30').getTime(), y: 9500 },

      { x: new Date('2024-10-31').getTime(), y: 9500 },
    ],
    [],
  );

  const slicedData = useMemo(() => {
    return data.slice(showData * SHOW_NUM, (showData + 1) * SHOW_NUM);
  }, [showData, data]);

  const dateNums = slicedData.map(date => new Date(date.x).getDate());

  const options: ApexOptions = {
    labels: ['이번달 식대 금액'],
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    grid: {
      show: false,
      padding: {
        top: 15,
        right: 33,
        bottom: -20,
        left: 33,
      },
    },
    stroke: {
      colors: ['#00C7FF'],
      show: true,
      curve: 'smooth',
      width: 2,
    },
    fill: {
      colors: ['rgba(0, 199, 255, 0.8)'],
      gradient: {
        opacityFrom: 26,
        opacityTo: 0,
      },
    },
    yaxis: {
      show: false,
      stepSize: 2500,
      max: 11000,
    },
    xaxis: {
      offsetY: -135,
      type: 'datetime',
      floating: false,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tickAmount: slicedData.length - 2,
      labels: {
        showDuplicates: false,
        show: true,
        formatter(_, timestamp: number) {
          const date = new Date(timestamp);
          const formatOptions = {
            weekday: 'short' as const,
            timeZone: 'Asia/Seoul',
          };
          const formatter = new Intl.DateTimeFormat('en-US', formatOptions);
          const enDay = formatter.format(date);
          return `${enDay}`;
        },
        style: {
          colors: '#b5b5b5',
          fontSize: '10px',
          fontWeight: 700,
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    annotations: {
      xaxis: data.map(point => {
        return {
          x: point.x,
          strokeDashArray: 0,
          borderColor: '#e1e1e1',
        };
      }),
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        colors: ['#fff'],
      },
      background: {
        enabled: true,
        foreColor: '#00C7FF',
        padding: 8,
        borderColor: '#dadada',
        borderWidth: 1,
        borderRadius: 5,
        dropShadow: {
          enabled: true,
          color: '#9a9a9a',
          opacity: 0.2,
          top: 0,
          left: 0,
          blur: 2,
        },
      },
      formatter(value, { dataPointIndex }) {
        if (dataPointIndex === slicedData.length - 1) {
          return `W${value.toLocaleString()}`;
        }
        return '';
      },
    },
    tooltip: {
      shared: false,
      enabled: true,
      x: {
        formatter(val) {
          return `${new Date(val).toLocaleDateString('ko')}`;
        },
      },
      y: {
        formatter(val) {
          return `${val.toLocaleString('ko')}원`;
        },
        title: {
          formatter: seriesName => `${seriesName}`,
        },
      },
    },
    markers: {
      hover: {
        size: 3,
      },
      colors: '#626262',
    },
  };

  const series = useMemo(
    () => [
      {
        name: '식대 금액',
        data: slicedData,
      },
    ],
    [slicedData],
  );

  const totalAmountOfMeal = useMemo(() => {
    return data.reduce((acc, curr) => acc + (curr.y || 0), 0);
  }, [data]);

  return (
    <div className="mt-4 h-[190px] w-full rounded-2xl bg-white px-6 pb-10 pt-5 shadow-card">
      <header className="mb-2 flex justify-between">
        <h2 className="font-semibold">이번달 식대 금액</h2>
        <div className="flex items-center">
          <span className="pr-1.5 text-xs font-semibold tracking-tight text-gray1">
            {new Date().getMonth() + 1}월
          </span>
          <span className="pr-0.5 text-sm font-semibold tracking-tight text-oliveGreen1">
            {totalAmountOfMeal.toLocaleString('ko')}
          </span>
          <span className="text-xs font-semibold text-oliveGreen1">원</span>
        </div>
      </header>

      <div className="relative flex h-full w-full">
        <ChartDataControlButton
          direction="left"
          onClick={() => setShowData(prev => (prev === 0 ? prev : prev - 1))}
        />

        <ul className="absolute inset-x-0 top-5 flex justify-between px-12">
          {dateNums.map(num => (
            <li
              key={num}
              className="w-6 text-center text-xs font-semibold text-gray1"
            >
              {num}
            </li>
          ))}
        </ul>
        <Chart
          type="area"
          options={options}
          series={series}
          width="100%"
          height="100%"
          style={{ flex: 1 }}
        />

        <ChartDataControlButton
          direction="right"
          onClick={() =>
            setShowData(prev =>
              prev >= Math.floor(data.length / SHOW_NUM) ? prev : prev + 1,
            )
          }
        />
      </div>
    </div>
  );
}
