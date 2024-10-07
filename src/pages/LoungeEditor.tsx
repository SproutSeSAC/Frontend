import { ReactNode, useCallback, useEffect, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { useTechStackList } from '@/hooks/useTechStackList';

import { usePostLoungeProject } from '@/services/lounge/loungeMutations';
import { useGetLoungePositionsFilterList } from '@/services/lounge/loungeQueries';

import Title from '../components/common/Title';
import SquareButton from '../components/common/button/SquareButton';
import LoungeTextEditor from '../components/lounge/editor/LoungeTextEditor';
import { loungeEditorSchema } from '../components/lounge/editor/loungeEditorSchema';

import {
  Progress,
  PtypeList,
  contactMethodList,
  progressList,
} from '@/constants';
import { useToggleModal } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Control,
  Controller,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';
import { BsLink45Deg } from 'react-icons/bs';

import MultiSelectDropdown from '@/components/common/dropdown/MultiSelectDropdown';
import SelectableDropdown from '@/components/common/dropdown/SelectableDropdown';
import ErrorMsg from '@/components/common/input/ErrorMsg';
import Alert from '@/components/common/modal/Alert';

const defaultInputStyle =
  'rounded-2xl border border-solid px-[15px] py-4 bg-white';
const inputStyle = {
  default: `${defaultInputStyle} border-gray4`,
  error: `${defaultInputStyle} border-[#FF3939]`,
};

const commonOptionBoxClass = 'px-4 py-[15px]';
const commonOptionClass = 'px-4 py-1 hover:rounded-lg hover:bg-gray4';

// TODO: api type 수정 필요
export interface FormValues {
  recruitmentCount: string;
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

function ContactMethodContainer({ control }: { control: Control<FormValues> }) {
  const contactMethod = useWatch({ control, name: 'contactMethod' });

  return (
    <div className={`${contactMethod && 'flex gap-2'}`}>
      <Controller
        control={control}
        name="contactMethod"
        render={({ field: { onChange }, fieldState: { error } }) => {
          return (
            <SelectableDropdown
              label="연락 방법"
              width="100%"
              options={contactMethodList}
              errorMsg={error?.message}
              selectBoxClassName={error ? inputStyle.error : inputStyle.default}
              selectOptionBoxClassName={commonOptionBoxClass}
              selectOptionClassName={commonOptionClass}
              onChangeValue={data => onChange(data[0].key)}
            />
          );
        }}
      />
      {contactMethod && (
        <Controller
          control={control}
          name="contactDetail"
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <div className={`flex w-full ${contactMethod && 'flex-1'}`}>
                <input
                  type="text"
                  className={`${error ? inputStyle.error : inputStyle.default} w-full`}
                  onChange={onChange}
                  value={value}
                />

                {error && (
                  <ErrorMsg
                    msg={error?.message || ''}
                    className="absolute bottom-[-26px] ml-2"
                  />
                )}
              </div>
            );
          }}
        />
      )}
    </div>
  );
}

export default function LoungeEditor() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { modalOpen, toggleModal } = useToggleModal();

  const methods = useForm<FormValues>({
    defaultValues: {
      recruitmentCount: '',
      meetingType: 'HYBRID',
      contactMethod: '',
      contactDetail: '',
      recruitmentType: '',
      startDate: '',
      endDate: '',
      positions: [],
      requiredStacks: [],
      projectTitle: '',
      projectDescription: '',
    },
    resolver: zodResolver(loungeEditorSchema),
  });
  const { data: positionsList } = useGetLoungePositionsFilterList();
  const { techStackList, isTechStackListLoading } = useTechStackList();

  const { mutateAsync } = usePostLoungeProject();

  const { handleSubmit, control } = methods;

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

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
          <Title as="h1" title="프로젝트 필수 정보" />
        </div>
        <div className="relative mt-8 grid grid-cols-2 gap-4 text-lg">
          <LabeledSection label="모집 구분" className="col-span-2">
            <Controller
              control={control}
              name="recruitmentType"
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <SelectableDropdown
                    label="모집 구분"
                    width="50%"
                    errorMsg={error?.message}
                    options={PtypeList}
                    selectBoxClassName={
                      error ? inputStyle.error : inputStyle.default
                    }
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
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => {
                  return (
                    <div className="relative flex w-[50%] flex-col">
                      <input
                        type="date"
                        id="datepicker"
                        value={value}
                        onChange={onChange}
                        className={`${error ? inputStyle.error : inputStyle.default} w-full`}
                      />
                      {error && (
                        <ErrorMsg
                          msg={error?.message || ''}
                          className="absolute bottom-[-26px] ml-2"
                        />
                      )}
                    </div>
                  );
                }}
              />
              <span>~</span>
              <Controller
                control={control}
                name="endDate"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => {
                  return (
                    <div className="relative flex w-[50%] flex-col">
                      <input
                        type="date"
                        id="datepicker"
                        value={value}
                        onChange={onChange}
                        className={`${error ? inputStyle.error : inputStyle.default} w-full`}
                      />
                      {error && (
                        <ErrorMsg
                          msg={error?.message || ''}
                          className="absolute bottom-[-26px] ml-2"
                        />
                      )}
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
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <SelectableDropdown
                    label="모집 인원"
                    width="100%"
                    errorMsg={error?.message}
                    options={recruitmentCountList}
                    selectOptionBoxClassName={commonOptionBoxClass}
                    selectOptionClassName={commonOptionClass}
                    selectBoxClassName={
                      error ? inputStyle.error : inputStyle.default
                    }
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
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <SelectableDropdown
                    label="모집 직무"
                    width="100%"
                    isCheckBox
                    errorMsg={error?.message}
                    options={positionsList || []}
                    selectBoxClassName={
                      error ? inputStyle.error : inputStyle.default
                    }
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
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <SelectableDropdown
                    label="모집 유형"
                    width="100%"
                    options={progressList}
                    selectBoxClassName={
                      error ? inputStyle.error : inputStyle.default
                    }
                    errorMsg={error?.message}
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
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <MultiSelectDropdown
                    label="기술스택"
                    defaultValue="백엔드"
                    width="100%"
                    errorMsg={error?.message}
                    isLoading={isTechStackListLoading}
                    buttonClassName={
                      error ? inputStyle.error : inputStyle.default
                    }
                    contentClassName="mt-[14px]"
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
          <div className="font-600 flex h-6 w-6 items-center justify-center rounded-full bg-skyBlue1 text-[18px] text-white">
            2
          </div>
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
            onClick={() => toggleModal()}
          >
            취소
          </button>
          <SquareButton name="등록하기" type="submit" />
        </div>
      </form>
      {modalOpen && (
        <>
          <Alert
            className="z-30"
            text="정말 나가시겠어요?"
            subText="저장하지 않은 내용을 잃어버릴 수 있어요."
          >
            <SquareButton
              color="gray"
              name="계속 작성하기"
              onClick={toggleModal}
              type="button"
              className="mt-6"
            />
            <SquareButton
              name="나가기"
              onClick={() => {
                navigate(`/lounge`);
                toggleModal();
              }}
              type="button"
              className="mt-6"
            />
          </Alert>
          <div
            className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
            onClick={toggleModal}
            onKeyDown={event => {
              if (event.key === 'Escape') {
                toggleModal();
              }
            }}
            tabIndex={-1}
            role="button"
            aria-label="모달 닫기"
          />
        </>
      )}
    </FormProvider>
  );
}
