import { useState } from 'react';

// import { leaveMemberShip } from '@/services/auth/authMutations';
import { useGetUserProfile } from '@/services/auth/authQueries';

import { useDialogContext } from '@/hooks';
import { BsCheckCircle } from 'react-icons/bs';

import SquareButton from '@/components/common/button/SquareButton';
import Modal from '@/components/common/modal/Modal';

export default function MembershipLeaveModal() {
  const [isActive, setIsActive] = useState(false);
  const { hideDialog, alert } = useDialogContext();

  const [textForLeave, setTextForLeave] = useState('');

  const { data: userProfile, isLoading: isUserProfileLoading } =
    useGetUserProfile();

  const onToggleActiveClick = () => setIsActive(prev => !prev);

  const onTextChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setTextForLeave(event.currentTarget.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 백엔드와 협의후 변경 예정.
    // Todo: leaveMemberShip();
    // Todo: 탈퇴 이메일 전송 로직

    await hideDialog();
    alert({
      text: '탈퇴 이메일이 발송되었습니다!',
      children: (
        <div className="mt-4 flex w-60 flex-col items-center">
          <p className="text-center text-sm text-darkGray-active">
            {userProfile?.email}로 발송된 탈퇴 확인 메일을 확인해주세요
          </p>
          <SquareButton name="나가기" onClick={hideDialog} type="button" />
        </div>
      ),
    });
  };

  if (isUserProfileLoading) return null;

  return (
    <Modal
      title="회원탈퇴"
      onToggleClick={hideDialog}
      headerType="squareBackBtn-title"
      className="!max-h-[90vh] max-w-[430px] p-6"
    >
      <p className="mt-5 text-lg font-semibold leading-6">
        {userProfile?.name} 스프님
        <br />
        이별인가요? 너무 아쉬워요.
      </p>
      <p className="mt-7 text-darkGray-active">
        계정을 탈퇴하시면 회원님의 모든 정보와 활동 기록이 삭제되며 복구할 수
        없어요!
      </p>
      <p className="mt-4 text-darkGray-active">
        새싹에서 제공하는 취업정보와 다른 사람들과의 네트워킹도 더 이상 이용하실
        수 없게 돼요!
      </p>
      <p className="mt-4 text-darkGray-active">정말 탈퇴하시겠어요?</p>

      <button
        className="mt-4 flex items-center gap-1"
        onClick={onToggleActiveClick}
      >
        <BsCheckCircle
          className={`size-5 ${isActive ? 'text-darkGreen' : 'text-mainGray'}`}
        />
        <p className={`${isActive ? 'text-black' : 'text-mainGray'}`}>
          회원탈퇴 유의사항을 확인하였으며 이에 동의합니다.
        </p>
      </button>

      <form onSubmit={handleSubmit}>
        <h2 className="mb-3 mt-8 text-lg font-semibold">
          계정을 삭제하시려는 이유가 궁금해요.
        </h2>
        <textarea
          value={textForLeave}
          onChange={onTextChange}
          className="bg-lightGrey min-h-48 w-full resize-none rounded-lg border p-4 outline-none placeholder:text-darkGray-active"
          placeholder="서비스 탈퇴 사유에 대해 알려주세요. 소중한 피드백을 담아 더 나은 서비스로 보답 드리도록 하겠습니다."
        />
        <div className="mb-4 mt-16 flex gap-[10px]">
          <SquareButton
            type="button"
            name="취소"
            className="w-full !bg-mainGray py-3 text-lg font-semibold"
            onClick={hideDialog}
          />
          <SquareButton
            type="submit"
            name="탈퇴하기"
            className={`w-full py-3 text-lg font-semibold ${isActive ? '!bg-mainGreen' : '!bg-darkGray-active'}`}
            disabled={!isActive}
          />
        </div>
      </form>
    </Modal>
  );
}
