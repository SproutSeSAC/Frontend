import { progressDisplay } from '@/constants';
import { LoungeDto } from '@/types/lounge/loungeDto';
import { formatDate } from '@/utils';

import Tag from '@/components/common/tag/Tag';
import ContactMethodDetail from '@/components/lounge/detail/ContactMethodDetail';

export default function LoungeApplicationInfoTemplate({
  recruitmentStart,
  recruitmentEnd,
  recruitmentCount,
  position,
  contactMethod,
  contactDetail,
  meetingType,
  techStack,
}: Pick<
  LoungeDto.GetProjectDetail,
  | 'recruitmentStart'
  | 'recruitmentEnd'
  | 'recruitmentCount'
  | 'position'
  | 'contactMethod'
  | 'contactDetail'
  | 'meetingType'
  | 'techStack'
>) {
  const loungeApplicationInfo = [
    {
      type: '기간',
      data:
        recruitmentStart && recruitmentEnd
          ? `${formatDate(recruitmentStart)} ~ ${formatDate(recruitmentEnd)}`
          : '-',
    },
    {
      type: '모집',
      data: recruitmentCount,
    },
    {
      type: '직무',
      data: position && (
        <ul className="flex w-full flex-1 flex-wrap gap-1">
          {position?.map(({ id, name }) => (
            <Tag
              key={id}
              text={name}
              size="big"
              className="whitespace-nowrap rounded bg-black !px-2 !font-normal text-white"
            />
          ))}
        </ul>
      ),
    },
    {
      type: '스택',
      data: techStack && (
        <ul className="flex w-full flex-1 flex-wrap gap-1">
          {techStack.map(({ id, path, name }) => (
            <img key={id} src={path} alt={name} className="size-10" />
          ))}
        </ul>
      ),
    },
    {
      type: '유형',
      data: meetingType && progressDisplay[meetingType],
    },
    {
      type: '연락',
      data: contactMethod && (
        <ContactMethodDetail
          contactMethod={contactMethod}
          contactDetail={contactDetail}
        />
      ),
    },
  ] as const;

  return (
    <ul className="mt-4 grid list-none grid-cols-2 gap-5 rounded-lg bg-white p-4 px-5 py-6 shadow-card">
      {loungeApplicationInfo.map(({ type, data }) => (
        <li key={type} className="flex items-center gap-3 text-[22px]">
          <h4 className="border-r-solid border-r border-r-mainGray pr-3 text-mainGray">
            {type}
          </h4>
          {data}
        </li>
      ))}
    </ul>
  );
}
