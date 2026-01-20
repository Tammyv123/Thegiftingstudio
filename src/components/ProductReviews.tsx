import { useState } from "react";
import { Star, Edit, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useProductReviews, Review } from "@/hooks/useProductReviews";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [photos, setPhotos] = useState<string[]>(existingReview?.photos || []);
  const [uploading, setUploading] = useState(false);
  const { addReview, updateReview } = useProductReviews(productId);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (photos.length + files.length > 5) {
      toast.error("Maximum 5 photos allowed per review");
      return;
    }

    setUploading(true);
    const newPhotos: string[] = [];

    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 5MB per image.`);
        continue;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(`reviews/${fileName}`, file);

      if (error) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(`reviews/${fileName}`);

      newPhotos.push(urlData.publicUrl);
    }

    setPhotos([...photos, ...newPhotos]);
    setUploading(false);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    if (existingReview) {
      updateReview.mutate({
        reviewId: existingReview.id,
        rating,
        comment,
        photos,
      });
    } else {
      addReview.mutate({ rating, comment, photos });
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
        <label className="block text-sm font-medium mb-2">Your Review</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product"
          rows={4}
          maxLength={1000}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Add Photos (optional)</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {photos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={photo}
                alt={`Review photo ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        {photos.length < 5 && (
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload Photo"}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
        <p className="text-xs text-muted-foreground mt-1">Max 5 photos, 5MB each</p>
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" disabled={rating === 0 || isSubmitting || uploading}>
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
      {review.photos && review.photos.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {review.photos.map((photo, index) => (
            <a
              key={index}
              href={photo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={photo}
                alt={`Review photo ${index + 1}`}
                className="w-16 h-16 object-cover rounded-lg hover:opacity-80 transition-opacity"
              />
            </a>
          ))}
        </div>
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
