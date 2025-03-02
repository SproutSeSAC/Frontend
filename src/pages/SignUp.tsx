import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { loginCheck } from '@/services/auth/authQueries';
import { TermsConsentList } from '@/services/auth/termsAndPolicy';

import { authenticationCodeAtom } from '@/atoms/authenticationCodeAtom';
import { currentStepAtom } from '@/atoms/formStepAtom';
import { verificationNicknameAtom } from '@/atoms/verificationNicknameAtom';

import { defaultSignUpFormValues, rolesObj } from '@/constants';
import { useDialogContext, useHandleSignUp } from '@/hooks';
import AuthPageLayout from '@/layouts/AuthPageLayout';
import styles from '@/policy.module.css';
import { RoleKey } from '@/types';
import {
  isEduManager,
  isInstructor,
  isJobCoordinator,
  isTrainee,
} from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtomValue } from 'jotai';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import Checkbox from '@/components/common/checkbox/Checkbox';
import MultiSelectDropdown from '@/components/common/dropdown/MultiSelectDropdown';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import TechStackDropdown from '@/components/common/dropdown/TechStackDropdown';
import ControllerPhoneNumber from '@/components/common/input/ControllerPhoneNumber';
import ErrorMsg from '@/components/common/input/ErrorMsg';
import TextInput from '@/components/common/input/TextInput';
import Modal from '@/components/common/modal/Modal';
import AuthenticationCode from '@/components/signup/AuthenticationCode';
import FormQuestionItem from '@/components/signup/FormQuestionItem';
import FormStepIndicator from '@/components/signup/FormStepIndicator';
import MultiSelectList from '@/components/signup/MultiSelectList';
import { SignUpFormSchema } from '@/components/signup/SignUpFormSchema';
import VerificationNickname from '@/components/signup/VerificationNickname';

export default function SignUp() {
  const currentStep = useAtomValue(currentStepAtom);
  const isAuthenticationCode = useAtomValue(authenticationCodeAtom);
  const isVerificationNickname = useAtomValue(verificationNicknameAtom);

  const methods = useForm({
    mode: 'onSubmit',
    defaultValues: defaultSignUpFormValues,
    resolver: zodResolver(SignUpFormSchema),
    context: { extra: { isValid: isVerificationNickname } },
  });

  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isValid },
    setError,
    clearErrors,
    getValues,
    setValue,
  } = methods;

  const currRole = getValues('role');
  const currCampusIdList = useWatch({ control, name: 'campusIdList' });

  const {
    jobList,
    domainList,
    campusList,
    courseList,
    techStackList,
    onSubmit,
    isLoading,
    questionListByRole,
    getQuestionNumber,
  } = useHandleSignUp({ currCampusIdList, currRole });

  const navigate = useNavigate();

  useEffect(() => {
    loginCheck().then(({ status }) => {
      if (status === 304) return;
      if (status === 200) {
        navigate(-1);
      } else {
        navigate('/login', { replace: true });
      }
    });
  }, [navigate]);

  const resolvedUnMatchCurrentStep =
    questionListByRole.length === 3 && currentStep >= 2
      ? currentStep + 1
      : currentStep;

  const triggerCourseIdListError = async () => {
    if (!currCampusIdList.length) {
      setError('courseIdList', {
        type: 'manual',
        message: '먼저 캠퍼스를 선택해주세요.',
      });
    }
  };

  const { showDialog, hideDialog } = useDialogContext();

  const onContentClick = async (type: TermsConsentList) => {
    const filename =
      type === '이용약관'
        ? 'termsAndConditionsOfService'
        : 'policyOfHandlingPersonalInformation';

    const response = await fetch(`/terms-and-policy/${filename}.html`);

    return response.text().then(content => {
      showDialog({
        key: 'POLICY_TERM_KEY',
        element: (
          <Modal
            title={type}
            onToggleClick={hideDialog}
            className="rounded-xl p-4"
          >
            <div
              className={`h-[70vh] w-[500px] overflow-auto ${styles.policyContainer}`}
              dangerouslySetInnerHTML={{ __html: content ?? '' }}
            />
          </Modal>
        ),
      });
    });
  };

  if (isLoading) return null;

  return (
    <AuthPageLayout>
      <FormProvider {...methods}>
        {/* 폼 단계 표시 */}
        <FormStepIndicator
          formStep={4}
          resolvedUnMatchCurrentStep={resolvedUnMatchCurrentStep}
          questionListByRole={questionListByRole}
        >
          <form
            className="mt-[10%] flex flex-1 flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-[5%] flex flex-1 flex-col">
              {questionListByRole.map(
                (questionList, index) =>
                  currentStep === index + 1 &&
                  questionList.map((question, idx) => {
                    const questionNumber = getQuestionNumber(index, idx);

                    return (
                      question && (
                        <FormQuestionItem
                          key={question.title.text}
                          title={`${questionNumber}. ${question.title.text}`}
                          condition={question.title.condition}
                        >
                          {'roles' in question && (
                            <fieldset className="flex flex-wrap gap-x-12 gap-y-3">
                              {/* 여기서 role을 바꿨으면 캠퍼스와 교육과정 초기화 */}
                              {question.roles.map((role: RoleKey) => (
                                <label
                                  key={role}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="radio"
                                    id={role}
                                    value={role}
                                    className="h-4 w-4 appearance-none rounded-full border border-black bg-white checked:border-mainGray checked:bg-darkGreen"
                                    {...register('role', {
                                      onChange: () => {
                                        setValue('campusIdList', []);
                                        setValue('courseIdList', []);
                                      },
                                    })}
                                  />

                                  <span>{rolesObj[role]}</span>
                                </label>
                              ))}
                            </fieldset>
                          )}

                          {'name' in question && (
                            <TextInput
                              placeholder="성함을 입력해주세요"
                              className="!h-[50px] w-full pl-4"
                              {...register('name')}
                              errorMsg={errors.name?.message}
                            />
                          )}

                          {'nickname' in question && <VerificationNickname />}

                          {'campusList' in question && campusList && (
                            <Controller
                              control={control}
                              name="campusIdList"
                              render={({ field: { onChange, value } }) => {
                                const selectedOptions = campusList?.filter(
                                  campus => value?.some(id => id === campus.id),
                                );

                                return isTrainee(currRole) ||
                                  isEduManager(currRole) ||
                                  isInstructor(currRole) ? (
                                  <SingleSelectDropdown
                                    defaultLabel="캠퍼스 선택"
                                    options={campusList}
                                    selectedOption={selectedOptions?.[0]}
                                    onChangeValue={data => {
                                      if (errors.courseIdList?.message) {
                                        clearErrors('courseIdList');
                                      }
                                      onChange([data[0]?.id]);
                                    }}
                                    errorMsg={errors.campusIdList?.message}
                                    selectBoxClassName="!h-[50px] !text-base !border-darkGray"
                                  />
                                ) : (
                                  <MultiSelectDropdown
                                    defaultLabel="캠퍼스 선택"
                                    value={value}
                                    options={campusList}
                                    onChangeValue={data => {
                                      if (errors.courseIdList?.message) {
                                        clearErrors('courseIdList');
                                      }
                                      onChange(data.map(({ id }) => id));
                                    }}
                                    errorMsg={errors.campusIdList?.message}
                                    selectBoxClassName="!h-[50px] !text-base !border-darkGray"
                                  />
                                );
                              }}
                            />
                          )}

                          {'courseList' in question && (
                            <Controller
                              control={control}
                              name="courseIdList"
                              render={({ field: { onChange, value } }) => {
                                const options = courseList?.map(
                                  ({ id, title }) => {
                                    return { id, name: title };
                                  },
                                );

                                const selectedOptions = courseList
                                  ?.filter(course =>
                                    value?.some(id => id === course.id),
                                  )
                                  ?.map(({ id, title }) => ({
                                    id,
                                    name: title,
                                  }));

                                return isJobCoordinator(currRole) ? (
                                  <MultiSelectDropdown
                                    defaultLabel="교육과정 선택"
                                    value={value}
                                    options={options}
                                    onChangeValue={data => {
                                      onChange(data.map(({ id }) => id));
                                    }}
                                    errorMsg={errors.courseIdList?.message}
                                    selectBoxClassName="!h-[50px] !text-base overflow-hidden !border-darkGray"
                                    onSelectBoxClick={triggerCourseIdListError}
                                    hasFullCheck={!!options.length}
                                    optionClassName="text-start tracking-tight leading-5"
                                  />
                                ) : (
                                  <SingleSelectDropdown
                                    defaultLabel="교육과정 선택"
                                    options={options}
                                    selectedOption={selectedOptions?.[0]}
                                    onChangeValue={data => {
                                      onChange(data.map(({ id }) => id));
                                    }}
                                    errorMsg={errors.courseIdList?.message}
                                    selectBoxClassName="!h-[50px] !text-base overflow-hidden !border-darkGray"
                                    onSelectBoxClick={triggerCourseIdListError}
                                    optionClassName="text-start tracking-tight whitespace-pre-wrap leading-5"
                                  />
                                );
                              }}
                            />
                          )}

                          {'phoneNumber' in question && (
                            <ControllerPhoneNumber name="phoneNumber" />
                          )}

                          {'techStackList' in question && techStackList && (
                            <div className="relative">
                              <Controller
                                control={control}
                                name="techStackIdList"
                                render={({
                                  field: { value },
                                  fieldState: { error: err },
                                }) => {
                                  const selectedOptions =
                                    techStackList?.filter(techStack =>
                                      value?.some(id => id === techStack.id),
                                    ) || [];

                                  return (
                                    <TechStackDropdown
                                      defaultLabel="기술 스택"
                                      defaultTabValue="백엔드"
                                      options={techStackList}
                                      initialSelectedOptions={selectedOptions}
                                      onChangeValue={data => {
                                        const val = data.map(({ id }) => id);
                                        setValue('techStackIdList', val, {
                                          shouldValidate: true,
                                          shouldDirty: true,
                                        });
                                      }}
                                      isMarkTechStackList
                                      selectBoxClassName="!h-[50px] !text-base !border-darkGray"
                                      errorMsg={err?.message}
                                    />
                                  );
                                }}
                              />
                            </div>
                          )}

                          {'jobList' in question && jobList && (
                            <MultiSelectList
                              list={jobList}
                              selectLimit={5}
                              name="jobIdList"
                              errorMsg={errors.jobIdList?.message}
                            />
                          )}

                          {'domainList' in question && domainList && (
                            <MultiSelectList
                              list={domainList}
                              selectLimit={3}
                              name="domainIdList"
                              errorMsg={errors.domainIdList?.message}
                            />
                          )}

                          {'verifyCode' in question && <AuthenticationCode />}

                          {'termList' in question && (
                            <ul className="relative flex flex-wrap gap-x-8">
                              {question.termList.map(term => (
                                <Controller
                                  key={term}
                                  control={control}
                                  name={
                                    term === '이용약관'
                                      ? 'serviceTerms'
                                      : 'personalInformationTerms'
                                  }
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <li
                                        key={term}
                                        className="mb-2 flex w-full items-center"
                                      >
                                        <Checkbox
                                          id={term}
                                          checked={value}
                                          onChange={() => onChange(!value)}
                                          text={`${term} 동의 (필수)`}
                                        />
                                        <button
                                          type="button"
                                          onClick={() => onContentClick(term)}
                                          className="ml-auto text-darkGray-active underline"
                                        >
                                          보기
                                        </button>
                                      </li>
                                    );
                                  }}
                                />
                              ))}

                              {errors.personalInformationTerms?.message && (
                                <ErrorMsg
                                  msg={errors.personalInformationTerms?.message}
                                />
                              )}
                            </ul>
                          )}
                        </FormQuestionItem>
                      )
                    );
                  }),
              )}
            </div>

            {currentStep === questionListByRole.length && (
              <SquareButton
                color={isAuthenticationCode && isValid ? 'mainGreen' : 'gray'}
                type="submit"
                name="시작하기"
                className="mx-auto w-[50%] px-4 py-3 font-medium"
              />
            )}
          </form>
        </FormStepIndicator>
      </FormProvider>
    </AuthPageLayout>
  );
}
