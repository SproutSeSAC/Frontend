interface CheckboxGroupProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function CheckboxGroup({
  title,
  children,
  className,
}: CheckboxGroupProps) {
  return (
    <fieldset>
      <legend className={`mb-[6px] ${className}`}>{title}</legend>
      <div className="flex flex-col gap-1">{children}</div>
    </fieldset>
  );
}
