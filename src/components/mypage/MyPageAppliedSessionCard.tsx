import { useGetAppliedSessionList } from '@/services/session/sessionsQueries';

import AppliedSession from '@/components/session/AppliedSession';

export default function MyPageAppliedSessionCard() {
  const { data: mySessionList, isLoading } =
    useGetAppliedSessionList('nearList');

  return (
    <div className="mt-2.5 flex h-[200px] w-full items-center justify-center rounded-[20px] bg-white p-6">
      {!isLoading &&
        (mySessionList?.length === 0 ? (
          <span className="text-mainGray-hover">
            특강 / 행사 신청 내역이 없어요!
          </span>
        ) : (
          <ul className="h-full w-full space-y-2">
            {mySessionList?.map(session => (
              <AppliedSession
                key={`${session.postId}-${session.ordinal}`}
                session={session}
              />
            ))}
          </ul>
        ))}
    </div>
  );
}
