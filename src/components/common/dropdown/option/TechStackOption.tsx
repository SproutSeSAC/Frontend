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
      className={`w-fit cursor-pointer rounded-lg border border-solid ${isSelected ? 'border-gray1' : 'border-gray4'}`}
    >
      <label className="flex w-full items-center gap-2 py-[5px] pl-[5px] pr-2.5">
        {/* TODO: image url 정상적으로 등록되면 주석 해제 예정 */}
        {/* {option.iconImageUrl ? (
                    <img src={option.iconImageUrl} alt={option.name} />
                  ) : ( */}
        <div className="h-5 w-5 bg-gray3" />
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
