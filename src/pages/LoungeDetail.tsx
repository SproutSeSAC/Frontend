import { useCallback } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import {
  usePostProjectComment,
  usePostScrapProject,
} from '@/services/lounge/loungeMutations';
import {
  useGetLoungeProjectsComment,
  useGetLoungeProjectsDetail,
} from '@/services/lounge/loungeQueries';

import { ptypeDisplay } from '@/constants';
import { FaChevronLeft } from 'react-icons/fa';

import Tag from '@/components/common/Tag';
import FavoriteButton from '@/components/common/button/FavoriteButton';
import ApplicationInfoTemplate from '@/components/common/post-template/ApplicationInfoTemplate';
import CommentTemplate from '@/components/common/post-template/CommentTemplate';
import PostDetailsTemplate from '@/components/common/post-template/PostDetailsTemplate';

export default function LoungeDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: projectsDetail, isLoading } = useGetLoungeProjectsDetail(
    Number(params.postId || 0),
  );
  const { data: commentList } = useGetLoungeProjectsComment(
    Number(params.postId || 0),
  );
  const { mutateAsync: postScrapProject } = usePostScrapProject();
  const { mutateAsync: postComment } = usePostProjectComment(
    Number(params.postId || 0),
  );

  const onScrapProject = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        await postScrapProject({ projectId: Number(params.postId || 0) });
        console.log('성공');
        queryClient.invalidateQueries({
          queryKey: ['useGetLoungeProjectsDetail'],
        });
      } catch (err) {
        console.error(err);
      }
    },
    [params.postId, postScrapProject, queryClient],
  );

  const handleSubmitComment = useCallback(
    async (data: { content: string }) => {
      try {
        await postComment(data);
        console.log('성공');
        queryClient.invalidateQueries({
          queryKey: ['useGetLoungeProjectsComment'],
        });
      } catch (err) {
        console.error(err);
      }
    },
    [postComment, queryClient],
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
                {projectsDetail?.title}
              </h1>
              <FavoriteButton
                isFavorite={projectsDetail?.isScraped ?? false}
                onClick={onScrapProject}
                size={24}
              />
            </div>
            <Tag
              color="green"
              size="medium"
              text={projectsDetail ? ptypeDisplay[projectsDetail.ptype] : ''}
              className="mt-12 w-fit"
            />
            <ApplicationInfoTemplate
              startPeriod={projectsDetail?.recruitmentStart}
              endPeriod={projectsDetail?.recruitmentEnd}
              personRecruited={projectsDetail?.recruitmentCount}
              positionNames={projectsDetail?.positionNames}
              contactMethod={projectsDetail?.contactMethod}
              contactDetail={projectsDetail?.contactDetail}
              meetingType={projectsDetail?.meetingType}
            />
            <PostDetailsTemplate
              // imgUrl={projectsDetail?.imgUrl}
              nickName={projectsDetail?.writerNickName}
              createdAt={projectsDetail?.createdAt}
              viewCount={projectsDetail?.viewCount}
              description={projectsDetail?.description}
            />
          </div>
        </div>
      </div>
      <CommentTemplate
        onSubmit={handleSubmitComment}
        commentList={
          (commentList || []).map(comment => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            writer: comment.writer,
            imgUrl: comment.imgUrl,
          })) || []
        }
      />
    </div>
  );
}
