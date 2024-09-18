import { useState } from 'react';

import { getQuestionListByRole } from '@/constants';
import AuthPageLayout from '@/layouts/AuthPageLayout';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import Dropdown from '@/components/common/form/Dropdown';
import FormStepIndicator from '@/components/common/form/FormStepIndicator';
import MultiSelectList from '@/components/common/form/MultiSelectList';
import QuestionItem from '@/components/common/form/QuestionItem';
import Radio from '@/components/common/input/Radio';
import UnControlledInput from '@/components/common/input/UnControlledInput';

type FormInputs = {
  role: string;
  name: string;
  nickname: string;
  courseId: string[];
  jobList: string[];
  domainList: string[];
  marketingConsent: boolean | string;
  email: string;
  avatarImgUrl: string;
  campus: string[];
};

const defaultValues: FormInputs = {
  courseId: ['디지털헬스케어 서비스 기획 올라잇'], // number
  name: '',
  nickname: '',
  email: '',
  avatarImgUrl: '',
  role: '새싹 교육생', // "ADMIN" ?
  domainList: ['모빌리티', '인공지능 AI'], // 원래는 영어
  jobList: ['프론트엔드', '안드로이드 개발', '유니티 개발'], // 원래는 영어
  marketingConsent: true,
  campus: ['강북 캠퍼스'], // 원래 없는 값이네
};

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState(1);

  const methods = useForm<FormInputs>({ mode: 'onSubmit', defaultValues });

  const { handleSubmit, watch, trigger } = methods;

  const onSubmit: SubmitHandler<FormInputs> = data => {
    const value = {
      ...data,
      marketingConsent: data.marketingConsent === '동의',
    };
    console.log('최종 데이터:', value);
  };

  const questionListByRole = getQuestionListByRole(watch('role'));

  const changeStep = async () => {
    const isValid = await trigger();

    if (isValid) {
      setCurrentStep(prev =>
        prev === questionListByRole.length ? prev : prev + 1,
      );
    }
  };

  return (
    <AuthPageLayout>
      {/* 폼 단계 표시 */}
      <FormStepIndicator
        totalStep={4}
        currentStep={
          questionListByRole.length === 3 && currentStep >= 2
            ? currentStep + 1
            : currentStep
        }
      />

      {/* 폼 문항 표시 */}
      <FormProvider {...methods}>
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
                    <QuestionItem
                      key={question.title.text}
                      title={`${currentQuestionNumber}. ${question.title.text}`}
                      condition={question.title.condition}
                    >
                      {'roles' in question && (
                        <fieldset className="flex flex-wrap gap-x-12 gap-y-3">
                          {question.roles.map(role => (
                            <Radio key={role} label={role} name="role" />
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
                              message: '국문, 영문, 숫자만 입력 가능합니다.',
                            },
                          }}
                        />
                      )}

                      {'campus' in question && (
                        <Dropdown name="campus" options={question.campus} />
                      )}

                      {'courseId' in question && (
                        <Dropdown name="courseId" options={question.courseId} />
                      )}

                      {'jobList' in question && (
                        <MultiSelectList
                          list={question.jobList}
                          selectLimit={5}
                          name="jobList"
                        />
                      )}

                      {'domainList' in question && (
                        <MultiSelectList
                          list={question.domainList}
                          selectLimit={3}
                          name="domainList"
                        />
                      )}

                      {'keyword' in question && (
                        <UnControlledInput
                          name="keyword"
                          placeholder="키워드를 입력해주세요"
                          className="h-[50px] w-full pl-4"
                          condition={{
                            required: '키워드를 입력해주세요.',
                          }}
                        />
                      )}

                      {'marketingConsent' in question && (
                        <>
                          <p className="mb-4 rounded border p-3 leading-5">
                            스프라우트가 제공하는 이벤트, 혜택, 다양한
                            정보(뉴스레터, 취업, 교육 등) 안내 목적으로 이메일을
                            통한 정보수신을 위해 이용하고자 합니다. 마케팅 및
                            정보 수신을원하지 않는 경우, 동의하지 않아도 됩니다.
                          </p>

                          <fieldset className="flex flex-wrap gap-x-8 gap-y-3">
                            <Radio label="동의" name="marketingConsent" />
                            <Radio
                              label="동의하지 않음"
                              name="marketingConsent"
                            />
                          </fieldset>
                        </>
                      )}
                    </QuestionItem>
                  );
                }),
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
      </FormProvider>

      {currentStep !== questionListByRole.length && (
        <SquareButton
          name="다음"
          onClick={changeStep}
          className="mt-14 w-[50%] self-center px-4 py-3 font-medium"
        />
      )}
    </AuthPageLayout>
  );
}
