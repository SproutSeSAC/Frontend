import { useGetUserProfile } from '@/services/auth/authQueries';

import { useDialogContext } from '@/hooks';
import { UserProfile } from '@/types';

import Tag from '@/components/common/Tag';
import EditButton from '@/components/common/button/EditButton';
import DomainJobTechStackModal from '@/components/user/DomainJobTechStackModal';

const listStyle = 'flex items-center py-2.5';
const itemStyle = 'font-semibold tracking-tight px-2 mt-1.5 leading-5';

export default function DomainJobTechStackCard() {
  const {
    data: userProfile,
    isLoading: isGetUserProfileLoading, //
  } = useGetUserProfile();

  const { jobList, techStackList, domainList } = userProfile as UserProfile;

  const { showDialog } = useDialogContext();

  const openModalClick = async () => {
    await showDialog({
      key: 'DOMAIN_JOB_TECH_STACK_CARD',
      element: <DomainJobTechStackModal />,
    });
  };

  if (isGetUserProfileLoading) return null;

  return (
    <>
      <EditButton
        label="나의 새싹 정보 수정하기"
        className="absolute -top-[38px] right-2 text-gray2"
        onClick={openModalClick}
      />

      <div className="flex h-[190px] w-full flex-1 flex-col justify-between divide-y rounded-3xl bg-white px-5 py-3 shadow-card">
        <ul className={`${listStyle} gap-1.5`}>
          {domainList
            ?.sort((a, b) => a.id - b.id)
            ?.map(({ id, domain }) => (
              <li key={id}>
                <Tag text={domain} size="big" color="gray" />
              </li>
            ))}
        </ul>

        <ul className={listStyle}>
          {jobList
            ?.sort((a, b) => a.id - b.id)
            ?.map(({ job, id }) => (
              <li key={id} className={itemStyle}>
                {job}
              </li>
            ))}
        </ul>

        {/* 기술스택 */}
        <div className="overflow-x-scroll scrollbar-hide">
          <ul className={`${listStyle} flex w-full max-w-0 flex-1 gap-x-3`}>
            {techStackList
              ?.sort((a, b) => a.id - b.id)
              ?.map(({ id, techStack, iconImageUrl }) => (
                <li
                  key={id}
                  className="size-10 flex-shrink-0 rounded-lg bg-vividGreen3"
                >
                  <img src={iconImageUrl} alt={techStack} />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
