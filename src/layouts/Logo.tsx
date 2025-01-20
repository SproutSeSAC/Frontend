import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link
      to="/"
      title="홈 이동"
      className="flex size-[57px] items-center justify-center rounded-full"
    >
      <img src="/sprout_logo.png" alt="Sprout Logo" className="size-10" />
    </Link>
  );
}
