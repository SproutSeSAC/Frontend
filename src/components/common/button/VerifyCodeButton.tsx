import { useDialogContext } from '@/hooks';

import SquareButton from '@/components/common/button/SquareButton';

const CODE = '새싹';

interface VerifyCodeButtonProps {
  currentCode: string;
}

export default function VerifyCodeButton({
  currentCode,
}: VerifyCodeButtonProps) {
  const { alert, hideDialog } = useDialogContext();

  const verified = CODE === currentCode;

  const onVerifyCodeClick = () => {
    alert({
      showDim: true,
      className: 'z-30',
      text: verified ? '인증 확인되었습니다!' : '인증에 실패했습니다.',
      subText: !verified ? '관리자에게 문의해주세요' : undefined,
      children: (
        <SquareButton
          name="나가기"
          onClick={hideDialog}
          type="button"
          className="mt-5"
        />
      ),
    });
  };

  return (
    <button
      type="button"
      className="absolute right-0 top-12 mt-2 rounded-md border px-2 py-0.5 text-gray1"
      onClick={onVerifyCodeClick}
    >
      인증 확인
    </button>
  );
}
