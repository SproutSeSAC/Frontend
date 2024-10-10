import { useCallback, useEffect, useState } from 'react';

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { PTYPE_PROJECT, PTYPE_STUDY } from '@/constants';
import { useDialogContext } from '@/hooks';
import { updateQueryParams } from '@/utils';

import TabNavigation from '@/components/common/TabNavigation';
import SquareButton from '@/components/common/button/SquareButton';

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
  const [temporaryTab, setTemporaryTab] = useState('');

  const location = useLocation();

  const { hideDialog, alert } = useDialogContext();

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
  }, [location.pathname]);

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

  const handleLeave = useCallback(() => {
    alert({
      showDim: true,
      className: 'z-30',
      text: '정말 나가시겠어요?',
      subText: '저장하지 않은 내용을 잃어버릴 수 있어요.',
      children: (
        <>
          <SquareButton
            color="gray"
            name="계속 작성하기"
            onClick={hideDialog}
            type="button"
            className="mt-6"
          />
          <SquareButton
            name="나가기"
            onClick={() => {
              hideDialog();
              tabChange(temporaryTab);
            }}
            type="button"
            className="mt-6"
          />
        </>
      ),
    });
  }, [alert, hideDialog, tabChange, temporaryTab]);

  const handelChangeValue = useCallback(
    (
      type: string,
      e?:
        | React.MouseEvent<HTMLLIElement, MouseEvent>
        | React.KeyboardEvent<HTMLLIElement>,
    ) => {
      if (location.pathname === '/lounge/editor') {
        e?.preventDefault();
        setTemporaryTab(type);
        handleLeave();
        return;
      }

      tabChange(type);
    },
    [handleLeave, location.pathname, tabChange],
  );

  return (
    <TabNavigation
      selectValue={tab}
      tabList={TAB_LIST}
      onChangeValue={(type, e) => handelChangeValue(type, e)}
      tabClassName="w-20"
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
    </TabNavigation>
  );
}
