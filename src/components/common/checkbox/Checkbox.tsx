interface CheckboxProps {
  id: string;
  text?: string;
  count?: number;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * @param id - 체크박스의 name 속성에 들어갈 값
 * @param text - 체크박스를 나타내는 텍스트
 * @param count - 동일한 카테고리의 요소가 몇개있는지 나타내는 숫자
 * @param checked - 체크 상태를 나타내는 boolean 값
 * @param onChange - 체크 상태가 바뀔 때 호출되는 함수
 */
export default function Checkbox({
  id,
  text,
  count,
  checked,
  onChange,
}: CheckboxProps) {
  return (
    <label htmlFor={id} className="flex w-fit items-center">
      <input
        type="checkbox"
        id={id}
        name={id}
        checked={checked}
        onChange={onChange}
        className="mr-2 h-4 w-4 appearance-none rounded-sm border border-[#B0BABF] bg-[#F6F8F9] bg-center bg-no-repeat checked:border-none checked:bg-blue-500 checked:bg-[url('./assets/images/check.png')] checked:bg-contain"
      />
      {text && <span className="mr-1 text-[#646567]">{text}</span>}
      {count && <span className="text-[#989B9E]">({count})</span>}
    </label>
  );
}
