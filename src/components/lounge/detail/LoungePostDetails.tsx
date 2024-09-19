import LoungeModal from '../LoungeModal';

import { useToggleModal } from '@/hooks';
import { BsEye } from 'react-icons/bs';

import SubmitButton from '@/components/common/button/SubmitButton';
import UserImage from '@/components/user/UserImage';

export default function LoungePostDetails() {
  const { toggleModal, modalOpen } = useToggleModal();
  return (
    <>
      <div className="border-b-solid mt-12 flex items-center justify-between border-b border-b-gray5 pb-6">
        <div>
          <div className="mt-2 flex items-center gap-2 text-[22px]">
            <UserImage className="size-[30px] p-0.5" />
            <div>@h-g0-getter</div>
          </div>

          <div className="mt-3 flex items-center gap-10 text-lg text-gray1">
            <div className="flex items-center gap-3">
              <div>작성일</div>
              <div>2024.04.12</div>
              <div>17:50</div>
            </div>
            <div className="ml-10 flex items-center gap-1">
              <BsEye className="h-[18px] w-[18px]" />
              <div>99</div>
            </div>
          </div>
        </div>
        <SubmitButton name="참여하기" onClick={toggleModal} />
      </div>

      <div className="mt-6 text-lg">
        스터디 주제 : 데이터 구조 및 알고리즘
        <br />
        스터디 목표 : 북미 취업 및 이직을 위한 데이터 구조 및 알고리즘 마스터
        <br />
        예상 스터디 일정 (횟수) :<br />
        1차: <br />
        매주 화요일, 목요일은 셀프 스터디 (미팅 조인 및 미팅 후 솔루션 제출
        필수)
        <br />
        매주 토요일은 1:1로 Mock Interview 진행 (영어 또는 한국어 선택) <br />
        2024년 9월 1일 일요일 - 2024년 11월 2일 토요일: 매주 화, 목, 토 7:00 PM
        - 8:00 PM
        <br />
        2024년 11월 3일 일요일 - 2024년 12월 1일 일요일: 매주 화, 목, 토 8:00 PM
        - 9:00 PM
        <br />
        2차: TBD <br />
        스터디 소개와 개설 이유 :<br />
        토론토에서 개발자로 일하고 현재는 캐나다 대학에서 프로그래밍을 가르치고
        있습니다. 데이터 구조 및 알고리즘을 <br />
        제대로 배워본 적이 없어 기초부터 같이 공부할 분들을 찾습니다. 미국
        빅테크 이직을 목표로 준비하고 있고 북미 취<br />
        업 및 이직 정보에 대해서는 빠삭한 편이라 스터디 계획 관련해선 문제
        없습니다. <br />
        친한 친구들이랑 공부하기엔 잡담만 하게 되고, 저처럼 혼자 공부하기엔
        의지가 없다 하시는 분들이 참여하시면 좋을
        <br />
        것 같습니다. 책임감 있고 꾸준히 공부할 수 있는 분들이 많이 참여해
        주셨으면 합니다. <br />
        스터디 관련 유의사항 : <br />
        GitHub, Notion, Discord 계정 필요
        <br />
        매주 참여비 3만원 또는 30 CAD <br />
        참여비는 매주 일요일에 돌려드립니다. <br />
        참여비가 모두 차감됐을 경우 스터디에서 제외됩니다. <br />
        미팅 불참 또는 솔루션 미제출시 이유 관계 없이 (개인 사정 등.) 참여비가
        차감됩니다. <br />
        차감으로 모인 참여비는 참여비 차감 없이 스터디를 마친 참여자분들께 매주
        배분됩니다. <br />
        스터디에 지원할 수 있는 방법을 남겨주세요. (이메일, 카카오 오픈채팅방,
        구글폼 등.) : <br />
        간단한 자기소개와 함께 연락주시면 감사하겠습니다. (사용할 언어 등.)
        <br />
      </div>
      {modalOpen && <LoungeModal toggleModal={toggleModal} />}
    </>
  );
}
