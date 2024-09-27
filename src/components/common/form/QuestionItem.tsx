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
    <div className="relative pb-14">
      <h4 className="mb-4 block text-lg font-semibold">
        {title}

        <span className="ml-2 text-base font-normal text-vividGreen2">
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
