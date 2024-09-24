import {
  useGetCampusList,
  useGetCourseList,
} from '@/services/course/courseQueries';
import {
  useGetDomainList,
  useGetJobList,
  useGetTechStackList,
} from '@/services/specifications/specificationsQueries';

import { currentStepAtom } from '@/atoms/formStepAtom';

import { getQuestionListByRole, matchedRoleName } from '@/constants';
import AuthPageLayout from '@/layouts/AuthPageLayout';
import { UserInfo, VerifyCode } from '@/types';
import { useAtom } from 'jotai';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import Dropdown from '@/components/common/form/Dropdown';
import FormStepIndicator from '@/components/common/form/FormStepIndicator';
import MultiSelectList from '@/components/common/form/MultiSelectList';
import QuestionItem from '@/components/common/form/QuestionItem';
import Radio from '@/components/common/input/Radio';
import UnControlledInput from '@/components/common/input/UnControlledInput';

const defaultValues: UserInfo & VerifyCode = {
  name: '',
  nickname: '',
  role: 'TRAINEE',
  campusId: 1,
  courseId: 1,
  domainIdList: [],
  jobIdList: [],
  techStackIdList: [],
  marketingConsent: false,
  verifyCode: '',
};

export default function SignUp() {
  const [currentStep] = useAtom(currentStepAtom);

  const methods = useForm<UserInfo & VerifyCode>({
    mode: 'onSubmit',
    defaultValues,
  });
  const { handleSubmit, watch } = methods;

  const campusIdValue = watch('campusId');

  const { data: jobList, isLoading: isJobListLoading } = useGetJobList();

  const { data: domainList, isLoading: isDomainListLoading } =
    useGetDomainList();

  const { data: techStackList, isLoading: isTechStackListLoading } =
    useGetTechStackList();

  const { data: campusList, isLoading: isCampusListLoading } =
    useGetCampusList();

  const { data: courseList } = useGetCourseList(campusIdValue);

  const onSubmit: SubmitHandler<UserInfo> = formData => {
    const data = {
      ...formData,
      courseId: +formData.courseId,
      marketingConsent:
        (formData.marketingConsent as unknown as string) === 'true',
    };

    const { verifyCode, campusId, ...rest } = data as UserInfo & VerifyCode;

    console.log('최종 데이터:', rest);
  };

  const questionListByRole = getQuestionListByRole(watch('role'));

  if (
    isCampusListLoading ||
    isDomainListLoading ||
    isJobListLoading ||
    isTechStackListLoading
  ) {
    return null;
  }

  return (
    <AuthPageLayout>
      {/* 폼 문항 표시 */}
      <FormProvider {...methods}>
        {/* 폼 단계 표시 */}
        <FormStepIndicator formStep={4} totalStep={questionListByRole.length}>
          <form
            className="mt-[15%] flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="h-[600px]">
              {questionListByRole.map(
                (questionList, index) =>
                  currentStep === index + 1 &&
                  questionList.map((question, idx) => {
                    const previousQuestionsCount = questionListByRole
                      .map(list => list.length)
                      .slice(0, index)
                      .reduce((acc, count) => acc + count, 0);

                    const currentQuestionNumber =
                      previousQuestionsCount + idx + 1;

                    return (
                      question && (
                        <QuestionItem
                          key={question.title.text}
                          title={`${currentQuestionNumber}. ${question.title.text}`}
                          condition={question.title.condition}
                        >
                          {'roles' in question && (
                            <fieldset className="flex flex-wrap gap-x-12 gap-y-3">
                              {question.roles.map(role => (
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
                            <UnControlledInput
                              name="name"
                              placeholder="성함을 입력해주세요"
                              className="h-[50px] w-full pl-4"
                              condition={{
                                required: '성함이 작성되지 않았습니다.',
                                pattern: {
                                  value: /^[가-힣a-zA-Z]+$/,
                                  message: '국문, 영문만 입력 가능합니다.',
                                },
                              }}
                            />
                          )}

                          {'nickname' in question && (
                            <UnControlledInput
                              name="nickname"
                              placeholder="사용하실 닉네임을 입력해주세요"
                              className="h-[50px] w-full pl-4"
                              condition={{
                                required: '닉네임을 입력해주세요.',
                                pattern: {
                                  value: /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/,
                                  message:
                                    '국문, 영문, 숫자만 입력 가능합니다.',
                                },
                              }}
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

                          {'techStackIdList' in question && techStackList && (
                            <MultiSelectList
                              list={techStackList}
                              selectLimit={3}
                              name="techStackIdList"
                            />
                          )}

                          {'verifyCode' in question && (
                            <div className="relative pb-10">
                              <UnControlledInput
                                name="verifyCode"
                                placeholder="코드를 입력해주세요"
                                className="h-[50px] w-full pl-4"
                                condition={{
                                  required: '코드를 입력해주세요.',
                                }}
                              />
                              <button
                                type="button"
                                className="absolute right-0 top-12 mt-2 rounded-md border px-2 py-0.5 text-gray1"
                                onClick={() => {}}
                              >
                                인증 확인
                              </button>
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
                        </QuestionItem>
                      )
                    );
                  }),
              )}

              {watch('role') === 'PRE_TRAINEE' && (
                <span className="mt-10 inline-block text-center text-gray2">
                  예비 수강생은 제한된 서비스만 이용 가능합니다.
                </span>
              )}
            </div>

            {currentStep === questionListByRole.length && (
              <SquareButton
                type="submit"
                name="제출"
                className="mx-auto mt-14 w-[50%] px-4 py-3 font-medium"
              />
            )}
          </form>
        </FormStepIndicator>
      </FormProvider>
    </AuthPageLayout>
  );
}
