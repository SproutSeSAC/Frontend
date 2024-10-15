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

export default function ThisMonthOfMealPriceChart() {
  const data = [
    { x: new Date('2024-09-15').getTime(), y: 10000 },
    { x: new Date('2024-09-16').getTime(), y: 9500 },
    { x: new Date('2024-09-17').getTime(), y: 9200 },
    { x: new Date('2024-09-18').getTime(), y: 9600 },
    { x: new Date('2024-09-19').getTime(), y: 10100 },
    { x: new Date('2024-09-20').getTime(), y: 10100 },
    { x: new Date('2024-09-21').getTime(), y: 10100 },
    { x: new Date('2024-09-22').getTime(), y: 10100 },
  ];

  const firstNullDataIndex = data.findIndex(item => item.y === null);

  const lastDataIndex =
    firstNullDataIndex === -1 ? data.length - 1 : firstNullDataIndex - 1;

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
        top: 30,
        right: 33,
        bottom: -10,
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
      tickAmount: data.length - 2,
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
        const date = new Date(point.x).getDate();
        return {
          x: point.x,
          strokeDashArray: 0,
          borderColor: '#e1e1e1',
          label: {
            text: `${date}`,
            orientation: 'horizontal',
            offsetY: -20,
            borderWidth: 0,
            style: {
              color: '#000',
              background: 'transparent',
              fontWeight: 700,
              fontSize: '12px',
              textAlign: 'center',
            },
          },
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
        if (dataPointIndex === lastDataIndex) {
          return `W${value.toLocaleString()}`;
        }
        return '';
      },
    },
    tooltip: {
      shared: false,
      enabled: true,
    },
    markers: {
      hover: {
        size: 3,
      },
    },
  };

  const series = [
    {
      name: '금액',
      data,
    },
  ];

  return (
    <div className="mt-4 h-[190px] w-full rounded-2xl bg-white px-6 pb-10 pt-5 shadow-card">
      <header className="mb-2 flex justify-between">
        <h2 className="font-semibold">이번달 식대 금액</h2>
        <div className="flex items-center">
          <span className="pr-1.5 text-xs font-semibold tracking-tight text-gray1">
            8월
          </span>
          <span className="pr-0.5 text-sm font-semibold tracking-tight text-oliveGreen1">
            240,320
          </span>
          <span className="text-xs font-semibold text-oliveGreen1">원</span>
        </div>
      </header>

      <div className="flex w-full">
        <ChartDataControlButton direction="left" onClick={() => {}} />
        <Chart
          type="area"
          options={options}
          series={series}
          width="100%"
          height="100%"
          style={{ flex: 1 }}
        />
        <ChartDataControlButton direction="right" onClick={() => {}} />
      </div>
    </div>
  );
}
