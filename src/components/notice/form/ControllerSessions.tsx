import { defaultEndDateTime, defaultStartDateTime } from '@/constants';
import { hours, minutes } from '@/constants/optionList';
import { NoticeCategoryDisplayValue } from '@/types';
import { formatDate } from '@/utils';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';

import XButton from '@/components/common/button/XButton';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import CustomDatePicker from '@/components/common/input/CustomDatePicker';
import ErrorMsg from '@/components/common/input/ErrorMsg';
import LabeledSection from '@/components/common/input/LabeledSection';
import { SessionSchemaType } from '@/components/notice/form/NoticeFormSchema';

interface ControllerSessionsProps {
  noticeType: NoticeCategoryDisplayValue;
}

type SessionErrorMsg = {
  [key: number]: {
    sessionEndDateTime?: { message: string };
  };
};

export type Session = SessionSchemaType & { id: number };

export default function ControllerSessions({
  noticeType,
}: ControllerSessionsProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  console.log(errors);

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

                  const errorMsg = (error as SessionErrorMsg)?.[index]
                    ?.sessionEndDateTime?.message;

                  return (
                    <LabeledSection
                      key={id}
                      label={`${noticeType} ${sessionList.length === 1 ? '' : `${index + 1}회차`} 일시`}
                      className="grid grid-cols-2 rounded-lg p-2.5 hover:bg-mainGray"
                    >
                      {sessionList.length > 1 && (
                        <XButton
                          onDeleteClick={() => {
                            const filteredData = sessionList.filter(session => {
                              return session.id !== id;
                            });
                            onChange(filteredData);
                          }}
                          iconClassName="text-black !size-6"
                          className="flex justify-end pr-2"
                        />
                      )}

                      <div className="relative col-span-2 flex flex-col">
                        <div className="grid grid-cols-3 gap-x-2">
                          {/* 날짜 선택 */}
                          <CustomDatePicker
                            className={`col-span-1 h-[50px] ${errorMsg ? 'border-red-500' : ''}`}
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
                          />

                          <div className="col-span-2 grid grid-cols-[1fr_1fr_0.1fr_1fr_1fr] items-center gap-1.5">
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
                              selectBoxClassName={`!gap-1.5 w-full ${errorMsg ? 'border-red-500' : ''}`}
                              optionClassName="hover:bg-darkGreen-active text-darkGray-active"
                            />
                            <SingleSelectDropdown
                              defaultLabel="분"
                              options={minutes}
                              selectedOption={getCurrMin(
                                startDate.getMinutes(),
                              )}
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
                              selectBoxClassName={`!gap-1.5 w-full ${errorMsg ? 'border-red-500' : ''}`}
                              optionClassName="hover:bg-darkGreen-active text-darkGray-active"
                            />

                            <span className="text-center text-xl">~</span>

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
                              selectBoxClassName={`!gap-1.5 w-full ${errorMsg ? 'border-red-500' : ''}`}
                              optionClassName="hover:bg-darkGreen-active text-darkGray-active"
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
                              selectBoxClassName={`!gap-1.5 w-full ${errorMsg ? 'border-red-500' : ''}`}
                              optionClassName="hover:bg-darkGreen-active text-darkGray-active"
                            />
                          </div>
                        </div>

                        {errorMsg && (
                          <ErrorMsg msg={errorMsg} className="self-end pr-2" />
                        )}
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
                  className={`text-base ${sessionList.length >= 4 ? 'text-mainGray' : 'text-mainGreen'}`}
                />
                <span
                  className={`text-base font-semibold ${sessionList.length >= 4 ? 'text-mainGray' : 'text-mainGreen'}`}
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
