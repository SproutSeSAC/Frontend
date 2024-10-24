import { FAQ } from '@/constants/faq';
import { useDialogContext } from '@/hooks';

import Accordion from '@/components/common/Accordion';
import MembershipLeaveModal from '@/components/user/MembershipLeaveModal';

interface Props {
  faq: FAQ;
}

export default function Faq({ faq }: Props) {
  const { showDialog } = useDialogContext();

  return (
    <Accordion title={faq.title} titleClassName="text-lg p-5">
      <p className="px-5 pb-4 pt-0">
        {faq.body === '' ? (
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis optioprovident possimus quibusdam. Quia voluptas ea iusto! Error, quae? Ipsamea deserunt soluta molestiae error iusto a incidunt neque hic.'
        ) : (
          <button
            type="button"
            onClick={async () => {
              await showDialog({
                key: 'MEMBERSHIP-LEAVE-TYPE',
                element: <MembershipLeaveModal />,
              });
            }}
          >
            {faq.body}
          </button>
        )}
      </p>
    </Accordion>
  );
}
