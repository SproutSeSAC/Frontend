export default function InterestJobDomainSkillCard() {
  const listStyle = 'flex items-center py-2.5';

  const itemStyle = 'font-semibold tracking-tight px-2 mt-1.5 leading-5';

  return (
    <div className="flex h-[190px] flex-1 flex-col justify-between divide-y rounded-3xl bg-white px-5 py-3 md:w-full">
      <ul className={`${listStyle} divide-x-2`}>
        {['IT', '건설', '게임'].map(domain => (
          <li key={domain} className={itemStyle}>
            {domain}
          </li>
        ))}
      </ul>
      <ul className={listStyle}>
        {['서비스 기획', '데이터 분석'].map(interestJob => (
          <li key={interestJob} className={itemStyle}>
            {interestJob}
          </li>
        ))}
      </ul>

      {/* 기술스택 */}
      <div className="overflow-x-scroll scrollbar-hide">
        <ul className={`${listStyle} flex w-full max-w-0 flex-1 gap-x-3`}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 0, 10, 11].map(skill => (
            <li
              key={skill}
              className="size-10 flex-shrink-0 rounded-lg bg-vividGreen3"
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
