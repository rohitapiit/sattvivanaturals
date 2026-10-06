import React, {
  useState,
  useEffect,
  useCallback,
} from "react";

import { Helmet } from "react-helmet";

import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

import { useCart } from "@/hooks/useCart";

import { useToast } from "@/hooks/use-toast";

import {
  ShoppingCart,
  Loader2,
  ArrowLeft,
  CheckCircle,
  Minus,
  Plus,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import ReactGA from "react-ga4";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";

function ProductDetailPage() {
  // ==========================================
  // ROUTER
  // ==========================================

  const { id } = useParams();

  const navigate =
    useNavigate();

  // ==========================================
  // PRODUCT STATE
  // ==========================================

  const [product, setProduct] =
    useState(null);

  const [allProducts, setAllProducts] =
    useState([]);

  const [
    selectedVariant,
    setSelectedVariant,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [quantity, setQuantity] =
    useState(1);

  // ==========================================
  // IMAGE STATE
  // ==========================================

  const [
    currentImageIndex,
    setCurrentImageIndex,
  ] = useState(0);

  const [zoom, setZoom] =
    useState(false);

  const [position, setPosition] =
    useState({
      x: 50,
      y: 50,
    });

  // ==========================================
  // CART STATE
  // ==========================================

  const [added, setAdded] =
    useState(false);

  // ==========================================
  // REVIEWS STATE
  // ==========================================

  const [reviews, setReviews] =
    useState([]);

  const [
    averageRating,
    setAverageRating,
  ] = useState(0);

  const [
    totalReviews,
    setTotalReviews,
  ] = useState(0);

  const [
    reviewsLoading,
    setReviewsLoading,
  ] = useState(true);

  const [
    visibleReviewCount,
    setVisibleReviewCount,
  ] = useState(3);

  const [
    expandedReviews,
    setExpandedReviews,
  ] = useState({});

  // ==========================================
  // CART & TOAST
  // ==========================================

  const { addToCart } =
    useCart();

  const { toast } =
    useToast();

  // ==========================================
  // FETCH PRODUCT
  // ==========================================

  useEffect(() => {
    const fetchProductData =
      async () => {
        try {
          setLoading(true);
          setError(null);

          // ------------------------------
          // FETCH CURRENT PRODUCT
          // ------------------------------

          const productResponse =
            await fetch(
              `${API}/products/${id}`
            );

          const productData =
            await productResponse.json();

          if (
            !productResponse.ok ||
            !productData.success
          ) {
            throw new Error(
              productData.message ||
                "Product not found"
            );
          }

          const fetchedProduct =
            productData.product;

          setProduct(
            fetchedProduct
          );

          // ------------------------------
          // SET DEFAULT VARIANT
          // ------------------------------

          if (
            fetchedProduct.variants &&
            fetchedProduct.variants.length > 0
          ) {
            setSelectedVariant(
              fetchedProduct.variants[0]
            );
          } else {
            setSelectedVariant(null);
          }

          // ------------------------------
          // RESET IMAGE
          // ------------------------------

          setCurrentImageIndex(0);

          // ------------------------------
          // FETCH ALL PRODUCTS
          // ------------------------------

          const productsResponse =
            await fetch(
              `${API}/products`
            );

          const productsData =
            await productsResponse.json();

          if (
            productsData.success
          ) {
            setAllProducts(
              productsData.products || []
            );
          }
        } catch (fetchError) {
          console.error(
            "FETCH PRODUCT ERROR:",
            fetchError
          );

          setError(
            fetchError.message
          );
        } finally {
          setLoading(false);
        }
      };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  // ==========================================
  // FETCH REVIEWS
  // ==========================================

  useEffect(() => {
    const fetchReviews =
      async () => {
        try {
          setReviewsLoading(true);

          const response =
            await fetch(
              `${API}/reviews/product/${id}`
            );

          const data =
            await response.json();

          if (data.success) {
            setReviews(
              data.reviews || []
            );

            setAverageRating(
              data.averageRating || 0
            );

            setTotalReviews(
              data.totalReviews || 0
            );
          }
        } catch (fetchError) {
          console.error(
            "FETCH PRODUCT REVIEWS ERROR:",
            fetchError
          );
        } finally {
          setReviewsLoading(false);
        }
      };

    if (id) {
      fetchReviews();
    }
  }, [id]);

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart =
    useCallback(async () => {
      if (!product) {
        return;
      }

      try {
        const activeVariant =
          selectedVariant ||
          product.variants?.[0] ||
          null;

        const availableQuantity =
          activeVariant?.stock ??
          product.stock ??
          0;

        const formattedProduct = {
          ...product,
          image:
            product.images?.[0] ||
            "/images/logo.png",
          price:
            activeVariant?.price ??
            product.price,
        };

        // ------------------------------
        // FORMAT VARIANT
        // ------------------------------

        const formattedVariant =
          activeVariant
            ? {
                ...activeVariant,

                id:
                  activeVariant._id,
              }
            : null;

        // ------------------------------
        // LOCAL CART
        // ------------------------------

        await addToCart(
          formattedProduct,
          formattedVariant,
          quantity,
          availableQuantity
        );

        // ------------------------------
        // GA4 EVENT
        // ------------------------------

        ReactGA.event(
          "add_to_cart",
          {
            currency: "INR",

            value:
              (activeVariant?.price ??
                product.price ??
                0) * quantity,

            items: [
              {
                item_id:
                  product._id,

                item_name:
                  product.title,

                item_variant:
                  activeVariant?.size ||
                  "Default",

                price:
                  activeVariant?.price ??
                  product.price,

                quantity,
              },
            ],
          }
        );

        setAdded(true);

        setTimeout(() => {
          setAdded(false);
        }, 2000);
      } catch (cartError) {
        console.error(
          "ADD TO CART ERROR:",
          cartError
        );

        toast({
          variant: "destructive",

          title:
            "Oh no! Something went wrong.",

          description:
            cartError.message,
        });
      }
    }, [
      product,
      selectedVariant,
      quantity,
      addToCart,
      toast,
    ]);

  // ==========================================
  // QUANTITY
  // ==========================================

  const handleQuantityChange =
    useCallback((amount) => {
      setQuantity(
        (previousQuantity) => {
          const newQuantity =
            previousQuantity +
            amount;

          if (
            newQuantity < 1
          ) {
            return 1;
          }

          return newQuantity;
        }
      );
    }, []);

  // ==========================================
  // IMAGE NAVIGATION
  // ==========================================

  const handlePrevImage =
    useCallback(() => {
      if (
        product?.images?.length >
        1
      ) {
        setCurrentImageIndex(
          (previousIndex) =>
            previousIndex === 0
              ? product.images.length -
                1
              : previousIndex - 1
        );
      }
    }, [
      product?.images?.length,
    ]);

  const handleNextImage =
    useCallback(() => {
      if (
        product?.images?.length >
        1
      ) {
        setCurrentImageIndex(
          (previousIndex) =>
            previousIndex ===
            product.images.length -
              1
              ? 0
              : previousIndex + 1
        );
      }
    }, [
      product?.images?.length,
    ]);

  // ==========================================
  // SCROLL TO REVIEWS
  // ==========================================

  const scrollToReviews =
    () => {
      document
        .getElementById(
          "customer-reviews"
        )
        ?.scrollIntoView({
          behavior: "smooth",

          block: "start",
        });
    };

  // ==========================================
  // IMAGE ZOOM
  // ==========================================

  const handleMouseMove =
    (event) => {
      const {
        left,
        top,
        width,
        height,
      } =
        event.currentTarget.getBoundingClientRect();

      const x =
        ((event.clientX - left) /
          width) *
        100;

      const y =
        ((event.clientY - top) /
          height) *
        100;

      setPosition({
        x,
        y,
      });
    };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div
        className="
          flex
          justify-center
          items-center
          h-[60vh]
        "
      >
        <Loader2
          className="
            h-16
            w-16
            text-primary
            animate-spin
          "
        />
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (
    error ||
    !product
  ) {
    return (
      <div
        className="
          max-w-5xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
        "
      >
        <Link
          to="/products"
          className="
            inline-flex
            items-center
            gap-2
            text-primary
            hover:text-purple-300
            transition-colors
            mb-6
          "
        >
          <ArrowLeft size={16} />

          Go back to Products
        </Link>

        <div
          className="
            text-center
            text-red-400
            p-6
            sm:p-8
            glass-card
            rounded-2xl
          "
        >
          <XCircle
            className="
              mx-auto
              h-16
              w-16
              mb-4
            "
          />

          <p className="mb-6">
            Error loading product:
            {" "}
            {error}
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PRODUCT VALUES
  // ==========================================

  const price =
    `₹${
      selectedVariant?.price ??
      product.price ??
      0
    }`;

  const cutPrice =
    selectedVariant?.cutPrice ??
    product.cutPrice ??
    null;

  const hasCutPrice =
    cutPrice !== null &&
    cutPrice !== undefined &&
    Number(cutPrice) > Number(selectedVariant?.price ?? product.price ?? 0);

  const availableStock =
    selectedVariant?.stock ??
    product.stock ??
    0;

  const canAddToCart =
    quantity <= availableStock;

  const isOutOfStock =
    availableStock <= 0;

  const currentImage =
    product.images?.[
      currentImageIndex
    ] ||
    "/images/logo.png";

  const hasMultipleImages =
    product.images?.length > 1;

  const relatedProducts =
    allProducts.filter(
      (item) =>
        item._id !==
        product._id
    );

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <>
      <Helmet>
        <title>
          {product.title}
          {" - "}
          Our Store
        </title>

        <meta
          name="description"
          content={
            product.description?.substring(
              0,
              160
            ) ||
            product.title
          }
        />
      </Helmet>

      <div
        className="
          max-w-5xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          w-full
          overflow-x-hidden
        "
      >
        {/* BACK TO PRODUCT CATALOG */}

        <Link
          to="/products"
          className="
            inline-flex
            items-center
            gap-2
            text-primary
            hover:text-purple-300
            transition-colors
            mb-4
            sm:mb-6
          "
        >
          <ArrowLeft size={16} />

          Back to Products
        </Link>

        {/* PRODUCT CARD */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2

            gap-6
            md:gap-8

            bg-white

            p-4
            sm:p-6
            md:p-8

            rounded-2xl

            shadow-lg
          "
        >
          {/* IMAGE SECTION */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.5,
            }}
            className="
              relative
              min-w-0
              w-full
            "
          >
            <div
              className="
                relative
                overflow-hidden
                rounded-lg
                shadow-2xl
                w-full
                max-w-full

                h-64
                sm:h-96
                md:h-[500px]

                bg-gray-50
                cursor-zoom-in
              "
              onMouseEnter={() =>
                setZoom(true)
              }
              onMouseLeave={() =>
                setZoom(false)
              }
              onMouseMove={
                handleMouseMove
              }
            >
              <img
                src={
                  currentImage
                }
                alt={
                  product.title
                }
                className="
                  w-full
                  h-full
                  object-contain
                  transition-transform
                  duration-200
                  ease-out
                "
                style={{
                  transform:
                    zoom
                      ? "scale(2)"
                      : "scale(1)",

                  transformOrigin:
                    `${position.x}% ${position.y}%`,
                }}
              />

              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onClick={
                      handlePrevImage
                    }
                    className="
                      absolute
                      left-2
                      top-1/2
                      -translate-y-1/2

                      bg-black/50
                      hover:bg-black/70

                      text-white

                      p-2

                      rounded-full

                      transition-colors
                    "
                    aria-label="Previous image"
                  >
                    <ChevronLeft
                      size={20}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleNextImage
                    }
                    className="
                      absolute
                      right-2
                      top-1/2
                      -translate-y-1/2

                      bg-black/50
                      hover:bg-black/70

                      text-white

                      p-2

                      rounded-full

                      transition-colors
                    "
                    aria-label="Next image"
                  >
                    <ChevronRight
                      size={20}
                    />
                  </button>
                </>
              )}
            </div>

            {/* MOBILE DOTS */}

            {hasMultipleImages && (
              <div
                className="
                  flex
                  justify-center
                  gap-2
                  mt-4
                "
              >
                {product.images.map(
                  (
                    _,
                    index
                  ) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setCurrentImageIndex(
                          index
                        )
                      }
                      className={`
                        w-3
                        h-3
                        rounded-full
                        transition-colors

                        ${
                          index ===
                          currentImageIndex
                            ? "bg-purple-500"
                            : "bg-gray-300 hover:bg-gray-400"
                        }
                      `}
                      aria-label={
                        `Go to image ${
                          index + 1
                        }`
                      }
                    />
                  )
                )}
              </div>
            )}

            {/* THUMBNAILS */}

            {hasMultipleImages && (
              <div
                className="
                  hidden
                  md:flex

                  flex-nowrap
                  gap-2

                  mt-4

                  overflow-x-auto

                  min-w-0
                  max-w-full
                "
              >
                {product.images.map(
                  (
                    image,
                    index
                  ) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setCurrentImageIndex(
                          index
                        )
                      }
                      className={`
                        flex-shrink-0

                        w-16
                        h-16

                        rounded-md

                        overflow-hidden

                        border-2

                        transition-colors

                        ${
                          index ===
                          currentImageIndex
                            ? "border-purple-500"
                            : "border-gray-200 hover:border-gray-400"
                        }
                      `}
                    >
                      <img
                        src={
                          image ||
                          "/images/logo.png"
                        }
                        alt={
                          `${product.title} ${
                            index + 1
                          }`
                        }
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </motion.div>

          {/* PRODUCT INFORMATION */}

          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
            className="
              flex
              flex-col
              min-w-0
              w-full
            "
          >
            {/* REVIEWS */}

            {totalReviews > 0 && (
              <button
                type="button"
                onClick={
                  scrollToReviews
                }
                className="
                  flex
                  items-center
                  gap-2
                  mb-2
                  group
                  cursor-pointer
                "
                aria-label="View customer reviews"
              >
                <div
                  className="
                    flex
                    items-center
                  "
                >
                  {[1, 2, 3, 4, 5].map(
                    (star) => {
                      const fillPercentage =
                        Math.max(
                          0,
                          Math.min(
                            1,
                            averageRating -
                              (star - 1)
                          )
                        ) *
                        100;

                      return (
                        <span
                          key={star}
                          className="
                            text-xl
                            leading-none
                          "
                          style={{
                            background:
                              `linear-gradient(
                                90deg,
                                #facc15 ${fillPercentage}%,
                                #d1d5db ${fillPercentage}%
                              )`,

                            WebkitBackgroundClip:
                              "text",

                            WebkitTextFillColor:
                              "transparent",

                            backgroundClip:
                              "text",
                          }}
                        >
                          ★
                        </span>
                      );
                    }
                  )}
                </div>

                <span
                  className="
                    font-semibold
                    text-gray-700
                  "
                >
                  {averageRating.toFixed(
                    1
                  )}
                </span>

                <span
                  className="
                    text-gray-500
                    text-sm

                    group-hover:underline
                  "
                >
                  (
                  {totalReviews}
                  {" "}
                  {totalReviews === 1
                    ? "review"
                    : "reviews"}
                  )
                </span>
              </button>
            )}

            {/* TITLE */}

            <h1
              className="
                text-2xl
                sm:text-3xl
                md:text-4xl

                font-bold

                text-primary

                mb-2

                break-words
              "
            >
              {product.title}
            </h1>

            {/* CATEGORY */}

            <p
              className="
                text-base
                sm:text-lg

                text-gray-600

                mb-4
              "
            >
              {product.category}
            </p>

            {/* OUT OF STOCK */}

            {isOutOfStock && (
              <div className="mt-2">
                <p
                  className="
                    text-sm
                    font-medium
                    text-red-600
                  "
                >
                  This product is currently
                  out of stock
                </p>
              </div>
            )}

            {/* VARIANTS */}

            {product.variants?.length >
              0 && (
              <div className="mb-4">
                <label
                  className="
                    block
                    font-semibold
                    mb-2
                  "
                >
                  Select Size
                </label>

                <select
                  value={
                    selectedVariant?.size ||
                    ""
                  }
                  onChange={(event) => {
                    const variant =
                      product.variants.find(
                        (item) =>
                          item.size ===
                          event.target.value
                      );

                    setSelectedVariant(
                      variant
                    );

                    setQuantity(1);
                  }}
                  className="
                    border
                    rounded-lg
                    p-3
                    w-full
                    text-base
                  "
                >
                  {product.variants.map(
                    (
                      variant
                    ) => (
                      <option
                        key={
                          variant._id ||
                          variant.size
                        }
                        value={
                          variant.size
                        }
                      >
                        {variant.size}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}

            {/* PRICE */}

            <div
              className="
                flex
                items-baseline
                gap-3

                mb-6

                flex-wrap
              "
            >
              {hasCutPrice && (
                <span
                  className="
                    text-xl
                    sm:text-2xl
                    text-gray-400
                    line-through
                  "
                >
                  ₹{Number(cutPrice).toLocaleString("en-IN")}
                </span>
              )}

              <span
                className="
                  text-3xl
                  sm:text-4xl
                  font-bold
                  text-secondary
                "
              >
                {price}
              </span>
            </div>

            {/* QUANTITY */}

            <div
              className="
                flex
                items-center
                gap-4
                mb-6
              "
            >
              <div
                className="
                  flex
                  items-center

                  border
                  border-gray-200

                  rounded-full

                  p-1
                "
              >
                <Button
                  type="button"
                  onClick={() =>
                    handleQuantityChange(
                      -1
                    )
                  }
                  variant="ghost"
                  size="icon"
                  disabled={
                    quantity === 1 ||
                    isOutOfStock
                  }
                  className="
                    rounded-full

                    h-8
                    w-8

                    text-primary

                    hover:bg-gray-100

                    disabled:opacity-50

                    disabled:cursor-not-allowed
                  "
                >
                  <Minus
                    size={16}
                  />
                </Button>

                <span
                  className="
                    w-10
                    text-center

                    text-primary

                    font-bold
                  "
                >
                  {quantity}
                </span>

                <Button
                  type="button"
                  onClick={() =>
                    handleQuantityChange(
                      1
                    )
                  }
                  variant="ghost"
                  size="icon"
                  disabled={
                    isOutOfStock ||
                    quantity >=
                      availableStock
                  }
                  className="
                    rounded-full

                    h-8
                    w-8

                    text-primary

                    hover:bg-gray-100

                    disabled:opacity-50

                    disabled:cursor-not-allowed
                  "
                >
                  <Plus
                    size={16}
                  />
                </Button>
              </div>
            </div>

            {/* ACTION BUTTONS */}

            <div className="mt-auto">
              <Button
                type="button"
                onClick={
                  handleAddToCart
                }
                size="lg"
                disabled={
                  isOutOfStock ||
                  !canAddToCart ||
                  added
                }
                className={`
                  w-full

                  font-semibold

                  py-3

                  text-base
                  sm:text-lg

                  transition-all
                  duration-300

                  ${
                    isOutOfStock
                      ? `
                        bg-gray-400
                        text-white
                        cursor-not-allowed
                        hover:bg-gray-400
                      `
                      : added
                      ? `
                        bg-green-600
                        hover:bg-green-600
                        text-white
                      `
                      : `
                        bg-gradient-to-r
                        from-purple-500
                        to-pink-500

                        hover:from-purple-600
                        hover:to-pink-600

                        text-white
                      `
                  }
                `}
              >
                {isOutOfStock ? (
                  "Out of Stock"
                ) : added ? (
                  <>
                    <CheckCircle
                      className="
                        mr-2
                        h-5
                        w-5
                      "
                    />

                    Added
                  </>
                ) : (
                  <>
                    <ShoppingCart
                      className="
                        mr-2
                        h-5
                        w-5
                      "
                    />

                    Add to Cart
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={() => {
                  if (isOutOfStock) {
                    return;
                  }

                  navigate(
                    "/checkout",
                    {
                      state: {
                        buyNowItem: {
                          product: {
                            ...product,

                            image:
                              product
                                .images?.[0] ||
                              "/images/logo.png",
                          },

                          variant:
                            selectedVariant,

                          quantity,
                        },
                      },
                    }
                  );
                }}
                size="lg"
                variant="outline"
                disabled={
                  isOutOfStock
                }
                className={`
                  w-full
                  mt-4

                  text-base
                  sm:text-lg

                  transition-all
                  duration-300

                  ${
                    isOutOfStock
                      ? `
                        border-gray-400
                        text-gray-400
                        cursor-not-allowed

                        hover:bg-transparent
                        hover:text-gray-400
                      `
                      : `
                        border-secondary
                        text-secondary

                        hover:bg-secondary
                        hover:text-white
                      `
                  }
                `}
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : "Buy Now"}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* PRODUCT DETAILS */}

        <div
          className="
            mt-8
            border-t
            pt-6
          "
        >
          <div
            className="
              mt-6
              sm:mt-10

              space-y-6
              sm:space-y-8
            "
          >
            <div
              className="
                bg-gray-50
                rounded-2xl

                p-4
                sm:p-6

                shadow-sm
              "
            >
              <h2
                className="
                  text-xl
                  sm:text-2xl

                  font-bold

                  mb-3
                  sm:mb-4
                "
              >
                Description
              </h2>

              <p
                className="
                  text-gray-700

                  leading-7
                  sm:leading-8

                  text-sm
                  sm:text-base
                "
              >
                {product.description}
              </p>
            </div>

            <div
              className="
                bg-gray-50
                rounded-2xl

                p-4
                sm:p-6

                shadow-sm
              "
            >
              <h2
                className="
                  text-xl
                  sm:text-2xl

                  font-bold

                  mb-3
                  sm:mb-4
                "
              >
                Key Benefits
              </h2>

              <ul
                className="
                  space-y-3

                  text-gray-700

                  text-sm
                  sm:text-base
                "
              >
                {product.keyBenefits?.map(
                  (
                    benefit,
                    index
                  ) => (
                    <li
                      key={index}
                    >
                      ✔
                      {" "}
                      {benefit}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div
              className="
                bg-gray-50
                rounded-2xl

                p-4
                sm:p-6

                shadow-sm
              "
            >
              <h2
                className="
                  text-xl
                  sm:text-2xl

                  font-bold

                  mb-3
                  sm:mb-4
                "
              >
                Ingredients
              </h2>

              <p
                className="
                  text-gray-700

                  leading-7
                  sm:leading-8

                  text-sm
                  sm:text-base
                "
              >
                {product.ingredients}
              </p>
            </div>

            <div
              className="
                bg-gray-50
                rounded-2xl

                p-4
                sm:p-6

                shadow-sm
              "
            >
              <h2
                className="
                  text-xl
                  sm:text-2xl

                  font-bold

                  mb-3
                  sm:mb-4
                "
              >
                Nutritional Information
              </h2>

              <p
                className="
                  text-gray-700

                  leading-7
                  sm:leading-8

                  text-sm
                  sm:text-base
                "
              >
                {
                  product.nutritionalInformation
                }
              </p>
            </div>
          </div>
        </div>

        {/* USES */}

        {product.uses?.length >
          0 && (
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2

              gap-6
              md:gap-8

              mt-8
              md:mt-12
            "
          >
            {product.uses.map(
              (
                use,
                index
              ) => (
                <div
                  key={index}
                  className="
                    bg-white

                    rounded-2xl

                    shadow-md

                    overflow-hidden
                  "
                >
                  {use.image && (
                    <img
                      src={
                        use.image
                      }
                      alt={
                        use.title
                      }
                      className="
                        w-full

                        h-40
                        sm:h-52

                        object-cover
                      "
                    />
                  )}

                  <div
                    className="
                      p-4
                      sm:p-5
                    "
                  >
                    <h3
                      className="
                        font-bold

                        text-lg
                        sm:text-xl
                      "
                    >
                      {use.title}
                    </h3>

                    <p
                      className="
                        text-gray-500

                        mt-2

                        text-sm
                        sm:text-base
                      "
                    >
                      {
                        use.description
                      }
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* CUSTOMER REVIEWS */}

        <div
          id="customer-reviews"
          className="
            mt-10
            scroll-mt-24
          "
        >
          <h2
            className="
              text-2xl
              font-semibold
              mb-6
            "
          >
            Customer Reviews
          </h2>

          {reviewsLoading ? (
            <p className="text-gray-500">
              Loading reviews...
            </p>
          ) : reviews.length ===
            0 ? (
            <p className="text-gray-500">
              No reviews yet for this
              product.
            </p>
          ) : (
            <>
              <div
                className="
                  space-y-5
                "
              >
                {reviews
                  .slice(
                    0,
                    visibleReviewCount
                  )
                  .map((item) => {
                    const isExpanded =
                      expandedReviews[
                        item._id
                      ];

                    const isLongReview =
                      item.review &&
                      item.review.length >
                        200;

                    return (
                      <div
                        key={
                          item._id
                        }
                        className="
                          border
                          rounded-xl

                          p-5

                          bg-white
                        "
                      >
                        <p
                          className="
                            font-semibold
                          "
                        >
                          {item.name}
                        </p>

                        {item.isGuest && (
                          <span
                            className="
                              text-xs
                              text-gray-400
                            "
                          >
                            Guest Customer
                          </span>
                        )}

                        <div
                          className="
                            flex
                            mt-2
                          "
                        >
                          {[
                            1,
                            2,
                            3,
                            4,
                            5,
                          ].map(
                            (
                              star
                            ) => (
                              <span
                                key={
                                  star
                                }
                                className={
                                  star <=
                                  item.rating
                                    ? `
                                      text-yellow-400
                                      text-xl
                                    `
                                    : `
                                      text-gray-300
                                      text-xl
                                    `
                                }
                              >
                                ★
                              </span>
                            )
                          )}
                        </div>

                        <div className="mt-3">
                          <p
                            className={`
                              text-gray-700
                              leading-6

                              ${
                                !isExpanded &&
                                isLongReview
                                  ? "line-clamp-2"
                                  : ""
                              }
                            `}
                          >
                            {
                              item.review
                            }
                          </p>

                          {isLongReview && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedReviews(
                                  (
                                    previous
                                  ) => ({
                                    ...previous,

                                    [item._id]:
                                      !previous[
                                        item._id
                                      ],
                                  })
                                )
                              }
                              className="
                                mt-1

                                text-sm
                                font-semibold

                                text-primary

                                hover:underline

                                inline-flex
                                items-center
                                gap-1
                              "
                            >
                              {isExpanded ? (
                                <>
                                  Read less

                                  <ChevronUp
                                    size={
                                      15
                                    }
                                  />
                                </>
                              ) : (
                                <>
                                  ... Read more

                                  <ChevronDown
                                    size={
                                      15
                                    }
                                  />
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {item.images?.length >
                          0 && (
                          <div
                            className="
                              flex
                              flex-wrap
                              gap-3
                              mt-4
                            "
                          >
                            {item.images.map(
                              (
                                image,
                                index
                              ) => (
                                <img
                                  key={
                                    index
                                  }
                                  src={
                                    image
                                  }
                                  alt="Customer review"
                                  className="
                                    w-20
                                    h-20

                                    object-cover

                                    rounded-lg

                                    border
                                  "
                                />
                              )
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

              {visibleReviewCount <
                reviews.length && (
                <div
                  className="
                    flex
                    justify-center
                    mt-8
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleReviewCount(
                        (
                          previous
                        ) =>
                          Math.min(
                            previous + 5,
                            reviews.length
                          )
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-2

                      px-6
                      py-3

                      border
                      border-gray-300

                      rounded-full

                      bg-white

                      text-primary

                      font-semibold

                      hover:bg-gray-50

                      transition
                    "
                  >
                    Show more reviews

                    <ChevronDown
                      size={18}
                    />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* RELATED PRODUCTS */}

        <div
          className="
            mt-12
            sm:mt-16
            md:mt-20
          "
        >
          <h2
            className="
              text-2xl
              sm:text-3xl

              font-bold

              mb-6
              sm:mb-8
            "
          >
            You May Also Like
          </h2>

          <div
            className="
              flex
              flex-nowrap

              gap-4
              sm:gap-6

              overflow-x-auto

              pb-4

              no-scrollbar

              min-w-0
              max-w-full
            "
          >
            {relatedProducts.map(
              (item) => (
                <div
                  key={
                    item._id
                  }
                  className="
                    min-w-[200px]
                    sm:min-w-[250px]

                    bg-white

                    rounded-2xl

                    shadow-md

                    overflow-hidden

                    hover:shadow-xl

                    transition
                  "
                >
                  <img
                    src={
                      item.images?.[0] ||
                      "/images/logo.png"
                    }
                    alt={
                      item.title
                    }
                    className="
                      w-full

                      h-40
                      sm:h-52

                      object-cover
                    "
                  />

                  <div className="p-4">
                    <h3
                      className="
                        font-bold

                        text-base
                        sm:text-lg
                      "
                    >
                      {item.title}
                    </h3>

                    <p
                      className="
                        text-gray-500

                        mt-2

                        text-sm
                        sm:text-base
                      "
                    >
                      ₹
                      {item.price}
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      className="
                        w-full
                        mt-4
                      "
                      onClick={() =>
                        navigate(
                          `/product/${item._id}`
                        )
                      }
                    >
                      View Product
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailPage;