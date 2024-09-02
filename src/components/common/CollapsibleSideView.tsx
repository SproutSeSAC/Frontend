interface CollapsibleSideViewProps {
  sideViewOpen: boolean;
  onClose: () => void;
  headerContent: React.ReactNode;
  mainContent: React.ReactNode;
}

export default function CollapsibleSideView({
  sideViewOpen,
  onClose,
  headerContent,
  mainContent,
}: CollapsibleSideViewProps) {
  return (
    <section
      className={`transtition-all sticky top-0 z-10 h-full duration-200 ease-in-out ${sideViewOpen ? 'w-[27%] translate-x-0' : 'w-0 translate-x-full'} mr-5 max-w-[284px] py-11`}
    >
      {sideViewOpen && (
        <header className="mb-10 mt-[50px] flex justify-between font-semibold text-gray2">
          <button type="button" className="mt-auto text-sm" onClick={onClose}>
            접어두기
          </button>

          {headerContent}
        </header>
      )}

      {mainContent}
    </section>
  );
}
