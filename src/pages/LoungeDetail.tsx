import { useCallback } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { useGetUserProfile } from '@/services/auth/authQueries';
import {
  useDeleteLoungeProject,
  usePostProjectComment,
  usePostScrapProject,
} from '@/services/lounge/loungeMutations';
import {
  useGetLoungeProjectsComment,
  useGetLoungeProjectsDetail,
} from '@/services/lounge/loungeQueries';

import { ptypeDisplay } from '@/constants';
import { useDialogContext } from '@/hooks';
import { FaChevronLeft } from 'react-icons/fa';

import Tag from '@/components/common/Tag';
import FavoriteButton from '@/components/common/button/FavoriteButton';
import SquareButton from '@/components/common/button/SquareButton';
import CommentTemplate from '@/components/common/post-template/CommentTemplate';
import PostDetailsTemplate from '@/components/common/post-template/PostDetailsTemplate';
import LoungeApplicationInfoTemplate from '@/components/lounge/LoungeApplicationInfoTemplate';

export default function LoungeDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { showToast, hideDialog, alert } = useDialogContext();
  const { data: userProfile } = useGetUserProfile();
  const { data: projectsDetail, isLoading } = useGetLoungeProjectsDetail(
    Number(params.postId!),
  );
  const { data: commentList } = useGetLoungeProjectsComment(
    Number(params.postId!),
  );
  const { mutateAsync: postScrapProject } = usePostScrapProject();
  const { mutateAsync: postComment } = usePostProjectComment(
    Number(params.postId!),
  );
  const { mutateAsync: deleteProject } = useDeleteLoungeProject();

  const onScrapProject = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        const result = await postScrapProject({
          projectId: Number(params.postId!),
        });

        if (result) {
          showToast('게시물을 찜했어요!', 1000);
        } else {
          showToast('게시물 찜하기를 취소 했어요!', 1000);
        }

        queryClient.invalidateQueries({
          queryKey: ['useGetLoungeProjectsDetail'],
        });
      } catch (err) {
        console.error(err);
        showToast('게시물 찜하기를 실패했어요');
      }
    },
    [params.postId, postScrapProject, queryClient, showToast],
  );

  const handleSubmitComment = useCallback(
    async (data: { content: string }) => {
      try {
        await postComment(data);
        showToast('댓글을 등록했어요!');
        queryClient.invalidateQueries({
          queryKey: ['useGetLoungeProjectsComment'],
        });
      } catch (err) {
        console.error(err);
        showToast('댓글등록을 실패했어요');
      }
    },
    [postComment, queryClient, showToast],
  );

  const handleDeleteProject = async () => {
    alert({
      text: '정말 프로젝트를 삭제하시겠어요?',
      subText:
        '삭제하면 모든 정보가 사라지며, 복구할 수 없어요.\n 그래도 계속하시겠어요?',
      children: (
        <>
          <SquareButton
            color="gray"
            name="닫기"
            onClick={hideDialog}
            type="button"
          />
          <SquareButton
            name="삭제"
            onClick={async () => {
              try {
                await deleteProject({ projectId: Number(params.postId!) });

                showToast('프로젝트를 삭제했습니다.');
                navigate('/lounge');
                queryClient.invalidateQueries({
                  queryKey: ['useGetLoungeProjects'],
                });
              } catch (err) {
                console.error(err);
                showToast('프로젝트 삭제를 실패했습니다.');
              }

              hideDialog();
            }}
            type="button"
          />
        </>
      ),
    });
  };

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
            <LoungeApplicationInfoTemplate
              startPeriod={projectsDetail?.recruitmentStart}
              endPeriod={projectsDetail?.recruitmentEnd}
              personRecruited={projectsDetail?.recruitmentCount}
              position={projectsDetail?.position}
              contactMethod={projectsDetail?.contactMethod}
              contactDetail={projectsDetail?.contactDetail}
              meetingType={projectsDetail?.meetingType}
              techStack={projectsDetail?.techStack}
            />
            <PostDetailsTemplate
              actions={
                userProfile?.nickname === projectsDetail?.writerNickName
                  ? [
                      {
                        label: '삭제하기',
                        onClick: handleDeleteProject,
                        className: 'bg-gray2',
                      },
                      {
                        label: '수정하기',
                        onClick: () => {
                          navigate(
                            `/lounge?ptype=EDIT&modifyProject=${params.postId!}`,
                          );
                        },
                        className: 'bg-oliveGreen1',
                      },
                    ]
                  : []
              }
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
