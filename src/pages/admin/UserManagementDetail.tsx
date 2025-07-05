import { Link, useParams } from 'react-router-dom';

import {
  useGetTraineeMemo,
  useGetUserAppliedSessionList,
  useGetUserToManageInfo,
} from '@/services/admin/userToManageQueries';

import { rolesObj } from '@/constants';
import { useDialogContext } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { isTrainee } from '@/utils';

import UserMemoModal from '@/pages/admin/UserMemoModal';
import UserPhoneNumberModal from '@/pages/admin/UserPhoneNumberModal';
import UserPostCollection from '@/pages/admin/UserPostCollection';

import Title from '@/components/common/Title';
import SquareButton from '@/components/common/button/SquareButton';
import ScrollContainer from '@/components/common/container/ScrollContainer';
import Tag from '@/components/common/tag/Tag';
import AppliedSession from '@/components/session/AppliedSession';
import MyCourseListWithHover from '@/components/user/MyCourseListWithHover';
import UserImage from '@/components/user/UserImage';

export default function UserManagementDetail() {
  const { userId: id } = useParams();
  const userId = +id!;

  const { showDialog } = useDialogContext();

  const { data: userInfo, isLoading } = useGetUserToManageInfo({ userId });

  const { data: traineeMemo } = useGetTraineeMemo({ traineeId: userId });

  const { data: appliedSessionList } = useGetUserAppliedSessionList({ userId });

  const userBasicData = [
    {
      name: '이름',
      value: userInfo && (
        <span className="peer line-clamp-1 flex items-center gap-1 text-darkGray-active">
          {userInfo?.name}
          <Tag
            text={rolesObj[userInfo?.role]}
            roleKey={userInfo.role}
            size="small"
            className="py-1"
          />
        </span>
      ),
    },
    {
      name: '이메일',
      value: (
        <span className="peer line-clamp-1 text-darkGray-active">
          {userInfo?.email}
        </span>
      ),
    },
    {
      name: '전화번호',
      value: (
        <span className="peer line-clamp-1 text-darkGray-active">
          {userInfo?.phoneNumber}
        </span>
      ),
    },
    {
      name: '메모',
      value: traineeMemo?.content,
      emptyValue: '작성된 메모가 없어요.',
    },
  ];

  const userSpecificationData = [
    {
      name: '도메인',
      dataList: userInfo?.domainList,
      emptyValue: '선택한 도메인이 없어요',
    },
    {
      name: '직무',
      dataList: userInfo?.jobList,
      emptyValue: '선택한 직무가 없어요',
    },
    {
      name: '기술스택',
      dataList: userInfo?.techStackList,
      emptyValue: '선택한 기술스택이 없어요',
    },
  ];

  const openModalClick = async (name: '메모' | '전화번호') => {
    if (name === '전화번호') {
      await showDialog({
        key: 'PHONE_NUMBER_CARD',
        element: (
          <UserPhoneNumberModal
            userId={userId}
            username={userInfo?.name || ''}
            userPhoneNumber={userInfo?.phoneNumber || ''}
          />
        ),
      });
    }
    if (name === '메모') {
      await showDialog({
        key: 'TRAINEE_MEMO_CARD',
        element: userInfo && (
          <UserMemoModal
            userId={userId}
            username={userInfo.name}
            memo={traineeMemo?.content || ''}
          />
        ),
      });
    }
  };

  return (
    <MainView className="mb-20">
      {!isLoading && userInfo && (
        <>
          <Header title={`${userInfo.name} 스프`} />

          <div className="flex gap-14">
            {/* 수강정보 */}
            <div className="size-full rounded-xl border bg-white p-12">
              <div className="flex items-center gap-7">
                <UserImage
                  className="size-[120px]"
                  imageNameSegment={userInfo.profileImageUrl}
                />
                <div className="flex flex-col gap-2">
                  <Title
                    title={isTrainee(userInfo.role) ? '수강정보' : '담당정보'}
                  />
                  <span className="mt-2 truncate text-darkGray-active">
                    {userInfo?.campusList
                      .map(({ campusName }) => campusName.slice(0, -3))
                      .join(', ')}{' '}
                    캠퍼스
                  </span>
                  <MyCourseListWithHover
                    courseList={userInfo.courseList}
                    hoverBoxClassName="min-w-[550px]"
                  />
                </div>
              </div>

              <ul className="mt-10 flex flex-col gap-7">
                {userBasicData.map(({ name, value, emptyValue }) => (
                  <li
                    key={name}
                    className="relative flex items-center justify-between gap-12"
                  >
                    <div className="relative flex w-full flex-col items-start justify-between gap-3">
                      <Title title={name} />

                      {value ? (
                        <>
                          <span className="peer line-clamp-1 text-darkGray-active">
                            {value}
                          </span>
                          {name === '메모' && (
                            <div className="absolute top-16 z-40 hidden h-fit w-[550px] min-w-fit rounded-[20px] bg-black bg-opacity-90 px-6 py-4 shadow-card hover:block peer-hover:block">
                              <textarea
                                defaultValue={value as string}
                                className="h-fit w-full resize-none bg-transparent text-base text-white focus:outline-none"
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-darkGray">{emptyValue}</span>
                      )}
                    </div>
                    {(name === '전화번호' || name === '메모') && (
                      <SquareButton
                        name="수정하기"
                        color="gray"
                        className="min-w-fit"
                        onClick={() => openModalClick(name)}
                      />
                    )}
                  </li>
                ))}
                {/* 특강 신청 내역은 학생만 */}
                {isTrainee(userInfo.role) && (
                  <li className="relative">
                    <div className="mb-[10px] flex w-full items-center justify-between">
                      <Title title="특강 신청 내역" />
                      {appliedSessionList?.length !== 0 && (
                        <Link
                          to={`/admin/session-status/${userInfo.userId}`}
                          className="text-mainGray-active"
                          state={{
                            userId: userInfo.userId,
                            username: userInfo.name,
                          }}
                        >
                          더보기
                        </Link>
                      )}
                    </div>
                    {appliedSessionList?.length !== 0 ? (
                      <ul className="h-full w-full space-y-2">
                        {appliedSessionList?.map(session => (
                          <AppliedSession
                            key={`${session.startDateTime}-${session.ordinal}`}
                            session={session}
                            hasDeleteButton={false}
                          />
                        ))}
                      </ul>
                    ) : (
                      <span className="text-darkGray">
                        신청한 특강이 없습니다.
                      </span>
                    )}
                  </li>
                )}
              </ul>
            </div>

            {/* 특정정보 */}
            <div className="flex size-full flex-col gap-8 rounded-xl bg-white p-12">
              {isTrainee(userInfo.role) &&
                userSpecificationData.map(({ name, dataList, emptyValue }) => (
                  <div key={name} className="relative flex flex-col gap-3">
                    <Title title={name} />
                    {dataList?.length !== 0 ? (
                      <ScrollContainer className="gap-3" isBlurRight>
                        {dataList?.map(data => (
                          <li key={data.id}>
                            {'domain' in data && (
                              <Tag
                                text={data.domain}
                                size="big"
                                color="grayLight"
                                className="!py-[8px] px-[14px] !font-normal"
                              />
                            )}
                            {'job' in data && (
                              <span className="pr-3 leading-5 tracking-tight">
                                <Tag
                                  text={data.job}
                                  size="big"
                                  color="lightGreen"
                                  className="!py-[8px] px-[14px] !font-normal"
                                />
                              </span>
                            )}
                            {'techStack' in data && (
                              <img
                                src={data.iconImageUrl}
                                alt={data.techStack}
                                className="size-7"
                              />
                            )}
                          </li>
                        ))}
                      </ScrollContainer>
                    ) : (
                      <span className="text-darkGray">{emptyValue}</span>
                    )}
                  </div>
                ))}
              <div className="relative flex flex-col">
                <Title
                  title={`${userInfo?.name}님이 작성한 글 모음`}
                  className="mb-[10px]"
                />
                <UserPostCollection userId={userId} username={userInfo.name} />
              </div>
            </div>
          </div>
        </>
      )}
    </MainView>
  );
}
