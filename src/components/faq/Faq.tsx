import { useState } from 'react';

import { FAQ } from '@/constants/faq';
import { BsChevronDown } from 'react-icons/bs';

interface Props {
  faq: FAQ;
}

export default function Faq({ faq }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => setIsOpen(prev => !prev);

  return (
    <li
      style={{
        boxShadow: 'inset 2.83px 0 0px 0px #A9D4FF',
      }}
      className="mt-[15px] rounded-md bg-white pl-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="py-5 text-lg font-medium">{faq.title}</h3>
        <button
          type="button"
          aria-label={isOpen ? '아코디언 접기' : '아코디언 펼치기'}
          onClick={toggleAccordion}
          className="p-5"
        >
          <BsChevronDown
            className={`size-[18px] stroke-[0.5px] text-black transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          isOpen ? 'max-h-[1000px]' : 'max-h-0'
        }`}
      >
        <p className="pb-4 pr-5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis
          optio provident possimus quibusdam. Quia voluptas ea iusto! Error,
          quae? Ipsam ea deserunt soluta molestiae error iusto a incidunt neque
          hic.
        </p>
      </div>
    </li>
  );
}
