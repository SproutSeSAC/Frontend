interface CheckboxProps {
  name: string;
  text?: string;
  count?: number;
}

/**
 * @param name - 체크박스의 name 속성에 들어갈 값
 * @param text - 체크박스를 나타내는 텍스트
 * @param count - 동일한 카테고리의 요소가 몇개있는지 나타내는 숫자
 */
export default function Checkbox({ name, text, count }: CheckboxProps) {
  return (
    <label htmlFor={name} className="flex w-fit items-center">
      <input
        type="checkbox"
        id={name}
        name={name}
        className="mr-2 h-4 w-4 appearance-none rounded border border-[#B0BABF] bg-[#F6F8F9] bg-center bg-no-repeat checked:border-none checked:bg-blue-500 checked:bg-[url('./assets/images/check.png')] checked:bg-contain"
      />
      {text && <span className="mr-1 text-[#646567]">{text}</span>}
      {count && <span className="text-[#989B9E]">({count})</span>}
    </label>
  );
}
