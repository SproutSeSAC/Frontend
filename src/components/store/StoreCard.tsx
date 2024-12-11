import { MouseEvent, useCallback, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { usePostStoreScrap } from '@/services/store/storeMutations';

import StoreMenuImage from './StoreMenuImage';
import StoreProposalEditModal from './modal/StoreProposalEditModal';

import { foodFilterDisplay } from '@/constants';
import { useDialogContext } from '@/hooks';
import { FoodFilterDisplayKey } from '@/types';
import { Store } from '@/types/store/storeDto';
import {
  BsClockFill,
  BsFillGeoAltFill,
  BsFillTelephoneFill,
} from 'react-icons/bs';
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from 'react-icons/io';
import { PiArrowSquareInThin } from 'react-icons/pi';

import FavoriteButton from '@/components/common/button/FavoriteButton';
import Tag from '@/components/common/tag/Tag';
import StoreMenuImageSlider from '@/components/store/StoreMenuImageSlider';

interface StoreDataType
  extends Omit<
    Store,
    | 'phoneNumber'
    | 'underPrice'
    | 'address'
    | 'foodType'
    | 'contact'
    | 'scrapCount'
    | 'longitude'
    | 'latitude'
    | 'holiday'
  > {
  phoneNumber?: string;
  foodType?: FoodFilterDisplayKey;
  scrapCount?: number;
  longitude?: string;
  latitude?: string;
}

interface StoreCardProps {
  width: string;
  height: string;
  storeData: StoreDataType;
  showFavoriteButton?: boolean;
  isModal?: boolean;
}

export default function StoreCard({
  width,
  height,
  storeData,
  showFavoriteButton = true,
  isModal,
}: StoreCardProps) {
  const { showToast, showDialog } = useDialogContext();
  const [openHoursModal, setOpenHoursModal] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync: postStoreScrap } = usePostStoreScrap();

  const onStoreScrap = useCallback(
    async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        const result = await postStoreScrap({ storeId: storeData.id });

        if (result) {
          showToast('맛집을 찜했어요!', 1000);
        } else {
          showToast('맛집 찜하기를 취소 했어요!', 1000);
        }

        queryClient.invalidateQueries({
          queryKey: ['useGetInfiniteStoreList', {}],
        });
      } catch (err) {
        console.error(err);
        showToast('맛집 찜하기를 실패했어요');
      }
    },
    [postStoreScrap, queryClient, showToast, storeData.id],
  );

  const isOpen = useCallback((): boolean => {
    const parseTimeString = (timeString: string) => {
      const [open = '', close = ''] = timeString
        .replace('매일 ', '')
        .split(' - ');

      return { open, close };
    };

    try {
      const { open, close } = parseTimeString(storeData.workingDay);

      const today = new Date();
      const currentTime = today.getHours() * 60 + today.getMinutes();

      const [openHour, openMinute] = open.split(':').map(Number);
      const [closeHour, closeMinute] = close.split(':').map(Number);

      const openTime = openHour * 60 + openMinute;
      const closeTime = closeHour * 60 + closeMinute;

      if (closeTime < openTime) {
        return currentTime >= openTime || currentTime <= closeTime;
      }

      return currentTime >= openTime && currentTime <= closeTime;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [storeData.workingDay]);

  // TODO: 예시를위한 임시코드
  const naverShareUrl = 'https://naver.me/GgWjoodG';

  const handleOpenNaverLink = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(naverShareUrl, '_blank');
  };
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [test, setTest] = useState(false);

  return (
    <article className={`${width} gap-[11px]`}>
      <StoreMenuImageSlider slideList={storeData?.storeImageList || []}>
        {item => {
          return (
            <StoreMenuImage src={item.path} width={width} height={height} />
          );
        }}
      </StoreMenuImageSlider>

      <section className={`flex flex-col gap-6 ${isModal ? 'mt-8' : 'mt-3'}`}>
        <header className="flex items-center justify-between font-semibold">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <h2 className="text-lg">{storeData.name || ''}</h2>
              <span className="text-gray2">
                {storeData.foodType
                  ? foodFilterDisplay[storeData.foodType]
                  : '-'}
              </span>
            </div>
            {isModal && (
              <button
                onClick={async () => {
                  await showDialog({
                    key: 'STORE-PROPOSAL-EDIT-MODAL-TYPE',
                    element: <StoreProposalEditModal />,
                  });
                }}
                className="flex items-center justify-center text-base font-semibold text-gray2"
              >
                정보 수정 제안하기
                <IoIosArrowForward size={18} />
              </button>
            )}
          </div>
          {showFavoriteButton && (
            <FavoriteButton
              size={18}
              isFavorite={storeData.isScrap}
              onClick={onStoreScrap}
            />
          )}
        </header>

        <div className="flex flex-col gap-4">
          <section className="flex items-center gap-2.5">
            <BsFillGeoAltFill className="text-gray2" size={15} />
            <div className="relative flex items-center gap-2.5">
              <span className="text-gray1">
                {storeData ? `${storeData.campusName}캠퍼스` : '-'}
              </span>
              <div className="flex gap-1 text-gray1">
                <span>도보</span>
                <span>
                  <span className="text-skyBlue1">
                    {storeData.walkTime || 0}
                  </span>
                  <span>분</span>
                </span>
                <button
                  onMouseEnter={() => setTest(true)}
                  onMouseLeave={() => setTest(false)}
                  onClick={handleOpenNaverLink}
                  className="flex items-center justify-center text-sm"
                >
                  <PiArrowSquareInThin size={18} />
                </button>
                {test && (
                  <div className="absolute -right-[88px] -top-10 whitespace-normal rounded-md rounded-bl-none bg-oliveGreen1 bg-opacity-90 p-2 text-white">
                    빠른 길찾기
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="flex items-center">
            <BsClockFill className="mr-[10px] min-w-3.5 text-gray2" size={15} />
            <span className="min-w-[60px] text-gray1">
              {isOpen() ? '영업 중' : '영업 종료'}
            </span>
            <span className="mx-1 text-gray3">|</span>
            <div
              className="relative text-gray1"
              onMouseEnter={() => setIsPopoverVisible(true)}
              onMouseLeave={() => setIsPopoverVisible(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1.5"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenHoursModal(prev => !prev);
                }}
              >
                <div className="line-clamp-1 min-w-[166px] overflow-hidden overflow-ellipsis">
                  {storeData.workingDay}
                </div>

                {storeData.breakTime &&
                  (openHoursModal ? <IoIosArrowUp /> : <IoIosArrowDown />)}
              </button>
              {storeData.breakTime && openHoursModal && (
                <div className="absolute right-0 top-6 z-10 flex w-full min-w-[166px] flex-col justify-center gap-2 rounded-lg bg-white px-2.5 py-3 text-sm shadow-card">
                  {storeData ? `${storeData.breakTime} 브레이크타임` : '-'}
                </div>
              )}
              {isPopoverVisible && (
                <div className="absolute bottom-8 w-full whitespace-normal rounded-md bg-oliveGreen1 bg-opacity-90 p-2 text-white">
                  {/* 삼각형 */}
                  <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-oliveGreen1 opacity-90" />
                  {storeData.workingDay}
                </div>
              )}
            </div>
          </section>

          {storeData.phoneNumber && (
            <section className="flex items-center">
              <BsFillTelephoneFill className="mr-[10px] text-gray2" size={15} />
              <span className="text-gray1">{storeData.phoneNumber}</span>
            </section>
          )}
        </div>

        <footer className="flex gap-2 overflow-x-scroll">
          {storeData.isZeropay && <Tag text="# 제로페이" />}
          {storeData.isLessThan10000Menu && <Tag text="# 만원이하" />}
          {storeData.isOverPerson && <Tag text="# 5인 이상" />}
          {storeData.walkTime <= 5 && <Tag text="# 도보 5분 이내" />}
        </footer>
      </section>
    </article>
  );
}
