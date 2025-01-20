import { useCallback } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';
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
import {
  useHandleComment,
  useHandleImage,
  useHandleOnScrap,
  useHandlePostActions,
} from '@/hooks';

import BackButton from '@/components/common/button/BackButton';
import FavoriteButton from '@/components/common/button/FavoriteButton';
import CommentTemplate from '@/components/common/post-template/CommentTemplate';
import PostDetailsTemplate from '@/components/common/post-template/PostDetailsTemplate';
import Tag from '@/components/common/tag/Tag';
import LoungeApplicationInfoTemplate from '@/components/lounge/LoungeApplicationInfoTemplate';

export default function LoungeDetail() {
  const params = useParams();
  const projectId = +params.postId!;

  const { deletePostImages } = useHandleImage();

  const { data: userProfile = initialUserProfile } = useGetUserProfile();

  const { data: projectsDetail } = useGetLoungeProjectsDetail(projectId);

  const { data: commentList = [] } = useGetLoungeProjectsComment(projectId);

  const { mutateAsync: postScrapProject } = usePostScrapProject();

  const { mutateAsync: postComment } = usePostProjectComment(projectId);

  const { mutateAsync: deletePost } = useDeleteLoungeProject({
    onSuccess: () => {
      if (projectsDetail?.description) {
        deletePostImages(projectsDetail?.description);
      }
    },
  });

  const getScrapResult = useCallback(async () => {
    return postScrapProject({ projectId });
  }, [projectId, postScrapProject]);

  const { onScrapClick } = useHandleOnScrap({
    getScrapResult,
    invalidateQueryKeys: ['useGetLoungeProjectsDetail'],
  });

  const { handleSubmitComment } = useHandleComment({
    postComment,
    invalidateQueryKeys: ['useGetLoungeProjectsComment'],
  });

  const navigate = useNavigate();

  const { actions } = useHandlePostActions({
    postType: '프로젝트를',
    requiredActions: {
      delete: {
        action: () => {
          deletePost({ projectId });
          navigate('/lounge');
        },
      },
      edit: {
        action: () => {
          const state = projectsDetail;
          navigate(`/lounge?ptype=EDIT&modifyProject=${projectId}`, { state });
        },
      },
    },
    invalidateQueryKeys: ['useGetLoungeProjects'],
  });

  const postWriter = userProfile?.nickname === projectsDetail?.writerNickName;

  return (
    <div className="flex w-full">
      <BackButton />

      <div className="w-full">
        <div className="w-full px-6 pb-[45px] pt-5">
          <header className="flex items-center justify-between">
            <h1 className="text-[32px] font-semibold">
              {projectsDetail?.title}
            </h1>
            <FavoriteButton
              isFavorite={projectsDetail?.isScraped ?? false}
              onClick={onScrapClick}
              size={24}
            />
          </header>
          <Tag
            color="green"
            size="medium"
            text={projectsDetail ? ptypeDisplay[projectsDetail.ptype] : ''}
            className="mt-12 w-fit py-1"
          />
          {projectsDetail && (
            <LoungeApplicationInfoTemplate
              recruitmentStart={projectsDetail.recruitmentStart}
              recruitmentEnd={projectsDetail.recruitmentEnd}
              recruitmentCount={projectsDetail?.recruitmentCount || 0}
              position={projectsDetail?.position || []}
              contactMethod={projectsDetail.contactMethod}
              contactDetail={projectsDetail.contactDetail}
              meetingType={projectsDetail.meetingType}
              techStack={projectsDetail?.techStack || []}
            />
          )}
          <PostDetailsTemplate
            actions={postWriter ? actions : []}
            imageNameSegment={projectsDetail?.imgUrl}
            nickname={projectsDetail?.writerNickName || '-'}
            createdAt={projectsDetail?.createdAt}
            viewCount={projectsDetail?.viewCount}
            description={projectsDetail?.description}
          />
        </div>

        <CommentTemplate
          onSubmit={handleSubmitComment}
          commentList={commentList}
        />
      </div>
    </div>
  );
}
