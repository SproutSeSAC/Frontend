import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { usePostMeal } from '@/services/store/storeMutations';

import MealRecruitDateSelectBox from './MealRecruitDateSelectBox';
import {
  dateOptions,
  hours,
  minutes,
  recruitmentCountList,
} from './mealRecruitDropdownOptions';
import { mealRecruitSchema } from './mealRecruitSchema';

import { useDialogContext } from '@/hooks';
import { PostMeal } from '@/types/store/storeMealPostDto';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitErrorHandler, useForm } from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import ErrorMsg from '@/components/common/input/ErrorMsg';
import LabeledSection from '@/components/common/input/LabeledSection';
import TextInput from '@/components/common/input/TextInput';
import Modal from '@/components/common/modal/Modal';

const defaultStyle =
  'rounded-xl border border-solid border-gray2 px-6 py-[13px] text-lg';

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
  const { mutateAsync } = usePostMeal();

  const onSubmit = useCallback(
    async (data: FormValues) => {
      const newDate = data.date;

      newDate?.setHours(data.hourTime, data?.minuteTime || 0, 0, 0);

      const date = new Date(newDate || '');

      if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        showToast(`잘못된 날짜형식 : ${newDate}`);
        return;
      }

      const localDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000,
      );
      const formattedDate = localDate.toISOString().replace('Z', '');

      const params = {
        title: data.title,
        appointmentTime: formattedDate,
        meetingPlace: data.meetingPlace,
        memberCount: data.memberCount,
        storeName: data.storeName,
      };

      try {
        await mutateAsync(params);

        showToast('한끼팟을 생성했습니다.');

        queryClient.invalidateQueries({
          queryKey: ['useGetInfiniteMealPostList'],
        });
      } catch (err) {
        console.error(err);
        showToast('한끼팟을 생성하지 못했습니다.');
      }
    },
    [mutateAsync, queryClient, showToast],
  );

  const onError: SubmitErrorHandler<FormValues> = useCallback(
    err => {
      console.error('hook form error >>', {
        data: methods.getValues(),
        error: err,
      });
      const firstErrorMessage = Object.entries(err)?.[0]?.[1].message || '';

      if (firstErrorMessage) {
        showToast(firstErrorMessage);
      }
    },
    [methods, showToast],
  );

  return (
    <Modal
      className="p-[50px]"
      onToggleClick={() => hideDialog()}
      title={
        <>
          <div className="mb-4 text-2xl">한끼팟 만들기</div>
          <div className="mt-3 text-base font-normal text-gray2">
            다른 사람들의 이야기가 궁금한가요? 함께 식사할 사람을 찾아봐요!
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="relative mb-10 mt-4 grid grid-cols-2 gap-4 text-lg">
          <LabeledSection label="제목" className="col-span-2 gap-4">
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <div className="flex flex-col">
                    <TextInput
                      placeholder="한끼팟 제목을 작성해주세요"
                      className={`h-full ${defaultStyle} ${error && 'border-red-500'}`}
                      name="기술 스택"
                      onChange={onChange}
                    />

                    {error && (
                      <ErrorMsg msg={error?.message || ''} className="ml-2" />
                    )}
                  </div>
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
                    errorMas={error?.message || ''}
                    onChange={onChange}
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
                        selectBoxClassName="h-[50px] border-gray2 rounded-xl"
                        optionClassName="hover:bg-vividGreen3 text-gray1"
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
                        selectBoxClassName="h-[50px] border-gray2 rounded-xl"
                        optionClassName="hover:bg-vividGreen3 text-gray1"
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
                  <div className="flex flex-col">
                    <TextInput
                      placeholder="식당 이름을 작성해주세요"
                      className={`h-full ${defaultStyle} ${error && 'border-red-500'}`}
                      name="식당"
                      onChange={onChange}
                    />

                    {error && (
                      <ErrorMsg msg={error?.message || ''} className="ml-2" />
                    )}
                  </div>
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
                    selectBoxClassName="h-[50px] border-gray2 rounded-xl"
                    optionClassName="hover:bg-vividGreen3 justify-center text-gray1"
                  />
                );
              }}
            />
          </LabeledSection>
          <LabeledSection label="위치" className="col-span-2 gap-4">
            <Controller
              control={control}
              name="meetingPlace"
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <div className="flex flex-col">
                    <TextInput
                      placeholder="모일 위치를 작성해주세요"
                      className={`h-full ${defaultStyle} ${error && 'border-red-500'}`}
                      name="위치"
                      onChange={onChange}
                    />

                    {error && (
                      <ErrorMsg msg={error?.message || ''} className="ml-2" />
                    )}
                  </div>
                );
              }}
            />
          </LabeledSection>
        </div>

        <div className="flex justify-end">
          <SquareButton
            color="vividGreen"
            name="저장하기"
            type="submit"
            className="self-end"
          />
        </div>
      </form>
    </Modal>
  );
}
