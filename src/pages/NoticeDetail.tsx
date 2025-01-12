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
  useHandleImage,
  useHandleOnScrap,
  useHandlePostActions,
} from '@/hooks';
import { findCurrNotice, getColorByRole, isPreTrainee } from '@/utils';
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

  const { deletePostImages } = useHandleImage();

  const { mutateAsync: deleteNotice } = useDeleteNotice({
    onSuccess: () => {
      if (noticeDetail?.content) {
        deletePostImages(noticeDetail.content);
      }
    },
  });

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

  const navigate = useNavigate();

  const { actions } = useHandlePostActions({
    postType: '공지사항을',
    requiredActions: {
      delete: {
        action: () => {
          deleteNotice({ noticeId });
          navigate('/notice');
        },
      },
      edit: {
        action: () => {
          const state = noticeDetail;
          navigate(`/notice?tab=EDIT&modifyNotice=${noticeId}`, { state });
        },
      },
    },
    invalidateQueryKeys: ['useGetInfiniteNoticeList'],
  });

  const applySession = useCallback(() => {
    if (
      noticeDetail &&
      !isPreTrainee(noticeDetail.writer.role) &&
      findCurrNotice(noticeDetail.noticeType)?.needExtraInfo
    ) {
      const {
        sessions,
        isPhoneNumberRequired,
        participantCapacity, //
      } = noticeDetail;

      if ((sessions?.length || 0) > 0 && participantCapacity) {
        if (sessions?.[0]?.currentStatus === null) {
          const actionToApply = {
            label: '참여하기',
            onClick: () => {
              showDialog({
                key: 'APPLICATION-NOTICE',
                element: (
                  <NoticeModal
                    participantCapacity={participantCapacity}
                    sessions={sessions ?? []}
                    isPhoneNumberRequired={isPhoneNumberRequired ?? false}
                  />
                ),
              });
            },
            className: 'bg-oliveGreen1',
          };
          return [actionToApply];
        }
        const applicationComplete = {
          label: '신청 완료',
          className: 'bg-vividGreen1',
          disabled: true,
          onClick: () => {}, // NOTE: 마이페이지 신청내역으로 이동시키기
        };
        return [applicationComplete];
      }
    }
    return undefined;
  }, [noticeDetail, showDialog]);

  const onBackClick = () => navigate('/notice');

  return (
    <main className="flex w-full">
      <BackButton onClick={onBackClick} />

      <div className="w-full">
        <section className="w-full px-6 pb-[45px] pt-5">
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
                size="big"
                text={noticeCategoryDisplay[noticeDetail?.noticeType]}
                className="px-[10px] py-[5px]"
              />
            )}
            {noticeDetail?.writer.userId === userProfile.userId && (
              <div className="group relative ml-auto flex items-center justify-center">
                <button className="px-2">
                  <IoEllipsisHorizontalSharp className="size-7 text-gray1" />
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
            nickname={noticeDetail?.writer.userName || '-'}
            createdAt={noticeDetail?.createdAt}
            viewCount={noticeDetail?.viewCount || 0}
            description={noticeDetail?.content || '-'}
            actions={applySession()}
            imageNameSegment={noticeDetail?.writer.profileUrl}
          />
        </section>

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
    </main>
  );
}
