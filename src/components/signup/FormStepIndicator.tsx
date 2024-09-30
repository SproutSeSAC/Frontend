import { ReactNode } from 'react';

import { currentStepAtom } from '@/atoms/formStepAtom';

import { useAtom } from 'jotai';
import { useFormContext } from 'react-hook-form';
import { BiChevronLeft } from 'react-icons/bi';

import SquareButton from '@/components/common/button/SquareButton';

interface FormStepIndicatorProps {
  formStep: number;
  totalStep: number;
  children: ReactNode;
}

export default function FormStepIndicator({
  formStep,
  totalStep,
  children,
}: FormStepIndicatorProps) {
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);
  const {
    formState: { isValid },
  } = useFormContext();

  const goNextStep = async () => {
    if (isValid) {
      const nextStep = currentStep === formStep ? currentStep : currentStep + 1;
      setCurrentStep(nextStep);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const goPrevStep = async () => {
    const prevStep = currentStep === 1 ? currentStep : currentStep - 1;
    setCurrentStep(prevStep);
  };

  const steps = Array.from({ length: formStep }, (_, i) => i + 1);

  const resolvedUnMatchStep =
    totalStep === formStep - 1 && currentStep >= formStep - 2
      ? currentStep + 1
      : currentStep;

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
              className={`${step <= resolvedUnMatchStep ? 'bg-skyBlue1' : 'bg-[#C7D3EB]'} h-[10px] w-full rounded-full`}
            />
          ))}
        </div>
      </div>

      {children}

      {currentStep !== formStep && (
        <SquareButton
          name="다음"
          onClick={goNextStep}
          className="w-[50%] self-center px-4 py-3 font-medium"
        />
      )}
    </>
  );
}
