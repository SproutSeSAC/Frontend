import { MouseEvent, useCallback } from 'react';

import { useGetCampusList } from '@/services/campusCourse/campusCourseQueries';

import { foodFilterDisplay } from '@/constants/store';
import { useDialogContext, useHandleScrap } from '@/hooks';
import { Store } from '@/types/store/storeDto';
import { BsClockFill, BsFillTelephoneFill, BsGeoAltFill } from 'react-icons/bs';
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
      element: <StoreProposalEditModal storeName={storeData.name} />,
    });
  };

  return (
    <article
      className={`${width} flex flex-col gap-3 ${isOpenStoreProposalEditModal ? 'mt-6' : 'mt-3'}`}
      {...rest}
    >
      {storeImageList.length === 1 ? (
        <StoreMenuImage
          src={storeImageList[0].path}
          width="w-full "
          height="h-[16.5rem]"
        />
      ) : (
        <SwiperContainer
          slideList={storeImageList}
          arrowClassName="absolute hover:bg-black mx-1 !size-14 p-2 hover:disabled:bg-transparent hover:bg-opacity-50 z-10 h-fit rounded-full disabled:!text-mainGray !text-white"
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

      <header className="mb-2 flex items-start justify-between font-semibold">
        <h2 className="text-lg">
          <span className="mr-1.5">{storeData.name || ''}</span>
          <span className="text-mainGray-active">
            {storeData.foodType ? foodFilterDisplay[storeData.foodType] : '-'}
          </span>
        </h2>

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

      <ul className="flex flex-col gap-2">
        <li className="relative flex w-fit max-w-full items-center">
          <BsGeoAltFill className="mr-1.5 size-3.5 min-w-fit text-mainGray-hover" />

          <span className="mr-1.5 text-darkGray-active">
            {storeData.campusName}
          </span>

          <span className="mr-1.5">
            도보{' '}
            <span className="text-mainBlue">{storeData.walkTime || 0}</span>분
          </span>

          <button
            onClick={handleOpenNaverLink}
            className="peer flex items-center justify-center text-sm"
          >
            <PiArrowSquareInThin className="text-darkGray-active" size={18} />
          </button>

          <div className="absolute -right-[88px] -top-10 hidden rounded-md rounded-bl-none bg-mainGreen bg-opacity-90 px-3 py-2 peer-hover:block">
            <span className="whitespace-normal font-medium text-white">
              빠른 길찾기
            </span>
          </div>
        </li>

        <li className="flex items-center">
          <BsClockFill className="mr-1.5 size-3.5 min-w-fit text-mainGray-hover" />

          <span className="min-w-max text-darkGray-active">
            {isOpenForBusiness() ? '영업 중' : '영업 종료'}
          </span>

          <span className="mx-1.5 text-mainGray">|</span>

          <div className="group relative flex items-center">
            {/* 영업시간 정보 */}

            <span className="mr-1 line-clamp-1 text-start text-darkGray-active">
              {storeData.workingDay}
            </span>

            <div className="absolute -right-[5%] top-8 z-20 hidden min-w-max whitespace-normal rounded-md bg-mainGreen px-4 py-3 text-white group-hover:block">
              {/* 삼각형 */}
              <div className="absolute -top-1.5 right-[2%] h-0 w-0 -translate-x-1/2 border-x-8 border-b-8 border-x-transparent border-b-mainGreen" />
              <ul className="flex flex-col gap-1">
                {storeData.workingDay.split(/, |\(|\)/).map(workingDay => (
                  <li key={workingDay}>{workingDay}</li>
                ))}
                {/* 브레이크타임 정보 */}
                {storeData.breakTime !== ' ' && (
                  <li>{storeData.breakTime} 브레이크타임</li>
                )}
              </ul>
            </div>
          </div>
        </li>

        {storeData.contact && (
          <li className="flex items-center">
            <BsFillTelephoneFill className="mr-1.5 size-3.5 min-w-fit text-mainGray-hover" />
            <span className="text-darkGray-active">{storeData.contact}</span>
          </li>
        )}
      </ul>

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
    </article>
  );
}
