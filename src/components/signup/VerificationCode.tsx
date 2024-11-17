import { getVerifyCodeResult } from '@/services/auth/authQueries';

import { verifiedCodeAtom } from '@/atoms/verificationCodeAtom';

import { useDialogContext } from '@/hooks';
import { useAtom } from 'jotai';
import { useFormContext, useWatch } from 'react-hook-form';
import { BsCheckCircle } from 'react-icons/bs';

import SquareButton from '@/components/common/button/SquareButton';
import TextInput from '@/components/common/input/TextInput';

export default function VerificationCode() {
  const [isVerifiedCode, setIsVerifiedCode] = useAtom(verifiedCodeAtom);

  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  const watchedVerifyCode = useWatch({ control, name: 'verifyCode' });

  const { alert, hideDialog } = useDialogContext();

  const onVerifyCodeClick = async () => {
    if (watchedVerifyCode === '') return;

    try {
      const response = await getVerifyCodeResult(watchedVerifyCode);
      if (response.status === 200) {
        alert({
          text: '인증되었습니다!',
          children: (
            <SquareButton
              name="나가기"
              onClick={() => {
                setIsVerifiedCode(true);
                hideDialog();
              }}
              type="button"
            />
          ),
        });
      }
    } catch (error) {
      alert({
        text: '인증에 실패했습니다.',
        subText: '관리자에게 문의해주세요',
        children: (
          <SquareButton name="나가기" onClick={hideDialog} type="button" />
        ),
      });
    }
  };

  return (
    <div className="relative pb-10">
      <TextInput
        disabled={isVerifiedCode}
        placeholder="인증코드를 입력해주세요"
        className={`!h-[50px] w-full bg-white pl-4 ${isVerifiedCode && 'border-vividGreen1'}`}
        {...register('verifyCode')}
        errorMsg={errors?.verifyCode?.message as string}
      />

      {isVerifiedCode && (
        <BsCheckCircle className="absolute right-4 top-4 text-lg text-vividGreen1" />
      )}

      <button
        type="button"
        className={`absolute right-0 top-12 mt-2 rounded-md border px-2 py-0.5 ${isVerifiedCode ? 'text-gray2' : 'text-gray1'}`}
        onClick={onVerifyCodeClick}
        disabled={isVerifiedCode}
      >
        인증 확인
      </button>
    </div>
  );
}
