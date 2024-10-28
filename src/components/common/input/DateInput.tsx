import { dateFormat } from '@/utils/dateFormat';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsCalendar } from 'react-icons/bs';

import ErrorMsg from '@/components/common/input/ErrorMsg';

interface DateInputProps {
  value: string;
  onChange: (date: Date) => void;
  errorMsg?: string;
}

export default function DateInput({
  value,
  onChange,
  errorMsg,
}: DateInputProps) {
  return (
    <div className="relative w-full">
      {/* 커스텀 아이콘 */}
      <BsCalendar
        size={20}
        className="absolute left-4 top-[20px] z-10 size-[18px] cursor-pointer text-gray2"
      />
      <DatePicker
        id="datepicker"
        minDate={new Date()}
        selected={value ? new Date(value) : undefined}
        onChange={date => onChange(date || new Date())}
        dateFormat="YYYY년 MM월 dd일"
        placeholderText={`${dateFormat(new Date(), 'YYYY년 MM월 DD일')}`}
        className={`w-full flex-1 rounded-2xl bg-white py-4 pl-11 pr-[15px] text-lg placeholder:text-gray2 focus:outline-none ${errorMsg ? 'border-red-500' : 'border-gray4'}`}
      />

      {errorMsg && (
        <ErrorMsg msg={errorMsg} className="absolute bottom-[-26px] ml-2" />
      )}
    </div>
  );
}
