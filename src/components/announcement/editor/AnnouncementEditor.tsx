import { ReactNode, useCallback, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { usePostLoungeProject } from '@/services/lounge/loungeMutations';

import Title from '../../common/Title';
import SquareButton from '../../common/button/SquareButton';
// import { useGetLoungePositionsFilterList } from '@/services/lounge/loungeQueries';
import AnnouncementTextEditor from './AnnouncementTextEditor';

import {
  Progress,
  PtypeList,
  positionList,
  progressList,
  stackList,
} from '@/constants';
import {
  Controller,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { BsLink45Deg } from 'react-icons/bs';

import MultiSelectDropdown from '@/components/common/dropdown/MultiSelectDropdown';
import SelectableDropdown from '@/components/common/dropdown/SelectableDropdown';

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

const commonOptionBoxClass = 'px-4 py-[15px]';
const commonOptionClass = 'px-4 py-1 hover:rounded-lg hover:bg-gray4';

// TODO: api type 수정 필요
export interface FormValues {
  recruitmentCount: number;
  meetingType: Progress;
  contactMethod: string;
  recruitmentType: string;
  startDate: string;
  endDate: string;
  positions: number[];
  requiredStacks: number[];
  projectTitle: string;
  projectDescription: string;
}

interface LabeledSectionProps {
  label: string | ReactNode;
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

export default function AnnouncementEditor() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const methods = useForm<FormValues>({
    defaultValues: {
      recruitmentCount: 0,
      meetingType: 'ONLINE',
      contactMethod: '',
      recruitmentType: '',
      startDate: '',
      endDate: '',
      positions: [],
      requiredStacks: [],
      projectTitle: '',
      projectDescription: '',
    },
  });
  // const { data: positionsList } = useGetLoungePositionsFilterList();
  const { mutateAsync } = usePostLoungeProject();

  const { handleSubmit, control } = methods;

  const onSubmit: SubmitHandler<FormValues> = async data => {
    const params = {
      ...data,
      recruitmentCount: Number(data.recruitmentCount),
    };

    try {
      await mutateAsync(params);
      console.log('성공');
      queryClient.invalidateQueries({
        queryKey: ['useGetLoungeProjects', {}],
      });
      navigate('/lounge');
    } catch (err) {
      console.error(err);
    }
  };

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

  const recruitmentCountList = useMemo(() => {
    return Array.from({ length: 10 }, (_, index) => {
      if (index === 9) {
        return {
          id: index + 1,
          name: `${index + 1}명 이상`,
        };
      }
      return {
        id: index + 1,
        name: `${index + 1}명`,
      };
    });
  }, []);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="mt-[26px]">
        <div className="flex items-center gap-1.5">
          <div className="font-600 flex h-6 w-6 items-center justify-center rounded-full bg-skyBlue1 text-[18px] text-white">
            1
          </div>
          <Title as="h1" title="공지사항 필수 정보" />
        </div>
        <div className="relative mt-8 grid grid-cols-2 gap-4 text-lg">
          <LabeledSection label="모집 구분" className="col-span-2">
            <Controller
              control={control}
              name="recruitmentType"
              render={({ field: { onChange } }) => {
                return (
                  <SelectableDropdown
                    label="모집 구분"
                    width="50%"
                    options={PtypeList}
                    selectBoxClassName={`${defaultInputStyle}`}
                    selectOptionBoxClassName={commonOptionBoxClass}
                    selectOptionClassName={commonOptionClass}
                    onChangeValue={data => onChange(data[0].key)}
                  />
                );
              }}
            />
          </LabeledSection>

          <LabeledSection label="모집 기간">
            <div className="flex w-full items-center gap-2">
              <Controller
                control={control}
                name="startDate"
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
                name="endDate"
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
              name="recruitmentCount"
              render={({ field: { onChange } }) => {
                return (
                  <SelectableDropdown
                    label="모집 인원"
                    width="100%"
                    options={recruitmentCountList}
                    selectOptionBoxClassName={commonOptionBoxClass}
                    selectOptionClassName={commonOptionClass}
                    selectBoxClassName={`${defaultInputStyle}`}
                    onChangeValue={data => onChange(data[0].name)}
                  />
                );
              }}
            />
          </LabeledSection>
          <LabeledSection label="모집 직무">
            <Controller
              control={control}
              name="positions"
              render={({ field: { onChange } }) => {
                return (
                  <SelectableDropdown
                    label="모집 직무"
                    width="100%"
                    isCheckBox
                    options={positionList || []}
                    selectBoxClassName={`${defaultInputStyle}`}
                    selectOptionBoxClassName={commonOptionBoxClass}
                    selectOptionClassName={commonOptionClass}
                    onChangeValue={data => {
                      const ids = data.map(item => item.id);
                      onChange(ids);
                    }}
                  />
                );
              }}
            />
          </LabeledSection>
          <LabeledSection label="모집 유형">
            <Controller
              control={control}
              name="meetingType"
              render={({ field: { onChange } }) => {
                return (
                  <SelectableDropdown
                    label="모집 유형"
                    width="100%"
                    options={progressList}
                    selectBoxClassName={`${defaultInputStyle}`}
                    selectOptionBoxClassName={commonOptionBoxClass}
                    selectOptionClassName={commonOptionClass}
                    onChangeValue={data => onChange(data[0].key)}
                  />
                );
              }}
            />
          </LabeledSection>
          <LabeledSection label="필요 스택">
            <Controller
              control={control}
              name="requiredStacks"
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
                      const ids = data.map(item => item.id);
                      onChange(ids);
                    }}
                  />
                );
              }}
            />
          </LabeledSection>
          <LabeledSection
            label={
              <div className="flex items-center gap-1.5">
                <div>연락 방법</div>
                <BsLink45Deg size={22} />
              </div>
            }
          >
            <Controller
              control={control}
              name="contactMethod"
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
          <LabeledSection
            label={
              <div className="flex items-center gap-1.5">
                <div>zoom</div>
                <BsLink45Deg size={22} />
              </div>
            }
          >
            <Controller
              control={control}
              name="contactMethod"
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
          <LabeledSection
            label={
              <div className="flex items-center gap-1.5">
                <div>만족도 조사</div>
                <BsLink45Deg size={22} />
              </div>
            }
          >
            <Controller
              control={control}
              name="contactMethod"
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
          <div className="font-600 flex h-6 w-6 items-center justify-center rounded-full bg-skyBlue1 text-[18px] text-white">
            2
          </div>
          <Title as="h1" title="공지사항 상세 정보" />
        </div>
        <div className="w-full">
          <LabeledSection label="제목" className="mt-8">
            <Controller
              control={control}
              name="projectTitle"
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
            <AnnouncementTextEditor />
          </LabeledSection>
        </div>
        <div className="flax mt-8 w-full items-center justify-end gap-4 text-end">
          <button
            type="button"
            className="mr-2 rounded-lg bg-gray2 px-4 py-2 tracking-tight text-white"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <SquareButton name="등록하기" type="submit" />
        </div>
      </form>
    </FormProvider>
  );
}
