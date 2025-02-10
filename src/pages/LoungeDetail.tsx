import { useNavigate, useParams } from 'react-router-dom';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import { useDeleteMyPost } from '@/services/post/postMutation';
import { useGetPostDetail } from '@/services/post/postQueries';

import { ptypeDisplay } from '@/constants';
import { useHandleImage, useHandlePostActions, useHandleScrap } from '@/hooks';
import { LoungeDto } from '@/types/lounge/loungeDto';

import BackButton from '@/components/common/button/BackButton';
import FavoriteButton from '@/components/common/button/FavoriteButton';
import CommentTemplate from '@/components/common/post-template/CommentTemplate';
import PostDetailsTemplate from '@/components/common/post-template/PostDetailsTemplate';
import Tag from '@/components/common/tag/Tag';
import LoungeApplicationInfoTemplate from '@/components/lounge/LoungeApplicationInfoTemplate';

export default function LoungeDetail() {
  const params = useParams();
  const postId = +params.postId!;

  const { deletePostImages } = useHandleImage();

  const { data: userProfile = initialUserProfile } = useGetUserProfile();

  const { data: postDetail } =
    useGetPostDetail<LoungeDto.GetProjectDetail>(postId);

  const { mutateAsync: deletePost } = useDeleteMyPost({
    onSuccess: async () => {
      if (postDetail?.description) {
        await deletePostImages(postDetail?.description);
      }
    },
  });

  const { onScrapClick } = useHandleScrap({
    postId,
    isScraped: !!postDetail?.isScraped,
    invalidateQueryKeys: ['useGetPostDetail', postId],
  });

  const navigate = useNavigate();

  const { actions } = useHandlePostActions({
    postType: '프로젝트를',
    requiredActions: {
      delete: {
        action: () => {
          deletePost({ postId });
          navigate('/lounge');
        },
      },
      edit: {
        action: () => {
          const state = postDetail;
          navigate(`/lounge?pType=EDIT&modifyProject=${postId}`, { state });
        },
      },
    },
    invalidateQueryKeys: ['useGetLoungeProjectList'],
  });

  const postWriter = userProfile?.nickname === postDetail?.writerNickName;

  return (
    <div className="flex w-full">
      <BackButton />

      <div className="w-full">
        <div className="w-full px-6 pb-[45px] pt-5">
          <header className="flex items-center justify-between">
            <h1 className="text-[32px] font-semibold">{postDetail?.title}</h1>
            <FavoriteButton
              isFavorite={postDetail?.isScraped ?? false}
              onClick={onScrapClick}
              size={24}
            />
          </header>
          <Tag
            color="green"
            size="medium"
            text={postDetail ? ptypeDisplay[postDetail.ptype] : ''}
            className="mt-12 w-fit py-1"
          />

          {postDetail && (
            <LoungeApplicationInfoTemplate
              recruitmentStart={postDetail.recruitmentStart}
              recruitmentEnd={postDetail.recruitmentEnd}
              recruitmentCount={postDetail?.recruitmentCount || 0}
              position={postDetail?.position || []}
              contactMethod={postDetail.contactMethod}
              contactDetail={postDetail.contactDetail}
              meetingType={postDetail.meetingType}
              techStack={postDetail?.techStack || []}
            />
          )}
          <PostDetailsTemplate
            actions={postWriter ? actions : []}
            imageNameSegment={postDetail?.imgUrl}
            nickname={postDetail?.writerNickName || '-'}
            createdAt={postDetail?.createdAt}
            viewCount={postDetail?.viewCount}
            description={postDetail?.description}
          />
        </div>

        <CommentTemplate postId={postId} />
      </div>
    </div>
  );
}
