import { useParams, useSearchParams } from 'react-router-dom';

import { useGetPostDetail } from '@/services/post/postQueries';

import {
  LIMITLESS_CAPACITY_NUM,
  SESSION_TABLE_HEADERS,
  appliedSessionStatusObj,
} from '@/constants';
import { useHandleSessionApplicantList, useHandleTabNavigation } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import {
  AppliedSessionStatusKey,
  AppliedSessionStatusValue,
  NoticeDto,
  SessionStatusKey,
} from '@/types';
import { formatDate } from '@/utils';
import { BsCalendar, BsClock } from 'react-icons/bs';

import EmptyContent from '@/components/common/EmptyContent';
import TabNavigation from '@/components/common/TabNavigation';
import SquareButton from '@/components/common/button/SquareButton';
import Checkbox from '@/components/common/checkbox/Checkbox';

export default function SessionApplicantManagementDetail() {
  const { postId } = useParams();

  const [searchParams] = useSearchParams();

  const currSessionId = searchParams.get('sessionId');

  const { tabName, handleChangeTab } = useHandleTabNavigation();

  const tabList: {
    text: '전체' | AppliedSessionStatusValue;
    type: 'ALL' | AppliedSessionStatusKey;
  }[] = [
    { text: '전체', type: 'ALL' },
    { text: '대기', type: 'WAIT' },
    { text: '승인', type: 'PARTICIPANT' },
    { text: '반려', type: 'REJECT' },
    { text: '종료', type: 'END' },
  ];

  const { data: noticeDetail } = useGetPostDetail<NoticeDto.GetNoticeDetail>(
    +postId!,
  );

  const session = noticeDetail?.sessions?.find(
    ({ sessionId }) => sessionId === +currSessionId!,
  );

  const {
    applicantList,
    isApplicantListLoading,
    checkedList,

    onCheckedChange,
    onAllClearCheckedChange,
    onAllCheckedChange,

    handleCheckedItemAccept,
    isAcceptPending,
    handleCheckedItemReject,
    isRejectPending,
  } = useHandleSessionApplicantList({
    sessionId: session?.sessionId || +currSessionId!,
    searchParticipantStatus: tabName as AppliedSessionStatusKey,
  });

  const STATUS_STYLES: Record<AppliedSessionStatusKey, string> = {
    WAIT: 'text-orange-500',
    PARTICIPANT: 'text-green-600',
    REJECT: 'text-red-500',
    END: 'text-gray-500',
    UNKNOWN: 'text-gray-500',
  };

  const gridStyle =
    'grid grid-cols-[0.5fr_0.8fr_1.5fr_1fr_1fr_1fr_1fr] gap-x-2.5';

  const allChecked = applicantList?.length === checkedList.length;

  const getSessionStatus = (applicationEndDateTime: string) => {
    const checkIsEndSession = (sessionEndDateTime: string) => {
      return new Date(sessionEndDateTime).getTime() < new Date().getTime();
    };

    const isEndSession = checkIsEndSession(applicationEndDateTime);

    const currentStatus: SessionStatusKey = isEndSession
      ? 'INACTIVE'
      : noticeDetail?.status || 'UNKNOWN';

    return currentStatus;
  };

  if (!session) return null;

  return (
    <MainView className="mb-32">
      <Header
        title="특강 / 행사 신청 현황"
        subTitleChildren={
          <div className="flex items-center gap-4">
            <span className="text-[#A2C27D]">{noticeDetail?.title}</span>
            <div className="flex items-center gap-1">
              <span className="text-[15px] text-darkGray">일자</span>
              <BsCalendar size={13} className="text-darkGray" />{' '}
              <span className="text-[15px] text-darkGray">
                {formatDate(session.sessionStartDateTime, 'yyyy.MM.dd')}{' '}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[15px] text-darkGray">시간</span>
              <BsClock size={13} className="text-darkGray" />
              <span className="text-[15px] text-darkGray">
                {formatDate(session.sessionStartDateTime, 'HH:mm')}~
                {formatDate(session.sessionEndDateTime, 'HH:mm')}
              </span>
            </div>
          </div>
        }
      />

      <div className="flex items-end justify-between">
        <TabNavigation
          tabList={tabList}
          selectValue={tabName ?? 'ALL'}
          onChangeValue={handleChangeTab}
          tabClassName="!pb-3 !px-3"
        />

        <div className="flex items-center space-x-4">
          <span className="mr-2 text-sm text-darkGray">
            {applicantList?.length} /{' '}
            {noticeDetail?.participantCapacity === LIMITLESS_CAPACITY_NUM
              ? '제한 없음'
              : noticeDetail?.participantCapacity}
          </span>
          <SquareButton
            name={allChecked ? '선택 해제' : '모두 선택'}
            className="!bg-mainGray-active !text-white"
            onClick={allChecked ? onAllClearCheckedChange : onAllCheckedChange}
          />
          <SquareButton
            name="승인"
            color="lightGreen"
            className="!text-darkGreen"
            onClick={handleCheckedItemAccept}
            disabled={isAcceptPending}
          />
          <SquareButton
            name="반려"
            className="!bg-red-100 !text-red-500"
            onClick={handleCheckedItemReject}
            disabled={isRejectPending}
          />
        </div>
      </div>

      {/* 표 */}
      <div
        className={`mb-2 mt-4 w-full ${gridStyle} items-center py-4 pl-[30px] font-medium text-darkGray-hover`}
      >
        {SESSION_TABLE_HEADERS.map(header => (
          <span key={header} className="text-center">
            {header}
          </span>
        ))}
      </div>

      {applicantList?.length === 0 ? (
        <EmptyContent
          message="신청자가 없습니다."
          className="h-full rounded-[20px] bg-white py-20"
        />
      ) : (
        <ul className="space-y-4">
          {!isApplicantListLoading &&
            applicantList?.map(
              ({
                noticeParticipantId,
                userName,
                campuses,
                courses,
                email,
                phoneNumber,
                applicationTime,
                status,
              }) => {
                const userCampuses = campuses
                  ?.map(({ name }) => name.slice(0, -3))
                  .join(', ');
                const userCourse = courses?.[0].name;

                return (
                  <li key={noticeParticipantId} className="flex items-center">
                    {getSessionStatus(session.sessionEndDateTime) ===
                      'ACTIVE' && (
                      <Checkbox
                        id="applicant"
                        checked={
                          !!checkedList.find(
                            ({ participantId: id }) =>
                              id === noticeParticipantId,
                          )
                        }
                        onChange={() =>
                          onCheckedChange({ noticeParticipantId, status })
                        }
                        inputClassName="bg-white !size-5 !mr-3"
                      />
                    )}

                    <div
                      className={`w-full ${gridStyle} items-center rounded-2xl bg-white py-4 shadow-card [&>*]:truncate [&>*]:text-center`}
                    >
                      <span className="text-darkGray-active">{userName}</span>
                      <span className="text-darkGray-active">
                        {`${userCampuses}캠퍼스` || '정보 없음'}
                      </span>
                      <span className="text-darkGray-active">
                        {courses.length > 1
                          ? `${userCourse}외 ${courses.length - 2}`
                          : userCourse || '정보 없음'}
                      </span>
                      <span className="text-darkGray-active">{email}</span>
                      <span className="text-darkGray-active">
                        {phoneNumber}
                      </span>
                      <span className="text-darkGray-active">
                        {applicationTime || '-'}
                      </span>
                      <span className={`font-medium ${STATUS_STYLES[status]}`}>
                        {appliedSessionStatusObj[status]}
                      </span>
                    </div>
                  </li>
                );
              },
            )}
        </ul>
      )}
    </MainView>
  );
}
