import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import {
  usePutMealPost,
  usePutMealPostLeave,
} from '@/services/store/storeMutations';
import { useGetMealPostDetail } from '@/services/store/storeQueries';

import { dateFormat, timeFormat } from '@/utils/dateFormat';

import { useDialogContext } from '@/hooks';
import { FaCrown } from 'react-icons/fa';

import SquareButton from '@/components/common/button/SquareButton';
import Modal from '@/components/common/modal/Modal';
import UserImage from '@/components/user/UserImage';

interface MealRecruitCardModalProps {
  id: number;
}

export default function MealRecruitCardModal({
  id,
}: MealRecruitCardModalProps) {
  const { hideDialog, showToast } = useDialogContext();

  const queryClient = useQueryClient();
  const { data } = useGetMealPostDetail(id);
  const { mutateAsync } = usePutMealPost();
  const { mutateAsync: leaveMutateAsync } = usePutMealPostLeave();

  const handleJoinClick = useCallback(async () => {
    try {
      await mutateAsync({ mealPostId: id });
      showToast('참여요청을 성공하였습니다.');
      queryClient.invalidateQueries({
        queryKey: ['useGetInfiniteMealPostList'],
      });
    } catch (err) {
      console.error(err);
      showToast('참여요청을 실패했습니다.');
    }
  }, [id, mutateAsync, queryClient, showToast]);

  const handleLeaveClick = useCallback(async () => {
    try {
      await leaveMutateAsync({ mealPostId: id });
      showToast('모임에서 성공적으로 탈퇴했습니다.');
      queryClient.invalidateQueries({
        queryKey: ['useGetInfiniteMealPostList'],
      });
    } catch (err) {
      console.error(err);
      showToast('탈퇴 요청을 처리하는 데 문제가 발생했습니다.');
    }
  }, [id, leaveMutateAsync, queryClient, showToast]);

  return (
    <Modal
      className="main-w-[284px] px-8 py-10"
      onToggleClick={() => hideDialog()}
      title={
        <div className="text-base font-semibold">{data?.title || '-'}</div>
      }
    >
      <div className="mt-1 flex flex-col gap-2 rounded-lg bg-gray5 px-3 py-[17px] text-sm">
        <div className="flex items-center">
          <span className="meal-recruit-text-divider text-gray1">일정</span>

          <span className="flex flex-1 gap-1 overflow-hidden">
            {data
              ? `${dateFormat(data.appointmentTime)} ${timeFormat(data.appointmentTime, 'A h시')}`
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
        <div className="text-sm text-gray1">{`참여중인 멤버 ${data?.memberCount || 0}/4명`}</div>

        <ul className="mt-3 flex flex-col gap-3">
          {[1, 2].map(item => {
            return (
              <li key={item} className="flex gap-2.5">
                <UserImage className="size-10 p-0.5" profileImageUrl="" />
                <div className="w-full">
                  <div className="flex items-center justify-between gap-9">
                    <span className="text-sm">모집자 닉네임</span>
                    {item === 1 && (
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
          onClick={handleLeaveClick}
          color="gray"
          name="나가기"
        />
        <SquareButton
          color="vividGreen"
          type="button"
          name="참여하기"
          className="w-full flex-1"
          onClick={handleJoinClick}
        />
      </div>
    </Modal>
  );
}
