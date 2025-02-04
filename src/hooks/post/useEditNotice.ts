import { useNavigate } from 'react-router-dom';

import { usePutMyPost } from '@/services/post/postMutation';

import { useDialogContext, useHandleImage } from '@/hooks';
import { NoticeDto } from '@/types';
import { findCurrNotice } from '@/utils';

import { Session } from '@/components/notice/form/ControllerSessions';

interface UseEditNoticeProps {
  postId: number;
  content?: string;
}

export const useEditNotice = ({
  postId,
  content: prevContent,
}: UseEditNoticeProps) => {
  const { alert, hideDialog } = useDialogContext();

  const navigate = useNavigate();

  const confirmBtn = {
    name: '확인',
    onClick: async () => {
      hideDialog();
      navigate(`/notice/post/${postId}`);
    },
  };

  const { mutateAsync: mutateEditedNotice } = usePutMyPost({
    onError: () => {
      alert({
        text: '공지사항 수정 중 오류가 발생했습니다.',
        subText: '다시 시도해주세요.',
        buttonList: [confirmBtn],
      });
    },
    onSuccess: async () => {
      alert({
        dimClick: false,
        text: '공지사항이 수정되었습니다!',
        buttonList: [confirmBtn],
      });
    },
  });

  const { handleImagesInHtmlContent } = useHandleImage();

  const onEditSubmit = async (submittedValue: NoticeDto.PostNotice) => {
    const {
      noticeType,
      title,
      content: newContent,
      targetCourseIdList,
      sessions, //
    } = submittedValue;

    const contentWithHandledImage = await handleImagesInHtmlContent(
      newContent,
      prevContent,
    );

    const needExtraInfoNoticeType = findCurrNotice(noticeType)?.needExtraInfo;

    if (needExtraInfoNoticeType) {
      const sessionsWithNoId = (sessions as Session[])?.map(
        ({ id, ...rest }) => rest,
      );
      const extraFormValue = {
        ...submittedValue,
        sessions: sessionsWithNoId,
        content: contentWithHandledImage,
      };
      mutateEditedNotice({ postId, params: extraFormValue });
    }

    if (!needExtraInfoNoticeType) {
      const formValue = {
        noticeType,
        title,
        content: contentWithHandledImage,
        targetCourseIdList,
      };
      mutateEditedNotice({ postId, params: formValue });
    }
  };
  return {
    onEditSubmit,
  };
};
