import { useCallback, useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';

import { useGetCampusList } from '@/services/course/courseQueries';
import { useGetFilterCount } from '@/services/store/storeQueries';

import SingleSelectDropdown from '../common/dropdown/SingleSelectDropdown';

import { foodFilterList, storeMainFilterList } from '@/constants';
import { updateQueryParams } from '@/utils';
import { Controller, useForm } from 'react-hook-form';
import { MdOutlineRefresh } from 'react-icons/md';

import Checkbox from '@/components/common/checkbox/Checkbox';
import CheckboxGroup from '@/components/common/checkbox/CheckboxGroup';

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

export default function StoreFilterForm() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: campusList } = useGetCampusList();
  const { data: filterCount } = useGetFilterCount(
    campusList ? campusList[0]?.id : 0,
  );

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
  }, [reset, setSearchParams]);

  useEffect(() => {
    if (searchParams.size > 0) {
      handleReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form action="" className="flex w-[200px] flex-shrink-0 flex-col gap-8">
      <div className="flex w-full justify-between">
        <h3 className="text-[#545B61]">Filter</h3>
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={handleReset}
        >
          <MdOutlineRefresh className="text-gray-400" />
          <span className="text-xs text-gray1">Clear filters</span>
        </button>
      </div>

      <div>
        <h3 className="mb-[6px] text-sm font-semibold">나의 위치 찾기</h3>
        <Controller
          control={control}
          name="campusId"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <SingleSelectDropdown
              defaultLabel={campusList ? campusList[0].name : '선택'}
              options={campusList || []}
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
              selectBoxClassName="py-[7px] px-3 bg-white rounded w-[120px] h-7 text-xs"
              optionClassName="text-sm hover:rounded-sm hover:bg-gray3 pl-1"
            />
          )}
        />
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
                  count={filterCount ? filterCount[item.countKey] : 0}
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
        {foodFilterList.map(item => (
          <Controller
            key={item.key}
            control={control}
            name="foodTypeList"
            render={({ field: { value } }) => {
              const isChecked = value.includes(item.value);
              return (
                <Checkbox
                  id={item.key}
                  textClassName="text-sm"
                  text={item.key}
                  count={filterCount ? filterCount[item.countKey] : 0}
                  checked={isChecked}
                  onChange={e =>
                    handleFoodTypeListCheckboxChange(
                      'foodTypeList',
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
    </form>
  );
}
