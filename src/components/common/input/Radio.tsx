import { KeyOfRole, Role } from '@/types';
import { useFormContext } from 'react-hook-form';

interface RadioProps {
  value: KeyOfRole | string;
  label: Role[KeyOfRole] | string;
  name: string;
}

export default function Radio({ value, label, name }: RadioProps) {
  const { register } = useFormContext();

  return (
    <label className="flex items-center gap-2">
      <input
        type="radio"
        id={label}
        value={value}
        className="h-4 w-4 appearance-none rounded-full border border-text bg-white checked:border-gray2 checked:bg-vividGreen1"
        {...register(name)}
      />

      <span>{label}</span>
    </label>
  );
}
