interface MyCourseListWithHoverProps {
  courseList: { courseTitle: string }[];
  className?: string;
  hoverBoxClassName?: string;
}

export default function MyCourseListWithHover({
  courseList,
  className = '',
  hoverBoxClassName = '',
}: MyCourseListWithHoverProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="peer flex items-center">
        {courseList.length > 1 ? (
          courseList.slice(0, 1).map(({ courseTitle }) => (
            <span key={courseTitle} className="line-clamp-1">
              {courseTitle}
            </span>
          ))
        ) : (
          <span className="line-clamp-1">{courseList[0]?.courseTitle}</span>
        )}
      </div>

      {/* 호버 박스 */}
      <div
        className={`absolute z-40 hidden max-h-[380px] overflow-scroll rounded-[20px] bg-black bg-opacity-90 p-6 shadow-card scrollbar-hide hover:block peer-hover:block ${hoverBoxClassName}`}
      >
        {courseList.length > 1 && (
          <header className="mb-4 flex items-center justify-between border-b border-mainGray pb-3 text-white">
            <h4>소속 교육과정 전체 목록</h4>
            <span>총 {courseList.length}개</span>
          </header>
        )}

        <ul className="flex flex-col gap-y-4">
          {courseList.map(({ courseTitle }, index) => (
            <li
              key={courseTitle}
              className="flex w-full overflow-hidden tracking-tight text-white"
            >
              {courseList.length > 1 && (
                <span className="mr-2 inline-block min-w-8 text-lightGray">
                  {index + 1}.
                </span>
              )}
              <span className="text-start">{courseTitle}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
