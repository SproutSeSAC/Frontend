import { ReactNode } from 'react';

import { BsCheckCircle } from 'react-icons/bs';

interface VerificationContainerProps {
  children: ReactNode;
  isVerified: boolean;
  onVerifyClick: () => void;
  buttonName: string;
  buttonDisabled: boolean;
}

export default function VerificationContainer({
  children,
  isVerified,
  onVerifyClick,
  buttonName,
  buttonDisabled,
}: VerificationContainerProps) {
  return (
    <div
      className={`relative pb-10 ${isVerified && '[&>div>input]:border-darkGreen [&>div>input]:text-darkGreen-hover'}`}
    >
      {children}

      {isVerified && (
        <BsCheckCircle className="absolute right-4 top-4 text-lg text-darkGreen" />
      )}

      <button
        type="button"
        className={`absolute right-0 top-12 mt-2 rounded-md border px-2 py-0.5 ${isVerified ? 'text-mainGray' : 'text-darkGray-active'}`}
        onClick={onVerifyClick}
        disabled={isVerified || buttonDisabled}
      >
        {buttonName}
      </button>
    </div>
  );
}
