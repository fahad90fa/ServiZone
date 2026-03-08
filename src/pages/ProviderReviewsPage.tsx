import { reviews } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { Star, User } from 'lucide-react';
import { motion } from 'framer-motion';

const ProviderReviewsPage = () => {
  const myReviews = reviews.filter(r => r.providerId === 'u3' || r.providerId === 'u4');
  const avgRating = myReviews.length > 0
    ? (myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length).toFixed(1)
    : '0';

  return (
    <div className="container py-8">
      <h1 className="mb-2 text-3xl font-bold text-foreground">Customer Reviews</h1>
      <p className="mb-6 text-muted-foreground">See what your customers are saying</p>

      <Card className="mb-8 border border-border p-6 shadow-card">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-foreground">{avgRating}</p>
            <div className="mt-1 flex gap-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`h-4 w-4 ${s <= Math.round(Number(avgRating)) ? 'fill-warning text-warning' : 'text-border'}`} />
              ))}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{myReviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map(star => {
              const count = myReviews.filter(r => r.rating === star).length;
              const pct = myReviews.length > 0 ? (count / myReviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-3 text-muted-foreground">{star}</span>
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  <div className="h-2 flex-1 rounded-full bg-muted">
                    <div className="h-2 rounded-full gradient-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-right text-xs text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {myReviews.map((review, i) => (
          <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border border-border p-5 shadow-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{review.userName}</p>
                    <p className="text-xs text-muted-foreground">{review.serviceName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? 'fill-warning text-warning' : 'text-border'}`} />
                    ))}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{review.createdAt}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
            </Card>
          </motion.div>
        ))}

        {myReviews.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">No reviews yet.</div>
        )}
      </div>
    </div>
  );
};

export default ProviderReviewsPage;
