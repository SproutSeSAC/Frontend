import MealRecruitList from '@/components/meal-recruit/MealRecruitList';

interface MealRecruitSideViewProps {
  sideViewOpen: boolean;
  setSideViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MealRecruitSideView({
  sideViewOpen,
  setSideViewOpen,
}: MealRecruitSideViewProps) {
  return (
    <section
      className={`transtition-all z-10 h-full duration-200 ease-in-out ${sideViewOpen ? 'w-[27%] translate-x-0' : 'w-0 translate-x-full'} mr-5 max-w-[284px] py-11`}
    >
      {sideViewOpen && (
        <header className="mb-10 mt-[50px] flex justify-between font-semibold text-gray2">
          <button
            type="button"
            className="mt-auto text-sm"
            onClick={() => setSideViewOpen(false)}
          >
            접어두기
          </button>

          <span className="text-[27px]">
            <span>오늘의 </span>
            <span className="text-vividGreen1">한끼팟!</span>
          </span>
        </header>
      )}

      <MealRecruitList />
    </section>
  );
}
