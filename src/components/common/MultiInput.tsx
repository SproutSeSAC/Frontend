import { useCallback, useRef, useState } from 'react';

import { BsX } from 'react-icons/bs';

interface MultiInputProps {
  onChangeValue: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

function MultiInput({
  className,
  onChangeValue,
  placeholder,
}: MultiInputProps) {
  const [tagList, setTagList] = useState<string[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(() => {
    const keyword = searchInputRef.current?.value.trim() || '';
    if (!keyword) {
      alert('검색어를 입력해주세요.');
      return;
    }
    setTagList(prev => {
      const updateTag = prev.includes(keyword)
        ? prev.filter(item => item !== keyword)
        : [...prev, keyword];

      onChangeValue(updateTag);

      return updateTag;
    });

    // TODO: 다른방법 찾아보기.....
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.value = '';
      }
    }, 100);
  }, [onChangeValue]);

  const handleTagDelete = useCallback(
    (tag: string) => {
      setTagList(prev => {
        const deleteTag = prev.filter(item => item !== tag);

        onChangeValue(deleteTag);

        return deleteTag;
      });
    },
    [onChangeValue],
  );

  return (
    <div className={`relative flex gap-4 ${className}`}>
      {tagList.length > 0 && (
        <ul className="flex items-center gap-2">
          {tagList.map(tag => (
            <li
              key={tag}
              className="flex w-fit items-center gap-2 rounded-md bg-gray4 px-2 py-1"
            >
              {tag}
              <button
                type="button"
                aria-label={`${tag} 삭제`}
                onClick={() => handleTagDelete(tag)}
              >
                <BsX size={20} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        placeholder={placeholder}
        ref={searchInputRef}
        type="text"
        className="w-full"
        onKeyDown={async e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            await handleSearch();
          }
        }}
      />
    </div>
  );
}

export default MultiInput;
