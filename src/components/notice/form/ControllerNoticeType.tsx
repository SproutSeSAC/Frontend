import {
  noticeCategoryListOfForm,
  specialLectureEventFormValues,
} from '@/constants';
import { NoticeCategoryDisplayKey } from '@/types';
import { findCurrNotice } from '@/utils';
import { Controller, useFormContext } from 'react-hook-form';

import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';

export default function ControllerNoticeType() {
  const { control, getValues, reset } = useFormContext();

  const setConditionalKey = (type: NoticeCategoryDisplayKey) => {
    if (findCurrNotice(type)?.needExtraInfo) {
      reset({ ...specialLectureEventFormValues, ...getValues() });
    } else {
      const {
        noticeType: noticeTypeValue,
        title: titleValue,
        content: contentValue,
        targetCourseIdList: targetCourseValue,
      } = getValues();
      reset({
        noticeType: noticeTypeValue,
        title: titleValue,
        content: contentValue,
        targetCourseIdList: targetCourseValue,
      });
    }
  };

  return (
    <Controller
      control={control}
      name="noticeType"
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedOption = findCurrNotice(value);

        return (
          <SingleSelectDropdown
            defaultLabel="일반공지, 특강, 취업정보 ..."
            options={noticeCategoryListOfForm}
            selectedOption={selectedOption}
            onChangeValue={data => {
              const newNoticeKey = data[0].key as NoticeCategoryDisplayKey;
              onChange(newNoticeKey);
              setConditionalKey(newNoticeKey);
            }}
            errorMsg={error?.message}
          />
        );
      }}
    />
  );
}
