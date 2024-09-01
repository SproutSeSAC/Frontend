import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link
      to="/"
      title="홈 이동"
      className="flex aspect-square w-12 items-center justify-center rounded-lg"
    >
      <img src="/sprout_logo.png" alt="Sprout Logo" className="size-12" />
    </Link>
  );
}
