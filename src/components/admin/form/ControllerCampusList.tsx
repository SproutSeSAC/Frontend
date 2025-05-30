import { useGetCampusList } from '@/services/campusCourse/campusCourseQueries';

import { Controller, useFormContext, useWatch } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import ErrorMsg from '@/components/common/input/ErrorMsg';

export default function ControllerCampusList() {
  const { control } = useFormContext();

  const { data: campusList } = useGetCampusList();

  const currCampusIdList = useWatch({ control, name: 'campusIdList' });

  const toggleItemInArr = (arr: number[], id: number) => {
    return arr.includes(id)
      ? arr.filter(itemId => itemId !== id)
      : [...arr, id];
  };

  return (
    <Controller
      control={control}
      name="campusIdList"
      render={({ field: { onChange }, fieldState: { error } }) => {
        return (
          <div className="mb-6 mt-4 h-[300px]">
            <ul className="flex flex-wrap gap-3">
              {campusList?.map(({ name: campusName, id }) => (
                <li key={id}>
                  <SquareButton
                    name={campusName}
                    onClick={() => {
                      onChange(toggleItemInArr(currCampusIdList, id));
                    }}
                    color={
                      !currCampusIdList.includes(id) ? 'inActive' : 'mainBlue'
                    }
                  />
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
