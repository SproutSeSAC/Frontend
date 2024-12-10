import { useNavigate } from 'react-router-dom';

import { FaChevronLeft } from 'react-icons/fa6';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="flex size-10 h-[38px] w-[38px] items-center justify-center rounded bg-vividGreen2 text-white"
    >
      <FaChevronLeft />
    </button>
  );
}
