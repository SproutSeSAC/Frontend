import { ReactNode } from 'react';

export default function QuestionItem({
  title,
  condition,
  children,
}: {
  title: string;
  condition?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative mb-10">
      <h4 className="mb-4 block text-lg font-semibold">
        {title}

        <span className="ml-2 text-base font-normal text-[#FF3939]">
          {condition?.includes('최대') ? (
            <>
              <span className="text-gray2">*최대</span>
              {condition.split('최대')[1]}
            </>
          ) : (
            condition
          )}
        </span>
      </h4>

      {children}
    </div>
  );
}
