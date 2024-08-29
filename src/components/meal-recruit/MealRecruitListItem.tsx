export default function MealRecruitListItem() {
  return (
    <div className="h-full w-full">
      <div className="rounded-lg bg-white px-5 py-4 shadow-[2px_4px_12px_0px_rgba(0,0,0,0.08)]">
        <header className="mb-4 font-semibold">
          [성북 2기] 햄버거 드실 분 모집합니다!
        </header>

        <div className="mb-8 flex flex-col gap-2 text-sm">
          <p>
            <span className="text-gray1">일정</span>
            <span className="text-gray1"> | </span>
            <span>2024.07.06 오후 1시</span>
          </p>
          <p>
            <span className="text-gray1">식당</span>
            <span className="text-gray1"> | </span>
            <span>롯데리아</span>
          </p>
          <p>
            <span className="text-gray1">위치</span>
            <span className="text-gray1"> | </span>
            <span>월곡역 1번 출구 앞</span>
          </p>
        </div>

        <footer className="flex items-center justify-between">
          <div className="size-10 rounded-full bg-gray3" />
          <div>
            <p>모집자 닉네임</p>
            <p className="text-sm text-gray1">2/4명</p>
          </div>
          <button
            className="rounded-3xl bg-vividGreen1 px-5 py-2 text-sm text-white"
            type="button"
          >
            참여하기
          </button>
        </footer>
      </div>
    </div>
  );
}
