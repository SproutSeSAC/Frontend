import { AdminCalendarLabel } from '@/constants';
import { FaPlus } from 'react-icons/fa6';

interface AddSubscribeCalenderButtonProps {
  name: AdminCalendarLabel;
  onAdminCalendarClick: (name: AdminCalendarLabel) => void;
}

export default function AddSubscribeCalenderButton({
  name,
  onAdminCalendarClick,
}: AddSubscribeCalenderButtonProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="mr-2 size-4 rounded-sm border border-[#B0BABF] bg-[#F6F8F9]" />
      <span className="flex-1 text-gray2">{name}</span>
      <button
        type="button"
        className="p-0.5"
        onClick={() => onAdminCalendarClick(name)}
      >
        <FaPlus className="size-4 text-gray1" />
      </button>
    </div>
  );
}
