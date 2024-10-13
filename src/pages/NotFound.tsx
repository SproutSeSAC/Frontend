import { useNavigate } from 'react-router-dom';

import MainView from '@/layouts/MainView';

import SquareButton from '@/components/common/button/SquareButton';

export default function NotFound() {
  const navigate = useNavigate();

  const onGoHomeClick = () => navigate('/');

  return (
    <MainView isEmpty>
      <img
        src="src/assets/images/404.png"
        alt="존재하지 않는 페이지"
        className="mb-[1%] h-[50%] max-h-[290px] object-cover"
      />

      <h2 className="mb-[1%] text-[40px] font-semibold">
        찾으시는 페이지가 없습니다.
      </h2>
      <p className="text-lg">
        잘못된 접근이거나 요청하신 페이지를 찾을 수 없습니다.
      </p>
      <p className="text-lg">
        입력하신 페이지의 주소가 정확한지 다시 한번 확인해 주시기 바랍니다.
      </p>

      <SquareButton
        name="홈으로"
        onClick={onGoHomeClick}
        className="mt-[2%] px-8 text-lg font-bold"
      />
    </MainView>
  );
}
