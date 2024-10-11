import { FAQ } from '@/constants/faq';

import Accordion from '@/components/common/Accordion';

interface Props {
  faq: FAQ;
}

export default function Faq({ faq }: Props) {
  return (
    <Accordion title={faq.title} titleClassName="text-lg p-5">
      <p className="px-5 pb-4 pt-0">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis optio
        provident possimus quibusdam. Quia voluptas ea iusto! Error, quae? Ipsam
        ea deserunt soluta molestiae error iusto a incidunt neque hic.
      </p>
    </Accordion>
  );
}
