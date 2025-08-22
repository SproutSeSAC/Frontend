import { ReactNode, useEffect } from 'react';

import { createPortal } from 'react-dom';

import { modalSizeObj } from '@/constants';
import { BsX } from 'react-icons/bs';

import Icon from '@/components/common/Icon';

/**
 * @param onToggleClick - 모달을 여는 함수
 * @param title - 모달 헤더 제목, 커스텀도 가능(옵셔널, 값이 없을 시 헤더가 없음)
 * @param headerType - 모달 헤더의 두가지 유형, 'title-xIcon'이 디폴트로 제목과 모달을 닫는 X 버튼, 'squareBackBtn' 타입은 제목과 Chevron left 버튼, 'onlyTitle'은 버튼없이 제목만.
 * @param children - 모달 body 내용물
 * @param hideClose - 모달을 닫는 함수
 */

type Modalsize = 'sm' | 'md' | 'lg';

type HeaderSize = 'base' | 'lg' | '2xl';

type ZIndex = 10 | 30 | 40 | 100 | 200;

interface Props {
  onClose: () => void;
  title?: string | ReactNode;
  children: ReactNode;
  modalSize?: Modalsize;
  headerSize?: HeaderSize;
  headerType?: 'title-xIcon' | 'squareBackBtn-title' | 'onlyTitle';
  zIndex?: ZIndex;
}

export default function Modal({
  onClose,
  title,
  children,
  modalSize = 'md',
  headerSize = '2xl',
  headerType = 'title-xIcon',
  zIndex = 40,
}: Props) {
  const el = document.getElementById('modal') as Element;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const headerSizeObj: { [key in HeaderSize]: string } = {
    base: 'text-base',
    lg: 'text-lg',
    '2xl': 'text-2xl',
  };

  /** NOTE: alert는 최상위에 위치해야하므로 z-[1001] */
  const zIndexObj: { [key in ZIndex]: { modal: string; overlay: string } } = {
    10: { modal: 'z-10', overlay: 'z-[9]' },
    30: { modal: 'z-30', overlay: 'z-[29]' },
    40: { modal: 'z-40', overlay: 'z-[39]' },
    100: { modal: 'z-[100]', overlay: 'z-[99]' },
    200: { modal: 'z-[200]', overlay: 'z-[199]' },
  };

  return createPortal(
    <>
      <section
        className={`fixed inset-0 m-auto h-fit max-h-[90vh] min-h-[180px] overflow-hidden rounded-2xl bg-white ${modalSizeObj[modalSize]} ${zIndexObj[zIndex].modal}`}
      >
        {title && (
          <header
            className={`mb-4 flex items-center justify-between ${headerSizeObj[headerSize]}`}
          >
            {headerType === 'title-xIcon' && (
              <>
                <h2 className="font-semibold">{title}</h2>
                <button type="button" aria-label="모달 닫기" onClick={onClose}>
                  <BsX size={34} />
                </button>
              </>
            )}

            {headerType === 'squareBackBtn-title' && (
              <>
                <button
                  type="button"
                  aria-label="접어두기"
                  className="flex aspect-square h-9 items-center justify-center rounded-lg border border-mainGray bg-white"
                  onClick={onClose}
                >
                  <Icon
                    name="ChevronLeft"
                    className="size-7 text-darkGray-active"
                  />
                </button>
                <h2 className="mr-10 w-full text-center font-semibold">
                  {title}
                </h2>
              </>
            )}

            {headerType === 'onlyTitle' && (
              <h2 className="font-semibold">{title}</h2>
            )}
          </header>
        )}

        <div className="max-h-[75vh] overflow-scroll scrollbar-hide">
          {children}
        </div>
      </section>

      {/* 오버레이 */}
      <div
        role="presentation"
        onKeyDown={e => {
          if (e.key === 'Escape') {
            onClose();
          }
        }}
        onClick={onClose}
        className={`fixed inset-0 h-[100vh] w-full bg-[rgba(43,43,43,0.6)] ${zIndexObj[zIndex].overlay}`}
      />
    </>,
    el,
  );
}
