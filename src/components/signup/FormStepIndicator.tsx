import { ReactNode } from 'react';

import { currentStepAtom } from '@/atoms/formStepAtom';

import {
  SignUpFormTitle,
  SignUpQuestionsByStep,
  UserInfo,
  VerifyCode,
} from '@/types';
import { useAtom } from 'jotai';
import { useFormContext } from 'react-hook-form';
import { BiChevronLeft } from 'react-icons/bi';

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
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);
  const { trigger } = useFormContext();

  const formItemsByStepArr = questionListByRole.map(item => {
    return item
      .map(i => {
        const { additionalInfo, title, ...rest } =
          i as unknown as SignUpFormTitle;
        return Object.keys(rest);
      })
      .flat()
      .map(key => (key === 'roles' ? 'role' : key));
  }) as unknown as (keyof UserInfo & VerifyCode)[][];

  const goNextStep = async () => {
    const currentFormItems = formItemsByStepArr[currentStep - 1];

    const checkValid = await Promise.all(
      currentFormItems.map(async key => {
        const isValids = await trigger(key);
        return isValids;
      }),
    );

    if (!checkValid.includes(false)) {
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
              className="group flex size-10 items-center justify-center self-end rounded-md border border-gray2 bg-white hover:border-gray1"
            >
              <BiChevronLeft className="size-8 text-gray2 group-hover:text-gray1" />
            </button>
          )}
        </div>

        <div className="flex w-full gap-2">
          {steps.map(step => (
            <div
              key={step}
              className={`${step <= resolvedUnMatchCurrentStep ? 'bg-skyBlue1' : 'bg-[#C7D3EB]'} h-[10px] w-full rounded-full`}
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
