import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
  updated_at: string;
  user_email?: string;
}

export const useProductReviews = (productId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!productId,
  });

  const { data: userReview } = useQuery({
    queryKey: ["user-review", productId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Review | null;
    },
    enabled: !!productId && !!user,
  });

  const addReview = useMutation({
    mutationFn: async ({
      rating,
      title,
      comment,
    }: {
      rating: number;
      title?: string;
      comment?: string;
    }) => {
      if (!user) throw new Error("Must be logged in to add review");

      const { data, error } = await supabase
        .from("reviews")
        .insert({
          product_id: productId,
          user_id: user.id,
          rating,
          title: title || null,
          comment: comment || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["user-review", productId, user?.id] });
      toast.success("Review added successfully!");
    },
    onError: (error: Error) => {
      if (error.message.includes("duplicate")) {
        toast.error("You have already reviewed this product");
      } else {
        toast.error("Failed to add review");
      }
    },
  });

  const updateReview = useMutation({
    mutationFn: async ({
      reviewId,
      rating,
      title,
      comment,
    }: {
      reviewId: string;
      rating: number;
      title?: string;
      comment?: string;
    }) => {
      if (!user) throw new Error("Must be logged in to update review");

      const { data, error } = await supabase
        .from("reviews")
        .update({
          rating,
          title: title || null,
          comment: comment || null,
        })
        .eq("id", reviewId)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["user-review", productId, user?.id] });
      toast.success("Review updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update review");
    },
  });

  const deleteReview = useMutation({
    mutationFn: async (reviewId: string) => {
      if (!user) throw new Error("Must be logged in to delete review");

      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["user-review", productId, user?.id] });
      toast.success("Review deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete review");
    },
  });

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return {
    reviews,
    userReview,
    isLoading,
    averageRating,
    addReview,
    updateReview,
    deleteReview,
  };
};
