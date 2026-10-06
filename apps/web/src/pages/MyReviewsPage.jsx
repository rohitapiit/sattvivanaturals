import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Star } from "lucide-react";
import { toast } from "react-toastify";
import ReviewDialog from "@/components/ReviewDialog";

const API = import.meta.env.VITE_API_URL;

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingReview, setEditingReview] = useState(null);
const [showEditDialog, setShowEditDialog] = useState(false);

// const [rating, setRating] = useState(0);
// const [review, setReview] = useState("");
// const [reviewImages, setReviewImages] = useState([]);
// const [reviewLoading, setReviewLoading] = useState(false);


  const fetchMyReviews = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(`${API}/reviews/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("FETCH MY REVIEWS ERROR:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API}/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      toast.success("Review deleted successfully");

      setReviews((prev) =>
        prev.filter((item) => item._id !== reviewId)
      );
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);
    toast.error("Something went wrong");
  }
};

const handleEditReview = (item) => {
  setEditingReview(item);
  setShowEditDialog(true);
};

  useEffect(() => {
    fetchMyReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p>Loading reviews...</p>
      </div>
    );
  }

  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">
        My Reviews
      </h1>

      {reviews.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">
            You haven't written any reviews yet.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((item) => (
            <div
              key={item._id}
              className="border rounded-xl p-5 bg-white shadow-sm"
            >
              <div className="flex gap-4">
                
                {/* Product Image */}
                <img
                  src={item.product?.images?.[0]}
                  alt={item.product?.name}
                  className="w-24 h-24 object-cover rounded-lg border"
                />

                <div className="flex-1">
                  {/* Product Name */}
                  <h2 className="font-semibold text-lg">
                    {item.product?.name}
                  </h2>

                  {/* Rating */}
                  <div className="flex items-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className={
                          star <= item.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  {/* Review */}
                  <p className="text-gray-700 mt-2">
                    {item.review}
                  </p>

                  {/* Review Images */}
                  {item.images?.length > 0 && (
                    <div className="flex gap-3 mt-3 flex-wrap">
                      {item.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  )}

                  {/* Date */}
                  <p className="text-sm text-gray-400 mt-3">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4">
                  <button
  onClick={() => handleEditReview(item)}
  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
>
  <Pencil size={16} />
  Edit
</button>

                 {/* <button
  onClick={() => handleDeleteReview(item._id)}
  className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50"
>
  <Trash2 size={16} />
  Delete
</button> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    <ReviewDialog
  open={showEditDialog}
  onOpenChange={setShowEditDialog}
  product={editingReview?.product}
  orderId={editingReview?.order}
  editingReview={editingReview}
  onSuccess={(updatedReview) => {
    setReviews((prev) =>
      prev.map((item) =>
        item._id === updatedReview._id
          ? {
              ...item,
              ...updatedReview,
              product: item.product,
            }
          : item
      )
    );

    setEditingReview(null);
  }}
/>
    
    </div>
  );
};

export default MyReviewsPage;