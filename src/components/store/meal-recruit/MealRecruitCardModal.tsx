import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { usePutMealPost } from '@/services/store/storeMutations';
import { useGetMealPostDetail } from '@/services/store/storeQueries';

import { useDialogContext } from '@/hooks';
import { formatDate } from '@/utils';
import { FaCrown } from 'react-icons/fa';

import SquareButton from '@/components/common/button/SquareButton';
import Modal from '@/components/common/modal/Modal';
import UserImage from '@/components/user/UserImage';

interface MealRecruitCardModalProps {
  id: number;
  isParticipant: boolean;
}

export default function MealRecruitCardModal({
  id,
  isParticipant,
}: MealRecruitCardModalProps) {
  const { hideDialog, showToast } = useDialogContext();

  const queryClient = useQueryClient();
  const { data } = useGetMealPostDetail(id);
  const { mutateAsync } = usePutMealPost();

  const handleJoinClick = useCallback(async () => {
    try {
      await mutateAsync({ mealPostId: id });
      showToast('참여요청을 성공하였습니다.');
      queryClient.invalidateQueries({
        queryKey: ['useGetInfiniteMealPostList'],
      });
      hideDialog();
    } catch (err) {
      console.error(err);
      showToast('참여요청을 실패했습니다.');
      hideDialog();
    }
  }, [hideDialog, id, mutateAsync, queryClient, showToast]);

  return (
    <Modal
      className="main-w-[284px] px-8 py-10"
      onToggleClick={hideDialog}
      hideClose
      title={
        <div className="text-base font-semibold">{data?.title || '-'}</div>
      }
    >
      <div className="mt-1 flex flex-col gap-2 rounded-lg bg-gray5 px-3 py-[17px] text-sm">
        <div className="flex items-center">
          <span className="meal-recruit-text-divider text-gray1">일정</span>

          <span className="flex flex-1 gap-1 overflow-hidden">
            {data
              ? `${formatDate(data.appointmentTime, 'yyyy.MM.dd a h시')}`
              : '-'}
          </span>
        </div>

        <div className="flex items-center">
          <span className="meal-recruit-text-divider text-gray1">식당</span>

          <span className="flex flex-1 gap-1 overflow-hidden">
            {data?.storeName || '-'}
          </span>
        </div>

        <div className="flex items-center">
          <span className="meal-recruit-text-divider text-gray1">위치</span>

          <span className="flex flex-1 gap-1 overflow-hidden">
            {data?.meetingPlace || '-'}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm text-gray1">{`참여중인 멤버 ${data?.currentMemberCount || 0}/${data?.targetMemberCount}명`}</div>

        <ul className="mt-3 flex flex-col gap-3">
          {(data?.members || []).map(member => {
            return (
              <li key={member.userId} className="flex gap-2.5">
                <UserImage
                  className="size-10"
                  // imgUrl={member.imgUrl} //TODO: img url 수정되면 노출
                />
                <div className="w-full">
                  <div className="flex items-center justify-between gap-9">
                    <span className="text-sm">{member.nickname}</span>
                    {member.isOwner && (
                      <div className="flex items-center justify-between gap-1 rounded bg-[#FEFAE0] px-1.5 py-1 text-xs text-[#FF6D28]">
                        <FaCrown />
                        <span>모임장</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray2">디자인</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 flex gap-3">
        <SquareButton
          type="button"
          className={`${isParticipant && 'flex-1'}`}
          onClick={hideDialog}
          color="gray"
          name="나가기"
        />
        {!isParticipant && (
          <SquareButton
            color="vividGreen"
            type="button"
            name="참여하기"
            className="w-full flex-1"
            onClick={handleJoinClick}
          />
        )}
      </div>
    </Modal>
  );
}
