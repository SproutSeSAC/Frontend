import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsClock } from 'react-icons/bs';

import ErrorMsg from '@/components/common/input/ErrorMsg';

interface TimeInputProps {
  value: string;
  onChange: (time: Date) => void;
  errorMsg?: string;
}

export default function TimeInput({
  value,
  onChange,
  errorMsg,
}: TimeInputProps) {
  return (
    <div className="relative w-full">
      {/* 커스텀 아이콘 */}
      <BsClock
        size={20}
        className="absolute left-4 top-5 z-10 size-[18px] cursor-pointer text-gray2"
      />
      <DatePicker
        id="timepicker"
        showTimeSelect
        showTimeSelectOnly
        timeCaption="시간"
        timeFormat="HH:mm aa"
        dateFormat="HH:mm aa"
        timeIntervals={15}
        selected={value ? new Date(value) : undefined}
        onChange={date => onChange(date || new Date())}
        placeholderText="07:00 PM"
        className={`w-full flex-1 rounded-2xl bg-white py-4 pl-11 pr-[15px] text-lg placeholder:text-gray2 focus:outline-none ${errorMsg ? 'border-red-500' : 'border-gray4'}`}
      />

      {errorMsg && (
        <ErrorMsg msg={errorMsg} className="absolute bottom-[-26px] ml-2" />
      )}
    </div>
  );
}
