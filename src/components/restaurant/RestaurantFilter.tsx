import { MdOutlineRefresh } from 'react-icons/md';

import Input from '@/components/common/Input';
import Checkbox from '@/components/common/checkbox/Checkbox';
import CheckboxGroup from '@/components/common/checkbox/CheckboxGroup';

export default function RestaurantFilter() {
  return (
    <form action="" className="flex w-[200px] flex-col gap-8">
      <div className="flex w-full justify-between">
        <h3 className="text-[#545B61]">Filter</h3>
        {/* TODO: 데이터 형식 확인한 후, 필터 초기화 기능 추가 */}
        <div className="flex items-center gap-2">
          <MdOutlineRefresh className="text-gray-400" />
          <span className="text-gray-600">Clear filters</span>
        </div>
      </div>

      <div>
        <h3 className="mb-[6px]">나의 위치 찾기</h3>
        <Input
          name="address"
          width="w-full"
          height="h-7"
          placeholder="지번, 도로명, 건물명으로 검색"
          size="small"
          onChange={() => {}}
        />
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
