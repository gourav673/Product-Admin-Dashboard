import type { Review } from "@/types/product";
import { formatDate, formatRating } from "@/lib/format";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900">Reviews ({reviews.length})</h2>
      {reviews.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">No reviews yet.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {reviews.map((review, index) => (
            <li key={`${review.reviewerEmail}-${index}`} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-slate-900">{review.reviewerName}</span>
                <span className="text-sm text-amber-600">{formatRating(review.rating)}</span>
              </div>
              <p className="mt-1 text-sm text-slate-700">{review.comment}</p>
              <p className="mt-1 text-xs text-slate-400">{formatDate(review.date)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
