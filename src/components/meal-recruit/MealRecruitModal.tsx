import { useCallback, useMemo, useState } from 'react';

import SquareButton from '../common/button/SquareButton';
import OutsideClickContainer from '../common/container/OutsideClickContainer';
import SelectableDropdown from '../common/dropdown/SelectableDropdown';
import ErrorMsg from '../common/input/ErrorMsg';
import LabeledSection from '../common/input/LabeledSection';
import TextInput from '../common/input/TextInput';
import Modal from '../common/modal/Modal';

import { Controller, useForm } from 'react-hook-form';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

const defaultStyle =
  'rounded-xl border border-solid border-gray2 px-6 py-[13px] text-lg';

interface MealRecruitModalProps {
  toggleModal: () => void;
}
interface FormValues {
  title: string;
  date: string;
  time: string;
  store: string;
  personnel: number;
  place: string;
}

function DateOption({ name, date }: { name: string; date: string }) {
  return (
    <div className="flex items-center justify-between text-lg">
      <div className="font-semibold text-vividGreen1">{name}</div>
      <div className="text-gray1">{date}</div>
    </div>
  );
}

function CustomSelectBox({
  dateOptions,
  errorMas,
  onChange,
}: {
  dateOptions: {
    id: string;
    name: JSX.Element;
  }[];
  errorMas: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (...event: any[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<{
    id: string;
    name: JSX.Element;
  }>();

  const handleChangeValue = (option: { id: string; name: JSX.Element }) => {
    setOpen(false);
    setSelectedOptions(option);
    onChange(option.id);
  };

  return (
    <OutsideClickContainer onClose={setOpen} width="100%">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`relative flex w-full items-center gap-5 text-start ${selectedOptions ? 'text-text' : 'text-[#9ca3af]'} ${defaultStyle}`}
      >
        <span className="w-full">
          {selectedOptions?.id || '날짜를 선택해주세요'}
        </span>
        {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </button>

      {open && (
        <article
          className={`relative left-0 ${open ? 'block' : 'none'} z-20 w-full`}
        >
          <ul
            className={`absolute mt-1 w-full list-none ${open ? 'animate-slide-fade-in-dropdown overflow-auto' : 'animate-slide-fade-out-dropdown overflow-hidden'} } flex max-h-72 flex-col gap-[14px] rounded-2xl border border-solid border-gray2 bg-white px-3 py-[15px] shadow-card`}
          >
            {dateOptions.map(option => (
              <li
                key={option.id}
                className="w-full cursor-pointer px-4 py-[5px] hover:rounded-lg hover:bg-vividGreen3"
              >
                <button
                  type="button"
                  className="w-full text-start"
                  onClick={() => handleChangeValue(option)}
                >
                  {option.name}
                </button>
              </li>
            ))}
          </ul>
        </article>
      )}

      {errorMas && <ErrorMsg msg={errorMas || ''} className="ml-2" />}
    </OutsideClickContainer>
  );
}

export default function MealRecruitModal({
  toggleModal,
}: MealRecruitModalProps) {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      title: '',
      date: '',
      time: '',
      store: '',
      personnel: 0,
      place: '',
    },
  });

  const today = new Date();

  const formatDate = useCallback((date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    };
    return date.toLocaleDateString('ko-KR', options);
  }, []);

  const dateOptions = [
    {
      id: formatDate(today),
      name: DateOption({ name: '오늘', date: formatDate(today) }),
    },
    {
      id: formatDate(new Date(today.setDate(today.getDate() + 1))),
      name: DateOption({
        name: '내일',
        date: formatDate(new Date(today.setDate(today.getDate() + 1))),
      }),
    },
    {
      id: formatDate(new Date(today.setDate(today.getDate() + 2))),
      name: DateOption({
        name: '모레',
        date: formatDate(new Date(today.setDate(today.getDate() + 2))),
      }),
    },
  ];

  const recruitmentCountList = useMemo(() => {
    return Array.from({ length: 10 }, (_, index) => {
      if (index === 9) {
        return {
          id: index + 1,
          name: `${index + 1}명 이상`,
        };
      }
      return {
        id: index + 1,
        name: `${index + 1}명`,
      };
    });
  }, []);

  return (
    <Modal
      className="p-[50px]"
      onToggleClick={toggleModal}
      title={
        <>
          <div className="mb-4 text-2xl">한끼팟 만들기</div>
          <div className="mt-3 text-base font-normal text-gray2">
            다른 사람들의 이야기가 궁금한가요? 함께 식사할 사람을 찾아봐요!
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit(data => console.log(data))}>
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
                      className={`h-full ${defaultStyle}`}
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
                  <CustomSelectBox
                    dateOptions={dateOptions}
                    errorMas={error?.message || ''}
                    onChange={onChange}
                  />
                );
              }}
            />
          </LabeledSection>

          <LabeledSection label="시간">
            <Controller
              control={control}
              name="time"
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <div className="flex flex-col">
                    <TextInput
                      placeholder="시간"
                      className={`h-full ${defaultStyle}`}
                      name="시간"
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
          <LabeledSection label="식당">
            <Controller
              control={control}
              name="store"
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <div className="flex flex-col">
                    <TextInput
                      placeholder="식당 이름을 작성해주세요"
                      className={`h-full ${defaultStyle}`}
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
              name="personnel"
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <SelectableDropdown
                    label="모집 인원"
                    width="100%"
                    errorMsg={error?.message}
                    options={recruitmentCountList}
                    selectOptionBoxClassName="rounded-2xl border border-solid border-gray2 bg-white px-3 py-[15px] max-h-40"
                    selectOptionClassName="px-4 py-[5px] hover:rounded-lg hover:bg-vividGreen3"
                    selectBoxClassName={defaultStyle}
                    onChangeValue={data => onChange(data[0].name)}
                  />
                );
              }}
            />
          </LabeledSection>
          <LabeledSection label="위치" className="col-span-2 gap-4">
            <Controller
              control={control}
              name="place"
              render={({ field: { onChange }, fieldState: { error } }) => {
                return (
                  <div className="flex flex-col">
                    <TextInput
                      placeholder="모일 위치를 작성해주세요"
                      className={`h-full ${defaultStyle}`}
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
          <SquareButton name="저장하기" type="submit" className="self-end" />
        </div>
      </form>
    </Modal>
  );
}
