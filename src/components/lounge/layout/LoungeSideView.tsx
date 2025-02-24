import { Link } from 'react-router-dom';

import { useGetEndingTomorrowProjects } from '@/services/post/loungeQueries';

import Title from '@/components/common/Title';
import UserImage from '@/components/user/UserImage';

export default function LoungeSideView() {
  const { data: endingTomorrowProjectList } = useGetEndingTomorrowProjects();
  return (
    <div className="flex flex-col gap-10">
      <div className="max-h-[90vh] min-h-60 overflow-y-scroll rounded-[20px] bg-white px-4 py-5">
        <Title
          as="h2"
          title="곧 마감합니다!"
          className="mb-6"
          highlight="마감"
        />

        {endingTomorrowProjectList?.length !== 0 ? (
          <div className="flex flex-col gap-6">
            {endingTomorrowProjectList?.map(project => (
              <Link
                key={project.projectId}
                to={`/lounge/post/${project.projectId}`}
              >
                <div className="text-darkGray-active">{project.title}</div>
                <div className="mt-2 flex items-center gap-2">
                  <UserImage
                    className="size-[22px]"
                    imageNameSegment={project.imgUrl}
                  />
                  <div>{project.userNickname}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <span className="text-mainGray-active">
            곧 마감하는 프로젝트가 없어요!
          </span>
        )}
      </div>
    </div>
  );
}
