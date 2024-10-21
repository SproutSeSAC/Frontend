export interface Option {
  id: number;
  name: string;
  key?: string;
}

interface SelectOptionProps {
  option: Option;
  isSelected: boolean;
  onOptionClick: (option: Option) => void;
  isMultiSelectOption?: boolean;
  className?: string;
}

/**
 * @param option - 옵션 정보입니다.
 * @param isSelected - 선택된 옵션인지 나타내는 불린값입니다.
 * @param onOptionClick - 옵션을 클릭했을때의 함수입니다.
 * @param isMultiSelectOption - 복수 선택 드롭다운에서의 옵션입니다. true일 시 checkbox가 나타납니다. 기본값은 단일 선택 드롭다운입니다.
 */

export default function SelectOption({
  option,
  isSelected,
  onOptionClick,
  isMultiSelectOption = false,
  className = '',
}: SelectOptionProps) {
  return (
    <li key={option.id} className="first:mt-2 last:mb-2">
      {isMultiSelectOption ? (
        <label
          className={`flex cursor-pointer items-center rounded-lg px-3 py-1.5 hover:bg-gray4 ${isSelected ? 'text-gray2' : 'text-text'} ${className}`}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onOptionClick(option)}
            className="mr-3 size-4 rounded border-gray-300"
          />
          <span>{option.name}</span>
        </label>
      ) : (
        <button
          type="button"
          className={`flex min-w-full cursor-pointer items-center rounded-lg px-3 py-1.5 hover:bg-gray4 ${isSelected ? 'text-gray2' : 'text-text'} ${className}`}
          onClick={() => onOptionClick(option)}
          disabled={isSelected}
        >
          {option.name}
        </button>
      )}
    </li>
  );
}
