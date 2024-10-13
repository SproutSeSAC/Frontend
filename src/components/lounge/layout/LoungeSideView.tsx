import { Link } from 'react-router-dom';

import { useGetEndingTomorrowProjects } from '@/services/lounge/loungeQueries';

// import Tag from '@/components/common/Tag';
import Title from '@/components/common/Title';
import UserImage from '@/components/user/UserImage';

// const TAG_LIST = [
//   '#스터디',
//   '#모각코',
//   '#프론트엔드',
//   '#백엔드',
//   '#디자이너',
//   '#React',
//   '#코딩테스트',
//   '#알고리즘',
//   '#면접',
//   '#이력서',
// ];

export default function LoungeSideView() {
  const { data: EndingTomorrowProjectList } = useGetEndingTomorrowProjects();
  return (
    <div className="flex flex-col gap-10">
      {/* <div className="rounded-lg bg-white p-4 shadow-card">
        <Title as="h2" className="mb-6" title="인기검색어" />
        <div className="flex flex-wrap gap-1.5">
          {TAG_LIST.map(tag => (
            <Tag
              key={tag}
              text={tag}
              className="w-fit"
              color="black"
              size="small"
            />
          ))}
        </div>
      </div> */}

      <div className="rounded-lg bg-white p-4 shadow-card">
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