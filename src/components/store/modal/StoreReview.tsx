import { StoreReview as Review } from '@/types/store/storeDto';
import { formatDate } from '@/utils';

import StoreStarRating from '@/components/store/modal/StoreStarRating';
import UserImage from '@/components/user/UserImage';

interface StoreReviewProps {
  review: Review;
}

export default function StoreReview({ review }: StoreReviewProps) {
  return (
    <li key={review.createdAt} className="flex w-full flex-col gap-4 text-lg">
      <div className="flex items-center gap-2">
        <UserImage
          className="size-[30px]"
          imageNameSegment={review.profileImageUrl}
        />

        <div>
          <span className="text-[15px]">{`@${review.nickname}`}</span>
          <StoreStarRating score={review.rating} />
        </div>
      </div>

      <p>{review.review}</p>

      <span className="text-[15px] text-darkGray">{`${formatDate(review.createdAt, 'yyyy.MM.dd HH:mm')}`}</span>
    </li>
  );
}
