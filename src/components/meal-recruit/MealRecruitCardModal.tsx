import Modal from '../common/modal/Modal';
import UserImage from '../user/UserImage';

import { useDialogContext } from '@/hooks';
import { FaCrown } from 'react-icons/fa';

export default function MealRecruitCardModal() {
  const { hideDialog } = useDialogContext();

  return (
    <Modal
      className="main-w-[284px] px-8 py-10"
      onToggleClick={hideDialog}
      title={
        <div className="text-base font-semibold">햄버거 드실분 모집합니다!</div>
      }
    >
      <div className="mt-1 flex flex-col gap-2 rounded-lg bg-gray5 px-3 py-[17px] text-sm">
        <div className="flex items-center">
          <span className="meal-recruit-text-divider text-gray1">일정</span>

          <span className="flex flex-1 gap-1 overflow-hidden">
            2024.07.06 오후1시
          </span>
        </div>

        <div className="flex items-center">
          <span className="meal-recruit-text-divider text-gray1">식당</span>

          <span className="flex flex-1 gap-1 overflow-hidden">롯데리아</span>
        </div>

        <div className="flex items-center">
          <span className="meal-recruit-text-divider text-gray1">위치</span>

          <span className="flex flex-1 gap-1 overflow-hidden">
            월곡역 1번 출구 앞
          </span>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm text-gray1">참여중인 멤버 2/4명</div>

        <ul className="mt-3 flex flex-col gap-3">
          {[1, 2].map(item => {
            return (
              <li key={item} className="flex gap-2.5">
                <UserImage className="size-10 p-0.5" profileImageUrl="" />
                <div className="w-full">
                  <div className="flex items-center justify-between gap-9">
                    <span className="text-sm">모집자 닉네임</span>
                    {item === 1 && (
                      <div className="flex items-center justify-between gap-1 rounded bg-[#FEFAE0] px-1.5 py-1 text-xs text-[#FF6D28]">
                        <FaCrown />
                        <span>모임장</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray2">디자인</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-full bg-vividGreen1 px-4 py-2 tracking-tight text-white"
        onClick={() => {
          hideDialog();
        }}
      >
        참여하기
      </button>
    </Modal>
  );
}
