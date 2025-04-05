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
              color="black"
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
          {techStack
            ?.sort((a, b) => a.jobName.localeCompare(b.jobName))
            ?.sort((a, b) => a.name.localeCompare(b.name))
            .map(({ id, path, name }) => (
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
    <ul className="mt-4 grid list-none grid-cols-2 gap-5 rounded-[20px] bg-white p-4 px-5 py-6">
      {loungeApplicationInfo.map(({ type, data }) => (
        <li key={type} className="flex items-center gap-3 text-[22px]">
          <h4 className="min-w-10 text-mainGray-active">{type}</h4>
          <span className="mx-2 text-mainGray-active">|</span>
          {data}
        </li>
      ))}
    </ul>
  );
}
