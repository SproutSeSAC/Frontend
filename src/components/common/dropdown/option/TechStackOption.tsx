import { OptionItem } from '@/components/common/dropdown/TechStackDropdown';

interface TechStackOptionProps {
  option: OptionItem;
  isSelected: boolean;
  onChangeValue: (option: OptionItem) => void;
  disabled?: boolean;
}

export default function TechStackOption({
  option,
  isSelected,
  onChangeValue,
  disabled,
}: TechStackOptionProps) {
  return (
    <li
      className={`w-fit rounded-lg border border-solid ${isSelected ? 'border-darkGray-active' : 'border-mainGray'} cursor-pointer`}
    >
      <label className="flex w-full cursor-pointer items-center gap-1.5 py-[5px] pl-[5px] pr-2.5">
        <img src={option.iconImageUrl} alt={option.name} className="size-4" />
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onChangeValue(option)}
          className="hidden"
          disabled={disabled}
        />
        {option.name}
      </label>
    </li>
  );
}
