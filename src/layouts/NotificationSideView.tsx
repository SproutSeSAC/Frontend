import { useCallback, useEffect } from 'react';

import { useBlocker, useNavigate } from 'react-router-dom';

import { notificationOpenAtom } from '@/atoms/notificationAtom';

import { useAtom } from 'jotai';
// import { BsX } from 'react-icons/bs';
import { FaChevronRight } from 'react-icons/fa';

import CollapsibleSideView from '@/components/common/container/CollapsibleSideView';
import UserImage from '@/components/user/UserImage';

export default function NotificationSideView() {
  const navigate = useNavigate();
  const [isNotificationOpenOpen, setIsNotificationOpenOpen] =
    useAtom(notificationOpenAtom);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !!isNotificationOpenOpen &&
      currentLocation.pathname !== nextLocation.pathname,
  );

  const handleClose = useCallback(() => {
    setIsNotificationOpenOpen(false);
  }, [setIsNotificationOpenOpen]);

  useEffect(() => {
    if (blocker.state === 'blocked') {
      blocker.proceed();
      handleClose();
    }
  }, [blocker, handleClose]);

  const headerContent = (
    <div className="mb-6 flex w-full items-center">
      <button
        type="button"
        aria-label="접어두기"
        className="flex size-12 items-center justify-center rounded-lg border border-solid border-gray4 bg-white text-gray2"
        onClick={handleClose}
      >
        <FaChevronRight />
      </button>
      <div className="w-full flex-1 py-3 text-center text-lg font-semibold text-text">
        알림
      </div>
    </div>
  );

  const mainContent = (
    <div className="flex h-[calc(100vh-24px-52px-40px)] flex-col gap-6 overflow-y-scroll">
      {[1, 2, 3, 4, 5].map(item => {
        return (
          <button
            key={item}
            disabled={item >= 3}
            className={`rounded-lg border border-solid border-gray4 p-4 text-sm text-gray1 ${item >= 3 && 'bg-gray3'} ${item === 5 && 'mb-10'}`}
            onClick={() => {
              navigate('/lounge/post/1');
            }}
          >
            <div className="mb-3.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {item < 3 && (
                  <div className="h-3.5 w-3.5 rounded-full bg-vividGreen1" />
                )}
                <div className="text-sm text-gray1">공지사항</div>
              </div>
              {/* <button onClick={() => {}}>
                <BsX className="size-5 text-gray5" />
              </button> */}
            </div>
            <div className="mb-6 line-clamp-2 w-full overflow-hidden text-ellipsis">
              안녕하세요, 새싹(SeSAC) 운영진입니다! 새싹(SeSAC) 강북&성북캠퍼스
              교육생을 위한 전문역량 강화 특강을 아래와 같이 실시합니다. 해당
              분야 전문가들을 모셔서 다양한 역량을 높일 수 있는 전문가
              특강입니당! [새싹데이@SeSAC Insight at N Site] 신청기한: ~
              8/29(목) 오전 11시 까지 ※ 특강 회차 당 신청시간 기준 선착순 95명
              한정 ※ 2회차 모두 신청할 경우 인원 초과시 1개 회차만 신청한
              인원에게 우선권 부여될 수 있음. [회차별 정보] 1회차 일시 : 9/2(월)
              18:30~20:00 ※ 각 회차별 특강 시간은 기본 1시간 30분 예정, 질의
              응답 시 연장될 수 있음) 주제: 피그마 초급반 대상 : 피그마를 처음
              접하는 경우 ~ 약간만 다룰 수 있는 정도! 목차· 피그마 기초
              인터페이스· 오토 레이아웃· 컴포넌트 · Q&A 2회차 일시 : 9/3(화)
              18:30~20:00 ※ 각 회차별 특강 시간은 기본 1시간 30분 예정, 질의
              응답 시 연장될 수 있음) 주제 : 피그마 중급반 대상 : 어느 정도
              커리큘럼 상에서 배운 정도 이상! 목차· 피그마 오토
              레이아웃&컴포넌트 핵심 및 사용 팁· 프로토타이핑 · Q&A [특강 개요]
              특강 강사 : 하이서 (활동명 : 피그마튜터) [연사 소개] ·
              2022.07~2023.08 / 그립컴퍼니 UXUI디자이너 · 2021.03~2022.06 /
              아비드이앤에프 UI디자이너 · 2019.12~2020.11 / 에스티유니타스
              UI디자이너 [저서 소개] Figma 핵심만 빠르게(전자책) (2022) 피그마로
              시작하는 UI디자인(2023 5월 출간) 특강 장소 : 온라인 (Zoom) ※ 본
              구글폼을 통해 사전 참석 신청한 분들에게 특강 당일 17:00에 줌(Zoom)
              링크 일괄 발송 예정 신청기한: ~ 8/29(목) 오전 11시 까지 ※ 특강
              회차 당 신청시간 기준 선착순 95명 한정 ※ 2회차 모두 신청할 경우
              인원 초과시 1개 회차만 신청한 인원에게 우선권 부여될 수 있음.
              감사합니다 운영진 드림.
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <UserImage className="size-6 p-0.5" profileImageUrl="" />
                <div className="text-text">박민석 매니저</div>
              </div>

              <div className="text-xs text-gray2">
                {item < 3 ? '2024.10.24' : '7시간전'}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <CollapsibleSideView
      sideViewOpen={isNotificationOpenOpen}
      onClose={handleClose}
      headerContent={headerContent}
      mainContent={mainContent}
      className="fixed right-0 max-w-[412px] bg-white px-5 pt-10 shadow-card"
      hideButton
    />
  );
}
