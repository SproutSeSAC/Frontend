export default function ThisMonthOfMealPriceChart() {
  return (
    <div className="my-6 h-[216px] rounded-2xl bg-white px-6 py-5">
      <header className="flex justify-between">
        <h2 className="font-semibold">이번달 식대 금액</h2>
        <div className="flex items-center">
          <span className="pr-1.5 text-xs font-semibold tracking-tight text-gray1">
            8월
          </span>
          <span className="pr-0.5 text-sm font-semibold tracking-tight text-oliveGreen1">
            240,320
          </span>
          <span className="text-xs font-semibold text-oliveGreen1">원</span>
        </div>
      </header>
    </div>
  );
}
