import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { usePostStoreReview } from '@/services/store/storeMutations';

import { dateFormat } from '@/utils/dateFormat';

import StoreStarRating from './StoreStarRating';

import { useDialogContext } from '@/hooks';
import { StoreReviewList } from '@/types/store/storeDto';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitErrorHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import SquareButton from '@/components/common/button/SquareButton';
import ErrorMsg from '@/components/common/input/ErrorMsg';
import UserImage from '@/components/user/UserImage';

interface StoreModalReviewProps {
  reviewList: StoreReviewList[];
  storeId: number;
  nickName: string;
}

interface FormValues {
  rating: number;
  review: string;
}

const reviewFormSchema = z.object({
  rating: z.union([
    z.number().min(1, '별점을 선택해 주세요.'),
    z.undefined().refine(data => data && data > 0, '별점을 선택해 주세요.'),
  ]),

  review: z.union([
    z.string().min(1, '댓글을 작성해 주세요.'),
    z.undefined().refine(() => false, '댓글을 작성해 주세요.'),
  ]),
});

export default function StoreModalReview({
  reviewList,
  storeId,
  nickName,
}: StoreModalReviewProps) {
  const queryClient = useQueryClient();
  const { mutateAsync } = usePostStoreReview();

  const { control, handleSubmit, reset, getValues } = useForm<FormValues>({
    defaultValues: {
      rating: 0,
      review: '',
    },
    resolver: zodResolver(reviewFormSchema),
  });

  const { showToast } = useDialogContext();

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        await mutateAsync({
          storeId,
          rating: data.rating,
          review: data.review,
        });

        showToast('댓글을 등록했어요!', 1000);
        reset();
        queryClient.invalidateQueries({
          queryKey: ['useGetStoreDetail'],
        });
      } catch (err) {
        console.error(err);
        showToast('댓글을 등록하지 못했어요..');
      }
    },
    [mutateAsync, queryClient, reset, showToast, storeId],
  );

  const onError: SubmitErrorHandler<FormValues> = useCallback(
    err => {
      console.error('hook form error >>', {
        data: getValues(),
        error: err,
      });
      const firstErrorMessage = Object.entries(err)?.[0]?.[1].message || '';

      if (firstErrorMessage) {
        showToast(firstErrorMessage);
      }
    },
    [getValues, showToast],
  );

  return (
    <section className="pb-14">
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="flex items-center gap-2">
          <UserImage className="size-[30px] p-0.5" />
          <div className="relative">
            <div>{nickName}</div>
            <Controller
              control={control}
              name="rating"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                return (
                  <>
                    <StoreStarRating
                      score={value}
                      onChange={onChange}
                      isEditable
                    />
                    {error && (
                      <ErrorMsg
                        msg={error?.message || ''}
                        className="w-30 absolute -right-24 top-4"
                      />
                    )}
                  </>
                );
              }}
            />
          </div>
        </div>
        <Controller
          control={control}
          name="review"
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <div className="mb-4 flex flex-col">
                <textarea
                  className={`mt-2.5 w-full resize-none rounded border border-solid p-[15px] text-lg ${error ? 'border-[#FF3939]' : 'border-gray5'}`}
                  placeholder="댓글을 작성해 주세요."
                  rows={5}
                  value={value}
                  onChange={onChange}
                />
                {error && <ErrorMsg msg={error?.message || ''} />}
              </div>
            );
          }}
        />

        <div className="flex justify-end gap-2">
          <SquareButton type="submit" name="등록하기" />
          <button
            onClick={() => {}}
            type="button"
            className="rounded-lg bg-gray5 px-4 py-2 tracking-tight text-white"
          >
            취소하기
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-8">
          {reviewList?.map(commentItem => (
            <div
              key={JSON.stringify(commentItem)}
              className="flex w-full flex-col gap-4 text-lg"
            >
              <div className="flex items-center gap-2">
                <UserImage
                  className="size-[30px] p-0.5"
                  // profileImageUrl={commentItem.profileImageUrl} //TODO: 이미지url 정상적으로 들어오면 노출
                />

                <div>
                  <div>{`@${commentItem.nickname}`}</div>
                  <StoreStarRating score={commentItem.rating} />
                </div>
              </div>

              <div>{commentItem.review}</div>
              <div className="flex gap-10 text-gray1">
                <div className="flex gap-4">
                  <div>{`${dateFormat(commentItem.createdAt, 'yyyy-MM-dd HH:mm:ss')}`}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </form>
    </section>
  );
}
