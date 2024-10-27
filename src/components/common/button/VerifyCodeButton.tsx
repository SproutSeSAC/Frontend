import { getVerifyCodeResult } from '@/services/auth/authQueries';

import { useDialogContext } from '@/hooks';

import SquareButton from '@/components/common/button/SquareButton';

interface VerifyCodeButtonProps {
  currentCode: string;
}

export default function VerifyCodeButton({
  currentCode,
}: VerifyCodeButtonProps) {
  const { alert, hideDialog } = useDialogContext();

  const onVerifyCodeClick = async () => {
    if (currentCode === '') return;

    try {
      const response = await getVerifyCodeResult(currentCode);
      if (response.status === 200) {
        alert({
          showDim: true,
          className: 'z-30',
          text: '인증 확인되었습니다!',
          children: (
            <SquareButton
              name="나가기"
              onClick={hideDialog}
              type="button"
              className="mt-5"
            />
          ),
        });
      }
    } catch (error) {
      alert({
        showDim: true,
        className: 'z-30',
        text: '인증에 실패했습니다.',
        subText: '관리자에게 문의해주세요',
        children: (
          <SquareButton
            name="나가기"
            onClick={hideDialog}
            type="button"
            className="mt-5"
          />
        ),
      });
    }
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
