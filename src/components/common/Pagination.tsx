import { useState } from 'react';

import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

import { ITEMS_PER_PAGE } from '@/components/user/PostAndCommentCollection';

interface Props {
  totalItems: number;
  onPageChange: (pageNumber: number) => void;
}

function Pagination({ totalItems, onPageChange }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  // 전체 페이지 수 계산
  const lastPage = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const pageList = Array.from({ length: lastPage }, (_, i) => i + 1);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    onPageChange(pageNumber);
  };

  const previousNextButtonStyle = 'rounded-full bg-gray4 p-1.5';

  const previousNextButtonIconStyle = 'size-2 stroke-1 text-gray2';

  return (
    <div className="flex w-full items-center justify-center gap-5">
      <button
        type="button"
        aria-label="이전 페이지로 이동"
        className={previousNextButtonStyle}
        onClick={() =>
          handlePageChange(currentPage === 1 ? 1 : currentPage - 1)
        }
      >
        <BsChevronLeft className={previousNextButtonIconStyle} />
      </button>

      {pageList.map(page => (
        <button
          type="button"
          key={page}
          className={`text-gray2 ${currentPage === page && 'text-text'}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        aria-label="다음 페이지로 이동"
        className={previousNextButtonStyle}
        onClick={() =>
          handlePageChange(
            currentPage === lastPage ? lastPage : currentPage + 1,
          )
        }
      >
        <BsChevronRight className={previousNextButtonIconStyle} />
      </button>
    </div>
  );
}

export default Pagination;
