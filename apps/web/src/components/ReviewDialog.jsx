import React, { useEffect, useState } from "react";
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
} from "@/components/ui/alert-dialog";

const API = import.meta.env.VITE_API_URL;

const ReviewDialog = ({
  open,
  onOpenChange,
  product,
  orderId,
  editingReview = null,
  onSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  // Edit mode mein existing review ka data fill karo
  useEffect(() => {
    if (editingReview) {
      setRating(editingReview.rating || 0);
      setReview(editingReview.review || "");
      setReviewImages(editingReview.images || []);
    } else {
      setRating(0);
      setReview("");
      setReviewImages([]);
    }
  }, [editingReview, open]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const currentCount = reviewImages.length;
    const remainingSlots = 5 - currentCount;

    if (files.length > remainingSlots) {
      toast.error(
        `You can upload maximum 5 images`
      );
      return;
    }

    setReviewImages((prev) => [...prev, ...files]);

    // Same file dobara select karne ki possibility ke liye
    e.target.value = "";
  };

  const removeImage = (index) => {
    setReviewImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const uploadNewImages = async (files, token) => {
    if (files.length === 0) {
      return [];
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await fetch(
      `${API}/review-upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(
        data.message || "Image upload failed"
      );
    }

    return data.imageUrls || [];
  };

  const handleSubmit = async () => {
    try {
      if (!rating) {
        toast.error("Please select a rating");
        return;
      }

      if (!review.trim()) {
        toast.error("Please write a review");
        return;
      }

      setReviewLoading(true);

      const token = localStorage.getItem("token");

      // Existing Cloudinary URLs
      const existingImages = reviewImages.filter(
        (image) => typeof image === "string"
      );

      // Newly selected files
      const newFiles = reviewImages.filter(
        (image) => image instanceof File
      );

      // Upload new files
      const newImageUrls = await uploadNewImages(
        newFiles,
        token
      );

      const allImages = [
        ...existingImages,
        ...newImageUrls,
      ];

      let response;

      if (editingReview) {
        // ================= UPDATE =================
        response = await fetch(
          `${API}/reviews/${editingReview._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              rating,
              review: review.trim(),
              images: allImages,
            }),
          }
        );
      } else {
        // ================= CREATE =================
        response = await fetch(
          `${API}/reviews`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              productId: product?._id,
              orderId,
              rating,
              review: review.trim(),
              images: allImages,
            }),
          }
        );
      }

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      toast.success(
        editingReview
          ? "Review updated successfully"
          : "Review submitted successfully"
      );

      onOpenChange(false);

      if (onSuccess) {
        onSuccess(data.review);
      }

      setRating(0);
      setReview("");
      setReviewImages([]);
    } catch (error) {
      console.error("REVIEW ERROR:", error);

      toast.error(
        error.message || "Something went wrong"
      );
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {editingReview
              ? "Edit Review"
              : "Write a Review"}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {editingReview
              ? "Update your experience with this product."
              : "Share your experience with this product."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Rating */}
        <div className="space-y-2">
          <label className="font-medium">
            Rating
          </label>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition-transform hover:scale-110 ${
                  star <= rating
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}

            {rating > 0 && (
              <span className="ml-2 text-gray-600">
                ({rating})
              </span>
            )}
          </div>
        </div>

        {/* Review */}
        <div className="space-y-2 mt-4">
          <label className="font-medium">
            Review
          </label>

          <textarea
            rows={4}
            value={review}
            onChange={(e) =>
              setReview(e.target.value)
            }
            placeholder="Write your review..."
            className="w-full border rounded-lg p-3 resize-none"
          />
        </div>

        {/* Images */}
        <div className="space-y-2 mt-4">
          <label className="font-medium">
            Add Photos
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full border rounded-lg p-2 cursor-pointer"
          />

          {reviewImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {reviewImages.map((image, index) => (
                <div
                  key={index}
                  className="relative"
                >
                  <img
                    src={
                      typeof image === "string"
                        ? image
                        : URL.createObjectURL(image)
                    }
                    alt={`Review ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index)
                    }
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel
            disabled={reviewLoading}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={
              reviewLoading ||
              rating === 0 ||
              !review.trim()
            }
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {reviewLoading
              ? editingReview
                ? "Updating..."
                : "Submitting..."
              : editingReview
                ? "Update Review"
                : "Submit Review"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReviewDialog;