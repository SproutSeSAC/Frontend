import { useQueryClient } from '@tanstack/react-query';

import { useDeleteAppliedSession } from '@/services/session/sessionsMutations';

import { rolesObj } from '@/constants';
import { useDialogContext } from '@/hooks';
import { AppliedSession } from '@/types';
import { formatDate } from '@/utils';
import { BsCalendar, BsClock } from 'react-icons/bs';

import SquareButton from '@/components/common/button/SquareButton';
import Modal from '@/components/common/modal/Modal';
import Tag from '@/components/common/tag/Tag';

interface AppliedSessionCancelModalProps {
  session: AppliedSession;
}

export default function AppliedSessionCancelModal({
  session,
}: AppliedSessionCancelModalProps) {
  const {
    sessionId,
    ordinal,
    role,
    participantId,
    startDateTime,
    endDateTime,
    title,
  } = session;

  const queryClient = useQueryClient();

  const { hideDialog, showToast } = useDialogContext();

  const { mutateAsync, isPending } = useDeleteAppliedSession({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['useGetAppliedSessionList'],
      });
    },
  });

  return (
    <Modal
      title="특강 / 행사 신청 취소"
      onToggleClick={hideDialog}
      className="p-12"
    >
      <div className="mb-3 mt-7 flex items-start justify-center gap-1.5">
        <Tag size="medium" text={rolesObj[role]} roleKey={role} />
        <Tag size="medium" text={`${ordinal}회차`} color="grayLight" />
        <span className="mt-0.5 max-w-[330px]">{title}</span>
      </div>

      <div className="mb-10 flex items-center justify-center gap-1">
        <BsCalendar size={15} className="text-darkGray" />
        <span>{formatDate(startDateTime, 'yyyy.MM.dd')}</span>{' '}
        <BsClock size={15} className="ml-2 text-darkGray" />
        <span className="tracking-tighter">
          {formatDate(startDateTime, 'a h시 mm분')} ~{' '}
          {formatDate(endDateTime, 'a h시 mm분')}
        </span>
      </div>

      <div className="flex justify-center gap-4">
        <SquareButton name="닫기" color="gray" onClick={hideDialog} />
        <SquareButton
          name="취소하기"
          onClick={async () => {
            try {
              await mutateAsync({ sessionId, participantId });
              showToast('특강/행사가 취소되었습니다!');
            } catch (error) {
              showToast('예기치 못한 에러가 발생했습니다!');
            } finally {
              await hideDialog();
            }
          }}
          disabled={isPending}
        />
      </div>
    </Modal>
  );
}
