import { useState } from 'react';

import { BsEye, BsEyeSlash } from 'react-icons/bs';

export default function EyeButton() {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisible = () => setIsVisible(prev => !prev);

  const iconStyle = 'size-6 pt-0.5 text-gray2';

  return (
    <button
      type="button"
      aria-label={isVisible ? '보임' : '숨김'}
      className="cursor-pointer px-1 py-2"
      onClick={toggleVisible}
    >
      {isVisible ? (
        <BsEye className={iconStyle} />
      ) : (
        <BsEyeSlash className={`${iconStyle} text-text`} />
      )}
    </button>
  );
}
