import { Link } from 'react-router-dom';

import { useGetEndingTomorrowProjects } from '@/services/post/loungeQueries';

import Title from '@/components/common/Title';
import UserImage from '@/components/user/UserImage';

export default function LoungeSideView() {
  const { data: endingTomorrowProjectList } = useGetEndingTomorrowProjects();

  return (
    <div className="max-h-[90vh] min-h-60 overflow-y-scroll rounded-[20px] bg-white px-5 py-6">
      <Title as="h2" title="마감 하루전!" className="mb-3" highlight="마감" />

      {endingTomorrowProjectList && endingTomorrowProjectList?.length !== 0 ? (
        <ul className="flex flex-col gap-3.5">
          {endingTomorrowProjectList?.map(project => (
            <li
              key={project.projectId}
              className="border-t pt-3.5 first:border-t-0"
            >
              <Link to={`/lounge/post/${project.projectId}`}>
                <h2 className="line-clamp-3 text-darkGray-hover">
                  {project.title}
                </h2>
                <div className="mt-2 flex items-center gap-2">
                  <UserImage
                    className="size-[22px]"
                    imageNameSegment={project.imgUrl}
                  />
                  <span className="tracking-tight">
                    @ {project.userNickname}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <span className="inline-block w-full pt-14 text-center text-mainGray-active">
          곧 마감하는 프로젝트가 없어요!
        </span>
      )}
    </div>
  );
}
