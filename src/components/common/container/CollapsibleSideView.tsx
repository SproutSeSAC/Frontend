import ChevronButton from '@/components/common/button/ChevronButton';

interface CollapsibleSideViewProps {
  sideViewOpen: boolean;
  onClose: () => void;
  headerContent: React.ReactNode;
  mainContent: React.ReactNode;
  className?: string;
  hideButton?: boolean;
}

export default function CollapsibleSideView({
  sideViewOpen,
  onClose,
  headerContent,
  mainContent,
  className,
  hideButton = false,
}: CollapsibleSideViewProps) {
  return (
    <section
      className={`z-10 flex flex-col transition-all duration-200 ease-in-out ${sideViewOpen ? 'w-full translate-x-0' : 'w-0 translate-x-full'} ${className}`}
    >
      {sideViewOpen && (
        <>
          <header className="flex justify-between pr-5 font-semibold text-mainGray-active">
            {!hideButton && (
              <ChevronButton direction="ChevronRight" handleClose={onClose} />
            )}

            {headerContent}
          </header>

          {mainContent}
        </>
      )}
    </section>
  );
}
