import ErrorMsg from './input/ErrorMsg';

import DatePicker, { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs';

interface CustomDatePickerProps {
  currentDate?: Date;
  onChange: (date: Date | null) => void;
  className?: string;
  errorMsg?: string;
  placeholder?: string;
}

export default function CustomDatePicker({
  currentDate,
  onChange,
  className,
  errorMsg,
  placeholder = '선택해주세요',
}: CustomDatePickerProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear + index);

  const months = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];

  return (
    <div className="relative flex w-full flex-col" id="customDatePicker">
      <DatePicker
        placeholderText={placeholder}
        className={
          className
            ? `w-full bg-white outline-none placeholder:text-gray2 ${className}`
            : 'w-full bg-white p-4 placeholder:text-gray2'
        }
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }: ReactDatePickerCustomHeaderProps) => (
          <div className="text-md my-1.5 flex justify-center gap-2">
            <button
              className="border-none bg-none"
              type="button"
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
            >
              <BsFillCaretLeftFill />
            </button>
            <div className="w-26 flex items-center justify-between">
              <select
                className="mr-0.5 rounded-sm text-text"
                value={date.getFullYear()}
                onChange={({ target: { value } }) => changeYear(Number(value))}
              >
                {years.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span>년</span>
            </div>
            <div className="w-26 flex items-center justify-between">
              <select
                className="mr-0.5 rounded-sm text-text"
                value={months[date.getMonth()]}
                onChange={({ target: { value } }) =>
                  changeMonth(months.indexOf(value))
                }
              >
                {months.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span>월</span>
            </div>
            <button
              type="button"
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
            >
              <BsFillCaretRightFill />
            </button>
          </div>
        )}
        dateFormat="yyyy.MM.dd"
        selected={currentDate}
        onChange={onChange}
        selectsStart
      />
      {errorMsg && (
        <ErrorMsg
          msg={errorMsg || ''}
          className="absolute bottom-[-26px] ml-2"
        />
      )}
    </div>
  );
}
