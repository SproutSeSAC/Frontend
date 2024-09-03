import FavoriteButton from '@/components/common/button/FavoriteButton';
import UserImage from '@/components/user/UserImage';

export default function FavoritePostCard() {
  return (
    <li className="w-[354px] flex-shrink-0 rounded-3xl bg-white p-8">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-semibold tracking-tight opacity-60">
          # 스터디모집
        </span>
        <FavoriteButton size={20} isFavorite onClick={() => {}} />
      </div>
      <h3 className="mb-2 font-semibold tracking-tight">
        자바스크립트 공부할 스터디원을 모집합니다!
      </h3>
      <p className="max-h-[72px] overflow-hidden font-semibold tracking-tight opacity-60">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
        obcaecati eligendi debitis cumque in dolor beatae tenetur repellendus
        assumenda ad, deserunt vero consequatur, velit minima sequi, earum quam
        ipsam ea!
      </p>

      <div className="mt-8 flex items-center gap-x-3">
        <UserImage className="size-12 p-3" />
        <div className="flex flex-col">
          <span className="text-sm">박민수</span>
          <span className="text-xs opacity-60">@minsupark5452</span>
        </div>
      </div>
    </li>
  );
}
