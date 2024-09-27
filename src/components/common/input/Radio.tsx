import { KeyOfRole } from '@/types';
import { RegisterOptions, useFormContext } from 'react-hook-form';

interface RadioProps {
  value: KeyOfRole | string;
  label: string;
  name: string;
  options?: RegisterOptions;
}

export default function Radio({ value, label, name, options }: RadioProps) {
  const { register } = useFormContext();

  return (
    <div className="flex items-center gap-2">
      <input
        type="radio"
        id={label}
        value={value}
        className="h-4 w-4 appearance-none rounded-full border border-text bg-white checked:border-gray2 checked:bg-vividGreen1"
        {...register(name, options)}
      />

      <label htmlFor={label}>{label}</label>
    </div>
  );
}
