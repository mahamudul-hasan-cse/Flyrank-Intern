type RatingBadgeProps = {
  rating: string;
  size?: "small" | "large";
};

export function RatingBadge({ rating, size = "small" }: RatingBadgeProps) {
  return (
    <span className={`rating-badge rating-badge-${size}`}>
      <span aria-hidden="true">★</span> {rating}
      <span className="sr-only"> out of 10 on IMDb</span>
    </span>
  );
}
