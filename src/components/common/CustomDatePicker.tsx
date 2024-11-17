import { dateFormat } from '@/utils/dateFormat';

import ErrorMsg from './input/ErrorMsg';

import { ko } from 'date-fns/locale';
import DatePicker, { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  BsCalendar,
  BsFillCaretLeftFill,
  BsFillCaretRightFill,
} from 'react-icons/bs';

function CustomDatePickerHeader({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: ReactDatePickerCustomHeaderProps) {
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
    <div className="text-md flex justify-between gap-2 px-3 pb-1.5">
      <button
        className="px-1.5 disabled:text-oliveGreen3"
        type="button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
      >
        <BsFillCaretLeftFill />
      </button>

      <div className="flex items-center justify-center">
        <select
          className="mr-0.5 rounded p-0.5 text-[14px] text-text outline-none"
          value={date.getFullYear()}
          onChange={({ target: { value } }) => changeYear(Number(value))}
        >
          {years.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="font-mono text-[15px]">년</span>

        <select
          className="ml-2 mr-0.5 rounded p-0.5 text-[14px] text-text outline-none"
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
        <span className="text-[15px]">월</span>
      </div>

      <button
        className="p-1.5 disabled:text-oliveGreen3"
        type="button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      >
        <BsFillCaretRightFill />
      </button>
    </div>
  );
}

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
  placeholder,
}: CustomDatePickerProps) {
  return (
    <>
      <label htmlFor="date-picker" className="relative flex h-full w-full">
        <BsCalendar
          size={20}
          className="absolute left-4 top-5 z-10 size-[18px] cursor-pointer text-gray2"
        />
        <DatePicker
          id="date-picker"
          className={`flex h-full w-full flex-1 items-center rounded-2xl border bg-white py-4 !pl-11 pr-[15px] text-lg placeholder:text-gray2 focus:outline-none ${errorMsg ? 'border-red-500' : 'border-gray4'} ${className}`}
          renderCustomHeader={CustomDatePickerHeader}
          closeOnScroll
          popperPlacement="top-start"
          dateFormat="YYYY년 MM월 dd일"
          locale={ko}
          placeholderText={
            placeholder || `${dateFormat(new Date(), 'YYYY년 MM월 DD일')}`
          }
          selected={currentDate}
          onChange={onChange}
          minDate={new Date()}
        />
      </label>

      {errorMsg && (
        <ErrorMsg
          msg={errorMsg}
          className="absolute bottom-[-26px] left-0 ml-2"
        />
      )}
    </>
  );
}
