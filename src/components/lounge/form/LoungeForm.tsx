import { useCallback } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { usePostMyPost, usePutMyPost } from '@/services/post/postMutation';
import { useGetPostDetail } from '@/services/post/postQueries';
import { useGetJobList } from '@/services/specifications/specificationsQueries';

import { progressList, ptypeList, recruitmentCountList } from '@/constants';
import {
  useDialogContext,
  useHandleImage,
  usePageBlocker,
  useTechStackList,
} from '@/hooks';
import { ContactMethodDisplayKey, Option, Progress } from '@/types';
import { LoungeDto } from '@/types/lounge/loungeDto';
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
import Title from '@/components/common/Title';
import SquareButton from '@/components/common/button/SquareButton';
import MultiSelectDropdown from '@/components/common/dropdown/MultiSelectDropdown';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import TechStackDropdown from '@/components/common/dropdown/TechStackDropdown';
import ControllerDateTime from '@/components/common/input/ControllerDateTime';
import LabeledSection from '@/components/common/input/LabeledSection';
import ControllerContentEditor from '@/components/common/text-editor/ControllerContentEditor';
import ContactMethodContainer from '@/components/lounge/form/ContactMethodContainer';
import { loungeFormSchema } from '@/components/lounge/form/loungeFormSchema';

export interface FormValues {
  recruitmentCount: number;
  meetingType: Progress | '';
  contactMethod: ContactMethodDisplayKey | '';
  contactDetail: string;
  recruitmentType: string | '';
  startDate: string;
  endDate: string;
  positions: number[];
  requiredStacks: number[];
  projectTitle: string;
  projectDescription: string;
}

const changeDataToFieldValues = (
  data?: LoungeDto.GetProjectDetail,
): FormValues => {
  return {
    recruitmentCount: data?.recruitmentCount || 0,
    meetingType: data?.meetingType || '',
    contactMethod: data?.contactMethod || '',
    contactDetail: data?.contactDetail || '',
    recruitmentType: data?.ptype || '',
    startDate: data?.recruitmentStart || '',
    endDate: data?.recruitmentEnd || '',
    // eslint-disable-next-line no-nested-ternary
    positions: !data
      ? []
      : data?.position.length === 0
        ? [0]
        : data?.position.map(item => item.id),
    // eslint-disable-next-line no-nested-ternary
    requiredStacks: !data
      ? []
      : data.techStack.length === 0
        ? [0]
        : data.techStack.map(item => item.id),
    projectTitle: data?.title || '',
    projectDescription: data?.description || '',
  };
};

export default function LoungeForm() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const modifyProjectId = searchParams.get('modifyProject');

  const { showToast } = useDialogContext();

  const { data: jobList } = useGetJobList();

  const { data: projectsDetail } = useGetPostDetail<LoungeDto.GetProjectDetail>(
    Number(modifyProjectId || 0),
  );

  const { mutateAsync: postProject, isPending: isPostProjectPending } =
    usePostMyPost<LoungeDto.PostProjectParams>();

  const { mutateAsync: putProject, isPending: isEditProjectPending } =
    usePutMyPost<LoungeDto.PostProjectParams>();

  const { techStackOptionList } = useTechStackList();

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

  const { handleImagesInHtmlContent } = useHandleImage();

  const onSubmit: SubmitHandler<FormValues> = async data => {
    if (isPostProjectPending || isEditProjectPending) return;

    const descriptionWithHandledImage = await handleImagesInHtmlContent(
      data.projectDescription,
      modifyProjectId ? projectsDetail?.description : undefined,
    );

    const requiredStacks = data.requiredStacks.includes(0)
      ? []
      : data.requiredStacks;

    const positions = data.positions.includes(0) ? [] : data.positions;

    const params = {
      ...data,
      requiredStacks,
      positions,
      recruitmentCount: Number(data.recruitmentCount),
      projectDescription: descriptionWithHandledImage,
    } as LoungeDto.PostProjectParams;

    if (modifyProjectId) {
      try {
        await putProject({ postId: Number(modifyProjectId), params });
        showToast('프로젝트를 수정했습니다.');
        navigate('/lounge');
      } catch (err) {
        showToast('프로젝트 수정을 실패했습니다.');
      }
      return;
    }

    try {
      await postProject(params);
      showToast('프로젝트를 등록했습니다.');
      navigate('/lounge');
    } catch (err) {
      showToast('프로젝트 등록을 실패했습니다.');
    }
  };

  const onError: SubmitErrorHandler<FormValues> = useCallback(
    err => {
      const firstErrorMessage = Object.entries(err)?.[0]?.[1].message || '';
      if (firstErrorMessage) {
        showToast(firstErrorMessage);
      }
    },
    [showToast],
  );

  const jobOptionList = [{ id: 0, job: '제한 없음' }, ...(jobList || [])]?.map(
    ({ id, job }) => ({ id, name: job }),
  );

  const onChangeOptionList = (
    type: '직무' | '기술 스택',
    data: Option[],
    onChange: (optionList: number[]) => void,
  ) => {
    const selectedIds = data.map(item => item.id);

    if (selectedIds.includes(0) && selectedIds.length > 1) {
      showToast(
        data[0].id === 0
          ? '먼저 "제한 없음" 옵션을 해제해주세요.'
          : `선택한 ${type} 옵션을 해제했습니다.`,
      );
      const result = selectedIds.filter(id => id === 0);
      return onChange(result);
    }

    return onChange(selectedIds);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="mt-[26px]">
        <section>
          <header className="flex items-center gap-1.5">
            <CircleNumber number={1} />
            <Title as="h1" title="프로젝트 필수 정보" />
          </header>
          <div className="relative mt-8 grid grid-cols-2 gap-x-4 gap-y-5 text-lg">
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
                  const selectedOption = ptypeList.find(
                    ({ key }) => key === value,
                  );
                  return (
                    <SingleSelectDropdown
                      defaultLabel="모집 구분"
                      options={ptypeList}
                      selectedOption={selectedOption}
                      onChangeValue={data => onChange(data[0].key)}
                      errorMsg={error?.message}
                    />
                  );
                }}
              />
            </LabeledSection>

            <LabeledSection label="모집 기간">
              <div className="flex h-[59px] w-full items-center gap-2">
                <ControllerDateTime type="date" name="startDate" />
                <span className="text-xl">~</span>
                <ControllerDateTime type="date" name="endDate" />
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
                      selectBoxClassName="h-[59px]"
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
                  return (
                    <MultiSelectDropdown
                      defaultLabel="모집 직무"
                      value={value}
                      options={jobOptionList}
                      onChangeValue={data =>
                        onChangeOptionList('직무', data, onChange)
                      }
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
                  return (
                    <TechStackDropdown
                      defaultLabel="기술 스택"
                      defaultTabValue="백엔드"
                      errorMsg={error?.message}
                      value={value}
                      options={techStackOptionList}
                      onChangeValue={data =>
                        onChangeOptionList('기술 스택', data, onChange)
                      }
                      hasUnlimitOption
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
              <ContactMethodContainer />
            </LabeledSection>
          </div>
        </section>

        <section>
          <header className="mt-16 flex items-center gap-1.5">
            <CircleNumber number={2} />
            <Title as="h1" title="프로젝트 상세 정보" />
          </header>

          <ControllerContentEditor
            type="프로젝트"
            controlNames={{
              title: 'projectTitle',
              content: 'projectDescription',
            }}
          />

          <div className="mt-8 flex w-full items-center justify-end gap-4 text-end">
            <SquareButton
              type="button"
              name="취소"
              color="gray"
              onClick={() => navigate('/lounge')}
            />
            <SquareButton
              name={modifyProjectId ? '수정하기' : '등록하기'}
              type="submit"
            />
          </div>
        </section>
      </form>
    </FormProvider>
  );
}
