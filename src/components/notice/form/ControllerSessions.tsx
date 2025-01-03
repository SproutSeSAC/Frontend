import { defaultEndDateTime, defaultStartDateTime } from '@/constants';
import { hours, minutes } from '@/constants/optionList';
import { NoticeCategoryDisplayValue } from '@/types';
import { formatDate } from '@/utils';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';

import XButton from '@/components/common/button/XButton';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import CustomDatePicker from '@/components/common/input/CustomDatePicker';
import LabeledSection from '@/components/common/input/LabeledSection';
import { SessionSchemaType } from '@/components/notice/form/NoticeFormSchema';

interface ControllerSessionsProps {
  noticeType: NoticeCategoryDisplayValue;
}

type ErrorMsg = {
  [key: number]: {
    sessionEndDateTime?: { message: string };
  };
};

export type Session = SessionSchemaType & { id: number };

export default function ControllerSessions({
  noticeType,
}: ControllerSessionsProps) {
  const { control } = useFormContext();

  const sessionList: Session[] = useWatch({
    control,
    name: 'sessions',
  });

  return (
    <div className="col-span-2 mt-1 rounded-2xl border bg-[#eeeeee] p-3">
      <Controller
        control={control}
        name="sessions"
        render={({
          field: { onChange, value: currSessionList },
          fieldState: { error },
        }) => {
          const getCurrHour = (hour: number) =>
            hours.find(({ id }) => id === hour);

          const getCurrMin = (minute: number) =>
            minutes.find(({ id }) => id === minute);

          const changeSessionDate = (
            type: 'start' | 'end',
            date: number,
            index: number,
          ) => {
            const dateTime = formatDate(date, "yyyy-MM-dd'T'HH:mm:ss");

            const result = (currSessionList as SessionSchemaType[])?.map(
              (sessionItem, idx) => {
                if (index === idx) {
                  switch (type) {
                    case 'start':
                      return {
                        ...sessionItem,
                        sessionStartDateTime: dateTime,
                      };
                    case 'end':
                      return {
                        ...sessionItem,
                        sessionEndDateTime: dateTime,
                      };
                    default:
                      return sessionItem;
                  }
                } else {
                  return sessionItem;
                }
              },
            );
            return result;
          };

          return (
            <>
              {sessionList?.map(
                ({ id, sessionStartDateTime, sessionEndDateTime }, index) => {
                  const startDate = new Date(sessionStartDateTime);
                  const endDate = new Date(sessionEndDateTime);

                  const errorMsg = (error as ErrorMsg)?.[index]
                    ?.sessionEndDateTime?.message;

                  return (
                    <LabeledSection
                      key={id}
                      label={`${noticeType} ${sessionList.length === 1 ? '' : `${index + 1}회차`} 일시`}
                      className="col-span-2 mb-2 grid grid-cols-2 gap-x-8 gap-y-2 rounded-lg p-2.5 hover:bg-gray3"
                    >
                      {sessionList.length > 1 && (
                        <XButton
                          onDeleteClick={() => {
                            const filteredData = sessionList.filter(session => {
                              return session.id !== id;
                            });
                            onChange(filteredData);
                          }}
                          iconClassName="text-text !size-6"
                          className="flex justify-end pr-2"
                        />
                      )}

                      <div className="col-span-2 flex gap-4">
                        {/* 날짜 선택 */}
                        <CustomDatePicker
                          id={`${id}`}
                          currentDate={startDate || undefined}
                          onChange={data => {
                            if (data) {
                              const startHours = startDate.getHours();
                              const startMinutes = startDate.getMinutes();
                              const startDateTime = formatDate(
                                data.setHours(startHours, startMinutes, 0, 0),
                                "yyyy-MM-dd'T'HH:mm:ss",
                              );
                              const endHours = endDate.getHours();
                              const endMinutes = endDate.getMinutes();
                              const endDateTime = formatDate(
                                data.setHours(endHours, endMinutes, 0, 0),
                                "yyyy-MM-dd'T'HH:mm:ss",
                              );

                              const newValue = (
                                currSessionList as SessionSchemaType[]
                              )?.map((sessionItem, idx) =>
                                index === idx
                                  ? {
                                      ...sessionItem,
                                      sessionStartDateTime: startDateTime,
                                      sessionEndDateTime: endDateTime,
                                    }
                                  : sessionItem,
                              );
                              onChange(newValue);
                            }
                          }}
                          errorMsg={error?.message}
                        />

                        <div className="flex w-full items-center gap-1.5 [&>div]:w-full">
                          {/* 시작 시간 */}
                          <SingleSelectDropdown
                            defaultLabel="시"
                            options={hours}
                            selectedOption={getCurrHour(startDate.getHours())}
                            onChangeValue={data => {
                              const hour = data[0].id;
                              const startDateHour = startDate.setHours(hour);
                              const newValue = changeSessionDate(
                                'start',
                                startDateHour,
                                index,
                              );
                              onChange(newValue);
                            }}
                            errorMsg={errorMsg || undefined}
                            optionClassName="hover:bg-vividGreen3 text-gray1"
                          />
                          <SingleSelectDropdown
                            defaultLabel="분"
                            options={minutes}
                            selectedOption={getCurrMin(startDate.getMinutes())}
                            onChangeValue={data => {
                              const min = data[0].id;
                              const startDateMin = startDate.setMinutes(min);
                              const newValue = changeSessionDate(
                                'start',
                                startDateMin,
                                index,
                              );
                              onChange(newValue);
                            }}
                            errorMsg={errorMsg ? ' ' : undefined}
                            optionClassName="hover:bg-vividGreen3 text-gray1"
                          />
                          <span className="text-xl">~</span>

                          {/* 종료 시간 */}
                          <SingleSelectDropdown
                            defaultLabel="시"
                            options={hours}
                            selectedOption={getCurrHour(endDate.getHours())}
                            onChangeValue={data => {
                              const hour = data[0].id;
                              const endDateHour = endDate.setHours(hour);
                              const newValue = changeSessionDate(
                                'end',
                                endDateHour,
                                index,
                              );
                              onChange(newValue);
                            }}
                            errorMsg={errorMsg ? ' ' : undefined}
                            optionClassName="hover:bg-vividGreen3 text-gray1"
                          />
                          <SingleSelectDropdown
                            defaultLabel="분"
                            options={minutes}
                            selectedOption={getCurrMin(endDate.getMinutes())}
                            onChangeValue={data => {
                              const min = data[0].id;
                              const endDateMin = endDate.setMinutes(min);
                              const newValue = changeSessionDate(
                                'end',
                                endDateMin,
                                index,
                              );
                              onChange(newValue);
                            }}
                            errorMsg={errorMsg ? ' ' : undefined}
                            optionClassName="hover:bg-vividGreen3 text-gray1"
                          />
                        </div>
                      </div>
                    </LabeledSection>
                  );
                },
              )}

              <button
                type="button"
                className="flex items-center gap-2 rounded-md px-2.5 py-1.5"
                onClick={() => {
                  const maxId = currSessionList.reduce(
                    (max: number, item: { id: number }) =>
                      item.id > max ? item.id : max,
                    0,
                  );
                  const newSession = {
                    id: maxId + 1,
                    sessionStartDateTime: defaultStartDateTime,
                    sessionEndDateTime: defaultEndDateTime,
                  };
                  onChange([...currSessionList, newSession]);
                }}
                disabled={sessionList.length >= 4}
              >
                <FaPlus
                  className={`text-base ${sessionList.length >= 4 ? 'text-gray2' : 'text-oliveGreen1'}`}
                />
                <span
                  className={`text-base font-semibold ${sessionList.length >= 4 ? 'text-gray2' : 'text-oliveGreen1'}`}
                >
                  회차 정보 추가하기
                </span>
              </button>
            </>
          );
        }}
      />
    </div>
  );
}
