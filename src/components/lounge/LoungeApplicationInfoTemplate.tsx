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
  | 'ptype'
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
          {position
            ?.sort((a, b) => a.name.localeCompare(b.name))
            .map(({ id, name }) => (
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
        <ul className="flex w-full flex-1 flex-wrap gap-2">
          {techStack
            ?.sort((a, b) => a.jobName.localeCompare(b.jobName))
            ?.sort((a, b) => a.name.localeCompare(b.name))
            .map(({ id, path, name }) => (
              <img key={id} src={path} alt={name} className="size-7" />
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
    <ul className="grid list-none grid-cols-2 gap-x-4 gap-y-3 rounded-[20px] bg-white p-7">
      {loungeApplicationInfo.map(({ type, data }) => (
        <li key={type} className="flex items-center gap-2.5 text-xl">
          <h4 className="min-w-12 border-r-2 leading-[23px] tracking-tighter text-mainGray-active">
            {type}
          </h4>

          {data}
        </li>
      ))}
    </ul>
  );
}
