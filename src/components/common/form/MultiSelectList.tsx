import { useFormContext } from 'react-hook-form';

interface MultiSelectListProps {
  name: string;
  list: { id: number; job?: string; domain?: string; techStack?: string }[];
  selectLimit: number;
}

export default function MultiSelectList({
  name,
  list,
  selectLimit,
}: MultiSelectListProps) {
  const { setValue, watch, getValues } = useFormContext();

  const handleClick = (id: number) => {
    const currentIds: number[] = getValues(name) || [];

    const removeId = currentIds.filter(currentId => currentId !== id);

    const addId = [...currentIds, id];
    const limitNum = currentIds.length >= selectLimit;
    const addIdUntilLimit = limitNum ? currentIds : addId;

    const listValue = currentIds.includes(id) ? removeId : addIdUntilLimit;

    setValue(name, listValue, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <ul className="flex flex-wrap gap-3">
      {list.map(({ id, ...rest }) => (
        <li
          key={id}
          className={`${watch(name).includes(id) ? 'bg-vividGreen1 text-white' : 'bg-white text-text'} cursor-pointer rounded border`}
        >
          <button
            type="button"
            onClick={() => handleClick(id)}
            className="px-2 py-0.5 font-medium"
          >
            {rest.domain || rest.job || rest.techStack}
          </button>
        </li>
      ))}
    </ul>
  );
}
