import { ReactNode } from 'react';

import Title from '../common/Title';
import SquareButton from '../common/button/SquareButton';

import GuideNumberIcon from '@/assets/icon/GuideNumberIcon';

const defaultInputStyle =
  'rounded-2xl border border-solid border-gray4 px-[15px] py-4';

interface LabeledSectionProps {
  label: string;
  children: ReactNode;
  className?: string;
}

function LabeledSection({ label, children, className }: LabeledSectionProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="text-lg font-medium">{label}</div>
      {children}
    </div>
  );
}

export default function LoungeEditor() {
  return (
    <div className="mt-[26px]">
      <div className="flex items-center gap-1.5">
        <GuideNumberIcon version="v1" />
        <Title as="h1" title="프로젝트 필수 정보" />
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 text-lg">
        <LabeledSection label="모집 구분" className="col-span-2">
          <select className={`${defaultInputStyle} w-1/2`}>
            <option>프로젝트, 스터디</option>
            <option>프로젝트, 스터디1</option>
            <option>프로젝트, 스터디2</option>
          </select>
        </LabeledSection>

        <LabeledSection label="모집 기간">
          <div className="flex w-full items-center gap-2">
            <input
              type="date"
              id="datepicker"
              className={`${defaultInputStyle} w-[50%]`}
            />
            <span>~</span>
            <input
              type="date"
              id="datepicker"
              className={`${defaultInputStyle} w-[50%]`}
            />
          </div>
        </LabeledSection>
        <LabeledSection label="모집 인원">
          <select className={`${defaultInputStyle} w-full`}>
            <option>인원 미정 ~ 10명 이상</option>
            <option>인원 미정 ~ 20명 이상</option>
            <option>인원 미정 ~ 30명 이상</option>
          </select>
        </LabeledSection>
        <LabeledSection label="모집 직무">
          <select className={`${defaultInputStyle} w-full`}>
            <option>프론트엔트, 백엔드</option>
            <option>디자인, 기획</option>
          </select>
        </LabeledSection>
        <LabeledSection label="모집 유형">
          <select className={`${defaultInputStyle} w-full`}>
            <option>온라인</option>
            <option>오프라인</option>
            <option>혼합</option>
          </select>
        </LabeledSection>
        <LabeledSection label="필요 스택">
          <select className={`${defaultInputStyle} w-full`}>
            <option>react</option>
            <option>nextjs</option>
            <option>js,ts</option>
          </select>
        </LabeledSection>
        <LabeledSection label="연락 방법">
          <input type="text" className={`${defaultInputStyle} w-full`} />
        </LabeledSection>
      </div>

      <div className="mt-16 flex items-center gap-1.5">
        <GuideNumberIcon version="v2" />
        <Title as="h1" title="프로젝트 상세 정보" />
      </div>
      <div className="w-full">
        <LabeledSection label="제목" className="mt-8">
          <input type="text" className={`${defaultInputStyle} w-full`} />
        </LabeledSection>
        <LabeledSection label="모집기간" className="mt-6">
          <input
            type="text"
            className={`${defaultInputStyle} h-[300px] w-full`}
          />
        </LabeledSection>
      </div>
      <div className="flax mt-8 w-full items-center justify-end gap-4">
        <button
          type="button"
          className="mr-2 rounded-lg bg-gray2 px-4 py-2 tracking-tight text-white"
          onClick={() => {}}
        >
          취소
        </button>
        <SquareButton name="등록하기" onClick={() => {}} />
      </div>
    </div>
  );
}
