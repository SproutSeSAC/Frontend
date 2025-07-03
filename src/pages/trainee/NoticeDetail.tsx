import { useCallback, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import { usePatchNoticeStatus } from '@/services/post/noticeMutations';
import { useDeleteMyPost } from '@/services/post/postMutation';
import { useGetPostDetail } from '@/services/post/postQueries';

import { noticeCategoryDisplay, rolesObj } from '@/constants';
import {
  useDialogContext,
  useHandleImage,
  useHandlePostActions,
  useHandleScrap,
} from '@/hooks';
import { NoticeDto } from '@/types';
import { findCurrNotice, hasAdmin } from '@/utils';
import { IoEllipsisHorizontalSharp } from 'react-icons/io5';

import LoopLoading from '@/components/common/LoopLoading';
import BackButton from '@/components/common/button/BackButton';
import FavoriteButton from '@/components/common/button/FavoriteButton';
import CommentTemplate from '@/components/common/post-template/CommentTemplate';
import PostDetailsTemplate from '@/components/common/post-template/PostDetailsTemplate';
import Tag from '@/components/common/tag/Tag';
import NoticeApplicationInfoTemplate from '@/components/notice/NoticeApplicationInfoTemplate';
import SessionApplicationModal from '@/components/notice/modal/SessionApplicationModal';

export default function NoticeDetail() {
  const { postId: id } = useParams();

  const postId = +id!;

  const { showDialog } = useDialogContext();

  const { data: userProfile = initialUserProfile } = useGetUserProfile();

  const {
    data: noticeDetail,
    isLoading: isNoticeDetailLoading,
    error,
  } = useGetPostDetail<NoticeDto.GetNoticeDetail>(postId);

  const { deletePostImages } = useHandleImage();

  const { mutateAsync: deleteNotice } = useDeleteMyPost({
    onSuccess: () => {
      if (noticeDetail?.content) {
        deletePostImages(noticeDetail.content);
      }
    },
  });

  const { onScrapClick, isPostScrapPending, isDeleteScrapPending } =
    useHandleScrap({
      postId,
      isScraped: !!noticeDetail?.isScraped,
      invalidateQueryKeys: [{ queryKey: ['useGetPostDetail', postId] }],
    });

  const navigate = useNavigate();

  const { actions } = useHandlePostActions({
    postType: '공지사항을',
    requiredActions: {
      delete: {
        action: async () => {
          await deleteNotice({ postId });
          navigate('/notice');
        },
      },
      edit: {
        action: () => {
          const state = noticeDetail;
          navigate(`/notice?tab=EDIT&modifyNotice=${postId}`, { state });
        },
      },
    },
    invalidateQueryKeys: ['useGetInfiniteNoticeList'],
  });

  const queryClient = useQueryClient();

  const { mutateAsync: changeNoticeStatus } = usePatchNoticeStatus({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['useGetPostDetail', postId],
      });
    },
  });

  const sessionActionList = useCallback(() => {
    if (noticeDetail && noticeDetail.sessions) {
      const { sessions, participantCapacity, applicationEndDateTime } =
        noticeDetail;

      if (applicationEndDateTime && participantCapacity) {
        const isEndApplication =
          new Date(applicationEndDateTime).getTime() < new Date().getTime();

        const applySessionList = {
          label: '참여하기',
          className: 'bg-mainGreen text-white disabled:bg-mainGray-hover',
          disabled: isEndApplication || noticeDetail.status !== 'ACTIVE',
          onClick: () => {
            showDialog({
              key: 'APPLICATION-NOTICE',
              element: (
                <SessionApplicationModal
                  participantCapacity={participantCapacity}
                  sessions={sessions}
                  postId={postId}
                />
              ),
            });
          },
        };

        const toggleNoticeStatus = {
          label:
            noticeDetail.status === 'ACTIVE'
              ? '신청 마감하기'
              : '다시 신청받기',
          className: 'bg-mainBlue-active text-white disabled:bg-mainGray-hover',
          disabled: isEndApplication,
          onClick: () => {
            changeNoticeStatus({ noticeId: noticeDetail.id });
          },
        };

        const currAdminWriter =
          hasAdmin(noticeDetail.writer.role) &&
          noticeDetail.writer.userId === userProfile.userId;

        return currAdminWriter
          ? [applySessionList, toggleNoticeStatus]
          : [applySessionList];
      }
    }
    return [];
  }, [
    changeNoticeStatus,
    noticeDetail,
    postId,
    showDialog,
    userProfile.userId,
  ]);

  const onBackClick = () => navigate('/notice');

  const { alert, hideDialog } = useDialogContext();

  useEffect(() => {
    const errorStatus = (error as unknown as { status: number })?.status;
    if (errorStatus) {
      navigate(-1);
      alert({
        text: '게시글을 찾을 수 없습니다.',
        showDim: true,
        buttonList: [{ name: '확인', onClick: hideDialog, color: 'gray' }],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <div className="flex w-full">
      <BackButton onClick={onBackClick} />

      {isNoticeDetailLoading ? (
        <div className="ml-2 flex h-[80vh] w-full items-center justify-center">
          <LoopLoading />
        </div>
      ) : (
        <div className="w-full">
          <section className="w-full px-6 pb-[45px] pt-5">
            <header className="flex items-center justify-between">
              <h1 className="pr-4 text-[32px] font-semibold">
                {noticeDetail?.title || '-'}
              </h1>
              <FavoriteButton
                isFavorite={noticeDetail?.isScraped ?? false}
                onClick={onScrapClick}
                size={24}
                disabled={isPostScrapPending || isDeleteScrapPending}
              />
            </header>

            <div className="mt-12 flex gap-2">
              {noticeDetail?.writer?.role && (
                <Tag
                  roleKey={noticeDetail?.writer?.role}
                  size="big"
                  text={rolesObj[noticeDetail?.writer?.role]}
                  className="px-[10px] py-[5px]"
                />
              )}
              {noticeDetail?.noticeType && (
                <Tag
                  size="big"
                  color="gray"
                  text={noticeCategoryDisplay[noticeDetail?.noticeType]}
                  className="px-[10px] py-[5px]"
                />
              )}
              {noticeDetail?.writer?.userId === userProfile?.userId && (
                <div className="group relative ml-auto flex items-center justify-center">
                  <button className="px-2">
                    <IoEllipsisHorizontalSharp className="size-7 text-darkGray-active" />
                  </button>

                  <div className="absolute right-0 top-5 z-10 hidden py-4 hover:block group-hover:block">
                    <ul className="flex w-[90px] flex-col items-center gap-3 rounded-md bg-white p-3 shadow-card">
                      {actions.map(action => (
                        <li key={action.label}>
                          <button
                            onClick={action.onClick}
                            className={action.className}
                          >
                            {action.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {noticeDetail?.noticeType &&
              findCurrNotice(noticeDetail?.noticeType)?.needExtraInfo && (
                <NoticeApplicationInfoTemplate notice={noticeDetail} />
              )}

            <PostDetailsTemplate
              name={noticeDetail?.writer?.userName || '-'}
              createdAt={noticeDetail?.createdAt}
              viewCount={noticeDetail?.viewCount || 0}
              description={noticeDetail?.content || '-'}
              actions={sessionActionList()}
              imageNameSegment={noticeDetail?.writer?.profileUrl}
            />
          </section>

          <CommentTemplate postId={postId} />
        </div>
      )}
    </div>
  );
}
