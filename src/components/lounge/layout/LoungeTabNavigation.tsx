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
  const modifyProjectId = searchParams.get('modifyProject');
  const [tab, setTab] = useState('ALL');

  const location = useLocation();

  const { hideDialog, alert } = useDialogContext();

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

  const handleLeave = useCallback(
    (type: string) => {
      alert({
        text: '정말 나가시겠어요?',
        subText: '저장하지 않은 내용을 잃어버릴 수 있어요.',
        children: (
          <>
            <SquareButton
              color="gray"
              name="계속 작성하기"
              onClick={() => hideDialog()}
              type="button"
            />
            <SquareButton
              name="나가기"
              onClick={() => {
                if (modifyProjectId) {
                  searchParams.delete('modifyProject');
                }
                hideDialog();
                tabChange(type);
              }}
              type="button"
            />
          </>
        ),
      });
    },
    [alert, hideDialog, modifyProjectId, searchParams, tabChange],
  );

  const handelChangeValue = useCallback(
    (
      type: string,
      e?:
        | React.MouseEvent<HTMLLIElement, MouseEvent>
        | React.KeyboardEvent<HTMLLIElement>,
    ) => {
      if (location.pathname === '/lounge/editor') {
        e?.preventDefault();

        handleLeave(type);
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
      tabClassName=""
    >
      <div
        className={`box-border cursor-pointer justify-center whitespace-pre px-4 pb-[19px] ${location.pathname === '/lounge/editor' ? 'border-b-2 border-text' : 'text-gray2'}`}
      >
        <button
          type="button"
          onClick={() => {
            setTab('edit');
            if (!modifyProjectId) {
              navigate('/lounge/editor');
            }
          }}
        >
          {modifyProjectId ? '모집수정' : '모집하기'}
        </button>
      </div>
    </TabNavigation>
  );
}
