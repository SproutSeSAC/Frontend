import { useCallback } from 'react';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import sproutLogo from '@/assets/images/sprout-logo2.png';
import { courseGrowthLevelList } from '@/constants';
import { useDialogContext } from '@/hooks';
import { getDDay, getDateProgress } from '@/utils';

import CircularGauge from '@/components/common/CircularGauge';
import InfoHoverBox from '@/components/common/InfoHoverBox';
import EditButton from '@/components/common/button/EditButton';
import ScrollContainer from '@/components/common/container/ScrollContainer';
import Tag from '@/components/common/tag/Tag';
import DomainJobTechStackModal from '@/components/user/DomainJobTechStackModal';

export default function MyCourseProgressCard() {
  const { data: userProfile = initialUserProfile, isLoading } =
    useGetUserProfile();

  const { courseList, campusList, jobList, techStackList, domainList } =
    userProfile;

  const getProgress = useCallback(() => {
    return (
      courseList?.[0] &&
      getDateProgress(
        courseList?.[0]?.courseStartDate,
        courseList?.[0]?.courseEndDate,
      )
    );
  }, [courseList]);

  const progress = getProgress();

  const DDay = getDDay(courseList?.[0]?.courseEndDate);

  const { level, label, image } =
    courseGrowthLevelList.find(
      ({ maxProgress }) => maxProgress >= getProgress(),
    ) || courseGrowthLevelList[0];

  const { showDialog } = useDialogContext();

  const openModalClick = async () => {
    await showDialog({
      key: 'DOMAIN_JOB_TECH_STACK_CARD',
      element: <DomainJobTechStackModal />,
    });
  };

  if (isLoading) return null;

  return (
    <>
      <EditButton
        label="나의 새싹 정보 수정하기"
        className="absolute right-2 top-0.5 text-darkGray-hover"
        onClick={openModalClick}
      />
      <div className="flex min-w-[404px] flex-1 flex-col justify-between rounded-[20px] bg-white py-5">
        <ul className="mb-4 flex gap-4 px-4">
          {[`D${DDay}`, `${progress}% 달성`].map(text => (
            <li key={text}>
              <Tag
                text={text}
                color="grayLight"
                size="big"
                className="px-[14px] py-[10px]"
              />
            </li>
          ))}

          <InfoHoverBox
            text="다음 그래프는 진행률을 나타내며 수료율을 의미하지 않습니다"
            className="ml-auto size-7 [&>span]:w-64"
          />
        </ul>

        {/* 레벨정보 */}
        <div className="relative mb-7 mt-4 flex h-48 items-center justify-center px-4">
          <div className="peer absolute -top-0 flex items-center justify-center">
            <img
              src={image}
              alt="성장캐릭터"
              className="absolute rounded-full bg-white object-contain p-10"
            />
            <CircularGauge gauge={progress} />
            <span className="absolute -bottom-2 rounded-lg bg-mainGreen px-4 py-2 font-semibold text-white">
              Lv{level}. {label}
            </span>
          </div>
        </div>

        {/* 캠퍼스 */}
        <div className="mb-7 flex items-center px-4">
          <img src={sproutLogo} alt="새싹 로고" className="size-5 p-1" />
          <span className="mr-2 text-sm font-bold">
            {campusList[0]?.campusName}
          </span>
          <span className="text-sm font-medium text-darkGray-active">
            {courseList?.[0]?.courseStartDate?.replaceAll('-', '.')} ~{' '}
            {courseList?.[0]?.courseEndDate?.replaceAll('-', '.')}
          </span>
        </div>

        {/* 도메인 직무 기술 스택 */}
        <div className="flex w-full flex-1 flex-col justify-between gap-1.5 pl-4">
          <div className="flex w-full items-center [&>div]:flex-1">
            <span className="w-20 text-sm font-semibold">도메인</span>
            <ScrollContainer className="gap-3" isBlurRight>
              {domainList?.map(({ id, domain }) => (
                <li key={id}>
                  <Tag
                    text={domain}
                    size="big"
                    color="grayLight"
                    className="px-[14px] py-[10px] !font-normal"
                  />
                </li>
              ))}
            </ScrollContainer>
          </div>

          <div className="flex w-full items-center [&>div]:flex-1">
            <span className="w-20 text-sm font-semibold">직무</span>
            <ScrollContainer className="gap-4" isBlurRight>
              {jobList?.map(({ job, id }) => (
                <li key={id} className="leading-5 tracking-tight">
                  {job}
                </li>
              ))}
            </ScrollContainer>
          </div>

          <div className="flex w-full items-center [&>div]:flex-1">
            <span className="w-20 text-sm font-semibold">기술 스택</span>
            <ScrollContainer className="gap-3" isBlurRight>
              {techStackList?.map(({ id, techStack, iconImageUrl }) => (
                <li key={id} className="size-7">
                  <img
                    src={iconImageUrl}
                    alt={techStack}
                    className="size-full"
                  />
                </li>
              ))}
            </ScrollContainer>
          </div>
        </div>
      </div>
    </>
  );
}
