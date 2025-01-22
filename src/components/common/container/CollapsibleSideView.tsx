import Icon from '@/components/common/Icon';

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
      className={`z-10 transition-all duration-200 ease-in-out ${sideViewOpen ? 'w-full translate-x-0' : 'w-0 translate-x-full'} ${className}`}
    >
      {sideViewOpen && (
        <header className="flex justify-between font-semibold text-mainGray">
          {!hideButton && (
            <button
              type="button"
              aria-label="접어두기"
              className="mb-10 mt-auto flex size-10 items-center justify-center rounded-lg bg-white text-sm text-mainGray"
              onClick={onClose}
            >
              <Icon name="ChevronRight" className="size-6 fill-darkerGray" />
            </button>
          )}

          {headerContent}
        </header>
      )}

      {mainContent}
    </section>
  );
}
