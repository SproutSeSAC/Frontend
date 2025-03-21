import { useState } from 'react';

import { getVerifyCodeResult } from '@/services/auth/authQueries';

import { authenticationCodeAtom } from '@/atoms/authenticationCodeAtom';

import { useDialogContext } from '@/hooks';
import { useAtom } from 'jotai';
import { useFormContext, useWatch } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import TextInput from '@/components/common/input/TextInput';
import VerificationContainer from '@/components/signup/VerificationContainer';

export default function AuthenticationCode() {
  const [isAuthenticationCode, setIsAuthenticationCode] = useAtom(
    authenticationCodeAtom,
  );
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  const watchedVerifyCode = useWatch({ control, name: 'verifyCode' });

  const { alert, hideDialog } = useDialogContext();

  const onVerifyCodeClick = async () => {
    if (watchedVerifyCode === '') return;

    setIsPending(true);

    try {
      const response = await getVerifyCodeResult(watchedVerifyCode);
      if (response.status === 200) {
        alert({
          text: '인증되었습니다!',
          children: (
            <SquareButton
              name="나가기"
              onClick={() => {
                setIsAuthenticationCode(true);
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
    setIsPending(false);
  };

  return (
    <VerificationContainer
      isVerified={isAuthenticationCode}
      onVerifyClick={onVerifyCodeClick}
      buttonName="인증 확인"
      buttonDisabled={isPending}
    >
      <TextInput
        disabled={isAuthenticationCode}
        placeholder="인증코드를 입력해주세요"
        className="!h-[50px] w-full bg-white pl-4"
        {...register('verifyCode')}
        errorMsg={errors?.verifyCode?.message as string}
      />
    </VerificationContainer>
  );
}
