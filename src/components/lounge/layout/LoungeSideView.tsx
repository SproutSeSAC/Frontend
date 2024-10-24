import { Link } from 'react-router-dom';

import { useGetEndingTomorrowProjects } from '@/services/lounge/loungeQueries';

import Title from '@/components/common/Title';
import UserImage from '@/components/user/UserImage';

export default function LoungeSideView() {
  const { data: EndingTomorrowProjectList } = useGetEndingTomorrowProjects();
  return (
    <div className="flex flex-col gap-10">
      <div className="max-h-[90vh] overflow-y-scroll rounded-lg bg-white p-4 shadow-card">
        <Title as="h2" title="마감 하루전!" className="mb-6" highlight="마감" />

        <div className="flex flex-col gap-6">
          {EndingTomorrowProjectList?.map(project => (
            <Link
              key={project.projectId}
              to={`/lounge/post/${project.projectId}`}
            >
              <div className="text-gray1">{project.title}</div>
              <div className="mt-2 flex items-center gap-2">
                <UserImage
                  className="size-[22px] p-0.5"
                  // profileImageUrl={project.imgUrl}
                />
                <div>{project.userNickname}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
