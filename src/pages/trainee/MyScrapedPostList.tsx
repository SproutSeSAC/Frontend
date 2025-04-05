import { useGetMyScrapedPostList } from '@/services/post/myPostQueries';

import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

import ScrapedPostCard from '@/components/user/ScrapedPostCard';

export default function MyScrapedPostList() {
  const { data: myScrapedPostList, isLoading: isMyScrapedPostListLoading } =
    useGetMyScrapedPostList('내가 찜한 글');

  return (
    <MainView className="mb-32">
      <Header title="내가 찜한 글" />
      <ul className="grid grid-cols-3 gap-8">
        {!isMyScrapedPostListLoading &&
          myScrapedPostList?.content?.map(card => (
            <ScrapedPostCard key={card.postId} card={card} />
          ))}
      </ul>
    </MainView>
  );
}
