import { MdOutlineRefresh } from 'react-icons/md';

import Checkbox from '@/components/common/checkbox/Checkbox';
import CheckboxGroup from '@/components/common/checkbox/CheckboxGroup';

export default function StoreFilterForm() {
  return (
    <form action="" className="flex w-[200px] flex-shrink-0 flex-col gap-8">
      <div className="flex w-full justify-between">
        <h3 className="text-[#545B61]">Filter</h3>
        {/* TODO: 데이터 형식 확인한 후, 필터 초기화 기능 추가 */}
        <div className="flex items-center gap-2">
          <MdOutlineRefresh className="text-gray-400" />
          <span className="text-xs text-gray1">Clear filters</span>
        </div>
      </div>

      <div>
        <h3 className="mb-[6px]">나의 위치 찾기</h3>
        {/* TODO: 추후 API 명세에 따라 value값 추가 */}
        <select name="campus" className="px-3 py-1">
          <option value="">강북캠퍼스</option>
          <option value="">도봉캠퍼스</option>
          <option value="">동대문캠퍼스</option>
          <option value="">성북캠퍼스</option>
        </select>
      </div>

      {/* TODO: 추후 데이터 받아올 시, 반복문으로 구현 */}
      <CheckboxGroup title="새싹">
        <Checkbox name="제로페이" text="제로페이" count={20} />
        <Checkbox name="만원이하" text="만원이하" count={20} />
        <Checkbox name="5인 이상" text="5인 이상" count={50} />
        <Checkbox name="도보 5분 이내" text="도보 5분 이내" count={5} />
      </CheckboxGroup>

      <CheckboxGroup title="메뉴별">
        <Checkbox name="한식" text="한식" count={200} />
        <Checkbox name="양식" text="양식" count={15} />
        <Checkbox name="중식" text="중식" count={3} />
        <Checkbox name="일식" text="일식" count={41} />
        <Checkbox name="샐러드" text="샐러드" count={20} />
        <Checkbox name="패스트푸드" text="패스트푸드" count={200} />
      </CheckboxGroup>
    </form>
  );
}
