import { useFormContext } from 'react-hook-form';

interface MultiSelectListProps {
  name: string;
  list: string[];
  selectLimit: number;
}

export default function MultiSelectList({
  name,
  list,
  selectLimit,
}: MultiSelectListProps) {
  const { setValue, watch, getValues } = useFormContext();

  const handleClick = (item: string) => {
    const currentList: string[] = getValues(name) || [];

    const removeItem = currentList.filter(currentItem => currentItem !== item);
    const addItem = [...currentList, item];
    const limitNum = currentList.length >= selectLimit;
    const addItemUntilLimit = limitNum ? currentList : addItem;
    const listValue = currentList.includes(item)
      ? removeItem
      : addItemUntilLimit;

    setValue(name, listValue, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <ul className="flex flex-wrap gap-3">
      {list.map(item => (
        <li
          key={item}
          className={`${watch(name).includes(item) ? 'bg-vividGreen1 text-white' : 'bg-white text-text'} cursor-pointer rounded border`}
        >
          <button
            type="button"
            onClick={() => handleClick(item)}
            className="px-2 py-0.5 font-medium"
          >
            {item}
          </button>
        </li>
      ))}
    </ul>
  );
}
