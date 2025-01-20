import { Link } from 'react-router-dom';

import CardContent from '@/components/notification/CardContent';

export default function NotificationContent() {
  return (
    <div className="flex h-[calc(100vh-24px-52px-40px)] flex-col gap-6 overflow-y-scroll">
      {[1, 2, 3, 4, 5].map(item => {
        return (
          <div key={item} className="w-full">
            {item < 3 ? (
              <Link
                to="/lounge/post/1"
                className={`border-lightGrey block rounded-lg border border-solid p-4 text-sm text-darkGray-active ${item === 5 ? 'mb-10' : ''}`}
              >
                <CardContent item={item} />
              </Link>
            ) : (
              <div
                className={`border-lightGrey rounded-lg border border-solid bg-mainGray p-4 text-sm text-darkGray-active ${item === 5 ? 'mb-10' : ''}`}
              >
                <CardContent item={item} disabled />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
