import { IoIosInformation } from 'react-icons/io';

interface InfoHoverBoxProps {
  text: string;
  className?: string;
}

export default function InfoHoverBox({
  text,
  className = '',
}: InfoHoverBoxProps) {
  return (
    <div
      className={`group relative flex cursor-pointer items-center justify-center rounded-lg bg-bg ${className}`}
    >
      <IoIosInformation className="size-8 text-xl text-darkGray" />
      <span className="absolute right-0 top-[110%] z-10 hidden w-[185px] rounded-lg bg-black px-5 py-6 text-base leading-6 text-white opacity-70 group-hover:block">
        {text}
      </span>
    </div>
  );
}
