import { Link } from 'react-router-dom';

interface RoleSwitchButtonProps {
  title: '관리자로 전환' | '학생으로 전환';
}

export default function RoleSwitchButton({ title }: RoleSwitchButtonProps) {
  return (
    <Link
      to={title === '관리자로 전환' ? '/admin' : '/'}
      className="rounded-lg border border-mainGreen-active bg-lightGreen px-[14px] py-[8px] text-base font-medium tracking-tight text-mainGreen-active"
    >
      {title}
    </Link>
  );
}
