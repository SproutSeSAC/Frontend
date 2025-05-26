import { useGetCourseListByCampus } from '@/services/campusCourse/campusCourseQueries';

import { Controller, useFormContext, useWatch } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import ErrorMsg from '@/components/common/input/ErrorMsg';

export default function ControllerCourseList() {
  const { control } = useFormContext();

  const currCampusIdList = useWatch({ control, name: 'campusIdList' });

  const currCourseIdList = useWatch({ control, name: 'courseIdList' });

  const allCurrCourseList = useGetCourseListByCampus(currCampusIdList);

  const toggleItemInArr = (arr: number[], id: number) => {
    return arr.includes(id)
      ? arr.filter(itemId => itemId !== id)
      : [...arr, id];
  };

  const courseListByCampus = allCurrCourseList.map(({ data }) => ({
    campusId: data?.[0].campusId,
    campusName: data?.[0].campusName,
    data,
  }));

  return (
    <Controller
      control={control}
      name="courseIdList"
      render={({ field: { onChange }, fieldState: { error } }) => {
        return (
          <div className="mb-6 mt-4 h-[300px]">
            <ul className="flex max-h-[300px] flex-col gap-9 overflow-scroll scrollbar-hide">
              {courseListByCampus?.map(({ data, campusName }) => (
                <li key={campusName}>
                  <div className="flex justify-between pb-2 text-sm font-medium text-darkGray-active">
                    <span>{campusName} 교육과정</span>{' '}
                    <span>
                      {
                        data?.filter(({ id }) => currCourseIdList.includes(id))
                          .length
                      }{' '}
                      / {data?.length}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {data?.map(({ id, title }) => (
                      <li key={id}>
                        <SquareButton
                          name={title}
                          color={
                            !currCourseIdList.includes(id)
                              ? 'inActive'
                              : 'mainBlue'
                          }
                          className="w-full truncate whitespace-pre !px-3 text-start"
                          onClick={() =>
                            onChange(toggleItemInArr(currCourseIdList, id))
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            {error?.message && <ErrorMsg msg={error.message} />}
          </div>
        );
      }}
    />
  );
}
