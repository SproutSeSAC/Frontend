import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'large';
}

export default function Logo({ size = 'small' }: LogoProps) {
  const sizeClasses = {
    small: 'size-[40px]',
    large: 'size-[90px]',
  };

  return (
    <Link
      to="/"
      title="홈 이동"
      className={`flex items-center justify-center rounded-full ${sizeClasses[size]}`}
    >
      <img
        src="/sprout_logo.png"
        alt="Sprout Logo"
        className="h-full w-full object-cover"
      />
    </Link>
  );
}
