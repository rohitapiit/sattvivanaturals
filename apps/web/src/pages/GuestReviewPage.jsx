import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_URL;

const GuestReviewPage = () => {
  const { token } = useParams();
  const isLoggedInReview =
  window.location.pathname.startsWith("/review/");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingReview, setLoadingReview] = useState(true);

  const [guestName, setGuestName] = useState("");
  const [productId, setProductId] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [images, setImages] = useState([]);

  const [submitting, setSubmitting] = useState(false);

  // ================= FETCH PRODUCTS =================

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await fetch(`${API}/products`);

  //       const data = await response.json();

  //       if (data.success) {
  //         setProducts(data.products || []);
  //       } else {
  //         toast.error(
  //           data.message || "Unable to load products"
  //         );
  //       }
  //     } catch (error) {
  //       console.error("FETCH PRODUCTS ERROR:", error);
  //       toast.error("Unable to load products");
  //     } finally {
  //       setLoadingProducts(false);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  useEffect(() => {
  const fetchReviewDetails = async () => {
    try {
      setLoadingReview(true);

     const reviewDetailsUrl = isLoggedInReview
  ? `${API}/reviews/token/${token}`
  : `${API}/guest-reviews/token/${token}`;

const response = await fetch(reviewDetailsUrl);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Invalid or expired review link."
        );
      }

      setGuestName(data.guestName || "");

      setProducts(data.products || []);

    } catch (error) {
      console.error(
        "FETCH GUEST REVIEW DETAILS ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Unable to load review details."
      );

    } finally {
      setLoadingReview(false);
    }
  };

  if (token) {
    fetchReviewDetails();
  }
}, [token]);
  // ================= IMAGE SELECT =================

const handleImageChange = (e) => {
  const files = Array.from(e.target.files);

  if (images.length + files.length > 5) {
    toast.error("You can upload maximum 5 images.");
    return;
  }

  setImages((prev) => [...prev, ...files]);

  e.target.value = "";
};

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!guestName.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!productId) {
      toast.error("Please select a product.");
      return;
    }

    if (!rating) {
      toast.error("Please select a rating.");
      return;
    }

    if (!review.trim()) {
      toast.error("Please write your review.");
      return;
    }

    try {
      setSubmitting(true);

      const imageUrls = [];

      // ================= UPLOAD IMAGES =================

      for (const image of images) {
        const formData = new FormData();

        formData.append("image", image);

        const uploadResponse = await fetch(
          `${API}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadData =
          await uploadResponse.json();

        if (!uploadData.success) {
          throw new Error(
            uploadData.message ||
              "Image upload failed"
          );
        }

        imageUrls.push(uploadData.imageUrl);
      }

      // ================= SAVE REVIEW =================

      const submitUrl = isLoggedInReview
  ? `${API}/reviews/token/${token}`
  : `${API}/guest-reviews/token/${token}`;

const response = await fetch(
  submitUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  productId,
  rating,
  review: review.trim(),
  images: imageUrls,
}),
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(
        "Thank you! Your review has been submitted."
      );

      // Reset form
      setGuestName("");
      setProductId("");
      setRating(0);
      setReview("");
      setImages([]);

    } catch (error) {
      console.error(
        "GUEST REVIEW ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">

      <div className="max-w-xl mx-auto">

        {/* Header */}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-green-800">
            Share Your Experience
          </h1>

          <p className="text-gray-500 mt-2">
            We would love to hear your feedback.
          </p>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border p-6 space-y-6"
        >

          {/* Name */}

          <div className="space-y-2">
            <label className="font-medium">
              Your Name
            </label>

            <input
  type="text"
  value={guestName}
  readOnly
  className="w-full border rounded-lg p-3 bg-gray-50 outline-none"
/>
          </div>

          {/* Product */}

          <div className="space-y-2">
            <label className="font-medium">
              Product
            </label>

            <select
  value={productId}
  onChange={(e) =>
    setProductId(e.target.value)
  }
  disabled={loadingReview}
  className="w-full border rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-green-600"
>
              <option value="">
  {loadingReview
    ? "Loading products..."
    : "Select a product"}
</option>

              {products.map((product) => (
                <option
                  key={product._id}
                  value={product._id}
                >
                  {product.name || product.title}
                </option>
              ))}
            </select>
          </div>

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
                  onClick={() =>
                    setRating(star)
                  }
                  className={`text-4xl transition-transform hover:scale-110 ${
                    star <= rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  aria-label={`Rate ${star} star`}
                >
                  ★
                </button>
              ))}

              {rating > 0 && (
                <span className="ml-2 text-gray-600">
                  {rating}/5
                </span>
              )}

            </div>
          </div>

          {/* Review */}

          <div className="space-y-2">
            <label className="font-medium">
              Review
            </label>

            <textarea
              rows={5}
              value={review}
              onChange={(e) =>
                setReview(e.target.value)
              }
              placeholder="Write your review..."
              className="w-full border rounded-lg p-3 resize-none outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Images */}

          <div className="space-y-2">
            <label className="font-medium">
              Add Photos
              <span className="text-gray-400 text-sm ml-2">
                (Optional, max 5)
              </span>
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full border rounded-lg p-2 cursor-pointer"
            />

            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">

                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />

                    <button
      type="button"
      onClick={() => {
        setImages((prev) =>
          prev.filter((_, i) => i !== index)
        );
      }}
      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
    >
      ×
    </button>
                  </div>
                ))}

              </div>
            )}
          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-60"
          >
            {submitting
              ? "Submitting..."
              : "Submit Review"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default GuestReviewPage;