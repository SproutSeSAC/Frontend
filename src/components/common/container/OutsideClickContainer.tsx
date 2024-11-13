import { ReactNode, useEffect, useRef } from 'react';

interface OutsideClickContainerProps {
  children: ReactNode;
  onClose: (value: boolean) => void;
}

function OutsideClickContainer({
  onClose,
  children,
}: OutsideClickContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return <div ref={containerRef}>{children}</div>;
}

export default OutsideClickContainer;
