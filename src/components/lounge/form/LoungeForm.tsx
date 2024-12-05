import { useCallback } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { useTechStackList } from '@/hooks/useTechStackList';

import {
  usePostLoungeProject,
  usePutLoungeProject,
} from '@/services/lounge/loungeMutations';
import {
  useGetLoungePositionsFilterList,
  useGetLoungeProjectsDetail,
} from '@/services/lounge/loungeQueries';

import { dateFormat } from '@/utils/dateFormat';

import Title from '../../common/Title';
import SquareButton from '../../common/button/SquareButton';
import LoungeTextEditor from './LoungeTextEditor';
import { loungeFormSchema } from './loungeFormSchema';

import { Progress, PtypeList, progressList } from '@/constants';
import { recruitmentCountList } from '@/constants/optionList';
import { useDialogContext, usePageBlocker } from '@/hooks';
import { GetLoungeProjectDetail } from '@/types/lounge/loungeDto';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Controller,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { BsLink45Deg } from 'react-icons/bs';

import CircleNumber from '@/components/common/CircleNumber';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import MultiSelectDropdown from '@/components/common/dropdown/MultiSelectDropdown';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import TechStackDropdown from '@/components/common/dropdown/TechStackDropdown';
import ErrorMsg from '@/components/common/input/ErrorMsg';
import LabeledSection from '@/components/common/input/LabeledSection';
import ContactMethodContainer from '@/components/lounge/form/ContactMethodContainer';

const defaultInputStyle =
  'rounded-2xl border border-solid px-[15px] py-4 bg-white';
export const inputStyle = {
  default: `${defaultInputStyle} border-gray4`,
  error: `${defaultInputStyle} border-[#FF3939]`,
};

// TODO: api type 수정 필요
export interface FormValues {
  recruitmentCount: number;
  meetingType: Progress;
  contactMethod: string;
  contactDetail: string;
  recruitmentType: string;
  startDate: string;
  endDate: string;
  positions: number[];
  requiredStacks: number[];
  projectTitle: string;
  projectDescription: string;
}

const changeDataToFieldValues = (data?: GetLoungeProjectDetail) => {
  return {
    recruitmentCount: data?.recruitmentCount || 0,
    meetingType: data?.meetingType || 'ALL',
    contactMethod: data?.contactMethod || '',
    contactDetail: data?.contactDetail || '',
    recruitmentType: data?.ptype || '',
    startDate: data?.recruitmentStart || '',
    endDate: data?.recruitmentEnd || '',
    positions: data && data.position ? data.position.map(item => item.id) : [],
    requiredStacks:
      data && data.techStack ? data.techStack.map(item => item.id) : [],
    projectTitle: data?.title || '',
    projectDescription: data?.description || '',
  };
};

export default function LoungeForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modifyProjectId = searchParams.get('modifyProject');

  const { showToast } = useDialogContext();

  const queryClient = useQueryClient();
  const { data: positionsList } = useGetLoungePositionsFilterList();
  const { data: projectsDetail } = useGetLoungeProjectsDetail(
    Number(modifyProjectId || 0),
  );
  const { mutateAsync: postProject } = usePostLoungeProject();
  const { mutateAsync: putProject } = usePutLoungeProject();

  const { techStackList } = useTechStackList();

  const methods = useForm<FormValues>({
    defaultValues: changeDataToFieldValues(),
    values: changeDataToFieldValues(projectsDetail),
    resolver: zodResolver(loungeFormSchema),
  });

  const {
    handleSubmit,
    control,
    formState: { isDirty, isSubmitting },
  } = methods;

  usePageBlocker({
    isBlockRefresh: true,
    form: {
      isDirty,
      isSubmitted: isSubmitting,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async data => {
    const params = {
      ...data,
      recruitmentCount: Number(data.recruitmentCount),
    };
    if (modifyProjectId) {
      try {
        await putProject({ projectId: Number(modifyProjectId), params });
        showToast('프로젝트를 수정했습니다.');
        queryClient.invalidateQueries({
          queryKey: ['useGetLoungeProjects', {}],
        });
        navigate('/lounge');
      } catch (err) {
        console.error(err);
        showToast('프로젝트 수정을 실패했습니다.');
      }
      return;
    }

    try {
      await postProject(params);
      showToast('프로젝트를 등록했습니다.');
      queryClient.invalidateQueries({
        queryKey: ['useGetLoungeProjects', {}],
      });
      navigate('/lounge');
    } catch (err) {
      console.error(err);
      showToast('프로젝트 등록을 실패했습니다.');
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
        showToast(firstErrorMessage);
      }
    },
    [methods, showToast],
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="mt-[26px]">
        <div className="flex items-center gap-1.5">
          <CircleNumber number={1} />
          <Title as="h1" title="프로젝트 필수 정보" />
        </div>
        <div className="relative mt-8 grid grid-cols-2 gap-4 text-lg">
          <LabeledSection
            label="모집 구분"
            className="col-span-2 [&>div]:w-1/2"
          >
            <Controller
              control={control}
              name="recruitmentType"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                const selectedOption = PtypeList.find(
                  ({ key }) => key === value,
                );
                return (
                  <SingleSelectDropdown
                    defaultLabel="모집 구분"
                    options={PtypeList}
                    selectedOption={selectedOption}
                    onChangeValue={data => onChange(data[0].key)}
                    errorMsg={error?.message}
                  />
                );
              }}
            />
          </LabeledSection>

          <LabeledSection label="모집 기간">
            <div className="flex w-full items-center">
              <Controller
                control={control}
                name="startDate"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => {
                  const handleStartDate = (date: Date | null) => {
                    onChange(dateFormat(date, 'YYYY-MM-DD') || '');
                  };
                  return (
                    <div className="flex w-full min-w-[46%] flex-col">
                      <CustomDatePicker
                        currentDate={value ? new Date(value) : undefined}
                        onChange={handleStartDate}
                        errorMsg={error?.message || ''}
                      />
                    </div>
                  );
                }}
              />
              <span className="mx-2 text-center">~</span>
              <Controller
                control={control}
                name="endDate"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => {
                  const handleEndDate = (date: Date | null) => {
                    onChange(dateFormat(date, 'YYYY-MM-DD') || '');
                  };
                  return (
                    <div className="flex w-full min-w-[46%] flex-col">
                      <CustomDatePicker
                        currentDate={value ? new Date(value) : undefined}
                        onChange={handleEndDate}
                        errorMsg={error?.message || ''}
                      />
                    </div>
                  );
                }}
              />
            </div>
          </LabeledSection>
          <LabeledSection label="모집 인원">
            <Controller
              control={control}
              name="recruitmentCount"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                const selectedOption = recruitmentCountList.find(
                  ({ id }) => id === value,
                );

                return (
                  <SingleSelectDropdown
                    defaultLabel="모집 인원"
                    options={recruitmentCountList}
                    selectedOption={selectedOption}
                    onChangeValue={data => onChange(data[0].id)}
                    errorMsg={error?.message}
                  />
                );
              }}
            />
          </LabeledSection>
          <LabeledSection label="모집 직무">
            <Controller
              control={control}
              name="positions"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                const selectedOption = positionsList?.filter(position =>
                  value.includes(position.id),
                );

                return (
                  <MultiSelectDropdown
                    defaultLabel="모집 직무"
                    initialSelectedOptions={selectedOption}
                    options={positionsList || []}
                    onChangeValue={data => {
                      const ids = data.map(item => item.id);
                      onChange(ids);
                    }}
                    errorMsg={error?.message}
                  />
                );
              }}
            />
          </LabeledSection>
          <LabeledSection label="모집 유형">
            <Controller
              control={control}
              name="meetingType"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                const selectedOption = progressList.find(
                  ({ key }) => key === value,
                );
                return (
                  <SingleSelectDropdown
                    defaultLabel="모집 유형"
                    options={progressList}
                    selectedOption={selectedOption}
                    onChangeValue={data => onChange(data[0].key)}
                    errorMsg={error?.message}
                  />
                );
              }}
            />
          </LabeledSection>

          <LabeledSection label="필요 스택">
            <Controller
              control={control}
              name="requiredStacks"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                const selectedOption = techStackList?.filter(position =>
                  value.includes(position.id),
                );

                return (
                  <TechStackDropdown
                    defaultLabel="기술스택"
                    defaultTabValue="백엔드"
                    errorMsg={error?.message}
                    initialSelectedOptions={selectedOption}
                    options={techStackList}
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
            <ContactMethodContainer control={control} />
          </LabeledSection>
        </div>

        <div className="mt-16 flex items-center gap-1.5">
          <CircleNumber number={2} />
          <Title as="h1" title="프로젝트 상세 정보" />
        </div>
        <div className="w-full">
          <LabeledSection label="제목" className="mt-8">
            <Controller
              control={control}
              name="projectTitle"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                return (
                  <div className="flex flex-col">
                    <input
                      type="text"
                      className={`${error ? inputStyle.error : inputStyle.default} w-full`}
                      onChange={onChange}
                      value={value}
                      placeholder="제목을 입력해 주세요"
                    />
                    {error && (
                      <ErrorMsg msg={error?.message || ''} className="ml-2" />
                    )}
                  </div>
                );
              }}
            />
          </LabeledSection>
          <LabeledSection label="모집기간" className="mt-6">
            <LoungeTextEditor />
          </LabeledSection>
        </div>
        <div className="flax mt-8 w-full items-center justify-end gap-4 text-end">
          <button
            type="button"
            className="mr-2 rounded-lg bg-gray2 px-4 py-2 tracking-tight text-white"
            onClick={() => navigate('/lounge')}
          >
            취소
          </button>
          <SquareButton
            name={modifyProjectId ? '수정하기' : '등록하기'}
            type="submit"
          />
        </div>
      </form>
    </FormProvider>
  );
}
