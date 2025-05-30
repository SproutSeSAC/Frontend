import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { usePostTraineeMemo } from '@/services/admin/userToManageMutation';
import { useGetTraineeMemo } from '@/services/admin/userToManageQueries';

import { useDialogContext } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import SquareButton from '@/components/common/button/SquareButton';
import ErrorMsg from '@/components/common/input/ErrorMsg';
import Modal from '@/components/common/modal/Modal';

interface UserMemoModalProps {
  userId: number;
  username: string;
  memo: string;
}

const formSchema = z.object({
  content: z.string().min(1, '메모가 작성되지 않았습니다.'),
});

export default function UserMemoModal({
  userId,
  username,
  memo,
}: UserMemoModalProps) {
  const { hideDialog, showToast } = useDialogContext();

  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();

  const { data: traineeMemo } = useGetTraineeMemo({
    traineeId: userId,
  });

  const { mutateAsync: changeTraineeMemo } = usePostTraineeMemo({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['useGetTraineeMemo', userId],
      });
      showToast('메모가 저장되었습니다.');
    },
  });

  const methods = useForm({
    defaultValues: { content: traineeMemo?.content || memo },
    resolver: zodResolver(formSchema),
  });

  const { handleSubmit, control } = methods;

  const toggleEditing = () => setIsEditing(prev => !prev);

  return (
    <Modal title="메모" onClose={hideDialog} modalSize="lg">
      {!isEditing ? (
        <div className="flex flex-col">
          <span className="text-mainGray-active">
            {username}님에 대한 메모를 볼 수 있어요.
          </span>
          {typeof traineeMemo === 'string' || traineeMemo?.content === '' ? (
            <span className="mb-10 mt-6 min-h-32 text-mainGray-active">
              작성된 메모가 없어요.
            </span>
          ) : (
            <textarea
              defaultValue={traineeMemo?.content}
              className="mb-10 mt-6 min-h-32"
            />
          )}
          <SquareButton
            type="submit"
            name="수정하기"
            className="h-[50px] !min-w-[300px] self-end !rounded-xl"
            onClick={toggleEditing}
          />
        </div>
      ) : (
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(({ content }) => {
              if (content !== traineeMemo?.content) {
                changeTraineeMemo({
                  traineeId: userId,
                  content,
                });
              }
              return hideDialog();
            })}
            className="flex flex-col"
          >
            <Controller
              control={control}
              name="content"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                return (
                  <div className="mb-4 flex flex-col">
                    <textarea
                      className={`w-full resize-none rounded-xl border border-solid p-[15px] text-base focus:outline-none ${error ? 'border-[#FF3939]' : 'border-mainGray-active'}`}
                      placeholder="학생에 대한 메모를 작성해 주세요."
                      rows={8}
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
            <SquareButton
              type="submit"
              name="저장하기"
              color="mainGreen"
              className="h-[50px] !min-w-[300px] self-end !rounded-xl"
            />
          </form>
        </FormProvider>
      )}
    </Modal>
  );
}
