import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';
import { usePostStoreReview } from '@/services/store/storeMutations';

import { useDialogContext } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitErrorHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import SquareButton from '@/components/common/button/SquareButton';
import ErrorMsg from '@/components/common/input/ErrorMsg';
import StoreStarRating from '@/components/store/modal/StoreStarRating';
import UserImage from '@/components/user/UserImage';

interface StoreModalReviewProps {
  storeId: number;
  nickname: string;
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

export default function StoreReviewForm({
  storeId,
  nickname,
}: StoreModalReviewProps) {
  const queryClient = useQueryClient();
  const { mutateAsync } = usePostStoreReview();

  const { data: { profileImageUrl } = initialUserProfile } =
    useGetUserProfile();

  const { control, handleSubmit, reset } = useForm<FormValues>({
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
          queryKey: ['useGetPostDetail', storeId],
        });
      } catch (err) {
        showToast('댓글을 등록하지 못했어요.');
      }
    },
    [mutateAsync, queryClient, reset, showToast, storeId],
  );

  const onError: SubmitErrorHandler<FormValues> = useCallback(
    err => {
      const firstErrorMessage = Object.entries(err)?.[0]?.[1].message || '';

      if (firstErrorMessage) {
        showToast(firstErrorMessage);
      }
    },
    [showToast],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <div className="flex items-center gap-2">
        <UserImage className="size-[35px]" imageNameSegment={profileImageUrl} />
        <div className="relative">
          <span>@{nickname}</span>
          <Controller
            control={control}
            name="rating"
            render={({ field: { onChange, value }, fieldState: { error } }) => {
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
                      className="absolute bottom-1 left-[110%] w-32"
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
                className={`mt-2 w-full resize-none rounded-xl border border-solid p-[15px] text-base focus:outline-none ${error ? 'border-[#FF3939]' : 'border-mainGray-active'}`}
                placeholder="댓글을 작성해 주세요."
                rows={5}
                value={value}
                onChange={onChange}
              />
              {error && (
                <ErrorMsg msg={error?.message || ''} className="pl-2" />
              )}
            </div>
          );
        }}
      />

      <div className="flex justify-end gap-2">
        <SquareButton type="submit" name="등록하기" />
      </div>
    </form>
  );
}
