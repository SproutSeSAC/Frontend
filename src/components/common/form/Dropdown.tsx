import { useFormContext } from 'react-hook-form';

interface DropdownProps {
  options: { id: number; name: string }[];
  name: string;
  className?: string;
}

export default function Dropdown({
  options,
  name,
  className = '',
}: DropdownProps) {
  const { register } = useFormContext();

  return (
    <select
      {...register(name)}
      className="w-full appearance-none rounded-xl border bg-[url('src/assets/images/chevron-down.svg')] bg-[center_right_12px] bg-no-repeat p-3 pr-10"
    >
      {options.map(({ id, name: optionName }) => (
        <option key={id} value={id} className={`text-gray1 ${className}`}>
          {optionName}
        </option>
      ))}
    </select>
  );
}
