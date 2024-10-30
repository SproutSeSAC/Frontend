export default function CircleNumber({ number }: { number: number }) {
  return (
    <div className="font-600 flex h-6 w-6 items-center justify-center rounded-full bg-skyBlue1 text-[18px] text-white">
      {number}
    </div>
  );
}
