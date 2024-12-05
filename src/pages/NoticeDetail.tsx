import { useCallback, useMemo } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { usePostNoticeComment } from '@/services/notice/noticeMutations';
import {
  useGetNoticeCommentList,
  useGetNoticeDetail,
} from '@/services/notice/noticeQueries';

import { RolesObj, noticeCategoryDisplay } from '@/constants';
import { useDialogContext } from '@/hooks';
import { getColorByRole, isManagerAndAdmin } from '@/utils';
import { FaChevronLeft } from 'react-icons/fa';

import Tag from '@/components/common/Tag';
import FavoriteButton from '@/components/common/button/FavoriteButton';
import CommentTemplate from '@/components/common/post-template/CommentTemplate';
import PostDetailsTemplate from '@/components/common/post-template/PostDetailsTemplate';
import NoticeApplicationInfoTemplate from '@/components/notice/NoticeApplicationInfoTemplate';
import NoticeModal from '@/components/notice/modal/NoticeModal';

export default function NoticeDetail() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const { showToast, showDialog } = useDialogContext();
  const queryClient = useQueryClient();

  const { data } = useGetNoticeDetail(Number(postId!));
  const { data: commentList } = useGetNoticeCommentList(Number(postId!));
  const { mutateAsync: postNoticeComment } = usePostNoticeComment(
    Number(postId!),
  );

  const newCommentList = useMemo(() => {
    return (commentList?.comments || []).map(item => ({
      id: item.commentId,
      content: item.content,
      createdAt: item.createdAt,
      writer: item.userName,
      imgUrl: item.userProfileUrl,
    }));
  }, [commentList?.comments]);

  const handleSubmitComment = useCallback(
    async (commentData: { content: string }) => {
      try {
        await postNoticeComment({ content: commentData.content });
        showToast('댓글을 등록했어요!');
        queryClient.invalidateQueries({
          queryKey: ['useGetNoticeCommentList'],
        });
      } catch (err) {
        console.error(err);
        showToast('댓글등록을 실패했어요');
      }
    },
    [postNoticeComment, queryClient, showToast],
  );

  const getActions = useCallback(() => {
    const actions = [];
    if (data) {
      if (data.meetingType === 'ONLINE') {
        actions.push({
          label: 'Zoom',
          onClick: () => {
            window.location.href = data?.meetingPlace || '';
          },
          className: 'bg-gray2',
        });
      }

      if (!isManagerAndAdmin(data.writer.role)) {
        actions.push({
          label: '참여하기',
          onClick: async () => {
            await showDialog({
              key: 'APPLICATION-NOTICE',
              element: (
                <NoticeModal
                  sessions={data?.sessions || []}
                  isPhoneNumberRequired={data?.isPhoneNumberRequired ?? false}
                />
              ),
            });
          },
          className: 'bg-oliveGreen1',
        });
      }
    }

    return actions;
  }, [data, showDialog]);

  return (
    <div className="w-full">
      <div className="mt-[26px] flex gap-[42px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex size-10 h-[38px] w-[38px] items-center justify-center rounded bg-vividGreen2 text-white"
        >
          <FaChevronLeft />
        </button>

        <div className="w-full">
          <div className="w-full px-6 pb-[45px] pt-5">
            <div className="flex items-center justify-between">
              <h1 className="text-[32px] font-semibold">
                {data?.title || '-'}
              </h1>
              <FavoriteButton
                isFavorite={data?.isScraped ?? false}
                onClick={() => {}}
                size={24}
              />
            </div>

            <div className="mt-12 flex gap-2">
              <Tag
                color={
                  data?.writer.role &&
                  getColorByRole(RolesObj[data?.writer.role])
                }
                size="big"
                text={data?.writer.role ? RolesObj[data?.writer.role] : '-'}
                emphasisText
                className="px-[10px] py-[5px]"
              />

              <Tag
                color="gray"
                size="medium"
                text={
                  data?.noticeType
                    ? noticeCategoryDisplay[data?.noticeType]
                    : '-'
                }
                className="w-fit"
              />
            </div>
            <NoticeApplicationInfoTemplate notice={data} />
            <PostDetailsTemplate
              nickName={data?.writer.userName || '-'}
              createdAt={data?.applicationStartDateTime}
              viewCount={data?.viewCount || 0}
              description={data?.content || '-'}
              actions={getActions()}
            />
          </div>
        </div>
      </div>
      <CommentTemplate
        commentList={newCommentList || []}
        onSubmit={handleSubmitComment}
      />
    </div>
  );
}
