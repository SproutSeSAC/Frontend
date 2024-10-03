export interface ErrorMsgProps {
  msg: string;
  className?: string;
}

export default function ErrorMsg({ msg, className }: ErrorMsgProps) {
  return (
    <span className={`mt-1.5 inline-block text-sm text-[#FF3939] ${className}`}>
      {msg}
    </span>
  );
}
