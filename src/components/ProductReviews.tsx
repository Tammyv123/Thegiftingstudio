import { useState } from "react";
import { Star, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useProductReviews, Review } from "@/hooks/useProductReviews";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProductReviewsProps {
  productId: string;
}

const StarRating = ({
  rating,
  onRatingChange,
  interactive = false,
  size = "md",
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: "sm" | "md";
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const starSize = size === "sm" ? "h-4 w-4" : "h-6 w-6";

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            interactive ? "cursor-pointer" : ""
          } transition-colors ${
            star <= (hoverRating || rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground"
          }`}
          onClick={() => interactive && onRatingChange?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        />
      ))}
    </div>
  );
};

const ReviewForm = ({
  productId,
  existingReview,
  onCancel,
}: {
  productId: string;
  existingReview?: Review | null;
  onCancel?: () => void;
}) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [comment, setComment] = useState(existingReview?.comment || "");
  const { addReview, updateReview } = useProductReviews(productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    if (existingReview) {
      updateReview.mutate({
        reviewId: existingReview.id,
        rating,
        title,
        comment,
      });
    } else {
      addReview.mutate({ rating, title, comment });
    }
    
    if (onCancel) onCancel();
  };

  const isSubmitting = addReview.isPending || updateReview.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-muted/50 rounded-lg">
      <div>
        <label className="block text-sm font-medium mb-2">Your Rating *</label>
        <StarRating rating={rating} onRatingChange={setRating} interactive />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Review Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength={100}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Your Review</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product"
          rows={4}
          maxLength={1000}
        />
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" disabled={rating === 0 || isSubmitting}>
          {isSubmitting ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

const ReviewCard = ({
  review,
  isOwner,
  productId,
}: {
  review: Review;
  isOwner: boolean;
  productId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { deleteReview } = useProductReviews(productId);

  if (isEditing) {
    return (
      <ReviewForm
        productId={productId}
        existingReview={review}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="p-4 bg-card rounded-lg border">
      <div className="flex items-start justify-between mb-2">
        <div>
          <StarRating rating={review.rating} size="sm" />
          {review.title && (
            <h4 className="font-semibold mt-2">{review.title}</h4>
          )}
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Review</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete your review? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteReview.mutate(review.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      {review.comment && (
        <p className="text-muted-foreground mt-2">{review.comment}</p>
      )}
      <p className="text-xs text-muted-foreground mt-3">
        {new Date(review.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  );
};

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user } = useAuth();
  const { reviews, userReview, isLoading, averageRating } = useProductReviews(productId);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="mt-12 border-t pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={Math.round(averageRating)} size="sm" />
              <span className="text-muted-foreground">
                {averageRating.toFixed(1)} out of 5 ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Add Review Section */}
      {user ? (
        !userReview && !showForm ? (
          <Button onClick={() => setShowForm(true)} className="mb-6">
            Write a Review
          </Button>
        ) : showForm ? (
          <div className="mb-6">
            <ReviewForm productId={productId} onCancel={() => setShowForm(false)} />
          </div>
        ) : null
      ) : (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">
            <Link to="/auth" className="text-primary hover:underline">
              Sign in
            </Link>{" "}
            to write a review
          </p>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isOwner={user?.id === review.user_id}
              productId={productId}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">
          No reviews yet. Be the first to review this product!
        </p>
      )}
    </div>
  );
};
