import { useCallback } from 'react';

import { courseGrowthLevelList } from '@/constants';
import { UserProfile } from '@/types';
import { getDDay } from '@/utils';

import CircularGauge from '@/components/common/CircularGauge';

interface MyCourseProgressCardProps {
  userProfile: UserProfile;
}

export default function MyCourseProgressCard({
  userProfile,
}: MyCourseProgressCardProps) {
  const { courseEndDate, courseStartDate, campusName } = userProfile;

  const getProgress = useCallback(() => {
    const startDate = new Date(courseStartDate);
    const endDate = new Date(courseEndDate);
    const today = new Date();

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (today.getTime() >= endDate.getTime()) return 100;

    if (today.getTime() <= startDate.getTime()) return 0;

    const totalDays =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

    const elapsedDays =
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

    const progress = (elapsedDays / totalDays) * 100;

    return Math.round(progress);
  }, [courseEndDate, courseStartDate]);

  const progress = getProgress();

  const DDay = getDDay(courseEndDate);

  const courseGrowthLevel =
    courseGrowthLevelList.find(
      ({ maxProgress }) => maxProgress >= getProgress(),
    ) || courseGrowthLevelList[0];

  return (
    <div className="flex h-[396px] min-w-[380px] flex-col items-center justify-between gap-4 rounded-3xl bg-white p-10 shadow-card">
      <div className="flex w-full items-center justify-center gap-[10px]">
        <span className="rounded-lg bg-oliveGreen1 px-3 py-1 text-xl font-bold text-white">
          D{DDay}
        </span>

        <p className="text-sm font-semibold">
          김철수 스프님은
          <span className="mx-1 inline-block border-b border-b-oliveGreen1 px-1 text-oliveGreen1">
            {progress}%
          </span>
          달성했어요!
        </p>
      </div>

      <div className="relative flex h-40 w-full flex-col items-center justify-end rounded-xl bg-gray4 px-4 py-4">
        <div className="absolute -top-24 flex items-center justify-center">
          <img
            src={`src/assets/images/growth-character/${courseGrowthLevel.image}`}
            alt="성장캐릭터"
            className="absolute rounded-full bg-white object-contain p-10"
          />
          <CircularGauge gauge={progress} />

          <div className="absolute -bottom-2 rounded-lg bg-oliveGreen1 px-4 py-2 font-semibold text-white">
            Lv{courseGrowthLevel.level}. {courseGrowthLevel.label}
          </div>
        </div>

        <div className="flex items-center">
          <img
            src="src/assets/images/sprout-logo2.png"
            alt="새싹 로고"
            className="size-5 p-1"
          />
          <span className="mr-2 text-sm font-bold">{campusName}캠퍼스</span>
          <span className="text-sm font-medium text-gray1">
            {courseStartDate.replaceAll('-', '.')} ~{' '}
            {courseEndDate.replaceAll('-', '.')}
          </span>
        </div>
      </div>
    </div>
  );
}
