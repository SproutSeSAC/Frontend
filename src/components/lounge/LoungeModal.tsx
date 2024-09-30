import SquareButton from '../common/button/SquareButton';
import Label from '../common/input/Label';
import MultiInput from '../common/input/MultiInput';
import Modal from '../common/modal/Modal';

import { stackList } from '@/constants';

import MultiSelectDropdown from '@/components/common/dropdown/MultiSelectDropdown';

const TAB_LIST = [
  { text: '프론트엔드', type: 'frontend' },
  { text: '백엔드', type: 'backend' },
  { text: '모바일', type: 'mobile' },
  { text: '컴퓨터', type: 'computer' },
  { text: 'pm/ui/ux', type: 'pm' },
  { text: '데이터', type: 'data' },
  { text: '모두보기', type: 'all' },
];
const defaultInputStyle =
  'rounded-2xl border border-solid border-gray4 px-[15px] py-4 bg-white';

interface LoungeModalProps {
  toggleModal: () => void;
}

export default function LoungeModal({ toggleModal }: LoungeModalProps) {
  return (
    <Modal onToggleClick={toggleModal} title="참여하기">
      <form className="relative mt-3 flex w-[350px] flex-col">
        <Label htmlFor="기술 스택" />
        <MultiSelectDropdown
          label="기술스택"
          width="100%"
          tabList={TAB_LIST}
          defaultValue="frontend"
          className={`${defaultInputStyle} mb-6`}
          options={stackList}
          onChangeValue={data => {
            const newData = data.map(item => item.name);
            console.log(newData);
          }}
        />

        <Label htmlFor="참여직무" />
        <MultiInput
          className="mb-6 h-14 rounded-lg border border-solid border-gray3 bg-white px-3 py-1"
          onChangeValue={value => console.log('value22>>', value)}
          placeholder="참여직무를 선택해주세요."
        />

        <SquareButton name="저장하기" onClick={() => {}} className="self-end" />
      </form>
    </Modal>
  );
}
