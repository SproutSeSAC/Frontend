import { Link } from 'react-router-dom';

export default function HeaderMenu() {
  const menuList = [
    { title: '마이페이지', to: '/mypage' },
    { title: '공지사항', to: '/announcement' },
  ];

  return (
    <nav className="absolute right-0 top-[40px] z-10 hidden py-4 hover:block group-hover:block">
      <ul className="flex w-[116px] flex-col gap-2 rounded-md bg-white px-1 py-2 shadow-card">
        {menuList.map(menu => (
          <li key={menu.title}>
            <Link
              to={menu.to}
              className="block w-full rounded-md px-3 py-1.5 text-sm font-semibold tracking-tight hover:bg-gray4"
            >
              {menu.title}
            </Link>
          </li>
        ))}

        <li>
          <button
            type="button"
            className="w-full rounded-md px-3 py-1.5 text-start text-sm font-semibold tracking-tight text-red-500 hover:bg-gray3"
            onClick={() => {}}
          >
            로그아웃
          </button>
        </li>
      </ul>
    </nav>
  );
}
