export function ProductSkeleton() {
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="aspect-square skeleton-shimmer" />
      <div className="p-3.5 space-y-2.5">
        <div className="h-2.5 skeleton-shimmer rounded w-1/3" />
        <div className="h-4 skeleton-shimmer rounded w-3/4" />
        <div className="h-3 skeleton-shimmer rounded w-1/2" />
        <div className="h-4 skeleton-shimmer rounded w-1/3" />
        <div className="h-9 skeleton-shimmer rounded-xl" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="bg-gradient-to-b from-hero-bg to-white pb-8 mb-10">
      <div className="max-w-[1430px] mx-auto px-4 pt-6">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="lg:w-[65%]">
            <div className="h-[220px] md:h-[340px] lg:h-[420px] skeleton-shimmer rounded-2xl" />
          </div>
          <div className="lg:w-[35%] flex flex-col gap-4">
            <div className="h-[188px] skeleton-shimmer rounded-2xl" />
            <div className="h-[188px] skeleton-shimmer rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="h-6 skeleton-shimmer rounded w-48" />
      <div className="h-4 skeleton-shimmer rounded w-24" />
    </div>
  );
}
