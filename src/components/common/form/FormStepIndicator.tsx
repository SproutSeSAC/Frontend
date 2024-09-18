interface FormStepIndicatorProps {
  totalStep: number;
  currentStep: number;
}

/**
 * @param totalStep - 폼의 전체 단계
 * @param currentStep - 폼의 현재 단계
 */

export default function FormStepIndicator({
  totalStep,
  currentStep,
}: FormStepIndicatorProps) {
  const steps = Array.from({ length: totalStep }, (_, i) => i + 1);

  return (
    <div className="flex w-full gap-2">
      {steps.map(step => (
        <div
          key={step}
          className={`${step <= currentStep ? 'bg-skyBlue1' : 'bg-[#C7D3EB]'} h-[10px] w-full rounded-full`}
        />
      ))}
    </div>
  );
}
