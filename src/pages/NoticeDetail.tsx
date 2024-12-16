import { useCallback } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import {
  useDeleteNotice,
  usePostNoticeComment,
  usePostNoticeScrap,
} from '@/services/notice/noticeMutations';
import {
  useGetNoticeCommentList,
  useGetNoticeDetail,
} from '@/services/notice/noticeQueries';

import { RolesObj, noticeCategoryDisplay } from '@/constants';
import {
  useDialogContext,
  useHandleComment,
  useHandleOnScrap,
  useHandlePost,
  useSubmitNotice,
} from '@/hooks';
import { NoticeDto } from '@/types';
import { getColorByRole, isPreTrainee } from '@/utils';
import { IoEllipsisHorizontalSharp } from 'react-icons/io5';

import BackButton from '@/components/common/button/BackButton';
import FavoriteButton from '@/components/common/button/FavoriteButton';
import CommentTemplate from '@/components/common/post-template/CommentTemplate';
import PostDetailsTemplate from '@/components/common/post-template/PostDetailsTemplate';
import Tag from '@/components/common/tag/Tag';
import NoticeApplicationInfoTemplate from '@/components/notice/NoticeApplicationInfoTemplate';
import NoticeModal from '@/components/notice/modal/NoticeModal';

export default function NoticeDetail() {
  const { postId } = useParams<{ postId: string }>();

  const noticeId = +postId!;

  const { showDialog } = useDialogContext();

  const { data: userProfile = initialUserProfile } = useGetUserProfile();

  const { data: noticeDetail } = useGetNoticeDetail(noticeId);

  const { mutateAsync: postNoticeComment } = usePostNoticeComment(noticeId);

  const { data: commentList } = useGetNoticeCommentList(noticeId);

  const { mutateAsync: deleteNotice } = useDeleteNotice();

  const { findCurrNotice } = useSubmitNotice();

  const { handleSubmitComment } = useHandleComment({
    postComment: postNoticeComment,
    invalidateQueryKeys: ['useGetNoticeCommentList'],
  });

  const { mutateAsync: postNoticeScrap } = usePostNoticeScrap();

  const getScrapResult = useCallback(async () => {
    return postNoticeScrap({ noticeId: noticeDetail?.id || noticeId });
  }, [postNoticeScrap, noticeDetail?.id, noticeId]);

  const { onScrapClick } = useHandleOnScrap({
    getScrapResult,
    invalidateQueryKeys: ['useGetNoticeDetail'],
  });

  const { actions: postActions } = useHandlePost<
    { noticeId: number },
    NoticeDto.GetNoticeDetail
  >({
    postId: { noticeId },
    postType: '공지사항을',
    handleDelete: {
      deletePost: deleteNotice,
      navigateTo: '/notice',
    },
    handleEdit: {
      detail: noticeDetail,
      navigateTo: `/notice?tab=EDIT&modifyNotice=${noticeId}`,
    },
    invalidateQueryKeys: ['useGetInfiniteNoticeList'],
  });

  const getActions = useCallback(() => {
    const actions = [];

    if (noticeDetail && !isPreTrainee(noticeDetail.writer.role)) {
      const { sessions, noticeType, isPhoneNumberRequired } = noticeDetail;

      if (
        (sessions?.length || 0) > 0 &&
        findCurrNotice(noticeType)?.needExtraInfo
      ) {
        actions.push({
          label: '참여하기',
          onClick: async () => {
            await showDialog({
              key: 'APPLICATION-NOTICE',
              element: (
                <NoticeModal
                  sessions={sessions ?? []}
                  isPhoneNumberRequired={isPhoneNumberRequired ?? false}
                />
              ),
            });
          },
          className: 'bg-oliveGreen1',
        });
      }
    }
    return actions;
  }, [findCurrNotice, noticeDetail, showDialog]);

  const navigate = useNavigate();

  const onBackClick = () => navigate('/notice');

  return (
    <div className="flex w-full">
      <BackButton onClick={onBackClick} />

      <div className="w-full">
        <div className="w-full px-6 pb-[45px] pt-5">
          <header className="flex items-center justify-between">
            <h1 className="text-[32px] font-semibold">
              {noticeDetail?.title || '-'}
            </h1>
            <FavoriteButton
              isFavorite={noticeDetail?.isScraped ?? false}
              onClick={onScrapClick}
              size={24}
            />
          </header>

          <div className="mt-12 flex gap-2">
            {noticeDetail?.writer.role && (
              <Tag
                color={getColorByRole(noticeDetail?.writer.role)}
                size="big"
                text={RolesObj[noticeDetail?.writer.role]}
                emphasisText
                className="px-[10px] py-[5px]"
              />
            )}
            {noticeDetail?.noticeType && (
              <Tag
                color="gray"
                size="medium"
                text={noticeCategoryDisplay[noticeDetail?.noticeType]}
                className="w-fit"
              />
            )}

            {/* 수정 삭제 버튼 */}
            {noticeDetail?.writer.userId === userProfile.userId && (
              <div className="group relative ml-auto flex items-center justify-center">
                <button className="px-2">
                  <IoEllipsisHorizontalSharp className="size-7 text-gray1" />
                </button>
                <div className="absolute right-0 top-5 z-10 hidden py-4 hover:block group-hover:block">
                  <ul className="flex w-[90px] flex-col items-center gap-3 rounded-md bg-white p-3 shadow-card">
                    {postActions.map(action => (
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
            nickname={noticeDetail?.writer.userName || '-'}
            createdAt={noticeDetail?.applicationStartDateTime}
            viewCount={noticeDetail?.viewCount || 0}
            description={noticeDetail?.content || '-'}
            actions={getActions()}
          />
        </div>

        <CommentTemplate
          commentList={(commentList || []).map(
            ({ content, createdAt, ...rest }) => ({
              id: rest.commentId,
              content,
              createdAt,
              writer: rest.userName,
              imgUrl: rest.userProfileUrl,
            }),
          )}
          onSubmit={handleSubmitComment}
        />
      </div>
    </div>
  );
}
