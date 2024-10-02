import { useGetUserProfile } from '@/services/auth/authQueries';

import { useToggleModal } from '@/hooks';

import Tag from '@/components/common/Tag';
import EditButton from '@/components/common/button/EditButton';
import SquareButton from '@/components/common/button/SquareButton';
import Label from '@/components/common/input/Label';
import TextInput from '@/components/common/input/TextInput';
import Modal from '@/components/common/modal/Modal';

export default function InterestJobDomainSkillCard() {
  const { modalOpen, toggleModal } = useToggleModal();

  const { data, isLoading } = useGetUserProfile();

  const listStyle = 'flex items-center py-2.5';

  const itemStyle = 'font-semibold tracking-tight px-2 mt-1.5 leading-5';

  if (isLoading) return null;

  return (
    <>
      <EditButton
        label="나의 새싹 정보 수정하기"
        className="absolute -top-[38px] right-2 text-gray2"
        onClick={toggleModal}
      />

      <div className="flex h-[190px] flex-1 flex-col justify-between divide-y rounded-3xl bg-white px-5 py-3 shadow-card md:w-full">
        <ul className={`${listStyle} gap-1.5`}>
          {data?.domainList.map(({ id, domain }) => (
            <li key={id}>
              <Tag text={domain} size="big" color="gray" />
            </li>
          ))}
        </ul>

        <ul className={listStyle}>
          {data?.jobList.map(({ job, id }) => (
            <li key={id} className={itemStyle}>
              {job}
            </li>
          ))}
        </ul>

        {/* 기술스택 */}
        <div className="overflow-x-scroll scrollbar-hide">
          <ul className={`${listStyle} flex w-full max-w-0 flex-1 gap-x-3`}>
            {data?.techStackList.map(({ id, techStack, iconImageUrl }) => (
              <li
                key={id}
                className="size-10 flex-shrink-0 rounded-lg bg-vividGreen3"
              >
                <img src={iconImageUrl} alt={techStack} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {modalOpen && (
        <Modal onToggleClick={toggleModal} title="도메인 정보">
          <form className="mt-3 flex w-[350px] flex-col">
            <Label htmlFor="관심 도메인" />
            <ul className="mb-2 flex gap-1">
              {data?.domainList.map(({ id, domain }) => (
                <li key={id}>
                  <Tag
                    text={domain}
                    color="green"
                    size="medium"
                    onDeleteClick={() => {}}
                  />
                </li>
              ))}
            </ul>
            <TextInput
              name="관심 도메인"
              placeholder="관심 도메인을 입력해주세요."
              onChange={() => {}}
              className="mb-6"
            />

            <Label htmlFor="관심 직무" />
            <ul className="mb-2 flex gap-1">
              {data?.jobList.map(({ id, job }) => (
                <li key={id}>
                  <Tag
                    text={job}
                    color="olivegreen"
                    size="medium"
                    onDeleteClick={() => {}}
                  />
                </li>
              ))}
            </ul>
            {/* 드롭다운 */}
            <TextInput
              name="관심 직무"
              placeholder="관심 직무을 선택해주세요."
              onChange={() => {}}
              className="mb-6"
            />

            <Label htmlFor="기술 스택" />
            <ul className="mb-2 flex gap-1">
              {data?.techStackList.map(({ id, techStack, iconImageUrl }) => (
                <li
                  key={id}
                  className="size-10 flex-shrink-0 rounded-lg bg-vividGreen3"
                >
                  <img src={iconImageUrl} alt={techStack} />
                </li>
              ))}
            </ul>
            <TextInput
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
