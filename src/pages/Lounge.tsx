import LoungePostCard from '@/components/lounge/LoungePostCard';

export default function Lounge() {
  return (
    <ul className="grid grid-cols-3 gap-4 sm:!grid-cols-1 md:grid-cols-2">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(card => (
        <li key={card} className="[&>div]:w-full">
          <LoungePostCard />
        </li>
      ))}
    </ul>
  );
}
