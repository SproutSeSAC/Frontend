interface CheckboxGroupProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

// NOTE - 추후 API 명세에 따라 Props의 구조가 바뀜으로 컴포넌트 구조 또한 바뀔 예정입니다.
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
