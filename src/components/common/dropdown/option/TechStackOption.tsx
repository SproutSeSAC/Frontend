import { OptionItem } from '@/components/common/dropdown/TechStackDropdown';

interface TechStackOptionProps {
  option: OptionItem;
  isSelected: boolean;
  onChangeValue: (option: OptionItem) => void;
}

export default function TechStackOption({
  option,
  isSelected,
  onChangeValue,
}: TechStackOptionProps) {
  return (
    <li
      className={`w-fit rounded-lg border border-solid ${isSelected ? 'border-darkGray-active' : 'border-lightGray'} cursor-pointer`}
    >
      <label className="flex w-full items-center gap-1.5 py-[5px] pl-[5px] pr-2.5">
        <img src={option.iconImageUrl} alt={option.name} className="size-4" />
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onChangeValue(option)}
          className="hidden"
        />
        {option.name}
      </label>
    </li>
  );
}
