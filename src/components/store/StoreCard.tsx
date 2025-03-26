import { MouseEvent, useCallback, useState } from 'react';

import { useGetCampusList } from '@/services/campusCourse/campusCourseQueries';

import { foodFilterDisplay } from '@/constants';
import { useDialogContext, useHandleScrap } from '@/hooks';
import { Store } from '@/types/store/storeDto';
import {
  BsClockFill,
  BsFillGeoAltFill,
  BsFillTelephoneFill,
} from 'react-icons/bs';
import { PiArrowSquareInThin } from 'react-icons/pi';

import Icon from '@/components/common/Icon';
import FavoriteButton from '@/components/common/button/FavoriteButton';
import SwiperContainer from '@/components/common/container/SwiperContainer';
import Tag from '@/components/common/tag/Tag';
import StoreMenuImage from '@/components/store/StoreMenuImage';
import StoreProposalEditModal from '@/components/store/modal/StoreProposalEditModal';

interface StoreCardProps {
  width: string;
  height: string;
  storeData: Store;
  showFavoriteButton?: boolean;
  isOpenStoreProposalEditModal?: boolean;
}

export default function StoreCard({
  width = 'w-full',
  height,
  storeData,
  showFavoriteButton = true,
  isOpenStoreProposalEditModal,
  ...rest
}: StoreCardProps) {
  const [openHoursModal, setOpenHoursModal] = useState(false);

  const { showDialog } = useDialogContext();

  const { isScraped, postId, storeImageList, mapSchemaId } = storeData;

  const { onScrapClick, isPostScrapPending, isDeleteScrapPending } =
    useHandleScrap({
      postId,
      isScraped,
      invalidateQueryKeys: [{ queryKey: ['useGetInfiniteStoreList'] }],
    });

  const { data: campusList } = useGetCampusList();

  const isOpenForBusiness = useCallback((): boolean => {
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

  const handleOpenNaverLink = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const currCampus = campusList?.find(
      campus => campus.name === storeData.campusName,
    );
    if (currCampus) {
      const baseUrl = 'https://map.naver.com/p/directions';
      const campusSeg = `${currCampus.longitude},${currCampus.latitude},청년취업사관학교%20${currCampus?.name},${currCampus?.naverPlaceId},PLACE_POI`;
      const storeSeg = `${storeData.longitude},${storeData.latitude},${storeData.name},${mapSchemaId},PLACE_POI`;
      const resultUrl = `${baseUrl}/${campusSeg}/${storeSeg}/-/walk?c=18.00,0,0,0,dh`;
      window.open(resultUrl, '_blank');
    }
  };

  const onOpenStoreProposalEditModalClick = async () => {
    await showDialog({
      key: 'STORE-PROPOSAL-EDIT-MODAL-TYPE',
      element: <StoreProposalEditModal />,
    });
  };

  return (
    <article className={`${width} gap-[11px]`} {...rest}>
      {storeImageList.length === 1 ? (
        <StoreMenuImage
          src={storeImageList[0].path}
          width="w-full "
          height="h-[16.5rem]"
        />
      ) : (
        <SwiperContainer
          slideList={storeImageList}
          arrowClassName="absolute hover:bg-black mx-1 !size-14 p-2 hover:disabled:bg-transparent hover:bg-opacity-50 z-20 h-fit rounded-full disabled:!text-mainGray !text-white"
          slidesPerView={1}
        >
          {item => {
            return (
              <StoreMenuImage
                src={item.path}
                width=" w-full"
                height="h-[16.5rem]"
              />
            );
          }}
        </SwiperContainer>
      )}

      <section
        className={`flex flex-col gap-3 ${isOpenStoreProposalEditModal ? 'mt-6' : 'mt-3'}`}
      >
        <header className="mb-2 flex items-center justify-between font-semibold">
          <div className="flex items-center gap-[10px]">
            <h2 className="text-lg">{storeData.name || ''}</h2>
            <span className="text-mainGray-active">
              {storeData.foodType ? foodFilterDisplay[storeData.foodType] : '-'}
            </span>
          </div>

          {isOpenStoreProposalEditModal && (
            <button
              onClick={onOpenStoreProposalEditModalClick}
              className="flex items-center justify-center text-base font-semibold text-mainGray-active"
            >
              정보 수정 제안하기
              <Icon name="ChevronRight" width={18} height={18} />
            </button>
          )}

          {showFavoriteButton && (
            <FavoriteButton
              size={18}
              isFavorite={storeData.isScraped}
              onClick={onScrapClick}
              disabled={isPostScrapPending || isDeleteScrapPending}
            />
          )}
        </header>

        <section className="flex items-center gap-2.5">
          <BsFillGeoAltFill className="text-mainGray-hover" size={17} />
          <div className="relative flex items-center gap-2.5">
            <span className="text-darkGray-active">
              {storeData ? `${storeData.campusName}캠퍼스` : '-'}
            </span>
            <div className="flex gap-1 text-darkGray-active">
              <span>도보</span>
              <span>
                <span className="text-mainBlue">{storeData.walkTime || 0}</span>
                <span>분</span>
              </span>
              <button
                onClick={handleOpenNaverLink}
                className="peer flex items-center justify-center text-sm"
              >
                <PiArrowSquareInThin
                  className="text-mainGray-hover"
                  size={18}
                />
              </button>
              <div className="absolute -right-[88px] -top-10 hidden whitespace-normal rounded-md rounded-bl-none bg-mainGreen bg-opacity-90 px-3 py-2 font-medium text-white peer-hover:block">
                빠른 길찾기
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <BsClockFill
            className="mr-[10px] min-w-3.5 text-mainGray-hover"
            size={15}
          />
          <span className="min-w-max text-darkGray-active">
            {isOpenForBusiness() ? '영업 중' : '영업 종료'}
          </span>
          <span className="mx-2 text-mainGray">|</span>
          <div className="group relative flex border text-darkGray-active">
            <button
              type="button"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setOpenHoursModal(prev => !prev);
              }}
            >
              {/* 영업시간 정보 */}
              <span className="line-clamp-1 text-start">
                {storeData.workingDay}
              </span>

              {/* 브레이크타임 정보 */}
              {storeData.breakTime &&
                (openHoursModal ? (
                  <Icon name="ChevronUp" width={18} height={18} />
                ) : (
                  <Icon name="ChevronDown" width={18} height={18} />
                ))}
            </button>

            <div className="absolute -left-[30%] bottom-8 z-50 hidden min-w-max whitespace-normal rounded-md bg-mainGreen px-4 py-3 text-white group-hover:block">
              {/* 삼각형 */}
              <div className="absolute -bottom-1.5 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-mainGreen opacity-90" />
              <ul className="flex flex-col gap-1">
                {storeData.workingDay.split(/, |\(|\)/).map(workingDay => (
                  <li key={workingDay}>{workingDay}</li>
                ))}
              </ul>
            </div>

            {storeData.breakTime && openHoursModal && (
              <div className="absolute right-0 top-6 z-10 flex w-full min-w-[166px] flex-col justify-center gap-2 rounded-lg bg-white px-2.5 py-3 text-sm shadow-card">
                {storeData ? `${storeData.breakTime} 브레이크타임` : '-'}
              </div>
            )}
          </div>
        </section>

        {storeData.contact && (
          <section className="flex items-center">
            <BsFillTelephoneFill
              className="mr-[10px] text-mainGray-hover"
              size={15}
            />
            <span className="text-darkGray-active">{storeData.contact}</span>
          </section>
        )}

        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {storeData.isZeropay && (
            <Tag
              text="# 제로페이"
              color="grayLight"
              className="h-[27px] rounded-lg px-2.5 py-1"
            />
          )}
          {storeData.isLessThan10000Menu && (
            <Tag
              text="# 만원이하"
              color="grayLight"
              className="h-[27px] rounded-lg px-2.5 py-1"
            />
          )}
          {storeData.isOverPerson && (
            <Tag
              text="# 5인 이상"
              color="grayLight"
              className="h-[27px] rounded-lg px-2.5 py-1"
            />
          )}
          {storeData.walkTime <= 5 && (
            <Tag
              text="# 도보 5분 이내"
              color="grayLight"
              className="h-[27px] rounded-lg px-2.5 py-1"
            />
          )}
        </div>
      </section>
    </article>
  );
}
