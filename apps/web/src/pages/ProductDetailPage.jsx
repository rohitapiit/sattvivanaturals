import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import {ShoppingCart,Loader2,ArrowLeft,CheckCircle,Minus,Plus,XCircle,ChevronLeft,ChevronRight,ChevronDown,ChevronUp,Star} from 'lucide-react';
import ReactGA from "react-ga4";
const API = import.meta.env.VITE_API_URL;

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [visibleReviewCount, setVisibleReviewCount] = useState(3);
const [expandedReviews, setExpandedReviews] = useState({});

  const [selectedVariant, setSelectedVariant] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
const [position, setPosition] = useState({
  x: 50,
  y: 50,
});
  const [activeTab, setActiveTab] = useState("description");
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

useEffect(() => {
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);

      const response = await fetch(
        `${API}/reviews/product/${id}`
      );

      const data = await response.json();

      if (data.success) {
  setReviews(data.reviews || []);
  setAverageRating(data.averageRating || 0);
  setTotalReviews(data.totalReviews || 0);
} else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(
        "FETCH PRODUCT REVIEWS ERROR:",
        error
      );
    } finally {
      setReviewsLoading(false);
    }
  };

  if (id) {
    fetchReviews();
  }
}, [id]);

  const handleAddToCart = useCallback(async () => {
    if (product && selectedVariant) {
      const availableQuantity = selectedVariant.stock;
      try {
        const formattedProduct = {
          ...product,
          image: product.images?.[0] || "/images/logo.png",
          price: selectedVariant ? selectedVariant.price : product.price,
        };

        const token = localStorage.getItem("token");

        if (token) {
          const response = await fetch(`${API}/cart/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              productId: product._id,
              quantity,
              size: selectedVariant.size,
            }),
          });
        
          const data = await response.json();
        
          if (!data.success) {
            throw new Error(data.message);
          }
        }
        const formattedVariant = {
          ...selectedVariant,
          id: selectedVariant._id,
        };
        
        await addToCart(
  formattedProduct,
  formattedVariant,
  quantity,
  availableQuantity
);

// GA4 - Add to Cart event
ReactGA.event("add_to_cart", {
  currency: "INR",
  value: selectedVariant.price * quantity,
  items: [
    {
      item_id: product._id,
      item_name: product.title,
      item_variant: selectedVariant.size || "Default",
      price: selectedVariant.price,
      quantity: quantity,
    },
  ],
});

setAdded(true);

        setTimeout(() => {
          setAdded(false);
        }, 2000);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Oh no! Something went wrong.",
          description: error.message,
        });
      }
    }
  }, [product, selectedVariant, quantity, addToCart, toast]);

  const handleQuantityChange = useCallback((amount) => {
    setQuantity(prevQuantity => {
        const newQuantity = prevQuantity + amount;
        if (newQuantity < 1) return 1;
        return newQuantity;
    });
  }, []);

  const handlePrevImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
    }
  }, [product?.images?.length]);

  const handleNextImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1);
    }
  }, [product?.images?.length]);

  // --------ZoomIn Out-------

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
  
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
  
    setPosition({ x, y });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API}/products/${id}`,
        );
        const data = await response.json();

        if (data.success) {
          setProduct(data.product);

          if (
            data.product.variants &&
            data.product.variants.length > 0
          ) {
            setSelectedVariant(
              data.product.variants[0]
            );
          }
        }

        if (data.product.variants?.length > 0) {
          setSelectedVariant(data.product.variants[0]);
        }

        const productsResponse =
          await fetch(
            `${API}/products`,
          );

        const productsData =
          await productsResponse.json();

        setAllProducts(
          productsData.products
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-purple-300 transition-colors mb-6">
          <ArrowLeft size={16} />
          Go back
        </Link>
        <div className="text-center text-red-400 p-6 sm:p-8 glass-card rounded-2xl">
          <XCircle className="mx-auto h-16 w-16 mb-4" />
          <p className="mb-6">Error loading product: {error}</p>
        </div>
      </div>
    );
  }

  const price = `₹${
    selectedVariant
      ? selectedVariant.price
      : product?.price || 0
  }`;
  const originalPrice = selectedVariant?.price_formatted;
  const availableStock =
    selectedVariant
      ? selectedVariant.stock
      : product.stock;
      
  const canAddToCart = quantity <= availableStock;

  const isOutOfStock = availableStock <= 0;
  const currentImage =
    product?.images?.[currentImageIndex] ||
    "/images/logo.png";

  const hasMultipleImages =
    product?.images?.length > 1;

  const relatedProducts =
    allProducts.filter(
      p => p._id !== product._id
    );

  return (
    <>
      <Helmet>
        <title>{product.title} - Our Store</title>
        <meta name="description" content={product.description?.substring(0, 160) || product.title} />
      </Helmet>

      {/* Outer container: horizontal padding on small screens so content never
          touches the screen edge; scales up at sm/md/lg breakpoints. */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
        <Link to="/store" className="inline-flex items-center gap-2 text-primary hover:text-purple-300 transition-colors mb-4 sm:mb-6">
          <ArrowLeft size={16} />
          Back to Store
        </Link>

        {/* Main product card: single column on mobile, two columns from md up.
            Padding and gap shrink on small screens to avoid cramped edges. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative min-w-0 w-full">
            {/* Image height scales: shorter on phones, taller on tablets/desktop */}
            <div
  className="relative overflow-hidden rounded-lg shadow-2xl w-full max-w-full h-64 sm:h-96 md:h-[500px] bg-gray-50 cursor-zoom-in"
  onMouseEnter={() => setZoom(true)}
  onMouseLeave={() => setZoom(false)}
  onMouseMove={handleMouseMove}
>
<img
  src={currentImage}
  alt={product.title}
  className="w-full h-full object-contain transition-transform duration-200 ease-out"
  style={{
    transform: zoom ? "scale(2)" : "scale(1)",
    transformOrigin: `${position.x}% ${position.y}%`,
  }}
/>

              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {hasMultipleImages && (
              <div className="flex justify-center gap-2 mt-4">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-purple-500' : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Thumbnail strip: hidden on phones (dots above are the mobile
                pagination UI already), shown from md up, horizontally
                scrollable so it never overflows the card on tablets. */}
            {hasMultipleImages && (
              <div className="hidden md:flex flex-nowrap gap-2 mt-4 overflow-x-auto min-w-0 max-w-full">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-purple-500' : 'border-white/30 hover:border-white/50'
                    }`}
                  >
                    <img
                      src={image || "/images/logo.png"}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col min-w-0 w-full">
            {/* Title scales down on phones so long product names don't wrap awkwardly */}

            {totalReviews > 0 && (
  <div className="flex items-center gap-2 mb-2">
    <div className="flex items-center">
      <span className="text-yellow-400 text-lg">
        ★
      </span>

      <span className="ml-1 font-semibold text-gray-700">
        {averageRating.toFixed(1)}
      </span>
    </div>

    <span className="text-gray-500 text-sm">
      ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
    </span>
  </div>
)}


            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2 break-words">{product.title}</h1>

            <p className="text-base sm:text-lg text-gray-600 mb-4">
              {product.category}
            </p>

           {isOutOfStock && (
  <div className="mt-2">
    <p className="text-sm font-medium text-red-600">
      This product is currently out of stock
    </p>
  </div>
)}

            {product?.variants?.length > 0 && (
              <div className="mb-4">
                <label className="block font-semibold mb-2">
                  Select Size
                </label>

                <select
                  value={selectedVariant?.size || ""}
                  onChange={(e) => {
                    const variant =
                      product.variants.find(
                        (v) =>
                          v.size ===
                          e.target.value
                      );

                    setSelectedVariant(
                      variant
                    );
                  }}
                  className="border rounded-lg p-3 w-full text-base"
                >
                  {product.variants.map(
                    (variant) => (
                      <option
                        key={variant.size}
                        value={variant.size}
                      >
                        {variant.size}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-6 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold text-secondary">{price}</span>
              {selectedVariant?.sale_price_in_cents && (
                <span className="text-xl sm:text-2xl text-gray-400 line-through">{originalPrice}</span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-white/20 rounded-full p-1">
                <Button
  onClick={() => handleQuantityChange(-1)}
  variant="ghost"
  size="icon"
  disabled={quantity === 1 || isOutOfStock}
  className="rounded-full h-8 w-8 text-primary hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
>
  <Minus size={16} />
</Button>
                <span className="w-10 text-center text-primary font-bold">{quantity}</span>
                <Button
  onClick={() => handleQuantityChange(1)}
  variant="ghost"
  size="icon"
  disabled={isOutOfStock}
  className="rounded-full h-8 w-8 text-primary hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
>
  <Plus size={16} />
</Button>
              </div>
            </div>

            <div className="mt-auto">
              <Button
  onClick={handleAddToCart}
  size="lg"
  disabled={isOutOfStock || !canAddToCart || added}
  className={`w-full font-semibold py-3 text-base sm:text-lg transition-all duration-300 ${
    isOutOfStock
      ? "bg-gray-400 text-white cursor-not-allowed hover:bg-gray-400"
      : added
      ? "bg-green-600 hover:bg-green-600 text-white"
      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
  }`}
>
  {isOutOfStock ? (
    "Out of Stock"
  ) : added ? (
    <>
      <CheckCircle className="mr-2 h-5 w-5" />
      Added
    </>
  ) : (
    <>
      <ShoppingCart className="mr-2 h-5 w-5" />
      Add to Cart
    </>
  )}
</Button>

             <Button
  onClick={() => {
    navigate("/checkout", {
      state: {
        buyNowItem: {
          product: {
            ...product,
            image: product.images?.[0] || "/images/logo.png",
          },
          variant: selectedVariant,
          quantity,
        },
      },
    });
  }}
  size="lg"
  variant="outline"
  disabled={isOutOfStock}
  className={`w-full mt-4 text-base sm:text-lg transition-all duration-300 ${
    isOutOfStock
      ? "border-gray-400 text-gray-400 cursor-not-allowed hover:bg-transparent hover:text-gray-400"
      : "border-secondary text-secondary hover:bg-secondary hover:text-white"
  }`}
>
  {isOutOfStock ? "Out of Stock" : "Buy Now"}
</Button>

              {!canAddToCart && (
                <p className="text-sm text-red-600 mt-3 flex items-center justify-center gap-2">
                  {/* <XCircle size={16} />
                  Only {availableStock} left */}
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Product details: 1 column on mobile/tablet, still readable at full width.
            Padding shrinks on small screens; headings scale down too. */}
        <div className="mt-8 border-t pt-6">
          <div className="mt-6 sm:mt-10 space-y-6 sm:space-y-8">

            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-7 sm:leading-8 text-sm sm:text-base">
                {product.description}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                Key Benefits
              </h2>
              <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
                {product.keyBenefits?.map(
                  (benefit, index) => (
                    <li key={index}>
                      ✔ {benefit}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                Ingredients
              </h2>
              <p className="text-gray-700 leading-7 sm:leading-8 text-sm sm:text-base">
                {product.ingredients}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                Nutritional Information
              </h2>
              <p className="text-gray-700 leading-7 sm:leading-8 text-sm sm:text-base">
                {product.nutritionalInformation}
              </p>
            </div>

          </div>
        </div>

        {/* Uses section: single column on mobile, two columns from md up */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-8 md:mt-12">
          <div className="mt-6 sm:mt-10">
            <div className="grid gap-4 sm:gap-6">
              {product.uses?.map((use, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md overflow-hidden"
                >
                  <img
                    src={use.image}
                    alt={use.title}
                    className="w-full h-40 sm:h-52 object-cover"
                  />
                  <div className="p-4 sm:p-5">
                    <h3 className="font-bold text-lg sm:text-xl">
                      {use.title}
                    </h3>
                    <p className="text-gray-500 mt-2 text-sm sm:text-base">
                      {use.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>



      <div className="mt-10">

  <h2 className="text-2xl font-semibold mb-6">
    Customer Reviews
  </h2>

  {reviewsLoading ? (
    <p className="text-gray-500">
      Loading reviews...
    </p>
  ) : reviews.length === 0 ? (
    <p className="text-gray-500">
      No reviews yet for this product.
    </p>
  ) : (
    <>
      <div className="space-y-5">

        {reviews.slice(0, visibleReviewCount).map((item) => {

          const isExpanded = expandedReviews[item._id];

          // Approximate check for long reviews
          const isLongReview =
            item.review && item.review.length > 200;

          return (
            <div
              key={item._id}
              className="border rounded-xl p-5 bg-white"
            >

              {/* Customer Name */}
              <p className="font-semibold">
                {item.name}
              </p>

              {/* Guest label */}
              {item.isGuest && (
                <span className="text-xs text-gray-400">
                  Guest Customer
                </span>
              )}

              {/* Stars */}
              <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= item.rating
                        ? "text-yellow-400 text-xl"
                        : "text-gray-300 text-xl"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Review text */}
              <div className="mt-3">
                <p
                  className={`text-gray-700 leading-6 ${
                    !isExpanded && isLongReview
                      ? "line-clamp-2"
                      : ""
                  }`}
                >
                  {item.review}
                </p>

                {/* Read More / Read Less */}
                {isLongReview && (
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedReviews((prev) => ({
                        ...prev,
                        [item._id]: !prev[item._id],
                      }))
                    }
                    className="mt-1 text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        Read less
                        <ChevronUp size={15} />
                      </>
                    ) : (
                      <>
                        ... Read more
                        <ChevronDown size={15} />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Images */}
              {item.images?.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {item.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt="Customer review"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              )}

            </div>
          );
        })}

      </div>

      {/* Show More Reviews */}
      {visibleReviewCount < reviews.length && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={() =>
              setVisibleReviewCount((prev) =>
                Math.min(prev + 5, reviews.length)
              )
            }
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full bg-white text-primary font-semibold hover:bg-gray-50 transition"
          >
            Show more reviews
            <ChevronDown size={18} />
          </button>
        </div>
      )}

    </>
  )}

</div>

        {/* Related products: horizontally scrollable card row on every screen
            size, with narrower cards on phones so at least 1.5 cards peek
            into view (a strong "swipe for more" affordance on mobile). */}
        <div className="mt-12 sm:mt-16 md:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
            You May Also Like
          </h2>

          <div className="flex flex-nowrap gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar min-w-0 max-w-full">
            {relatedProducts.map(item => (
              <div
                key={item._id}
                className="min-w-[200px] sm:min-w-[250px] bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={
                    item.images?.[0] ||
                    "/images/logo.png"
                  }
                  alt={item.title}
                  className="w-full h-40 sm:h-52 object-cover"
                />

                <div className="p-4">
                  <h3 className="font-bold text-base sm:text-lg">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 mt-2 text-sm sm:text-base">
                    ₹{item.price}
                  </p>

                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() =>
                      navigate(`/product/${item._id}`)
                    }
                  >
                    View Product
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}

export default ProductDetailPage;