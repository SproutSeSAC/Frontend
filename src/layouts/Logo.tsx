import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link
      to="/"
      title="홈 이동"
      className="flex aspect-square w-12 items-center justify-center rounded-lg"
    >
      <div className="h-12 w-12 rounded-lg border bg-black" />
    </Link>
  );
}
