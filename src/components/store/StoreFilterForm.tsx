import { useCallback } from 'react';

import { useSearchParams } from 'react-router-dom';

import { updateQueryParams } from '@/utils';
import { Controller, useForm } from 'react-hook-form';
import { MdOutlineRefresh } from 'react-icons/md';

import Checkbox from '@/components/common/checkbox/Checkbox';
import CheckboxGroup from '@/components/common/checkbox/CheckboxGroup';

const temporaryMainFilter = [
  {
    text: '제로페이',
    count: 20,
  },
  {
    text: '만원이하',
    count: 20,
  },
  {
    text: '5인 이상',
    count: 50,
  },
  {
    text: '도보 5분 이내',
    count: 5,
  },
];

const temporaryCategory = [
  {
    text: '한식',
    count: 200,
  },
  {
    text: '양식',
    count: 15,
  },
  {
    text: '중식',
    count: 3,
  },
  {
    text: '일식',
    count: 41,
  },
  {
    text: '분식',
    count: 20,
  },
  {
    text: '간편식',
    count: 200,
  },
];

// TODO: api type 수정 필요
interface FormValues {
  campus: string;
  새싹: string[];
  메뉴별: string[];
}

export default function StoreFilterForm() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { control, setValue, getValues, reset } = useForm<FormValues>({
    defaultValues: {
      campus: '강북캠퍼스',
      새싹: [],
      메뉴별: [],
    },
    values: {
      campus: searchParams.get('campus') || '강북캠퍼스',
      새싹: searchParams.getAll('새싹')[0]?.split(',') || [],
      메뉴별: searchParams.getAll('메뉴별')[0]?.split(',') || [],
    },
  });

  const handleCheckboxChange = useCallback(
    (
      name: keyof Pick<FormValues, '새싹' | '메뉴별'>,
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
        <h3 className="mb-[6px]">나의 위치 찾기</h3>
        <Controller
          control={control}
          name="campus"
          render={({ field: { value, onChange } }) => (
            <select
              className="px-3 py-1"
              onChange={e => {
                onChange(e);
                updateQueryParams(
                  searchParams,
                  setSearchParams,
                  'campus',
                  e.target.value,
                );
              }}
              value={value}
            >
              <option value="강북캠퍼스">강북캠퍼스</option>
              <option value="도봉캠퍼스">도봉캠퍼스</option>
              <option value="동대문캠퍼스">동대문캠퍼스</option>
              <option value="성북캠퍼스">성북캠퍼스</option>
            </select>
          )}
        />
      </div>

      <CheckboxGroup title="새싹">
        {temporaryMainFilter.map(item => (
          <Controller
            key={item.text}
            control={control}
            name="새싹"
            render={({ field: { value } }) => {
              const isChecked = value.includes(item.text);

              return (
                <Checkbox
                  id={item.text}
                  text={item.text}
                  count={item.count}
                  checked={isChecked}
                  onChange={e =>
                    handleCheckboxChange('새싹', item.text, e.target.checked)
                  }
                />
              );
            }}
          />
        ))}
      </CheckboxGroup>

      <CheckboxGroup title="메뉴별">
        {temporaryCategory.map(item => (
          <Controller
            key={item.text}
            control={control}
            name="메뉴별"
            render={({ field: { value } }) => {
              const isChecked = value.includes(item.text);
              return (
                <Checkbox
                  id={item.text}
                  text={item.text}
                  count={item.count}
                  checked={isChecked}
                  onChange={e =>
                    handleCheckboxChange('메뉴별', item.text, e.target.checked)
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
