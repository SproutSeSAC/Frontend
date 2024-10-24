import { FaPlus } from 'react-icons/fa6';

interface AddSubscribeCalenderButtonProps {
  name: string;
  onAdminCalendarClick: () => void;
}

export default function AddSubscribeCalenderButton({
  name,
  onAdminCalendarClick,
}: AddSubscribeCalenderButtonProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="mr-2 size-4 rounded-sm border border-[#B0BABF] bg-[#F6F8F9]" />
      <span className="flex-1 tracking-tight text-gray2">{name}</span>
      <button type="button" onClick={onAdminCalendarClick}>
        <FaPlus className="size-4 text-gray1" />
      </button>
    </div>
  );
}
