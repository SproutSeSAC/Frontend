export default function LoungeApplicationInfo() {
  return (
    <div className="mt-12">
      <div className="py-3px w-fit rounded-3xl bg-vividGreen1 px-[13px] text-lg text-white">
        # 프로젝트
      </div>
      <div className="mt-4 flex w-full gap-5 rounded-lg bg-white p-4 px-5 py-6 shadow-card">
        <div className="flex w-full flex-col gap-6">
          <div className="flex items-center gap-3 text-[22px]">
            <div className="border-r-solid border-r border-r-gray2 pr-3 text-gray2">
              기간
            </div>
            <div className="">2024.04.15 ~ 2024.06.27</div>
          </div>
          <div className="flex items-center gap-3 text-[22px]">
            <div className="border-r-solid border-r border-r-gray2 pr-3 text-gray2">
              모집
            </div>
            <div className="">3/5</div>
          </div>
          <div className="flex items-center gap-3 text-[22px]">
            <div className="border-r-solid border-r border-r-gray2 pr-3 text-gray2">
              직무
            </div>
            <div className="flex gap-1">
              <div className="rounded-sm bg-text px-1 py-0.5 text-white">
                프론트엔드
              </div>
              <div className="rounded-sm bg-text px-1 py-0.5 text-white">
                백엔드
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-6">
          <div className="flex items-center gap-3 text-[22px]">
            <div className="border-r-solid border-r border-r-gray2 pr-3 text-gray2">
              스택
            </div>
            <div className="">slack </div>
          </div>
          <div className="flex items-center gap-3 text-[22px]">
            <div className="border-r-solid border-r border-r-gray2 pr-3 text-gray2">
              유형
            </div>
            <div className="">온라인</div>
          </div>
          <div className="flex items-center gap-3 text-[22px]">
            <div className="border-r-solid border-r border-r-gray2 pr-3 text-gray2">
              연락
            </div>
            <div className="">오픈톡</div>
          </div>
        </div>
      </div>
    </div>
  );
}
