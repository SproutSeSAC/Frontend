import { FAQ } from '@/constants';
import { useDialogContext } from '@/hooks';

import Accordion from '@/components/common/Accordion';
import MembershipLeaveModal from '@/components/user/MembershipLeaveModal';

interface Props {
  faq: FAQ;
}

export default function Faq({ faq }: Props) {
  const { showDialog } = useDialogContext();

  return (
    <Accordion
      title={faq.title}
      className="border-l-[8px] border-[#ffe96f]"
      titleClassName="[&>h3]:text-lg [&>h3]:pl-4 [&>button]:p-5"
    >
      <p className="p-5 pl-4 pt-2 text-start text-base">{faq.body}</p>

      {faq.title.includes('탈퇴') && (
        <button
          type="button"
          onClick={async () => {
            await showDialog({
              key: 'MEMBERSHIP-LEAVE-TYPE',
              element: <MembershipLeaveModal />,
            });
          }}
          className="mx-5 mb-5 rounded-lg bg-lightGray-active px-4 py-2 text-base"
        >
          회원 탈퇴하기
        </button>
      )}
    </Accordion>
  );
}
