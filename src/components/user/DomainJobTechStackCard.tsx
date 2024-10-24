import { useGetUserProfile } from '@/services/auth/authQueries';

import { useDialogContext } from '@/hooks';
import { UserProfile } from '@/types';

import Tag from '@/components/common/Tag';
import EditButton from '@/components/common/button/EditButton';
import ScrollContainer from '@/components/common/container/ScrollContainer';
import DomainJobTechStackModal from '@/components/user/DomainJobTechStackModal';

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

      <div className="flex h-[190px] w-full flex-col justify-between gap-2 divide-y rounded-3xl bg-white p-5 shadow-card">
        <ScrollContainer gap={2}>
          {domainList
            ?.sort((a, b) => a.id - b.id)
            ?.map(({ id, domain }) => (
              <li key={id}>
                <Tag text={domain} size="big" color="gray" />
              </li>
            ))}
        </ScrollContainer>

        <ScrollContainer gap={2}>
          {jobList
            ?.sort((a, b) => a.id - b.id)
            ?.map(({ job, id }) => (
              <li
                key={id}
                className="mt-1.5 px-2 font-semibold leading-5 tracking-tight"
              >
                {job}
              </li>
            ))}
        </ScrollContainer>

        {/* 기술스택 */}
        <ScrollContainer gap={3}>
          {techStackList
            ?.sort((a, b) => a.id - b.id)
            ?.map(({ id, techStack, iconImageUrl }) => (
              <li key={id} className="size-10 rounded-lg bg-vividGreen3">
                <img src={iconImageUrl} alt={techStack} />
              </li>
            ))}
        </ScrollContainer>
      </div>
    </>
  );
}
