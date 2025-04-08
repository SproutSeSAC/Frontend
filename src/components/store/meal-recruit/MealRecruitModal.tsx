import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { usePostMyPost } from '@/services/post/postMutation';

import { hours, minutes, recruitmentCountList } from '@/constants/optionList';
import { useDialogContext } from '@/hooks';
import { PostMeal } from '@/types/store/storeMealPostDto';
import { formatDate } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitErrorHandler, useForm } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import LabeledSection from '@/components/common/input/LabeledSection';
import TextInput from '@/components/common/input/TextInput';
import Modal from '@/components/common/modal/Modal';
import MealRecruitDateSelectBox from '@/components/store/meal-recruit/MealRecruitDateSelectBox';
import { dateOptions } from '@/components/store/meal-recruit/mealRecruitDropdownOptions';
import { mealRecruitSchema } from '@/components/store/meal-recruit/mealRecruitSchema';

const defaultStyle = 'h-full rounded-xl px-4 py-[13px] text-lg';

interface FormValues extends Omit<PostMeal, 'appointmentTime'> {
  date: Date | null;
  hourTime: number;
  minuteTime: number | null;
}

export default function MealRecruitModal() {
  const queryClient = useQueryClient();
  const { hideDialog, showToast } = useDialogContext();
  const methods = useForm<FormValues>({
    defaultValues: {
      title: '',
      date: null,
      hourTime: 0,
      minuteTime: null,
      storeName: '',
      memberCount: 0,
      meetingPlace: '',
    },
    resolver: zodResolver(mealRecruitSchema),
  });
  const { control, handleSubmit } = methods;

  const { mutateAsync: postMealRecruit, isPending, isIdle } = usePostMyPost();

  const onSubmit = useCallback(
    async (data: FormValues) => {
      const newDate = data.date;

      const date = new Date(newDate || '');

      if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        showToast(`잘못된 날짜형식 : ${newDate}`);
        return;
      }

      date.setHours(data.hourTime, data?.minuteTime || 0, 0, 0);

      const params = {
        title: data.title,
        appointmentTime: formatDate(date, "yyyy-MM-dd'T'HH:mm:ss"),
        meetingPlace: data.meetingPlace,
        memberCount: data.memberCount,
        storeName: data.storeName,
      };

      try {
        await postMealRecruit(params);

        showToast('한끼팟을 생성했습니다.');

        await queryClient.invalidateQueries({
          queryKey: ['useGetInfiniteMealPostList'],
        });

        hideDialog();
      } catch (err) {
        showToast('한끼팟을 생성하지 못했습니다.');
      }
    },
    [hideDialog, postMealRecruit, queryClient, showToast],
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
    <Modal onClose={hideDialog} title="한끼팟 만들기">
      <div className="mb-4 text-base font-normal text-mainGray-active">
        다른 사람들의 이야기가 궁금한가요? 함께 식사할 사람을 찾아봐요!
      </div>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col"
      >
        <div className="relative mb-10 mt-4 grid grid-cols-2 gap-4 text-lg">
          <LabeledSection label="제목" className="col-span-2">
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <TextInput
                    placeholder="한끼팟 제목을 작성해주세요"
                    className={defaultStyle}
                    name="한끼팟 제목"
                    onChange={onChange}
                    errorMsg={error?.message}
                  />
                );
              }}
            />
          </LabeledSection>

          <LabeledSection label="날짜">
            <Controller
              control={control}
              name="date"
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <MealRecruitDateSelectBox
                    dateOptions={dateOptions}
                    errorMsg={error?.message || ''}
                    onChange={date => onChange(date?.toLocaleDateString())}
                  />
                );
              }}
            />
          </LabeledSection>

          <LabeledSection label="시간">
            <div className="flex gap-1">
              <Controller
                control={control}
                name="hourTime"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => {
                  const selectedOption = hours.find(({ id }) => id === value);
                  return (
                    <div className="flex w-full flex-col">
                      <SingleSelectDropdown
                        defaultLabel="시"
                        options={hours}
                        selectedOption={selectedOption}
                        onChangeValue={data => onChange(data[0].id)}
                        errorMsg={error?.message}
                        selectBoxClassName="h-[50px] border-mainGray rounded-xl"
                        optionClassName="hover:bg-lightGreen-hover"
                      />
                    </div>
                  );
                }}
              />
              <Controller
                control={control}
                name="minuteTime"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => {
                  const selectedOption = minutes.find(({ id }) => id === value);

                  return (
                    <div className="flex w-full flex-col">
                      <SingleSelectDropdown
                        defaultLabel="분"
                        options={minutes}
                        selectedOption={selectedOption}
                        onChangeValue={data => onChange(data[0].id)}
                        errorMsg={error?.message}
                        selectBoxClassName="h-[50px] border-mainGray rounded-xl"
                        optionClassName="hover:bg-lightGreen-hover"
                      />
                    </div>
                  );
                }}
              />
            </div>
          </LabeledSection>
          <LabeledSection label="식당">
            <Controller
              control={control}
              name="storeName"
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <TextInput
                    placeholder="식당 이름을 작성해주세요"
                    className={defaultStyle}
                    name="식당"
                    onChange={onChange}
                    errorMsg={error?.message}
                  />
                );
              }}
            />
          </LabeledSection>
          <LabeledSection label="인원">
            <Controller
              control={control}
              name="memberCount"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                const selectedOption = recruitmentCountList.find(
                  ({ id }) => id === value,
                );

                return (
                  <SingleSelectDropdown
                    defaultLabel="모집 인원"
                    options={recruitmentCountList}
                    selectedOption={selectedOption}
                    onChangeValue={data => onChange(data[0].id)}
                    errorMsg={error?.message}
                    selectBoxClassName="h-[50px] border-mainGray rounded-xl"
                    optionClassName="hover:bg-lightGreen-hover justify-center"
                  />
                );
              }}
            />
          </LabeledSection>
          <LabeledSection label="모임장소" className="col-span-2">
            <Controller
              control={control}
              name="meetingPlace"
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <TextInput
                    placeholder="모일 장소를 작성해주세요"
                    className={defaultStyle}
                    name="만남 장소"
                    errorMsg={error?.message}
                    onChange={onChange}
                  />
                );
              }}
            />
          </LabeledSection>
        </div>

        <SquareButton
          name="저장하기"
          type="submit"
          className="cursor-pointer self-end"
          disabled={isPending || !isIdle}
        />
      </form>
    </Modal>
  );
}
