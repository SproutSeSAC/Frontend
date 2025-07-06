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

import LoopLoading from '@/components/common/LoopLoading';
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

  const { data: postDetail, isLoading: isPostDetailLoading } =
    useGetPostDetail<LoungeDto.GetProjectDetail>(postId);

  const { mutateAsync: deletePost } = useDeleteMyPost({
    onSuccess: async () => {
      if (postDetail?.description) {
        await deletePostImages(postDetail?.description);
      }
    },
  });

  const { onScrapClick, isPostScrapPending, isDeleteScrapPending } =
    useHandleScrap({
      postId,
      isScraped: !!postDetail?.isScraped,
      invalidateQueryKeys: [{ queryKey: ['useGetPostDetail', postId] }],
    });

  const navigate = useNavigate();

  const { actions } = useHandlePostActions({
    postType: '프로젝트를',
    requiredActions: {
      delete: {
        action: async () => {
          await deletePost({ postId });
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

  return isPostDetailLoading ? (
    <div className="flex h-[60vh] items-center justify-center">
      <LoopLoading />
    </div>
  ) : (
    <>
      <section className="mb-7 w-full">
        <BackButton onClick={() => navigate('/lounge')} />

        <header className="mt-7 flex items-center justify-between">
          <h1 className="pr-4 text-2xl font-semibold">{postDetail?.title}</h1>
          <FavoriteButton
            isFavorite={postDetail?.isScraped ?? false}
            onClick={onScrapClick}
            size={24}
            disabled={isPostScrapPending || isDeleteScrapPending}
          />
        </header>

        <Tag
          size="big"
          postKey={postDetail?.ptype}
          text={postDetail?.ptype ? `#${ptypeDisplay[postDetail?.ptype]}` : '-'}
          className="mb-3 mt-4 w-fit px-[10px] py-[5px]"
        />

        {postDetail && (
          <LoungeApplicationInfoTemplate
            ptype={postDetail?.ptype || '-'}
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
      </section>

      <CommentTemplate postId={postId} />
    </>
  );
}
