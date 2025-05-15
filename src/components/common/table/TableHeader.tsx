import { Option } from '@/types';
import { BiExpandVertical } from 'react-icons/bi';

import TrashButton from '@/components/common/button/TrashButton';
import Checkbox from '@/components/common/checkbox/Checkbox';
import MultiSelectDropdown from '@/components/common/dropdown/MultiSelectDropdown';

interface TableHeaderProps<T> {
  currCollection: T;
  headerCellList: string[];
  // 체크박스
  isChecked?: boolean;
  disabledCheck?: boolean;
  onCheckboxClick?: () => void;
  // 작성일
  onChangeOrder: () => void;
  // 분류
  categoryOptionList: Option[];
  checkedCategoryOptionList: Option[];
  onChangeCategory: (value: Option[]) => void;
  // 삭제
  disabledDelete?: boolean;
  onDeleteConfirmClick?: () => void;
}

export default function TableHeader<T>({
  headerCellList,
  isChecked,
  disabledCheck,
  categoryOptionList,
  currCollection,
  onDeleteConfirmClick,
  onChangeCategory,
  disabledDelete,
  checkedCategoryOptionList,
  onChangeOrder,
  onCheckboxClick,
}: TableHeaderProps<T>) {
  return (
    <thead>
      <tr className="text-center">
        {headerCellList.map(name => (
          <th key={name} className="relative pb-4 font-normal">
            {name === '체크박스' &&
              isChecked !== undefined &&
              onCheckboxClick && (
                <Checkbox
                  id={name}
                  checked={isChecked}
                  disabled={disabledCheck}
                  onChange={onCheckboxClick}
                  inputClassName="!rounded-lg size-5"
                />
              )}

            {name === '작성일' && (
              <button
                type="button"
                onClick={onChangeOrder}
                className="flex w-full items-center justify-center pl-1.5"
              >
                <span className="text-[15px]">{name}</span>
                <BiExpandVertical className="inline size-5 cursor-pointer px-0.5 text-darkGray-hover" />
              </button>
            )}

            {name === '분류' && (
              <div className="flex items-center justify-center">
                <MultiSelectDropdown
                  isDefaultLabelSelectBox
                  selectBoxClassName="border-none pl-1.5 !gap-0 text-[15px]"
                  options={categoryOptionList}
                  optionClassName="w-32"
                  defaultLabel="분류"
                  value={checkedCategoryOptionList.map(({ id }) => id)}
                  onChangeValue={onChangeCategory}
                />
              </div>
            )}

            {(name === '게시글 제목' || name === '댓글 내용') && (
              <div className="flex w-full pl-2">
                <span className="block text-[15px]">
                  {currCollection === '내가 쓴 댓글' ? '댓글 내용' : name}
                </span>
              </div>
            )}

            {name === '선택삭제' && (
              <TrashButton
                text="선택삭제"
                onConfirmClick={onDeleteConfirmClick}
                disabled={disabledDelete}
                className="mr-4 !text-black disabled:!text-mainGray"
              />
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}
