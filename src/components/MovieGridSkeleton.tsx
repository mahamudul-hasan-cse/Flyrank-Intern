type MovieGridSkeletonProps = {
  count: number;
};

export function MovieGridSkeleton({ count }: MovieGridSkeletonProps) {
  return (
    <ul className="movie-grid movie-grid-skeleton" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="skeleton-card">
          <div className="skeleton skeleton-poster" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line skeleton-line-short" />
        </li>
      ))}
    </ul>
  );
}
