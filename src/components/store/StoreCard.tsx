import { MouseEvent, useCallback, useState } from 'react';

import { foodFilterDisplay } from '@/constants';
import { useDialogContext, useHandleScrap } from '@/hooks';
import { FoodFilterDisplayKey } from '@/types';
import { Store } from '@/types/store/storeDto';
import {
  BsClockFill,
  BsFillGeoAltFill,
  BsFillTelephoneFill,
} from 'react-icons/bs';
import { PiArrowSquareInThin } from 'react-icons/pi';

import Icon from '@/components/common/Icon';
import FavoriteButton from '@/components/common/button/FavoriteButton';
import Tag from '@/components/common/tag/Tag';
import StoreMenuImage from '@/components/store/StoreMenuImage';
import StoreMenuImageSlider from '@/components/store/StoreMenuImageSlider';
import StoreProposalEditModal from '@/components/store/modal/StoreProposalEditModal';

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
  width = 'w-full',
  height,
  storeData,
  showFavoriteButton = true,
  isModal,
  ...rest
}: StoreCardProps) {
  const [openHoursModal, setOpenHoursModal] = useState(false);

  const { showDialog } = useDialogContext();

  const { onScrapClick } = useHandleScrap({
    postId: 0,
    isScraped: false,
    invalidateQueryKeys: ['useGetInfiniteNoticeList'],
  });

  // const { mutateAsync: postStoreScrap } = usePostStoreScrap();

  // const onStoreScrap = useCallback(
  //   async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
  //     e.preventDefault();
  //     e.stopPropagation();

  //     try {
  //       const result = await postStoreScrap({ storeId: storeData.id });

  //       if (result) {
  //         showToast('맛집을 찜했어요!', 1000);
  //       } else {
  //         showToast('맛집 찜하기를 취소 했어요!', 1000);
  //       }

  //       queryClient.invalidateQueries({
  //         queryKey: ['useGetInfiniteStoreList', {}],
  //       });
  //     } catch (err) {
  //       showToast('맛집 찜하기를 실패했어요');
  //     }
  //   },
  //   [postStoreScrap, queryClient, showToast, storeData.id],
  // );

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
    <article className={`${width} gap-[11px]`} {...rest}>
      <StoreMenuImageSlider slideList={storeData?.storeImageList || []}>
        {item => {
          return (
            <StoreMenuImage
              src={item.path}
              width="w-full max-w-[406px]"
              height="h-[16.5rem]"
            />
          );
        }}
      </StoreMenuImageSlider>

      <section className={`flex flex-col gap-6 ${isModal ? 'mt-8' : 'mt-3'}`}>
        <header className="flex items-center justify-between font-semibold">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <h2 className="text-lg">{storeData.name || ''}</h2>
              <span className="text-mainGray">
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
                className="flex items-center justify-center text-base font-semibold text-mainGray"
              >
                정보 수정 제안하기
                <Icon name="ChevronRight" width={18} height={18} />
              </button>
            )}
          </div>
          {showFavoriteButton && (
            <FavoriteButton
              size={18}
              isFavorite={storeData.isScrap}
              onClick={onScrapClick}
            />
          )}
        </header>

        <div className="flex flex-col gap-4">
          <section className="flex items-center gap-2.5">
            <BsFillGeoAltFill className="text-mainGray" size={15} />
            <div className="relative flex items-center gap-2.5">
              <span className="text-darkGray-active">
                {storeData ? `${storeData.campusName}캠퍼스` : '-'}
              </span>
              <div className="flex gap-1 text-darkGray-active">
                <span>도보</span>
                <span>
                  <span className="text-mainBlue">
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
                  <div className="absolute -right-[88px] -top-10 whitespace-normal rounded-md rounded-bl-none bg-mainGreen bg-opacity-90 p-2 text-white">
                    빠른 길찾기
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="flex items-center">
            <BsClockFill
              className="mr-[10px] min-w-3.5 text-mainGray"
              size={15}
            />
            <span className="min-w-[60px] text-darkGray-active">
              {isOpen() ? '영업 중' : '영업 종료'}
            </span>
            <span className="mx-1 text-mainGray">|</span>
            <div
              className="relative text-darkGray-active"
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
                  (openHoursModal ? (
                    <Icon name="ChevronUp" width={18} height={18} />
                  ) : (
                    <Icon name="ChevronDown" width={18} height={18} />
                  ))}
              </button>
              {storeData.breakTime && openHoursModal && (
                <div className="absolute right-0 top-6 z-10 flex w-full min-w-[166px] flex-col justify-center gap-2 rounded-lg bg-white px-2.5 py-3 text-sm shadow-card">
                  {storeData ? `${storeData.breakTime} 브레이크타임` : '-'}
                </div>
              )}
              {isPopoverVisible && (
                <div className="absolute bottom-8 w-full whitespace-normal rounded-md bg-mainGreen bg-opacity-90 p-2 text-white">
                  {/* 삼각형 */}
                  <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-mainGreen opacity-90" />
                  {storeData.workingDay}
                </div>
              )}
            </div>
          </section>

          {storeData.phoneNumber && (
            <section className="flex items-center">
              <BsFillTelephoneFill
                className="mr-[10px] text-mainGray"
                size={15}
              />
              <span className="text-darkGray-active">
                {storeData.phoneNumber}
              </span>
            </section>
          )}
        </div>

        <footer className="flex gap-1 overflow-x-auto scrollbar-hide">
          {storeData.isZeropay && (
            <Tag
              text="# 제로페이"
              color="gray-light"
              className="h-[27px] rounded-lg px-2.5 py-1"
            />
          )}
          {storeData.isLessThan10000Menu && (
            <Tag
              text="# 만원이하"
              color="gray-light"
              className="h-[27px] rounded-lg px-2.5 py-1"
            />
          )}
          {storeData.isOverPerson && (
            <Tag
              text="# 5인 이상"
              color="gray-light"
              className="h-[27px] rounded-lg px-2.5 py-1"
            />
          )}
          {storeData.walkTime <= 5 && (
            <Tag
              text="# 도보 5분 이내"
              color="gray-light"
              className="h-[27px] rounded-lg px-2.5 py-1"
            />
          )}
        </footer>
      </section>
    </article>
  );
}
