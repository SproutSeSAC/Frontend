import { Link } from 'react-router-dom';

interface PostCollectionTabListProps<T> {
  collectionList: T[];
  currCollection: T;
  onTabClick: (collection: T) => void;
  user?: { userId: number; username: string };
}

export default function PostCollectionTabList<T extends string>({
  collectionList,
  onTabClick,
  currCollection,
  user,
}: PostCollectionTabListProps<T>) {
  return (
    <ul className="mb-4 flex items-center gap-3">
      {collectionList.map(collection => (
        <li key={collection}>
          <button
            type="button"
            aria-label={collection}
            onClick={() => onTabClick(collection)}
            className={`${currCollection === collection ? 'bg-mainGray-hover text-white underline' : 'bg-white text-darkGray-active'} cursor-pointer rounded-lg border border-mainGray-hover px-4 py-[10px] text-sm font-medium`}
          >
            {collection}
          </button>
        </li>
      ))}

      {currCollection.includes('찜한 글') && (
        <Link
          to={`/scraped-posts/${user?.userId}`}
          className="ml-auto mt-3 text-darkGray"
          state={user}
        >
          더보기
        </Link>
      )}
    </ul>
  );
}
