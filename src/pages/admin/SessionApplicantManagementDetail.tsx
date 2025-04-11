import { useParams, useSearchParams } from 'react-router-dom';

import { useGetPostDetail } from '@/services/post/postQueries';

import {
  LIMITLESS_CAPACITY_NUM,
  SESSION_TABLE_HEADERS,
  appliedSessionStatusObj,
} from '@/constants';
import {
  useDialogContext,
  useHandleSessionApplicantList,
  useHandleTabNavigation,
} from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import {
  AppliedSessionStatusKey,
  AppliedSessionStatusValue,
  NoticeDto,
  SessionStatusKey,
} from '@/types';
import { formatDate, getDDay } from '@/utils';
import { BsCalendar, BsCalendar2Minus, BsClock } from 'react-icons/bs';

import EmptyContent from '@/components/common/EmptyContent';
import TabNavigation from '@/components/common/TabNavigation';
import SquareButton from '@/components/common/button/SquareButton';
import Checkbox from '@/components/common/checkbox/Checkbox';
import Modal from '@/components/common/modal/Modal';
import MyCourseListWithHover from '@/components/user/MyCourseListWithHover';

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
  ];

  const { data: noticeDetail } = useGetPostDetail<NoticeDto.GetNoticeDetail>(
    +postId!,
  );

  const session = noticeDetail?.sessions?.find(
    ({ sessionId }) => sessionId === +currSessionId!,
  );

  const { showToast, hideDialog, showDialog } = useDialogContext();

  const {
    applicantList,
    isApplicantListLoading,
    checkedList,

    onCheckedChange,
    onAllClearCheckedChange,
    onAllCheckedChange,

    acceptApplicant,
    isAcceptPending,
    rejectApplicant,
    isRejectPending,
  } = useHandleSessionApplicantList({
    sessionId: session?.sessionId || +currSessionId!,
    searchParticipantStatus:
      tabName === 'ALL' ? undefined : (tabName as AppliedSessionStatusKey),
  });

  const handleCheckedItem = async (type: '승인' | '반려') => {
    if (checkedList.length === 0) {
      showToast('선택된 참가자가 없습니다.');
      return;
    }

    await showDialog({
      key: 'SESSION_MANAGEMENT_MODAL',
      element: (
        <Modal title={`참가자 ${type}`} onClose={hideDialog}>
          <p className="mt-2 leading-6">
            선택한 스프들의 신청을 {type}하시겠습니까?
          </p>

          {/* <p>
            <span className="text-mainGreen-hover">
              {checkedList.map(user => user.name).join(', ')}
            </span>{' '}
            스프는{' '}
            <span className="font-medium">
              {type === '승인' ? '반려' : '승인'}됨에서 {type}됨
            </span>
            으로 상태를 변경하고 알림을 보냅니다.
          </p> */}

          {/* NOTE: 위의 문구는 만약 상태가 "대기" 인 참가자가 포함되어 있다면? */}

          <div className="mt-8 flex justify-end gap-3">
            <SquareButton
              name={type}
              onClick={async () => {
                try {
                  await Promise.all(
                    checkedList.map(({ participantId, status }) => {
                      const params = {
                        sessionId: session?.sessionId || +currSessionId!,
                        participantId,
                      };

                      if (type === '승인' && status !== 'PARTICIPANT') {
                        return acceptApplicant(params);
                      }

                      if (type === '반려' && status !== 'REJECT') {
                        return rejectApplicant(params);
                      }

                      return null;
                    }),
                  );
                  showToast(`선택한 참가자들을 모두 ${type}했습니다.`);
                  onAllClearCheckedChange();
                  hideDialog();
                } catch {
                  showToast(`참가자 ${type} 중 오류가 발생했습니다.`);
                }
              }}
            />
            <SquareButton name="취소" onClick={hideDialog} color="gray" />
          </div>
        </Modal>
      ),
    });
  };

  const STATUS_STYLES: Record<AppliedSessionStatusKey, string> = {
    WAIT: 'text-red-500',
    PARTICIPANT: 'text-mainGreen-hover',
    REJECT: 'text-mainBlue-active',
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

            <div className="flex items-center gap-1">
              <span className="text-[15px] text-darkGray">마감</span>
              <BsCalendar2Minus size={13} className="text-darkGray" />
              <span className="text-[15px] text-darkGray">
                {formatDate(
                  noticeDetail?.applicationEndDateTime,
                  'yyyy.MM.dd HH:mm',
                )}{' '}
                {noticeDetail?.applicationEndDateTime &&
                  `(D${getDDay(noticeDetail?.applicationEndDateTime)})`}
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
            onClick={() => handleCheckedItem('승인')}
            disabled={isAcceptPending}
          />
          <SquareButton
            name="반려"
            className="!bg-red-100 !text-red-500"
            onClick={() => handleCheckedItem('반려')}
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
          className="h-full rounded-[20px] bg-lightGray py-20"
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
                          onCheckedChange({
                            noticeParticipantId,
                            status,
                            userName,
                          })
                        }
                        inputClassName="bg-white !size-5 !mr-3"
                      />
                    )}

                    <div
                      className={`relative w-full ${gridStyle} items-center rounded-2xl bg-white py-4 shadow-card [&>*]:text-center [&>span]:truncate`}
                    >
                      <span className="text-darkGray-active">{userName}</span>
                      <span className="text-darkGray-active">
                        {`${userCampuses}캠퍼스` || '정보 없음'}
                      </span>

                      <MyCourseListWithHover
                        courseList={courses
                          .sort((a, b) => a.id - b.id)
                          .map(({ name }) => ({ courseTitle: name }))}
                        hoverBoxClassName="w-[400px]"
                      />

                      <span className="text-darkGray-active">{email}</span>
                      <span className="text-darkGray-active">
                        {phoneNumber}
                      </span>
                      <span className="text-darkGray-active">
                        {applicationTime || '-'}
                      </span>
                      <span className={` ${STATUS_STYLES[status]}`}>
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
