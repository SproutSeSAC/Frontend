import { useCallback, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  initialUserProfile,
  useGetUserProfile,
} from '@/services/auth/authQueries';

import { defaultNoticeFormValues, noticeCategoryOptions } from '@/constants';
import { useDialogContext, usePageBlocker } from '@/hooks';
import {
  NoticeCategoryKey,
  NoticeDto,
  SpecialLectureOrEventValue,
} from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Controller,
  FormProvider,
  SubmitErrorHandler,
  useForm,
  useWatch,
} from 'react-hook-form';

import CircleNumber from '@/components/common/CircleNumber';
import Title from '@/components/common/Title';
import SquareButton from '@/components/common/button/SquareButton';
import MultiSelectDropdown from '@/components/common/dropdown/MultiSelectDropdown';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import LabeledSection from '@/components/common/input/LabeledSection';
import ControllerContentEditor from '@/components/common/text-editor/ControllerContentEditor';
import ExtraInfoForm from '@/components/notice/form/ExtraInfoForm';
import { NoticeFormSchema } from '@/components/notice/form/NoticeFormSchema';

export default function NoticeForm() {
  const methods = useForm<NoticeDto.PostRequest>({
    defaultValues: defaultNoticeFormValues,
    resolver: zodResolver(NoticeFormSchema),
  });

  const {
    handleSubmit,
    control,
    formState: { isDirty },
  } = methods;

  const { data: userProfile = initialUserProfile } = useGetUserProfile();

  const { hideDialog, alert, showToast } = useDialogContext();

  const navigate = useNavigate();

  const { blocker } = usePageBlocker({
    isBlockRefresh: true,
    form: { isDirty },
  });

  useEffect(() => {
    if (blocker.state === 'blocked') {
      alert({
        text: '정말 나가시겠어요?',
        subText: '저장하지 않은 내용을 잃어버릴 수 있어요.',
        children: (
          <>
            <SquareButton
              color="gray"
              name="계속 작성하기"
              onClick={() => {
                hideDialog();
                if (blocker.state === 'blocked') {
                  blocker.reset();
                }
              }}
            />
            <SquareButton
              name="나가기"
              onClick={() => {
                hideDialog();
                if (blocker.state === 'blocked') {
                  blocker.proceed();
                }
              }}
            />
          </>
        ),
      });
    }
  }, [alert, blocker, blocker.state, hideDialog]);

  const onError: SubmitErrorHandler<NoticeDto.PostRequest> = errors => {
    const firstErrorKey = Object?.keys(
      errors,
    )?.[0] as keyof NoticeDto.PostRequest;
    const firstErrorMsg = errors[firstErrorKey]?.message;

    if (firstErrorMsg) {
      showToast(firstErrorMsg);
    }
  };

  const noticeKey = useWatch({ control, name: 'noticeType' });

  const findCurrNotice = useCallback((key: NoticeCategoryKey) => {
    return noticeCategoryOptions.find(option => key === option.key);
  }, []);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(() => {}, onError)} className="mt-[26px]">
        <section>
          <header className="mb-6 flex items-center gap-1.5">
            <CircleNumber number={1} />
            <Title as="h1" title="공지사항 대상 과정" />
          </header>
          <div className="relative mb-16 mt-6 grid grid-cols-2 gap-8 text-lg">
            <Controller
              control={control}
              name="targetCourseIdList"
              render={({ field: { onChange }, fieldState: { error } }) => {
                const courseListOption = userProfile?.courseList.map(
                  ({ courseId, courseTitle }) => ({
                    id: courseId,
                    name: courseTitle,
                  }),
                );

                return (
                  <MultiSelectDropdown
                    defaultLabel="교육과정을 선택해주세요."
                    options={courseListOption}
                    onChangeValue={data => {
                      const ids = data.map(({ id }) => id);
                      onChange(ids);
                    }}
                    errorMsg={error?.message}
                    hasFullCheck
                  />
                );
              }}
            />
          </div>
        </section>

        <section>
          <header className="flex items-center gap-1.5">
            <CircleNumber number={2} />
            <Title as="h1" title="공지사항 상세 정보" />
          </header>

          <div className="relative mb-16 mt-8 grid grid-cols-2 gap-8 text-lg">
            <LabeledSection label="공지 유형">
              <Controller
                control={control}
                name="noticeType"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => {
                  const selectedOption = findCurrNotice(value);

                  return (
                    <SingleSelectDropdown
                      defaultLabel="일반공지, 특강, 취업정보 ..."
                      options={noticeCategoryOptions}
                      selectedOption={selectedOption}
                      onChangeValue={data => onChange(data[0].key)}
                      errorMsg={error?.message}
                    />
                  );
                }}
              />
            </LabeledSection>

            {findCurrNotice(noticeKey)?.needExtraInfo && (
              <ExtraInfoForm
                noticeType={
                  findCurrNotice(noticeKey)?.name as SpecialLectureOrEventValue
                }
              />
            )}
          </div>
        </section>

        {/* 에디터  */}
        <section>
          <header className="mt-12 flex items-center gap-1.5">
            <CircleNumber
              number={findCurrNotice(noticeKey)?.needExtraInfo ? 3 : 2}
            />
            <Title as="h1" title="공지사항 상세 내용" />
          </header>

          <ControllerContentEditor type="notice" />

          <div className="mt-8 flex w-full items-center justify-end gap-4 text-end">
            <SquareButton
              name="취소"
              color="gray"
              type="button"
              onClick={() => navigate('/notice')}
            />
            <SquareButton name="등록하기" type="submit" />
          </div>
        </section>
      </form>
    </FormProvider>
  );
}
