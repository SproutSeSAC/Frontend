import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import SideView from '@/layouts/SideView';

import SquareButton from '@/components/common/button/SquareButton';
import LoungeSideView from '@/components/lounge/layout/LoungeSideView';
import LoungeTabNavigation from '@/components/lounge/layout/LoungeTabNavigation';

export default function LoungeLayout() {
  const { pathname } = useLocation();

  const [searchParams] = useSearchParams();
  const modifyProjectId = searchParams.get('modifyProject');
  const currPType = searchParams.get('pType');

  const navigate = useNavigate();

  const navigateEditingPage = () => {
    if (modifyProjectId) return;
    navigate('/lounge?pType=EDIT');
  };

  const editType = modifyProjectId ? '프로젝트 수정' : '프로젝트 등록';

  const highlight = !modifyProjectId ? '프로젝트' : undefined;

  return (
    <>
      <MainView>
        <Header
          title={currPType ? editType : '나에게 딱 맞는 프로젝트를 만나보세요!'}
          highlight={highlight}
        />
        {!pathname.includes('/lounge/post') && currPType !== 'EDIT' && (
          <LoungeTabNavigation />
        )}
        <Outlet />
      </MainView>
      <SideView>
        <LoungeSideView />
        <SquareButton
          color="mainGreen"
          type="button"
          name={modifyProjectId ? '모집수정' : '모집하기'}
          className="mt-4 w-full !py-3 font-semibold"
          onClick={navigateEditingPage}
        />
      </SideView>
    </>
  );
}
