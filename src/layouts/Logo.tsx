import { Link } from 'react-router-dom';

interface LogoProps {
  linkSize?: string;
  imgSize?: string;
}

export default function Logo({
  linkSize = 'size-[57px]',
  imgSize = 'size-10',
}: LogoProps) {
  return (
    <Link
      to="/"
      title="홈 이동"
      className={`flex ${linkSize} items-center justify-center rounded-full`}
    >
      <img src="/sprout_logo.png" alt="Sprout Logo" className={imgSize} />
    </Link>
  );
}
