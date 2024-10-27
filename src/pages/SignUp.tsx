import { currentStepAtom } from '@/atoms/formStepAtom';

import { defaultSignUpFormValues, matchedRoleName } from '@/constants';
import { useHandleSignUp } from '@/hooks';
import AuthPageLayout from '@/layouts/AuthPageLayout';
import { KeyOfRole } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import VerifyCodeButton from '@/components/common/button/VerifyCodeButton';
import MultiSelectDropdown from '@/components/common/dropdown/MultiSelectDropdown';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import TechStackDropdown from '@/components/common/dropdown/TechStackDropdown';
import Radio from '@/components/common/input/Radio';
import TextInput from '@/components/common/input/TextInput';
import FormQuestionItem from '@/components/signup/FormQuestionItem';
import FormStepIndicator from '@/components/signup/FormStepIndicator';
import MultiSelectList from '@/components/signup/MultiSelectList';
import { SignUpFormSchema } from '@/components/signup/SignUpFormSchema';

export default function SignUp() {
  const [currentStep] = useAtom(currentStepAtom);

  const methods = useForm({
    mode: 'onSubmit',
    defaultValues: defaultSignUpFormValues,
    resolver: zodResolver(SignUpFormSchema),
  });

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setError,
    clearErrors,
  } = methods;

  const watchedRole = useWatch({ control, name: 'role' });
  const watchedCampusList = useWatch({ control, name: 'campusList' });
  // const watchedCourseId = useWatch({ control, name: 'courseList' });
  const watchedVerifyCode = useWatch({ control, name: 'verifyCode' });

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
  } = useHandleSignUp({ watchedCampusList, watchedRole });

  if (isLoading) return null;

  const resolvedUnMatchCurrentStep =
    questionListByRole.length === 3 && currentStep >= 2
      ? currentStep + 1
      : currentStep;

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
                              {question.roles.map((role: KeyOfRole) => (
                                <Radio
                                  key={role}
                                  value={role}
                                  label={matchedRoleName[role]}
                                  name="role"
                                />
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

                          {'nickname' in question && (
                            <TextInput
                              placeholder="사용하실 닉네임을 입력해주세요"
                              className="h-[50px] w-full pl-4"
                              {...register('nickname')}
                              errorMsg={errors.nickname?.message}
                            />
                          )}

                          {'campusList' in question && campusList && (
                            <Controller
                              control={control}
                              name="campusList"
                              render={({ field: { onChange, value } }) => {
                                return (
                                  <MultiSelectDropdown
                                    defaultLabel="캠퍼스"
                                    options={campusList}
                                    initialSelectedOptions={value}
                                    onChangeValue={data => {
                                      if (errors.courseList?.message) {
                                        clearErrors('courseList');
                                      }
                                      onChange(data);
                                    }}
                                    errorMsg={errors.campusList?.message}
                                    selectBoxClassName="!h-[50px] !text-base"
                                  />
                                );
                              }}
                            />
                          )}

                          {'courseList' in question && (
                            <Controller
                              control={control}
                              name="courseList"
                              render={({ field: { onChange, value } }) => {
                                const options = courseList?.length
                                  ? courseList?.map(({ id, title }) => {
                                      return { id, name: title };
                                    })
                                  : [];

                                return (
                                  <SingleSelectDropdown
                                    defaultLabel="교육과정"
                                    options={options}
                                    selectedOption={value?.[0]}
                                    onChangeValue={onChange}
                                    errorMsg={errors.courseList?.message}
                                    selectBoxClassName="!h-[50px] !text-base"
                                    onSelectBoxClick={async () => {
                                      if (!watchedCampusList.length) {
                                        setError('courseList', {
                                          type: 'manual',
                                          message:
                                            '먼저 캠퍼스를 선택해주세요.',
                                        });
                                      }
                                    }}
                                  />
                                );
                              }}
                            />
                          )}

                          {'techStackList' in question && techStackList && (
                            <div className="relative">
                              <Controller
                                control={control}
                                name="techStackList"
                                render={({ field: { onChange } }) => {
                                  return (
                                    <TechStackDropdown
                                      defaultLabel="기술스택"
                                      defaultTabValue="백엔드"
                                      options={techStackList}
                                      onChangeValue={data => {
                                        const newData = data.map(
                                          ({ id }) => id,
                                        );
                                        onChange(newData);
                                      }}
                                      isMarkTechStackList
                                      selectBoxClassName="!h-[50px] !text-base"
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
                              name="jobList"
                              errorMsg={errors.jobList?.message}
                            />
                          )}

                          {'domainList' in question && domainList && (
                            <MultiSelectList
                              list={domainList}
                              selectLimit={3}
                              name="domainList"
                              errorMsg={errors.domainList?.message}
                            />
                          )}

                          {'verifyCode' in question && (
                            <div className="relative pb-10">
                              <TextInput
                                placeholder="인증코드를 입력해주세요"
                                className="!h-[50px] w-full pl-4"
                                {...register('verifyCode')}
                                errorMsg={errors.verifyCode?.message}
                              />
                              <VerifyCodeButton
                                currentCode={watchedVerifyCode}
                              />
                            </div>
                          )}

                          {'marketingConsent' in question && (
                            <>
                              <p className="mb-4 rounded border p-3 leading-5">
                                {question.additionalInfo}
                              </p>

                              <fieldset className="flex flex-wrap gap-x-8 gap-y-3">
                                {question.marketingConsent.map(label => (
                                  <Radio
                                    key={label}
                                    label={label}
                                    value={label}
                                    name="marketingConsent"
                                  />
                                ))}
                              </fieldset>
                            </>
                          )}
                        </FormQuestionItem>
                      )
                    );
                  }),
              )}

              {watchedRole === 'PRE_TRAINEE' &&
                currentStep === questionListByRole.length && (
                  <span className="mb-14 mt-auto inline-block w-full text-center text-gray1">
                    예비 수강생은 제한된 서비스만 이용 가능합니다.
                  </span>
                )}
            </div>

            {currentStep === questionListByRole.length && (
              <SquareButton
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
