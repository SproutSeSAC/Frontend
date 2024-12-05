import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useDialogContext } from '@/hooks/useDialogContext';

import { usePostNotice } from '@/services/notice/noticeMutation';

import { noticeCategoryOptions } from '@/constants';
import { NoticeDto } from '@/types';
import { SubmitErrorHandler } from 'react-hook-form';

import { Session } from '@/components/notice/form/ControllerSessions';
import { NoticeCategoryKeySchemaType } from '@/components/notice/form/NoticeFormSchema';

export const useHandlePostNotice = () => {
  const { showToast, alert, hideDialog } = useDialogContext();

  const navigate = useNavigate();

  const { mutate } = usePostNotice({
    onError: () => {
      alert({
        text: '오류가 발생했습니다.',
        subText: '다시 시도해주세요.',
        buttonList: [
          {
            name: '확인',
            onClick: () => {
              hideDialog();
              navigate('/notice');
            },
          },
        ],
      });
    },
    onSuccess: () => {
      alert({
        text: '공지사항이 등록되었습니다!',
        buttonList: [
          {
            name: '확인',
            onClick: () => {
              hideDialog();
              navigate('/notice');
            },
          },
        ],
      });
    },
  });

  const onError: SubmitErrorHandler<NoticeDto.Post> = errors => {
    const firstErrorKey = Object?.keys(errors)?.[0] as keyof NoticeDto.Post;
    const firstErrorMsg = errors[firstErrorKey]?.message;
    if (firstErrorMsg) {
      showToast(firstErrorMsg);
    }
  };

  const findCurrNotice = useCallback((key: NoticeCategoryKeySchemaType) => {
    return noticeCategoryOptions.find(option => key === option.key);
  }, []);

  const onSubmit = async (submittedValue: NoticeDto.Post) => {
    const {
      noticeType,
      title,
      content,
      targetCourseIdList,
      satisfactionSurvey,
      sessions,
    } = submittedValue;

    const sessionsWithNoId = (sessions as Session[])?.map(
      ({ id, ...rest }) => rest,
    );

    if (noticeType === 'SPECIAL_LECTURE' || noticeType === 'EVENT') {
      const formValue = {
        ...submittedValue,
        satisfactionSurvey: satisfactionSurvey || '',
        sessions: sessionsWithNoId,
      };
      mutate(formValue);
    } else {
      const formValue = { noticeType, title, content, targetCourseIdList };
      mutate(formValue);
    }
  };

  // 캘린더 데이터에 등록하기

  return {
    onError,
    findCurrNotice,
    onSubmit,
  };
};
