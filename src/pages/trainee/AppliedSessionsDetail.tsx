import { useLocation } from 'react-router-dom';

import { useGetUserAppliedSessionList } from '@/services/admin/userToManageQueries';
import { useGetAppliedSessionList } from '@/services/session/sessionsQueries';

import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

import EmptyContent from '@/components/common/EmptyContent';
import LoopLoading from '@/components/common/LoopLoading';
import AppliedSessionCard from '@/components/session/AppliedSessionCard';

export default function AppliedSessionsDetail() {
  const { state } = useLocation();

  const { data: myAppliedSessionList, isLoading: isMyAppliedLoading } =
    useGetAppliedSessionList('allList');

  const { data: appliedSessionList, isLoading: isAppliedLoading } =
    useGetUserAppliedSessionList({ userId: state?.userId, type: 'allList' });

  const dataList = !state?.userId ? myAppliedSessionList : appliedSessionList;

  const isLoading = !state?.userId ? isMyAppliedLoading : isAppliedLoading;

  return (
    <MainView className="mb-32">
      <Header
        title={`${state?.username ? `${state?.username}님이` : `내가`} 신청한 특강 / 행사`}
      />

      {isLoading && (
        <div className="flex h-full w-full items-center justify-center">
          <LoopLoading />
        </div>
      )}

      {!isLoading &&
        (myAppliedSessionList?.length === 0 ? (
          <EmptyContent
            message="신청한 특강/행사가 없습니다."
            className="h-full pb-20"
          />
        ) : (
          <ul className="grid grid-cols-3 gap-8">
            {dataList?.map(session => (
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
