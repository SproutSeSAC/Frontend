import { useGetAppliedSessionList } from '@/services/session/sessionsQueries';

import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

import EmptyContent from '@/components/common/EmptyContent';
import LoopLoading from '@/components/common/LoopLoading';
import AppliedSessionCard from '@/components/session/AppliedSessionCard';

export default function AppliedSessionsDetail() {
  const { data: appliedSessionList, isLoading } =
    useGetAppliedSessionList('allList');

  return (
    <MainView className="mb-32">
      <Header title="내가 신청한 특강 / 행사" />

      {isLoading && (
        <div className="flex h-full w-full items-center justify-center">
          <LoopLoading />
        </div>
      )}

      {!isLoading &&
        (appliedSessionList?.length === 0 ? (
          <EmptyContent
            message="신청한 이벤트가 없습니다."
            className="h-full pb-20"
          />
        ) : (
          <ul className="grid grid-cols-3 gap-8">
            {appliedSessionList?.map(session => (
              <AppliedSessionCard
                key={session.participantId}
                session={session}
              />
            ))}
          </ul>
        ))}
    </MainView>
  );
}
