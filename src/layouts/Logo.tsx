interface LogoProps {
  size?: 'small' | 'large';
}

export default function Logo({ size = 'small' }: LogoProps) {
  const sizeClasses = {
    small: 'size-[32px]',
    large: 'size-[90px]',
  };

  return (
    <img
      src="/sprout_logo.png"
      alt="Sprout Logo"
      className={`flex aspect-square items-center justify-center rounded-lg object-cover ${sizeClasses[size]}`}
    />
  );
}
