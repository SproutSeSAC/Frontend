import { useToggleModal } from '@/hooks';

import Tag from '@/components/common/Tag';
import EditButton from '@/components/common/button/EditButton';
import SquareButton from '@/components/common/button/SquareButton';
import Input from '@/components/common/input/Input';
import Label from '@/components/common/input/Label';
import Modal from '@/components/common/modal/Modal';

export default function InterestJobDomainSkillCard() {
  const { modalOpen, toggleModal } = useToggleModal();

  const listStyle = 'flex items-center py-2.5';

  const itemStyle = 'font-semibold tracking-tight px-2 mt-1.5 leading-5';

  const userInterestList = {
    domainList: ['IT', '건설', '게임'],
    interestJobList: ['서비스 기획', '데이터 분석'],
    skillList: [1, 2, 3, 4, 5, 6, 7, 8, 0, 10, 11],
  };

  return (
    <>
      <EditButton
        label="나의 새싹 정보 수정하기"
        className="absolute -top-[38px] right-2 text-gray2"
        onClick={toggleModal}
      />
      <div className="flex h-[190px] flex-1 flex-col justify-between divide-y rounded-3xl bg-white px-5 py-3 shadow-card md:w-full">
        <ul className={`${listStyle} gap-1.5`}>
          {userInterestList.domainList.map(domain => (
            <li key={domain}>
              <Tag text={domain} size="big" color="gray" />
            </li>
          ))}
        </ul>

        <ul className={listStyle}>
          {userInterestList.interestJobList.map(interestJob => (
            <li key={interestJob} className={itemStyle}>
              {interestJob}
            </li>
          ))}
        </ul>

        {/* 기술스택 */}
        <div className="overflow-x-scroll scrollbar-hide">
          <ul className={`${listStyle} flex w-full max-w-0 flex-1 gap-x-3`}>
            {userInterestList.skillList.map(skill => (
              <li
                key={skill}
                className="size-10 flex-shrink-0 rounded-lg bg-vividGreen3"
              />
            ))}
          </ul>
        </div>
      </div>

      {modalOpen && (
        <Modal onToggleClick={toggleModal} title="도메인 정보">
          <form className="mt-3 flex w-[350px] flex-col">
            <Label htmlFor="관심 도메인" />
            <ul className="mb-2 flex gap-1">
              {userInterestList.domainList.map(domain => (
                <li key={domain}>
                  <Tag
                    text={domain}
                    color="green"
                    size="medium"
                    onDeleteClick={() => {}}
                  />
                </li>
              ))}
            </ul>
            <Input
              name="관심 도메인"
              placeholder="관심 도메인을 입력해주세요."
              onChange={() => {}}
              className="mb-6"
            />

            <Label htmlFor="관심 직무" />
            <ul className="mb-2 flex gap-1">
              {userInterestList.interestJobList.map(interestJob => (
                <li key={interestJob}>
                  <Tag
                    text={interestJob}
                    color="olivegreen"
                    size="medium"
                    onDeleteClick={() => {}}
                  />
                </li>
              ))}
            </ul>
            {/* 드롭다운 */}
            <Input
              name="관심 직무"
              placeholder="관심 직무을 선택해주세요."
              onChange={() => {}}
              className="mb-6"
            />

            <Label htmlFor="기술 스택" />
            <Input
              name="기술 스택"
              placeholder="기술 스택을 등록해주세요."
              onChange={() => {}}
              className="mb-6"
            />

            <SquareButton
              name="저장하기"
              onClick={() => {}}
              className="self-end"
            />
          </form>
        </Modal>
      )}
    </>
  );
}
