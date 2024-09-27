import Tag from '@/components/common/Tag';
import Title from '@/components/common/Title';

export default function AnnouncementSideView() {
  return (
    <>
      <Title title="주요일정" />
      <div className="mb-10 mt-2 h-60 rounded-xl border bg-white shadow-card" />

      <div className="mb-2 flex items-center justify-between">
        <Title title="최근 본 공지사항" className="!pl-0 text-sm" />
      </div>

      <ul className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map(item => (
          <li key={item} className="flex h-7 w-full gap-1.5">
            <Tag
              size="small"
              color="green"
              text="엑스퍼트"
              className="h-6 !px-1 font-semibold"
            />
            <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
              1세대에게 직접 배우는 안드로이드 앱
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
