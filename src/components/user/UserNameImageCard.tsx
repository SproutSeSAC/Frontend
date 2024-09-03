import { useToggleModal } from '@/hooks';

import CameraButton from '@/components/common/button/CameraButton';
import EditButton from '@/components/common/button/EditButton';
import SubmitButton from '@/components/common/button/SubmitButton';
import Input from '@/components/common/input/Input';
import Label from '@/components/common/input/Label';
import Modal from '@/components/common/modal/Modal';
import UserImage from '@/components/user/UserImage';

export default function UserNameImageCard() {
  const { modalOpen, toggleModal } = useToggleModal();

  return (
    <>
      <div className="relative flex w-[45%] max-w-[305px] items-center gap-8 rounded-xl bg-oliveGreen1 px-6 py-10">
        <UserImage className="size-[100px] p-5">
          <CameraButton onClick={() => {}} />
        </UserImage>

        <div className="flex flex-col gap-2">
          <span className="text-2xl font-medium text-white">김철수</span>
          <span className="text-oliveGreen3">@새싹 김철수</span>
        </div>

        <EditButton
          label="프로필 수정 버튼"
          className="absolute right-3 top-3 text-white"
          onClick={toggleModal}
        />
      </div>

      {modalOpen && (
        <Modal onToggleClick={toggleModal} title="개인정보">
          <form className="flex w-[350px] flex-col">
            <UserImage className="mx-auto mb-6 size-[220px] p-10">
              <CameraButton
                onClick={() => {}}
                className="bottom-5 right-3"
                iconSize={6}
              />
            </UserImage>

            <Label htmlFor="이름" />
            <Input
              name="이름"
              placeholder="김철수"
              width="w-full"
              height="h-[45px]"
              onChange={() => {}}
              className="mb-5"
            />

            <Label htmlFor="별명" />
            <Input
              name="별명"
              placeholder="새싹 김철수"
              width="w-full"
              height="h-[45px]"
              onChange={() => {}}
            />

            <SubmitButton
              name="저장하기"
              onClick={() => {}}
              className="mt-6 self-end font-semibold text-white"
            />
          </form>
        </Modal>
      )}
    </>
  );
}
