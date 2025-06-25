import { useLocation, useParams } from 'react-router-dom';

import { useGetUserScrapList } from '@/services/admin/userToManageQueries';
import { useGetMyScrapedPostList } from '@/services/post/myPostQueries';

import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

import ScrapedPostCard from '@/components/user/ScrapedPostCard';

const filter = { page: 1, size: 100 };

export default function ScrapedPostList() {
  const params = useParams();
  const userId = params?.userId ? +params.userId : undefined;

  const { state } = useLocation();

  const { data: myScrapedPostList, isLoading: isMyScrapedPostListLoading } =
    useGetMyScrapedPostList('내가 찜한 글', filter);

  const { data: scrapList, isLoading: isScrapListLoading } =
    useGetUserScrapList('찜한 글', filter, userId);

  const dataList = userId ? scrapList : myScrapedPostList;
  const isLoading = userId ? isScrapListLoading : isMyScrapedPostListLoading;

  return (
    <MainView className="mb-32">
      <Header
        title={userId ? `${state?.username}님의 찜한 글` : '내가 찜한 글'}
      />
      <ul className="grid grid-cols-3 gap-8">
        {!isLoading &&
          dataList?.content?.map(card => (
            <ScrapedPostCard key={card.postId} card={card} />
          ))}
      </ul>
    </MainView>
  );
}
