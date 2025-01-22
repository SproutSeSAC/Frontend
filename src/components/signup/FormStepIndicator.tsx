import { ReactNode } from 'react';

import { currentStepAtom } from '@/atoms/formStepAtom';
import { verificationNicknameAtom } from '@/atoms/verificationNicknameAtom';

import {
  SignUpFormTitle,
  SignUpQuestionsByStep,
  SignUpUserFormValue,
} from '@/types';
import { useAtom, useAtomValue } from 'jotai';
import { useFormContext } from 'react-hook-form';

import Icon from '@/components/common/Icon';
import SquareButton from '@/components/common/button/SquareButton';

interface FormStepIndicatorProps {
  resolvedUnMatchCurrentStep: number;
  formStep: number;
  questionListByRole: SignUpQuestionsByStep[][];
  children: ReactNode;
}

export default function FormStepIndicator({
  resolvedUnMatchCurrentStep,
  formStep,
  questionListByRole,
  children,
}: FormStepIndicatorProps) {
  const verifiedNickname = useAtomValue(verificationNicknameAtom);

  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);

  const { trigger, setError } = useFormContext();

  const formItemsByStepArr = questionListByRole.map(item => {
    const keyName: Record<string, string> = {
      roles: 'role',
      campusList: 'campusIdList',
      courseList: 'courseIdList',
      domainList: 'domainIdList',
      techStackList: 'techStackIdList',
      jobList: 'jobIdList',
    };

    const keys = item
      .map(i => {
        const { additionalInfo, title, ...rest } = i as SignUpFormTitle;
        return Object.keys(rest);
      })
      .flat()
      .map(key => keyName[key] || key);

    return keys;
  }) as (keyof SignUpUserFormValue)[][];

  const goNextStep = async () => {
    if (!verifiedNickname) {
      setError('nickname', {
        type: 'manual',
        message: '중복 확인을 해주세요.',
      });
      return;
    }

    const currentFormItems = formItemsByStepArr[currentStep - 1];

    const checkValidKey = await Promise.all(
      currentFormItems.map(async key => {
        const isValids = await trigger(key);
        return isValids;
      }),
    );

    if (!checkValidKey.includes(false)) {
      const nextStep = currentStep === formStep ? currentStep : currentStep + 1;
      setCurrentStep(nextStep);
    }
  };

  const goPrevStep = async () => {
    const prevStep = currentStep === 1 ? currentStep : currentStep - 1;
    setCurrentStep(prevStep);
  };

  const steps = Array.from({ length: formStep }, (_, i) => i + 1);

  return (
    <>
      <div>
        <div className="mb-[15%] flex items-center justify-between">
          <img src="/sprout_logo.png" alt="sprout 로고" className="h-10 w-10" />

          {currentStep !== 1 && (
            <button
              onClick={goPrevStep}
              className="group flex size-10 items-center justify-center self-end rounded-md border border-mainGray bg-white hover:border-darkGray-active"
            >
              <Icon
                name="ChevronLeft"
                className="size-8 text-mainGray group-hover:text-darkGray-active"
              />
            </button>
          )}
        </div>

        <div className="flex w-full gap-2">
          {steps.map(step => (
            <div
              key={step}
              className={`${step <= resolvedUnMatchCurrentStep ? 'bg-mainBlue' : 'bg-[#C7D3EB]'} h-[10px] w-full rounded-full`}
            />
          ))}
        </div>
      </div>

      {children}

      {resolvedUnMatchCurrentStep !== formStep && (
        <SquareButton
          name="다음"
          onClick={goNextStep}
          className="w-[50%] self-center px-4 py-3 font-medium"
        />
      )}
    </>
  );
}
