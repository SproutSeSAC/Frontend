import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import {
  useDeleteMealPost,
  usePutMealParticipate,
  usePutMealPostLeave,
} from '@/services/store/storeMutations';
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
  isOwner: boolean;
}

export default function MealRecruitCardModal({
  id,
  isParticipant,
  isOwner,
}: MealRecruitCardModalProps) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetMealPostDetail(id);

  const { hideDialog, showToast, alert } = useDialogContext();

  const {
    mutateAsync: joinMeal,
    isPending: isJoinMealPending,
    isIdle: isJoinIdle,
  } = usePutMealParticipate();

  const {
    mutateAsync: leaveMeal,
    isPending: isLeaveMealPending,
    isIdle: isLeaveIdle,
  } = usePutMealPostLeave();

  const {
    mutateAsync: deleteMeal,
    isPending: isDeleteMealPending,
    isIdle: isDeleteIdle,
  } = useDeleteMealPost();

  const handleJoinClick = useCallback(async () => {
    try {
      await joinMeal({ mealPostId: id });
      await queryClient.invalidateQueries({
        queryKey: ['useGetInfiniteMealPostList'],
      });
      hideDialog();
      showToast('한끼팟 참여에 성공하였습니다.');
    } catch (err) {
      hideDialog();
      showToast('한끼팟 참여에 실패했습니다.');
    }
  }, [id, queryClient, hideDialog, showToast, joinMeal]);

  const handleLeaveClick = useCallback(async () => {
    try {
      await hideDialog('MEAL-RECRUIT-CARD-TYPE');

      if (isOwner) {
        await alert({
          text: '정말로 한끼팟을 폭파하시겠습니까?',
          subText: '다른 참여자들은 모두 자동으로 나가게 됩니다.',
          subTextColor: 'green',
          children: (
            <>
              <SquareButton
                name="취소"
                onClick={hideDialog}
                color="gray"
                type="button"
              />
              <SquareButton
                type="button"
                name="확인"
                onClick={async () => {
                  await deleteMeal({ mealPostId: id });
                  await hideDialog();
                  await queryClient.invalidateQueries({
                    queryKey: ['useGetInfiniteMealPostList'],
                  });
                  showToast('한끼팟을 폭파했습니다.');
                }}
              />
            </>
          ),
        });
      } else {
        await leaveMeal({ mealPostId: id });
        await hideDialog();
        await queryClient.invalidateQueries({
          queryKey: ['useGetInfiniteMealPostList'],
        });
        showToast('한끼팟 나가기에 성공하였습니다.');
      }
    } catch (err) {
      hideDialog();
      showToast(
        isOwner
          ? '한끼팟을 폭파하지 못했습니다.'
          : '한끼팟 나가기에 실패했습니다.',
      );
    }
  }, [
    isOwner,
    queryClient,
    showToast,
    alert,
    hideDialog,
    deleteMeal,
    id,
    leaveMeal,
  ]);

  return (
    !isLoading &&
    data && (
      <Modal
        onClose={hideDialog}
        modalSize="sm"
        headerType="onlyTitle"
        headerSize="base"
        title={data.title}
        zIndex={200}
      >
        <div className="flex flex-col gap-2 rounded-lg bg-lightGray-active px-3 py-[17px] text-sm">
          <div className="flex items-center">
            <span className="meal-recruit-text-divider text-darkGray-active">
              일정
            </span>

            <span className="flex flex-1 gap-1 overflow-hidden">
              {data
                ? `${formatDate(data.appointmentTime, 'yyyy.MM.dd a h시 mm분')}`
                : '-'}
            </span>
          </div>

          <div className="flex items-center">
            <span className="meal-recruit-text-divider text-darkGray-active">
              식당
            </span>

            <span className="flex flex-1 gap-1 overflow-hidden">
              {data?.storeName || '-'}
            </span>
          </div>

          <div className="flex items-center">
            <span className="meal-recruit-text-divider text-darkGray-active">
              만남 장소
            </span>

            <span className="flex flex-1 gap-1 overflow-hidden">
              {data?.meetingPlace || '-'}
            </span>
          </div>
        </div>

        <div className="mb-12 mt-6">
          <div className="text-sm text-darkGray-active">
            참여중인 멤버 {data?.currentMemberCount || 0}/
            {data?.targetMemberCount === 10000
              ? '∞'
              : `${data?.targetMemberCount}명`}
          </div>

          <ul className="mt-3 flex flex-col gap-3">
            {(data?.members || []).map(member => {
              return (
                <li key={member.userId} className="flex items-center gap-2.5">
                  <UserImage
                    className="size-10"
                    imageNameSegment={member.profileImageUrl}
                  />
                  <div className="flex w-full items-center justify-between gap-9">
                    <span className="text-sm">@{member.nickname}</span>
                    {member.isOwner && (
                      <div className="flex items-center justify-between gap-1 rounded bg-[#FEFAE0] px-1.5 py-1 text-xs text-[#FF6D28]">
                        <FaCrown />
                        <span>모임장</span>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-6 flex gap-3">
          <SquareButton
            type="button"
            onClick={hideDialog}
            color="gray"
            name="닫기"
            className={isOwner ? 'flex-1' : ''}
          />
          {!isParticipant && (
            <SquareButton
              type="button"
              name="참여하기"
              className="w-full flex-1"
              onClick={handleJoinClick}
              disabled={isJoinMealPending || !isJoinIdle}
            />
          )}

          {isParticipant && (
            <SquareButton
              type="button"
              name={isOwner ? '한끼팟 폭파' : '한끼팟 나가기'}
              className="w-full flex-1"
              onClick={handleLeaveClick}
              disabled={
                isOwner
                  ? isDeleteMealPending || !isDeleteIdle
                  : isLeaveMealPending || !isLeaveIdle
              }
            />
          )}
        </div>
      </Modal>
    )
  );
}
