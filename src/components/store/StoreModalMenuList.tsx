import StoreModalMenu from '@/components/store/StoreModalMenu';

export default function StoreModalMenuList() {
  return (
    <section className="flex flex-wrap gap-9">
      {Array.from({ length: 12 }, (_, idx) => (
        <StoreModalMenu key={idx} />
      ))}
    </section>
  );
}
