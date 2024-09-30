import { useToggleModal } from '@/hooks';

import Alert from '@/components/common/modal/Alert';

const CODE = '새싹';

interface VerifyCodeButtonProps {
  currentCode: string;
}

export default function VerifyCodeButton({
  currentCode,
}: VerifyCodeButtonProps) {
  const { modalOpen, toggleModal } = useToggleModal();
  const onVerifyCodeClick = () => {
    if (CODE === currentCode) {
      toggleModal();
    } else {
      toggleModal();
    }
  };

  return (
    <>
      <button
        type="button"
        className="absolute right-0 top-12 mt-2 rounded-md border px-2 py-0.5 text-gray1"
        onClick={onVerifyCodeClick}
      >
        인증 확인
      </button>

      {modalOpen && <Alert toggleModal={toggleModal} />}
    </>
  );
}
