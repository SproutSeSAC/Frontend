import { RegisterOptions, useFormContext } from 'react-hook-form';

interface RadioProps {
  label: string;
  name: string;
  options?: RegisterOptions;
}

export default function Radio({ label, name, options }: RadioProps) {
  const { register, setValue } = useFormContext();

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value === '동의') {
      setValue(name, true);
    } else if (value === '동의하지 않음') {
      setValue(name, false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        id={label}
        type="radio"
        value={label}
        className="h-4 w-4 appearance-none rounded-full border border-text bg-white checked:border-gray2 checked:bg-vividGreen1"
        {...register(name, options)}
        onChange={handleRadioChange}
      />

      <label htmlFor={label}>{label}</label>
    </div>
  );
}
