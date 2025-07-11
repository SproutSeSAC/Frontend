import { useCallback } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useGetEndingTomorrowProjects } from '@/services/post/loungeQueries';
import { usePostAddViewCount } from '@/services/post/postMutation';

import Title from '@/components/common/Title';
import UserImage from '@/components/user/UserImage';

export default function LoungeSideView() {
  const params = useParams();

  const { data: endingTomorrowProjectList } = useGetEndingTomorrowProjects();

  const { mutateAsync: addViewCount } = usePostAddViewCount('project');

  const navigate = useNavigate();

  const onViewCount = useCallback(
    async (linkedId: number, postId: number) => {
      if (params?.postId ? +params.postId === postId : false) return;
      await addViewCount({ linkedId });
      navigate(`/lounge/post/${postId}`);
    },
    [addViewCount, navigate, params.postId],
  );

  return (
    <div className="max-h-[90vh] min-h-60 overflow-y-scroll rounded-[20px] bg-white px-5 py-6">
      <Title as="h2" title="마감 하루전!" className="mb-3" highlight="마감" />

      {endingTomorrowProjectList && endingTomorrowProjectList?.length !== 0 ? (
        <ul className="flex flex-col">
          {endingTomorrowProjectList?.map(
            ({ projectId, postId, title, imgUrl, userNickname }) => (
              <li
                key={projectId}
                className="cursor-pointer border-t py-2.5 first:border-t-0"
              >
                <div
                  role="link"
                  tabIndex={0}
                  onClick={() => onViewCount(projectId, postId)}
                  onKeyDown={e => e.key === 'Enter' && onViewCount}
                >
                  <h2 className="line-clamp-3">{title}</h2>
                  <div className="mt-2 flex items-center gap-1.5">
                    <UserImage
                      className="size-[22px]"
                      imageNameSegment={imgUrl}
                    />
                    <span className="tracking-tight text-darkGray-hover">
                      @{userNickname}
                    </span>
                  </div>
                </div>
              </li>
            ),
          )}
        </ul>
      ) : (
        <span className="inline-block w-full pt-14 text-center text-mainGray-active">
          곧 마감하는 프로젝트가 없어요!
        </span>
      )}
    </div>
  );
}
