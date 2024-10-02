import { useToggleModal } from '@/hooks';

import SquareButton from '@/components/common/button/SquareButton';
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
    toggleModal();
  };

  const verified = CODE === currentCode;

  return (
    <>
      <button
        type="button"
        className="absolute right-0 top-12 mt-2 rounded-md border px-2 py-0.5 text-gray1"
        onClick={onVerifyCodeClick}
      >
        인증 확인
      </button>

      {modalOpen && (
        <Alert
          text={verified ? '인증 확인되었습니다!' : '인증에 실패했습니다.'}
          subText={!verified ? '관리자에게 문의해주세요' : undefined}
          className="gap-1"
        >
          <SquareButton
            name="계속 작성하기"
            onClick={toggleModal}
            type="button"
            className="mt-5"
            color="gray"
          />
          <SquareButton
            name="나가기"
            onClick={toggleModal}
            type="button"
            className="mt-5"
          />
        </Alert>
      )}
    </>
  );
}
