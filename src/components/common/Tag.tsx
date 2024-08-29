interface TagProps {
  text: string;
}

export default function Tag({ text }: TagProps) {
  return (
    <div className="rounded bg-text px-[5px] py-[1px] text-gray3"># {text}</div>
  );
}
