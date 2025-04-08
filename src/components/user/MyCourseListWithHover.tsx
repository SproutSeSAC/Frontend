interface MyCourseListWithHoverProps {
  courseList: { courseTitle: string }[];
}

export default function MyCourseListWithHover({
  courseList,
}: MyCourseListWithHoverProps) {
  return (
    <div className="w-full truncate">
      <div className="peer flex w-full items-center truncate">
        {courseList.length > 1 ? (
          courseList.slice(0, 1).map(({ courseTitle }) => (
            <span key={courseTitle} className="w-full truncate whitespace-pre">
              {courseTitle}
            </span>
          ))
        ) : (
          <span className="w-full truncate">{courseList[0]?.courseTitle}</span>
        )}
      </div>

      <div className="absolute z-40 hidden rounded-[20px] bg-black bg-opacity-90 p-6 shadow-card hover:block peer-hover:block">
        {courseList.length > 1 && (
          <header className="mb-4 flex items-center justify-between border-b border-mainGray pb-3 text-white">
            <h4>소속 교육과정 전체 목록</h4>
            <span>총 {courseList.length}개</span>
          </header>
        )}

        <ul className="flex min-w-fit max-w-[440px] flex-col gap-y-4">
          {courseList.map(({ courseTitle }, index) => (
            <li
              className="flex w-full overflow-hidden tracking-tight text-white"
              key={courseTitle}
            >
              {courseList.length > 1 && (
                <span className="mr-2 inline-block min-w-8 text-lightGray">
                  {index + 1}.
                </span>
              )}
              {courseTitle}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
