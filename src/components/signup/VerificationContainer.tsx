import { ReactNode } from 'react';

import { BsCheckCircle } from 'react-icons/bs';

interface VerificationContainerProps {
  children: ReactNode;
  isVerified: boolean;
  onVerifyClick: () => void;
  buttonName: string;
}

export default function VerificationContainer({
  children,
  isVerified,
  onVerifyClick,
  buttonName,
}: VerificationContainerProps) {
  return (
    <div
      className={`relative pb-10 ${isVerified && '[&>div>input]:border-vividGreen1 [&>div>input]:text-vividGreen2'}`}
    >
      {children}

      {isVerified && (
        <BsCheckCircle className="absolute right-4 top-4 text-lg text-vividGreen1" />
      )}

      <button
        type="button"
        className={`absolute right-0 top-12 mt-2 rounded-md border px-2 py-0.5 ${isVerified ? 'text-gray2' : 'text-gray1'}`}
        onClick={onVerifyClick}
        disabled={isVerified}
      >
        {buttonName}
      </button>
    </div>
  );
}
