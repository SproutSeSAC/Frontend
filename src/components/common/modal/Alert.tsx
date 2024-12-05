import { ReactNode } from 'react';

import { createPortal } from 'react-dom';

import SquareButton, {
  ButtonColor,
} from '@/components/common/button/SquareButton';

export interface AlertProps {
  text: string;
  subText?: string;
  className?: string;
  children?: ReactNode;
  buttonList?: { name: string; onClick: () => void; color?: ButtonColor }[];
}

export default function Alert({
  className,
  children,
  text,
  subText,
  buttonList,
}: AlertProps) {
  const el = document.getElementById('modal') as Element;

  return createPortal(
    <section
      className={`fixed inset-0 z-[60] m-auto flex h-fit w-fit min-w-[300px] flex-col items-center justify-between rounded-2xl bg-white p-8 shadow-card ${className}`}
    >
      <p className="text-center text-lg font-semibold">{text}</p>
      <p className="mb-5 whitespace-pre-wrap text-center text-sm text-gray2">
        {subText}
      </p>
      {children && <div className="flex items-center gap-2">{children}</div>}
      {buttonList && (
        <div className="flex items-center gap-2">
          {buttonList.map(({ name, onClick, color }) => (
            <SquareButton
              key={name}
              type="button"
              name={name}
              onClick={onClick}
              color={color}
            />
          ))}
        </div>
      )}
    </section>,
    el,
  );
}
