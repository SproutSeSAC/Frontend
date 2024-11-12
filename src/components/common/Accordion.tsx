import { ReactNode, useState } from 'react';

import { FaChevronDown } from 'react-icons/fa6';
import { FiInfo } from 'react-icons/fi';

interface AccordionProps {
  title: string;
  children: ReactNode;
  titleClassName?: string;
  className?: string;
  initialOpen?: boolean;
  tooltip?: string;
}

export default function Accordion({
  initialOpen,
  title,
  children,
  titleClassName = '',
  className = '',
  tooltip,
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
          className="h-full px-1"
        >
          {tooltip ? (
            <p className="group text-[15px] text-gray2">
              <FiInfo className="mb-1 inline size-3.5" />
              <span className="absolute z-40 ml-2 mt-2 hidden rounded-xl rounded-tl-none border bg-white px-4 py-2 group-hover:inline">
                {tooltip}
              </span>
            </p>
          ) : (
            <FaChevronDown
              className={`text-lg text-black transition-transform duration-300 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          )}
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
