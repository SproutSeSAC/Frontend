import { useGetPostDetail } from '@/services/post/postQueries';

import { useDialogContext } from '@/hooks';
import { GetStoreDetailResponse } from '@/types/store/storeDto';

import Modal from '@/components/common/modal/Modal';
import StoreReview from '@/components/store/modal/StoreReview';

interface MyCommentModalProps {
  postId: number;
  comment: string;
  nickname: string;
}

export default function MyCommentModal({
  postId,
  comment,
  nickname,
}: MyCommentModalProps) {
  const { hideDialog } = useDialogContext();

  const { data: storeDetail, isLoading: isStoreDetailLoading } =
    useGetPostDetail<GetStoreDetailResponse>(postId);

  const currReview = storeDetail?.storeReviewList.find(
    ({ review, nickname: name }) => review === comment && nickname === name,
  );

  return (
    currReview &&
    !isStoreDetailLoading && (
      <Modal
        className="main-w-[284px] px-8 py-10"
        onToggleClick={hideDialog}
        hideClose
        headerType="none"
      >
        <StoreReview review={currReview} />
      </Modal>
    )
  );
}
