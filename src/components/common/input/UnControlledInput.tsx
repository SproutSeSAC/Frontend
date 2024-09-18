import { RegisterOptions, useFormContext } from 'react-hook-form';

interface InputProps {
  type?: 'text' | 'email' | 'password';
  name: string;
  condition?: RegisterOptions;
  placeholder: string;
  className?: string;
}

export default function UnControlledInput({
  type = 'text',
  name,
  condition,
  placeholder,
  className,
}: InputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <input
        type={type}
        id={name}
        className={`rounded-xl border p-2 outline-none hover:placeholder-black ${className}`}
        placeholder={placeholder}
        {...register(name, condition)}
      />

      {errors[name] && (
        <span className="ml-4 mt-1.5 inline-block text-sm text-[#FF3939]">
          {`${errors[name]?.message}`}
        </span>
      )}
    </>
  );
}
