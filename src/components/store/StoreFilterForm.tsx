import { useCallback, useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';

import { useGetCampusList } from '@/services/campusCourse/campusCourseQueries';
import { useGetFilterCount } from '@/services/store/storeQueries';

import { foodFilterDisplay, storeMainFilterList } from '@/constants';
import { useDialogContext } from '@/hooks';
import { updateQueryParams } from '@/utils';
import { Controller, useForm } from 'react-hook-form';
import { MdOutlineRefresh } from 'react-icons/md';

import Checkbox from '@/components/common/checkbox/Checkbox';
import CheckboxGroup from '@/components/common/checkbox/CheckboxGroup';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import StoreReportModal from '@/components/store/modal/StoreReportModal';

interface StoreFilterFormProps {
  onReset: () => void;
}

interface FormValues {
  campusId: number;
  sprout: {
    isZeropay: boolean;
    overFivePerson: boolean;
    underPrice: boolean;
    walkTimeWithinFiveMinutes: boolean;
  };
  foodTypeList: string[];
}

export default function StoreFilterForm({ onReset }: StoreFilterFormProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: campusList } = useGetCampusList();
  const { data: filterCount } = useGetFilterCount(
    campusList ? campusList[0]?.id : 0,
  );

  const { showDialog } = useDialogContext();

  const { control, setValue, getValues, reset } = useForm<FormValues>({
    defaultValues: {
      campusId: 0,
      sprout: {
        isZeropay: false,
        overFivePerson: false,
        underPrice: false,
        walkTimeWithinFiveMinutes: false,
      },
      foodTypeList: [],
    },
  });

  const handleSproutCheckboxChange = useCallback(
    (
      name: keyof Pick<FormValues, 'sprout'>,
      value: string,
      checked: boolean,
    ) => {
      const params = new URLSearchParams(searchParams);
      const currentValues = getValues(name);

      const newValues = {
        ...currentValues,
        [value]: checked,
      };
      setValue(name, newValues);

      if (checked) {
        params.set(value, String(checked));
      } else {
        params.delete(value);
      }
      setSearchParams(params, { replace: true });
    },
    [getValues, searchParams, setSearchParams, setValue],
  );

  const handleFoodTypeListCheckboxChange = useCallback(
    (
      name: keyof Pick<FormValues, 'foodTypeList'>,
      value: string,
      checked: boolean,
    ) => {
      const currentValues = getValues(name);

      if (checked) {
        const newValues = [...currentValues, value];
        setValue(name, newValues);
        updateQueryParams(searchParams, setSearchParams, name, newValues);
      } else {
        const newValues = currentValues.filter(item => item !== value);
        setValue(name, newValues);
        updateQueryParams(searchParams, setSearchParams, name, newValues);
      }
    },
    [getValues, searchParams, setSearchParams, setValue],
  );

  const handleReset = useCallback(() => {
    reset();
    setSearchParams('', { replace: true });
    onReset();
  }, [onReset, reset, setSearchParams]);

  useEffect(() => {
    if (searchParams.size > 0) {
      handleReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside className="h-full w-[22%] max-w-[300px] flex-shrink-0">
      <form className="flex min-w-[80%] flex-shrink-0 flex-col gap-8">
        <div>
          <div className="mb-[23px] flex w-full max-w-[220px] items-center justify-between">
            <h3 className="ml-1 whitespace-nowrap text-xl font-semibold">
              나의 위치 찾기
            </h3>
            <button
              type="button"
              className="flex h-[42px] w-[42px] items-center justify-center gap-2"
              onClick={handleReset}
            >
              <MdOutlineRefresh className="h-6 w-6 text-darkGray" />
            </button>
          </div>
          <div>
            <Controller
              control={control}
              name="campusId"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                const selectedOption = campusList?.find(
                  ({ id }) => id === value,
                );

                return (
                  <div className="max-w-[90%]">
                    <SingleSelectDropdown
                      defaultLabel={campusList ? campusList[0].name : '선택'}
                      options={campusList || []}
                      selectedOption={selectedOption}
                      onChangeValue={data => {
                        onChange(data[0].id);
                        updateQueryParams(
                          searchParams,
                          setSearchParams,
                          'campusId',
                          data[0].id.toString(),
                        );
                      }}
                      errorMsg={error?.message}
                      selectBoxClassName="w-full h-[46px] p-5 bg-lightGray rounded-lg border border-mainGray-active justify-between items-center inline-flex"
                      optionClassName="text-sm hover:rounded-sm hover:bg-lightGray-hover pl-1 data-[selected=true]:text-black data-[selected=true]:font-bold"
                    />
                  </div>
                );
              }}
            />
          </div>
        </div>

        <CheckboxGroup title="새싹" className="text-sm font-semibold">
          {storeMainFilterList.map(item => (
            <Controller
              key={item.key}
              control={control}
              name="sprout"
              render={({ field: { value } }) => {
                return (
                  <Checkbox
                    id={item.key}
                    text={item.key}
                    textClassName="text-sm"
                    count={
                      filterCount
                        ? filterCount.storeOptionCount[item.countKey]
                        : 0
                    }
                    checked={value[item.value as keyof FormValues['sprout']]}
                    onChange={e =>
                      handleSproutCheckboxChange(
                        'sprout',
                        item.value,
                        e.target.checked,
                      )
                    }
                  />
                );
              }}
            />
          ))}
        </CheckboxGroup>

        <CheckboxGroup title="메뉴별" className="text-sm font-semibold">
          {filterCount?.foodTypeCount.map(item => (
            <Controller
              key={item.foodType}
              control={control}
              name="foodTypeList"
              render={({ field: { value } }) => {
                const isChecked = value.includes(item.foodType);
                return (
                  <Checkbox
                    id={item.foodType}
                    textClassName="text-sm"
                    text={foodFilterDisplay[item.foodType]}
                    count={item.count}
                    checked={isChecked}
                    onChange={e =>
                      handleFoodTypeListCheckboxChange(
                        'foodTypeList',
                        item.foodType,
                        e.target.checked,
                      )
                    }
                  />
                );
              }}
            />
          ))}
        </CheckboxGroup>
        <button
          type="button"
          className="inline-flex h-[46px] w-full max-w-[218px] items-center justify-center gap-2.5 rounded-lg bg-lightGreen-hover px-3.5 py-2.5 text-lg font-semibold text-darkGray-active hover:bg-lightGreen-active active:bg-mainGreen active:text-white"
          onClick={async () => {
            await showDialog({
              key: 'STORE-REPORT-TYPE',
              element: <StoreReportModal />,
            });
          }}
        >
          맛집 제보하기
        </button>
      </form>
    </aside>
  );
}
