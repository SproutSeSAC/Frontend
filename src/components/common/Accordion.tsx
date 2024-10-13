import { ReactNode, useState } from 'react';

import { FaChevronDown } from 'react-icons/fa6';

interface AccordionProps {
  title: string;
  children: ReactNode;
  titleClassName?: string;
  className?: string;
  initialOpen?: boolean;
}

export default function Accordion({
  initialOpen,
  title,
  children,
  titleClassName = '',
  className = '',
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const toggleAccordion = () => setIsOpen(prev => !prev);

  return (
    <li className={`mb-2 rounded-md bg-white ${className}`}>
      <div className={`flex items-center justify-between ${titleClassName}`}>
        <h3 className="font-medium">{title}</h3>
        <button
          type="button"
          aria-label={isOpen ? '아코디언 접기' : '아코디언 펼치기'}
          onClick={toggleAccordion}
          className="h-full py-1 pl-2 pr-0.5"
        >
          <FaChevronDown
            className={`stroke-[0.5px] text-lg text-black transition-transform duration-300 ${
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
        {children}
      </div>
    </li>
  );
}
