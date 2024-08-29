interface StoreTagProps {
  text: string;
}

export default function StoreTag({ text }: StoreTagProps) {
  return (
    <div className="rounded bg-text px-[5px] py-[1px] text-gray3"># {text}</div>
  );
}
