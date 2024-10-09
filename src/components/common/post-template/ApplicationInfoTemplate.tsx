import { dateFormat } from '@/utils/dateFormat';

import {
  CONTACT_METHOD_EMAIL,
  CONTACT_METHOD_MESSENGER,
  ContactMethodType,
  Progress,
  contactMethodDisplay,
  progressDisplay,
} from '@/constants';
import { BsCopy, BsLink45Deg } from 'react-icons/bs';

interface LoungeApplicationInfoProps {
  startPeriod?: string;
  endPeriod?: string;
  personRecruited?: number;
  positionNames?: string[];
  contactMethod?: ContactMethodType;
  contactDetail?: string;
  meetingType?: Progress;
}
const commonContactMethodStyle =
  'decoration-gray-1 underline decoration-solid decoration-0 flex gap-1 item-center';

export default function ApplicationInfoTemplate({
  startPeriod,
  endPeriod,
  personRecruited,
  positionNames,
  contactMethod,
  contactDetail,
  meetingType,
}: LoungeApplicationInfoProps) {
  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(contactDetail || '')
      .then(() => {
        alert(
          `${contactMethod === CONTACT_METHOD_EMAIL ? '이메일 주소' : '연락처'}가 복사되었습니다!`,
        );
      })
      .catch(err => {
        alert('복사에 실패했습니다.');
        console.error('복사 실패:', err);
      });
  };
  return (
    <div>
      <div className="mt-4 flex w-full gap-5 rounded-lg bg-white p-4 px-5 py-6 shadow-card">
        <div className="flex w-1/2 flex-col gap-6">
          <div className="flex items-center gap-3 text-[22px]">
            <div className="border-r-solid border-r border-r-gray2 pr-3 text-gray2">
              기간
            </div>
            <div className="">
              {startPeriod && endPeriod
                ? ` ${dateFormat(startPeriod)} ~ ${dateFormat(endPeriod)}`
                : '-'}
            </div>
          </div>
          <div className="flex items-center gap-3 text-[22px]">
            <div className="border-r-solid border-r border-r-gray2 pr-3 text-gray2">
              모집
            </div>
            <div className="">{personRecruited || 0}</div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[22px]">
            <div className="border-r-solid border-r border-r-gray2 pr-3 text-gray2">
              직무
            </div>
            <ul className="flex w-full flex-1 gap-1 overflow-hidden">
              {(positionNames || []).map(item => (
                <li
                  key={item}
                  className="whitespace-nowrap rounded-sm bg-text px-1 py-0.5 text-white"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex w-1/2 flex-col gap-6">
          <div className="flex items-center gap-3 text-[22px]">
            <div className="border-r-solid border-r border-r-gray2 pr-3 text-gray2">
              스택
            </div>
            <div className="">slack </div>
          </div>
          <div className="flex items-center gap-3 text-[22px]">
            <div className="border-r-solid border-r border-r-gray2 pr-3 text-gray2">
              유형
            </div>
            <div className="">
              {meetingType ? progressDisplay[meetingType] : '-'}
            </div>
          </div>
          <div className="flex items-center gap-3 text-[22px]">
            <div className="border-r-solid border-r border-r-gray2 pr-3 text-gray2">
              연락
            </div>
            <div>
              {contactMethod === CONTACT_METHOD_MESSENGER ? (
                <div className={commonContactMethodStyle}>
                  <a href={contactDetail}>
                    {contactMethod ? contactMethodDisplay[contactMethod] : '-'}
                  </a>
                  <BsLink45Deg size={22} className="mt-1" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleCopyClick}
                  className={commonContactMethodStyle}
                >
                  {contactMethod ? contactMethodDisplay[contactMethod] : '-'}
                  <BsCopy className="ml-1 mt-1" size={22} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
