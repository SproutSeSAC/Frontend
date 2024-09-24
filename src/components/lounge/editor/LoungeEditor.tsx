import { ReactNode, useCallback } from 'react';

import MultiSelectDropdown from '../../common/MultiSelectDropdown';
import SelectableDropdown from '../../common/SelectableDropdown';
import Title from '../../common/Title';
import SquareButton from '../../common/button/SquareButton';
import LoungeTextEditor from './LoungeTextEditor';
import { loungeEditorSchema } from './loungeEditorSchema';

import GuideNumberIcon from '@/assets/icons/GuideNumberIcon';
import { stackList } from '@/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Controller,
  FormProvider,
  SubmitErrorHandler,
  useForm,
} from 'react-hook-form';

const TAB_LIST = [
  { text: '프론트엔드', type: 'frontend' },
  { text: '백엔드', type: 'backend' },
  { text: '모바일', type: 'mobile' },
  { text: '컴퓨터', type: 'computer' },
  { text: 'pm/ui/ux', type: 'pm' },
  { text: '데이터', type: 'data' },
  { text: '모두보기', type: 'all' },
];
const defaultInputStyle =
  'rounded-2xl border border-solid border-gray4 px-[15px] py-4 bg-white';

// TODO: api type 수정 필요
interface FormValues {
  모집구분: string;
  모집기간1: string;
  모집기간2: string;
  모집인원: string;
  모집직무: string[];
  모집유형: string;
  필요스택: string[];
  연락방법: string;
  제목: string;
  모집기간: string;
}

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
  const methods = useForm<FormValues>({
    defaultValues: {
      모집구분: '',
      모집기간1: '',
      모집기간2: '',
      모집인원: '',
      모집직무: [],
      모집유형: '',
      필요스택: [],
      연락방법: '',
      제목: '',
      모집기간: '',
    },
    resolver: zodResolver(loungeEditorSchema),
  });

  const { handleSubmit, control } = methods;

  const onError: SubmitErrorHandler<FormValues> = useCallback(
    err => {
      console.error('hook form error >>', {
        data: methods.getValues(),
        error: err,
      });
      const firstErrorMessage = Object.entries(err)?.[0]?.[1].message || '';
      if (firstErrorMessage) {
        alert(firstErrorMessage);
      }
    },
    [methods],
  );

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(
          submitData => console.log('submitData', submitData),
          onError,
        )}
        className="mt-[26px]"
      >
        <div className="flex items-center gap-1.5">
          <GuideNumberIcon version="v1" />
          <Title as="h1" title="프로젝트 필수 정보" />
        </div>
        <div className="relative mt-8 grid grid-cols-2 gap-4 text-lg">
          <LabeledSection label="모집 구분" className="col-span-2">
            <Controller
              control={control}
              name="모집구분"
              render={({ field: { onChange } }) => {
                return (
                  <SelectableDropdown
                    label="모집 구분"
                    width="50%"
                    options={[
                      { key: '프로젝트, 스터디', value: '프로젝트, 스터디' },
                      { key: '프로젝트, 스터디2', value: '프로젝트, 스터디2' },
                      { key: '프로젝트, 스터디3', value: '프로젝트, 스터디3' },
                    ]}
                    className={`${defaultInputStyle}`}
                    onChangeValue={data => onChange(data[0].value)}
                  />
                );
              }}
            />
          </LabeledSection>

          <LabeledSection label="모집 기간">
            <div className="flex w-full items-center gap-2">
              <Controller
                control={control}
                name="모집기간1"
                render={({ field: { onChange, value } }) => {
                  return (
                    <input
                      type="date"
                      id="datepicker"
                      value={value}
                      onChange={onChange}
                      className={`${defaultInputStyle} w-[50%]`}
                    />
                  );
                }}
              />
              <span>~</span>
              <Controller
                control={control}
                name="모집기간2"
                render={({ field: { onChange, value } }) => {
                  return (
                    <input
                      type="date"
                      value={value}
                      id="datepicker"
                      onChange={onChange}
                      className={`${defaultInputStyle} w-[50%]`}
                    />
                  );
                }}
              />
            </div>
          </LabeledSection>
          <LabeledSection label="모집 인원">
            <Controller
              control={control}
              name="모집인원"
              render={({ field: { onChange } }) => {
                return (
                  <SelectableDropdown
                    label="모집 인원"
                    width="100%"
                    options={[
                      {
                        key: '인원 미정 ~ 10명 이상',
                        value: '인원 미정 ~ 10명 이상',
                      },
                      {
                        key: '인원 미정 ~ 20명 이상',
                        value: '인원 미정 ~ 20명 이상',
                      },
                      {
                        key: '인원 미정 ~ 30명 이상',
                        value: '인원 미정 ~ 30명 이상',
                      },
                    ]}
                    className={`${defaultInputStyle}`}
                    onChangeValue={data => onChange(data[0].value)}
                  />
                );
              }}
            />
          </LabeledSection>
          <LabeledSection label="모집 직무">
            <Controller
              control={control}
              name="모집직무"
              render={({ field: { onChange } }) => {
                return (
                  <MultiSelectDropdown
                    label="모집직무"
                    width="100%"
                    tabList={TAB_LIST}
                    defaultValue="frontend"
                    className={`${defaultInputStyle} `}
                    options={stackList}
                    onChangeValue={data => {
                      const newData = data.map(item => item.value);
                      onChange(newData);
                    }}
                  />
                );
              }}
            />
          </LabeledSection>
          <LabeledSection label="모집 유형">
            <Controller
              control={control}
              name="모집유형"
              render={({ field: { onChange } }) => {
                return (
                  <SelectableDropdown
                    label="모집 유형"
                    width="100%"
                    options={[
                      { key: '온라인', value: '온라인' },
                      { key: '오프라인', value: '오프라인' },
                      { key: '혼합', value: '혼합' },
                    ]}
                    className={`${defaultInputStyle}`}
                    onChangeValue={data => onChange(data[0].value)}
                  />
                );
              }}
            />
          </LabeledSection>
          <LabeledSection label="필요 스택">
            <Controller
              control={control}
              name="필요스택"
              render={({ field: { onChange } }) => {
                return (
                  <MultiSelectDropdown
                    label="기술스택"
                    tabList={TAB_LIST}
                    width="100%"
                    defaultValue="frontend"
                    className={`${defaultInputStyle} `}
                    options={stackList}
                    onChangeValue={data => {
                      const newData = data.map(item => item.value);
                      onChange(newData);
                    }}
                  />
                );
              }}
            />
          </LabeledSection>
          <LabeledSection label="연락 방법">
            <Controller
              control={control}
              name="연락방법"
              render={({ field: { onChange, value } }) => {
                return (
                  <input
                    type="text"
                    className={`${defaultInputStyle} w-full`}
                    onChange={onChange}
                    value={value}
                  />
                );
              }}
            />
          </LabeledSection>
        </div>

        <div className="mt-16 flex items-center gap-1.5">
          <GuideNumberIcon version="v2" />
          <Title as="h1" title="프로젝트 상세 정보" />
        </div>
        <div className="w-full">
          <LabeledSection label="제목" className="mt-8">
            <Controller
              control={control}
              name="제목"
              render={({ field: { onChange, value } }) => {
                return (
                  <input
                    type="text"
                    className={`${defaultInputStyle} w-full`}
                    onChange={onChange}
                    value={value}
                    placeholder="제목을 입력해 주세요"
                  />
                );
              }}
            />
          </LabeledSection>
          <LabeledSection label="모집기간" className="mt-6">
            <LoungeTextEditor />
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
          <SquareButton name="등록하기" type="submit" />
        </div>
      </form>
    </FormProvider>
  );
}
