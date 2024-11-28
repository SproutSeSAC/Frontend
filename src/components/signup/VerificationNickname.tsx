import { getVerifyNicknameResult } from '@/services/auth/authQueries';

import { verificationNicknameAtom } from '@/atoms/verificationNicknameAtom';

import { useDialogContext } from '@/hooks';
import { useAtom } from 'jotai';
import { useFormContext, useWatch } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import TextInput from '@/components/common/input/TextInput';
import VerificationContainer from '@/components/signup/VerificationContainer';

export default function VerificationNickname() {
  const [isVerifiedNickname, setIsVerifiedNickname] = useAtom(
    verificationNicknameAtom,
  );

  const {
    register,
    formState: { errors },
    control,
    trigger,
  } = useFormContext();

  const watchedNickname = useWatch({ control, name: 'nickname' });

  const { alert, hideDialog } = useDialogContext();

  const onVerifyClick = async () => {
    if (watchedNickname === '') return;

    const isValid = await trigger('nickname');

    if (isValid) {
      try {
        const response = await getVerifyNicknameResult(watchedNickname);
        if (response.status === 200) {
          alert({
            text: '사용 가능한 닉네임입니다!',
            children: (
              <SquareButton
                name="확인"
                onClick={() => {
                  setIsVerifiedNickname(true);
                  hideDialog();
                }}
                type="button"
              />
            ),
          });
        }
      } catch (error) {
        alert({
          text: '이미 사용중인 닉네임입니다.',
          children: (
            <SquareButton name="나가기" onClick={hideDialog} type="button" />
          ),
        });
      }
    }
  };

  return (
    <VerificationContainer
      onVerifyClick={onVerifyClick}
      isVerified={isVerifiedNickname}
      buttonName="중복 확인"
    >
      <TextInput
        disabled={isVerifiedNickname}
        placeholder="사용하실 닉네임을 입력해주세요"
        className="h-[50px] w-full pl-4"
        {...register('nickname')}
        errorMsg={errors.nickname?.message as string}
      />
    </VerificationContainer>
  );
}
