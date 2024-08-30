import { ElementType } from 'react';

interface TitleProps {
  as?: ElementType | string;
  title: string;
  highlight?: string;
}

interface HighlightProps {
  text: string;
  highlight: string;
}

type TitleStyleObj = { [key: string]: string };

const TitleWithHighlight = ({ text, highlight }: HighlightProps) => {
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part: string) =>
    part.toLowerCase() === highlight?.toLowerCase() ? (
      <span key={part} className="text-oliveGreen1">
        {part}
      </span>
    ) : (
      part
    ),
  );
};

export default function Title({
  as: DynamicTitleTag = 'h2',
  title,
  highlight,
}: TitleProps) {
  const titleStyleObj: TitleStyleObj = {
    h1: 'text-2xl font-semibold',
    h2: 'mb-[10px] pl-2 text-lg font-semibold',
  };

  const titleStyle = titleStyleObj[`${DynamicTitleTag}`];

  return (
    <DynamicTitleTag className={titleStyle}>
      {highlight ? (
        <TitleWithHighlight highlight={highlight} text={title} />
      ) : (
        title
      )}
    </DynamicTitleTag>
  );
}
