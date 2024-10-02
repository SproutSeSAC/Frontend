import { currentStepAtom } from '@/atoms/formStepAtom';

import {
  defaultSignUpFormValues,
  formCondition,
  matchedRoleName,
} from '@/constants';
import { useHandleSignUp } from '@/hooks';
import AuthPageLayout from '@/layouts/AuthPageLayout';
import { KeyOfRole, UserInfo, VerifyCode } from '@/types';
import { useAtom } from 'jotai';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import VerifyCodeButton from '@/components/common/button/VerifyCodeButton';
import Dropdown from '@/components/common/dropdown/Dropdown';
import Radio from '@/components/common/input/Radio';
import TextInput from '@/components/common/input/TextInput';
import FormQuestionItem from '@/components/signup/FormQuestionItem';
import FormStepIndicator from '@/components/signup/FormStepIndicator';
import MultiSelectList from '@/components/signup/MultiSelectList';

export default function SignUp() {
  const [currentStep] = useAtom(currentStepAtom);

  const methods = useForm<UserInfo & VerifyCode>({
    mode: 'onSubmit',
    defaultValues: defaultSignUpFormValues,
  });

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = methods;

  const watchedRole = useWatch({ control, name: 'role' });
  const watchedCampusId = useWatch({ control, name: 'campusId' });
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

  return (
    <AuthPageLayout>
      <FormProvider {...methods}>
        {/* 폼 단계 표시 */}
        <FormStepIndicator formStep={4} totalStep={questionListByRole.length}>
          <form
            className="mt-[10%] flex flex-1 flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-[5%] flex-1">
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
                              {...register('name', { ...formCondition.name })}
                              errorMsg={errors.name?.message}
                            />
                          )}

                          {'nickname' in question && (
                            <TextInput
                              placeholder="사용하실 닉네임을 입력해주세요"
                              className="h-[50px] w-full pl-4"
                              {...register('nickname', {
                                ...formCondition.nickname,
                              })}
                              errorMsg={errors.nickname?.message}
                            />
                          )}

                          {'campusId' in question && campusList && (
                            <Dropdown name="campusId" options={campusList} />
                          )}

                          {'courseId' in question && courseList && (
                            <Dropdown
                              name="courseId"
                              options={courseList.map(course => {
                                return { id: course.id, name: course.title };
                              })}
                            />
                          )}

                          {'techStackIdList' in question && techStackList && (
                            <MultiSelectList
                              list={techStackList}
                              selectLimit={5}
                              name="techStackIdList"
                            />
                          )}

                          {'jobIdList' in question && jobList && (
                            <MultiSelectList
                              list={jobList}
                              selectLimit={5}
                              name="jobIdList"
                            />
                          )}

                          {'domainIdList' in question && domainList && (
                            <MultiSelectList
                              list={domainList}
                              selectLimit={3}
                              name="domainIdList"
                            />
                          )}

                          {'verifyCode' in question && (
                            <div className="relative pb-10">
                              <TextInput
                                placeholder="코드를 입력해주세요"
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
                                {question.marketingConsent.map(consent => (
                                  <Radio
                                    key={`${consent}`}
                                    label={consent ? '동의' : '동의하지 않음'}
                                    value={`${consent}`}
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

              {watchedRole === 'PRE_TRAINEE' && (
                <span className="mt-10 inline-block text-center text-gray2">
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
