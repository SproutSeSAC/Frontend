import TechStackIcon from '@/components/common/TechStackIcon';
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
      <label className="flex w-full items-center gap-1.5 py-[5px] pl-[5px] pr-2.5">
        {/* TODO: image url 정상적으로 등록되면 주석 해제 예정 */}
        {/* {option.iconImageUrl ? (
                    <img src={option.iconImageUrl} alt={option.name} />
                  ) : ( */}
        <TechStackIcon techStack={option.name} className="size-[18px]" />
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
