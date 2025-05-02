import React, { useMemo } from 'react';

import Icon from '@/components/common/Icon';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

function Pagination({
  totalPages,
  onPageChange,
  currentPage,
}: PaginationProps) {
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
    <div className="mt-auto flex w-full items-center justify-center gap-5">
      <button
        type="button"
        aria-label="이전 페이지로 이동"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex size-6 items-center justify-center rounded-full bg-mainGray text-black disabled:bg-[#e9e9e9] disabled:text-mainGray-hover"
      >
        <Icon name="ChevronLeft" className="size-3" />
      </button>

      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`text-sm ${currentPage === 1 ? 'text-black' : 'text-mainGray'}`}
          >
            1
          </button>
          {pageNumbers[0] !== 2 && <span>...</span>}
        </>
      )}

      {pageNumbers.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${currentPage === page ? 'text-black' : 'text-mainGray'} text-sm`}
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
            className={`text-sm ${currentPage === totalPages ? 'text-black' : 'text-mainGray'}`}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        aria-label="다음 페이지로 이동"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex size-6 items-center justify-center rounded-full bg-mainGray text-black disabled:bg-[#e9e9e9] disabled:text-mainGray-hover"
      >
        <Icon name="ChevronRight" className="size-3" />
      </button>
    </div>
  );
}

export default React.memo(Pagination);
