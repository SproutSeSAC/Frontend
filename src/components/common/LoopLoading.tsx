interface LoopLoadingProps {
  size?: number;
}

export default function LoopLoading({ size = 200 }: LoopLoadingProps) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ height: `${size}px`, width: `${size}px` }}
    >
      <svg
        width="200"
        height="200"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          strokeWidth="11"
          fill="none"
          className="stroke-gray5"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray="45 240"
          strokeDashoffset="100"
          className="origin-center animate-spin border stroke-oliveGreen1"
        />
      </svg>
      <img
        src="src/assets/images/sprout-logo2.png"
        className="absolute w-[40%]"
        alt="새싹 로고"
      />
    </div>
  );
}
