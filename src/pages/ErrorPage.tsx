import { useNavigate } from 'react-router-dom';

import Warning from '@/assets/icons/warning.svg?react';
import Layout from '@/layouts/Layout';
import MainView from '@/layouts/MainView';

import SquareButton from '@/components/common/button/SquareButton';

export default function ErrorPage() {
  const navigate = useNavigate();

  const onGoHomeClick = () => navigate('/');

  return (
    <Layout>
      <MainView isEmpty>
        <Warning className="mb-[1%] h-[50%] max-h-[117px] max-w-[131px] object-cover" />

        <h2 className="mb-[1%] text-[40px] font-semibold">
          일시적인 오류입니다.
        </h2>
        <p className="text-lg">잠시 후에 다시 시도해 주세요.</p>

        <SquareButton
          name="홈으로"
          onClick={onGoHomeClick}
          className="mt-[2%] px-8 text-lg font-bold"
        />
      </MainView>
    </Layout>
  );
}
