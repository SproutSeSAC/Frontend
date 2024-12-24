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
                className={`block rounded-lg border border-solid border-gray4 p-4 text-sm text-gray1 ${item === 5 ? 'mb-10' : ''}`}
              >
                <CardContent item={item} />
              </Link>
            ) : (
              <div
                className={`rounded-lg border border-solid border-gray4 bg-gray3 p-4 text-sm text-gray1 ${item === 5 ? 'mb-10' : ''}`}
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
