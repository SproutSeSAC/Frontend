import { useCallback } from 'react';

import { useFormContext } from 'react-hook-form';

import ErrorMsg from '@/components/common/input/ErrorMsg';
import { FormStateProps } from '@/components/common/input/TextInput';

interface MultiSelectListProps extends FormStateProps {
  name: string;
  list: {
    id: number;
    job?: string;
    domain?: string;
    techStack?: string;
    iconImageUrl?: string;
  }[];
  selectLimit: number;
}

export default function MultiSelectList({
  name,
  list,
  selectLimit,
  errorMsg,
}: MultiSelectListProps) {
  const { setValue, getValues, watch } = useFormContext();

  const watchedValue = watch(name);

  const handleClick = useCallback(
    (id: number) => {
      const currentIds: number[] = getValues(name) || [];

      const removeId = currentIds.filter(currentId => currentId !== id);

      const limitNum = currentIds.length >= selectLimit;
      const addId = [...currentIds, id];
      const addIdUntilLimit = limitNum ? currentIds : addId;

      const listValue = currentIds.includes(id) ? removeId : addIdUntilLimit;

      setValue(name, listValue, { shouldValidate: true, shouldDirty: true });
    },
    [getValues, name, selectLimit, setValue],
  );

  return (
    <>
      <ul className="flex flex-wrap gap-1.5">
        {list.map(({ id, iconImageUrl, ...rest }) => (
          <li
            key={id}
            className={`${watchedValue.includes(id) ? 'bg-vividGreen1 text-white' : 'bg-white text-text'} cursor-pointer rounded border`}
          >
            <button
              type="button"
              onClick={() => handleClick(id)}
              className="flex items-center justify-center gap-1 px-2 py-0.5 font-medium"
            >
              <span>{rest.domain || rest.job || rest.techStack}</span>
            </button>
          </li>
        ))}
      </ul>

      {errorMsg && <ErrorMsg msg={errorMsg} />}
    </>
  );
}
