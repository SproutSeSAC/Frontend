import { useCallback, useEffect, useState } from 'react';

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { PTYPE_PROJECT, PTYPE_STUDY } from '@/constants';
import { useToggleModal } from '@/hooks';
import { updateQueryParams } from '@/utils';

import TabNavigation from '@/components/common/TabNavigation';
import SquareButton from '@/components/common/button/SquareButton';
import Alert from '@/components/common/modal/Alert';

const TAB_LIST = [
  { text: '전체', type: 'ALL' },
  { text: '프로젝트', type: PTYPE_PROJECT },
  { text: '스터디', type: PTYPE_STUDY },
  { text: '찜 모아보기', type: 'onlyScraped' },
];

export default function LoungeTabNavigation() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState('ALL');
  const location = useLocation();

  const { modalOpen, toggleModal } = useToggleModal();

  useEffect(() => {
    if (tab === 'ALL') {
      setSearchParams('', { replace: true });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (location.pathname === '/lounge/editor') {
      setTab('edit');
    }
  }, [location.pathname, tab]);

  const tabChange = useCallback(
    (type: string) => {
      navigate(`/lounge`, {
        replace: true,
      });
      setTab(type);
      updateQueryParams(searchParams, setSearchParams, 'pType', type);
    },
    [navigate, searchParams, setSearchParams],
  );

  const handelChangeValue = useCallback(
    (
      type: string,
      e?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ):
      | { confirmNavigation: () => void; cancelNavigation: () => void }
      | undefined => {
      if (location.pathname === '/lounge/editor') {
        e?.preventDefault();
        toggleModal();

        const confirmNavigation = () => {
          toggleModal();
          tabChange(type);
        };

        const cancelNavigation = () => {
          toggleModal();
        };

        return { confirmNavigation, cancelNavigation };
      }

      tabChange(type);
      return undefined;
    },
    [location.pathname, tabChange, toggleModal],
  );

  return (
    <TabNavigation
      selectValue={tab}
      tabList={TAB_LIST}
      onChangeValue={(type, e) => handelChangeValue(type, e)}
    >
      <div
        className={`box-border w-20 cursor-pointer justify-center pb-[19px] ${location.pathname === '/lounge/editor' ? 'border-b-2 border-text' : 'text-gray2'}`}
      >
        <button
          type="button"
          onClick={() => {
            setTab('edit');
            navigate('/lounge/editor');
          }}
        >
          모집하기
        </button>
      </div>
      {modalOpen && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
          onClick={toggleModal}
          onKeyDown={event => {
            if (event.key === 'Escape') {
              toggleModal();
            }
          }}
          tabIndex={-1}
          role="button"
          aria-label="모달 닫기"
        >
          <Alert
            className="z-30"
            text="정말 나가시겠어요?"
            subText="저장하지 않은 내용을 잃어버릴 수 있어요."
          >
            <SquareButton
              color="gray"
              name="계속 작성하기"
              onClick={toggleModal}
              type="button"
              className="mt-6"
            />
            <SquareButton
              name="나가기"
              onClick={() => {
                navigate(`/lounge`);
                toggleModal();
              }}
              type="button"
              className="mt-6"
            />
          </Alert>
        </div>
      )}
    </TabNavigation>
  );
}
