import React, { memo } from 'react';

import { FaRegStar, FaStar } from 'react-icons/fa';

interface StoreStarRatingProps {
  score: number;
  onChange?: (newScore: number) => void;
  isEditable?: boolean;
}

function StoreStarRating({
  score,
  onChange,
  isEditable = false,
}: StoreStarRatingProps) {
  const handleClick = (i: number) => {
    if (isEditable && onChange) {
      onChange(i + 1);
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (isEditable && (e.key === 'Enter' || e.key === ' ')) {
      onChange?.(i + 1);
    }
  };

  const renderStars = (): JSX.Element[] => {
    const result: JSX.Element[] = [];
    for (let i = 0; i < 5; i += 1) {
      result.push(
        <div>
          {isEditable ? (
            <button
              key={i + 1}
              type="button"
              onClick={() => handleClick(i)}
              onKeyDown={e => handleKeyDown(i, e)}
              className="cursor-pointer border-none bg-none p-0"
            >
              {i + 1 <= score ? <FaStar /> : <FaRegStar />}
            </button>
          ) : (
            <span key={i + 1} className="cursor-default">
              {i + 1 <= score ? <FaStar /> : <FaRegStar />}
            </span>
          )}
        </div>,
      );
    }
    return result;
  };

  return <div className="flex text-yellow-400">{renderStars()}</div>;
}

export default memo(StoreStarRating);
