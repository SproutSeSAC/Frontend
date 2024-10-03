import { currentStepAtom } from '@/atoms/formStepAtom';

import { defaultSignUpFormValues, matchedRoleName } from '@/constants';
import { useHandleSignUp } from '@/hooks';
import AuthPageLayout from '@/layouts/AuthPageLayout';
import { KeyOfRole, UserInfo, VerifyCode } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import VerifyCodeButton from '@/components/common/button/VerifyCodeButton';
import Dropdown from '@/components/common/dropdown/Dropdown';
import ErrorMsg from '@/components/common/input/ErrorMsg';
import Radio from '@/components/common/input/Radio';
import TextInput from '@/components/common/input/TextInput';
import FormQuestionItem from '@/components/signup/FormQuestionItem';
import FormStepIndicator from '@/components/signup/FormStepIndicator';
import MultiSelectList from '@/components/signup/MultiSelectList';
import { SignUpFormSchema } from '@/components/signup/SignUpFormSchema';

export default function SignUp() {
  const [currentStep] = useAtom(currentStepAtom);

  const methods = useForm<UserInfo & VerifyCode>({
    mode: 'onSubmit',
    defaultValues: defaultSignUpFormValues,
    resolver: zodResolver(SignUpFormSchema),
  });

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    watch,
    trigger,
  } = methods;

  const watchedRole = useWatch({ control, name: 'role' });
  const watchedCampusId = useWatch({ control, name: 'campusId' });
  const watchedCourseId = useWatch({ control, name: 'courseId' });
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
  } = useHandleSignUp({ watchedCampusId, watchedRole });

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

                          {'campusId' in question && campusList && (
                            <Controller
                              control={control}
                              name="campusId"
                              render={({ field: { onChange } }) => {
                                return (
                                  <>
                                    <Dropdown
                                      label="소속 캠퍼스"
                                      selectedOptionId={watchedCampusId}
                                      options={campusList}
                                      selectBoxClassName={`${!watchedCampusId && '[&>span]:text-gray2'}`}
                                      onChangeValue={data => {
                                        onChange(data[0].id);
                                      }}
                                    />
                                    {errors.campusId?.message && (
                                      <ErrorMsg
                                        msg={errors.campusId?.message}
                                        className="pl-4"
                                      />
                                    )}
                                  </>
                                );
                              }}
                            />
                          )}

                          {'courseId' in question && (
                            <>
                              <Controller
                                control={control}
                                name="courseId"
                                render={({ field: { onChange } }) => {
                                  const options = courseList?.length
                                    ? courseList?.map(({ id, title }) => {
                                        return { id, name: title };
                                      })
                                    : [];
                                  return (
                                    <Dropdown
                                      label="소속 교육과정"
                                      selectedOptionId={watchedCourseId}
                                      options={options}
                                      selectBoxClassName={`${!watch('courseId') && '[&>span]:text-gray2'}`}
                                      onChangeValue={data => {
                                        onChange(data[0].id);
                                      }}
                                      onSelectBoxClick={() => {
                                        if (!watchedCampusId) {
                                          trigger('campusId');
                                          return true;
                                        }
                                        return false;
                                      }}
                                    />
                                  );
                                }}
                              />
                              {errors.courseId?.message && (
                                <ErrorMsg
                                  msg={errors.courseId?.message}
                                  className="pl-4"
                                />
                              )}
                            </>
                          )}

                          {'techStackIdList' in question && techStackList && (
                            <MultiSelectList
                              list={techStackList}
                              selectLimit={50}
                              name="techStackIdList"
                              errorMsg={errors.techStackIdList?.message}
                            />
                          )}

                          {'jobIdList' in question && jobList && (
                            <MultiSelectList
                              list={jobList}
                              selectLimit={5}
                              name="jobIdList"
                              errorMsg={errors.jobIdList?.message}
                            />
                          )}

                          {'domainIdList' in question && domainList && (
                            <MultiSelectList
                              list={domainList}
                              selectLimit={3}
                              name="domainIdList"
                              errorMsg={errors.domainIdList?.message}
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
