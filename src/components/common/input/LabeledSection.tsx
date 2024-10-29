import { ReactNode } from 'react';

import { BsQuestionCircle } from 'react-icons/bs';

interface LabeledSectionProps {
  label: string | ReactNode;
  children: ReactNode;
  className?: string;
  tooltip?: string;
}

export default function LabeledSection({
  label,
  children,
  className,
  tooltip,
}: LabeledSectionProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {tooltip ? (
        <div className="flex items-center gap-1.5">
          <span className="pl-[5px] text-lg font-medium">{label}</span>
          <div className="relative border">
            <BsQuestionCircle className="peer cursor-pointer text-lg text-oliveGreen2" />
            <div className="absolute -top-9 left-2 hidden whitespace-pre rounded-xl rounded-bl-none bg-gray4 px-3 py-1 peer-hover:block">
              <p>{tooltip}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="pl-[5px] text-lg font-medium">{label}</div>
      )}

      {children}
    </div>
  );
}
