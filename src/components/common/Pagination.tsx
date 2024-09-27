import React, { useMemo } from 'react';

import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const previousNextButtonStyle = 'rounded-full bg-gray4 p-1.5';
const previousNextButtonIconStyle = 'size-2 stroke-1 text-gray2';
interface Props {
  totalPages: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

// < 1,2,3,4,5 ... last page > => 형태로 구현
function Pagination({ totalPages, onPageChange, currentPage }: Props) {
  const pageNumbers = useMemo(() => {
    const range: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // 총 페이지가 5 이하일 경우, 1부터 totalPages까지 모두 표시
      range.push(...Array.from({ length: totalPages }, (_, idx) => idx + 1));
    } else if (currentPage <= maxVisiblePages - 1) {
      // 현재 페이지가 1~4일 경우, 1~5까지의 페이지를 표시
      range.push(
        ...Array.from({ length: maxVisiblePages }, (_, idx) => idx + 1),
      );
    } else if (currentPage >= totalPages - (maxVisiblePages - 2)) {
      // 현재 페이지가 마지막 페이지에 가까울 때, 끝에서 5개의 페이지 표시
      range.push(
        ...Array.from(
          { length: maxVisiblePages },
          (_, idx) => totalPages - (maxVisiblePages - 1) + idx,
        ),
      );
    } else {
      // 그 외의 경우, 현재 페이지를 중심으로 5개의 페이지 표시
      range.push(
        ...Array.from(
          { length: maxVisiblePages },
          (_, idx) => currentPage - 2 + idx,
        ),
      );
    }

    return range;
  }, [currentPage, totalPages]);

  return (
    <div className="flex w-full items-center justify-center gap-5">
      <button
        type="button"
        aria-label="이전 페이지로 이동"
        className={previousNextButtonStyle}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <BsChevronLeft className={previousNextButtonIconStyle} />
      </button>

      {pageNumbers[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)}>1</button>
          {pageNumbers[0] !== 2 && <span>...</span>}
        </>
      )}

      {pageNumbers.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`text-gray2 ${currentPage === page && 'text-text'}`}
        >
          {page}
        </button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] !== totalPages - 1 && (
            <span>...</span>
          )}
          <button
            className="text-gray2"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        aria-label="다음 페이지로 이동"
        className={previousNextButtonStyle}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <BsChevronRight className={previousNextButtonIconStyle} />
      </button>
    </div>
  );
}

export default React.memo(Pagination);
