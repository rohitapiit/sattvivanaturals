import React, {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

// ==========================================
// API
// ==========================================

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";

// ==========================================
// HERO COMPONENT
// ==========================================

const Hero = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [banners, setBanners] = useState([]);

  const [products, setProducts] = useState([]);

  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentProductPage, setCurrentProductPage] = useState(0);

  const [loadingBanners, setLoadingBanners] = useState(true);

  const navigate = useNavigate();

  // ==========================================
  // FETCH ACTIVE BANNERS
  // ==========================================

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoadingBanners(true);

        const response = await fetch(
          `${API}/banners/active`
        );

        const data = await response.json();

        if (data.success) {
          setBanners(
            Array.isArray(data.banners)
              ? data.banners
              : []
          );
        }
      } catch (error) {
        console.error(
          "FETCH BANNERS ERROR:",
          error
        );
      } finally {
        setLoadingBanners(false);
      }
    };

    fetchBanners();
  }, []);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${API}/products`
        );

        const data = await response.json();

        if (data.success) {
          const activeProducts =
            (data.products || []).filter(
              (product) =>
                product.isActive !== false
            );

          setProducts(activeProducts);
        }
      } catch (error) {
        console.error(
          "FETCH PRODUCTS ERROR:",
          error
        );
      }
    };

    fetchProducts();
  }, []);

  // ==========================================
  // AUTO CHANGE BANNER
  // ==========================================

  useEffect(() => {
    if (banners.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentBanner((previous) =>
        previous === banners.length - 1
          ? 0
          : previous + 1
      );
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [banners.length]);

  // ==========================================
  // PREVIOUS BANNER
  // ==========================================

  const handlePreviousBanner = (event) => {
    event.stopPropagation();

    if (banners.length === 0) {
      return;
    }

    setCurrentBanner((previous) =>
      previous === 0
        ? banners.length - 1
        : previous - 1
    );
  };

  // ==========================================
  // NEXT BANNER
  // ==========================================

  const handleNextBanner = (event) => {
    event.stopPropagation();

    if (banners.length === 0) {
      return;
    }

    setCurrentBanner((previous) =>
      previous === banners.length - 1
        ? 0
        : previous + 1
    );
  };

  // ==========================================
  // PRODUCT CAROUSEL
  // Four products are shown per slot.
  // ==========================================

  const productsPerPage = 4;
  const productPageCount = Math.max(
    1,
    Math.ceil(products.length / productsPerPage)
  );

  useEffect(() => {
    setCurrentProductPage((page) =>
      Math.min(page, productPageCount - 1)
    );
  }, [productPageCount]);

  const visibleProducts = products.slice(
    currentProductPage * productsPerPage,
    currentProductPage * productsPerPage + productsPerPage
  );

  const handlePreviousProducts = (event) => {
    event.stopPropagation();

    setCurrentProductPage((page) =>
      page === 0 ? productPageCount - 1 : page - 1
    );
  };

  const handleNextProducts = (event) => {
    event.stopPropagation();

    setCurrentProductPage((page) =>
      page === productPageCount - 1 ? 0 : page + 1
    );
  };

  // ==========================================
  // CURRENT BANNER
  // ==========================================

  const activeBanner =
    banners[currentBanner];

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <section
      className="
        relative
        w-full
        bg-[#f8f6f1]
        px-2
        py-2
        md:px-3
        md:py-3
      "
    >
      <div
        className="
          w-full
          max-w-[1800px]
          mx-auto
          flex
          flex-col
          gap-3
        "
      >

        {/* ================================= */}
        {/* BANNER SECTION */}
        {/* ================================= */}

        <div
          className="
            relative
            w-full
          "
        >
          {loadingBanners ? (
            <div
              className="
                w-full
                h-full
                rounded-[20px]
                bg-white
                border
                border-[#e8e1d5]
                flex
                items-center
                justify-center
                text-sm
                text-[#756e63]
              "
            >
              Loading banner...
            </div>
          ) : banners.length === 0 ? (
            <div
              className="
                w-full
                h-full
                rounded-[20px]
                bg-white
                border
                border-[#e8e1d5]
                flex
                items-center
                justify-center
                text-sm
                text-[#756e63]
              "
            >
              No active banners available.
            </div>
          ) : (
            <div
              onClick={() =>
                navigate("/products")
              }
              className="
                relative
                w-full
                overflow-hidden
                cursor-pointer
                group
              "
            >

              {/* ================================= */}
              {/* BANNER IMAGE */}
              {/* ================================= */}

              <AnimatePresence mode="wait">
                <motion.picture
                  key={
                    activeBanner?._id ||
                    currentBanner
                  }
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="
                    block
                    w-full
                    h-auto
                  "
                >
                  {activeBanner?.mobileImage && (
                    <source
                      media="(max-width: 767px)"
                      srcSet={
                        activeBanner.mobileImage
                      }
                    />
                  )}

                  <img
                    src={
                      activeBanner?.desktopImage ||
                      activeBanner?.mobileImage
                    }
                    alt={`Banner ${
                      currentBanner + 1
                    }`}
                    className="
                      block
                      w-full
                      h-auto
                      object-contain
                      object-center
                    "
                  />
                </motion.picture>
              </AnimatePresence>

              {/* ================================= */}
              {/* SHOP COLLECTION */}
              {/* ================================= */}

              <div
                className="
                  absolute
                  right-4
                  bottom-4
                  z-20
                  hidden
                  md:flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-full
                  bg-[#173c2b]/90
                  text-white
                  text-xs
                  font-medium
                  backdrop-blur-md
                  shadow-lg
                  opacity-0
                  translate-y-2
                  group-hover:opacity-100
                  group-hover:translate-y-0
                  transition-all
                  duration-300
                "
              >
                Shop Collection

                <ArrowRight size={16} />
              </div>

              {/* ================================= */}
              {/* PREVIOUS BANNER */}
              {/* ================================= */}

              {banners.length > 1 && (
                <button
                  type="button"
                  onClick={
                    handlePreviousBanner
                  }
                  className="
                    absolute
                    left-3
                    md:left-5
                    top-1/2
                    -translate-y-1/2
                    z-40
                    w-8
                    h-8
                    md:w-10
                    md:h-10
                    rounded-full
                    bg-white/85
                    text-[#173c2b]
                    shadow-lg
                    hover:bg-white
                    transition
                    flex
                    items-center
                    justify-center
                  "
                  aria-label="Previous banner"
                >
                  <ChevronLeft size={18} />
                </button>
              )}

              {/* ================================= */}
              {/* NEXT BANNER */}
              {/* ================================= */}

              {banners.length > 1 && (
                <button
                  type="button"
                  onClick={
                    handleNextBanner
                  }
                  className="
                    absolute
                    right-3
                    md:right-5
                    top-1/2
                    -translate-y-1/2
                    z-40
                    w-8
                    h-8
                    md:w-10
                    md:h-10
                    rounded-full
                    bg-white/85
                    text-[#173c2b]
                    shadow-lg
                    hover:bg-white
                    transition
                    flex
                    items-center
                    justify-center
                  "
                  aria-label="Next banner"
                >
                  <ChevronRight size={18} />
                </button>
              )}

              {/* ================================= */}
              {/* BANNER DOTS */}
              {/* ================================= */}

              {banners.length > 1 && (
                <div
                  className="
                    absolute
                    bottom-3
                    left-1/2
                    -translate-x-1/2
                    z-40
                    flex
                    items-center
                    gap-1.5
                  "
                >
                  {banners.map(
                    (banner, index) => (
                      <button
                        key={
                          banner._id ||
                          index
                        }
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();

                          setCurrentBanner(
                            index
                          );
                        }}
                        className={`
                          rounded-full
                          transition-all
                          duration-300
                          ${
                            currentBanner ===
                            index
                              ? `
                                w-6
                                h-1.5
                                bg-white
                              `
                              : `
                                w-1.5
                                h-1.5
                                bg-white/60
                              `
                          }
                        `}
                        aria-label={`Go to banner ${
                          index + 1
                        }`}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================================= */}
        {/* PRODUCTS SECTION */}
        {/* ================================= */}

        <div
          className="
            relative
            w-full
            rounded-[20px]
            bg-[#f1ede5]
            border
            border-[#e2dacb]
            shadow-[0_8px_25px_rgba(50,45,35,0.06)]
            px-3
            py-4
            md:px-5
            md:py-4
          "
        >

          {/* ================================= */}
          {/* BACKGROUND */}
          {/* ================================= */}

          <div
            className="
              absolute
              inset-0
              rounded-[20px]
              bg-[radial-gradient(circle_at_15%_80%,rgba(210,180,130,0.14),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.85),transparent_30%)]
              pointer-events-none
            "
          />

          {/* ================================= */}
          {/* HEADER */}
          {/* ================================= */}

          <div
            className="
              relative
              z-10
              text-center
              mb-4
            "
          >
            <div
              className="
                flex
                items-center
                justify-center
                gap-1.5
                text-[#9a793e]
                mb-1
              "
            >
              <Sparkles size={11} />

              <span
                className="
                  text-[8px]
                  sm:text-[9px]
                  uppercase
                  tracking-[0.22em]
                  font-semibold
                "
              >
                Pure Goodness
              </span>

              <Sparkles size={11} />
            </div>

            <h2
              className="
                font-serif
                text-[#27463b]
                text-[21px]
                sm:text-[25px]
                md:text-[30px]
                font-semibold
                leading-tight
              "
            >
              Explore Our Products
            </h2>
          </div>

          {/* ================================= */}
          {/* PRODUCT CAROUSEL */}
          {/* ================================= */}

          <div
            className="
              relative
              w-full
              rounded-[20px]
              bg-[#f1ede5]
              border
              border-[#e2dacb]
              shadow-[0_8px_25px_rgba(50,45,35,0.06)]
              px-3
              py-4
              md:px-5
              md:py-4
            "
          >
            <div
              className="
                absolute
                inset-0
                rounded-[20px]
                bg-[radial-gradient(circle_at_15%_80%,rgba(210,180,130,0.14),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.85),transparent_30%)]
                pointer-events-none
              "
            />

           

            {products.length === 0 ? (
              <div className="relative z-10 w-full text-center py-8 text-sm text-[#756e63]">
                No products available.
              </div>
            ) : (
              <div className="relative z-10">
                {/* Carousel controls */}
                {productPageCount > 1 && (
                  <div className="flex items-center justify-end gap-2 mb-3">
                    <button
                      type="button"
                      onClick={handlePreviousProducts}
                      aria-label="Previous products"
                      className="
                        w-9 h-9 md:w-10 md:h-10 rounded-full
                        bg-white text-[#173c2b] border border-[#ddd4c6]
                        shadow-sm hover:bg-[#173c2b] hover:text-white
                        transition flex items-center justify-center
                      "
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={handleNextProducts}
                      aria-label="Next products"
                      className="
                        w-9 h-9 md:w-10 md:h-10 rounded-full
                        bg-[#173c2b] text-white border border-[#173c2b]
                        shadow-sm hover:bg-[#245740] transition
                        flex items-center justify-center
                      "
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-4
                    gap-3
                    md:gap-4
                  "
                >
                  {visibleProducts.map((product) => {
                    const productImage = product.images?.[0];

                    if (!productImage) return null;

                    const description =
                      product.description ||
                      "Wood pressed • Pure & natural";

                    const sellingPrice =
                      product?.variants?.[0]?.price ??
                      product?.price ??
                      0;

                    const cutPrice =
                      product?.variants?.[0]?.cutPrice ??
                      product?.cutPrice ??
                      null;

                    const hasCutPrice =
                      cutPrice !== null &&
                      cutPrice !== undefined &&
                      Number(cutPrice) > Number(sellingPrice);

                    return (
                      <div
                        key={product._id}
                        className="
                          group/product
                          min-w-0
                          rounded-[18px]
                          bg-[#fffdf9]
                          border
                          border-[#e3dbcf]
                          overflow-hidden
                          shadow-[0_6px_18px_rgba(70,60,45,0.08)]
                          transition-all duration-300
                          hover:-translate-y-1
                          hover:shadow-[0_12px_25px_rgba(70,60,45,0.12)]
                        "
                      >
                        <div className="flex items-center min-h-[120px] px-3 py-2.5 sm:px-4 md:min-h-[125px] lg:px-4">
                          <div className="flex items-center justify-center shrink-0 w-[28%] min-w-[75px] h-[105px] md:h-[110px]">
                            <img
                              src={productImage}
                              alt={product.title || "Product"}
                              className="
                                w-full h-full object-contain
                                transition-transform duration-300
                                group-hover/product:scale-105
                              "
                            />
                          </div>

                          <div className="flex-1 min-w-0 pl-3 md:pl-4">
                            <span className="block text-[7px] md:text-[8px] uppercase tracking-[0.18em] font-semibold text-[#987842] mb-1">
                              SattViva Naturals
                            </span>

                            <h3 className="font-serif text-[14px] sm:text-[15px] md:text-[17px] leading-snug font-semibold text-[#29463b] line-clamp-2">
                              {product.title}
                            </h3>

                            <p className="mt-1 text-[9px] md:text-[10px] leading-relaxed text-[#776f63] line-clamp-2">
                              {description}
                            </p>

                            <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
                              <span className="text-[17px] md:text-[19px] font-bold text-[#29463b]">
                                ₹{Number(sellingPrice).toLocaleString("en-IN")}
                              </span>

                              {hasCutPrice && (
                                <span className="text-[12px] md:text-[14px] font-medium text-[#9a948a] line-through">
                                  ₹{Number(cutPrice).toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => navigate(`/product/${product._id}`)}
                          className="
                            relative w-full flex items-center justify-center gap-2
                            py-2.5 md:py-3 bg-[#204b38] text-white
                            text-[10px] md:text-[11px] font-semibold
                            hover:bg-[#173c2b] transition-all duration-300
                          "
                        >
                          <ShoppingBag size={14} />
                          <span>Buy Now</span>
                          <ArrowRight
                            size={14}
                            className="
                              absolute right-4 transition-transform duration-300
                              group-hover/product:translate-x-1
                            "
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {productPageCount > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-4">
                    {Array.from({ length: productPageCount }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentProductPage(index)}
                        aria-label={`Show product set ${index + 1}`}
                        className={`h-1.5 rounded-full transition-all ${
                          currentProductPage === index
                            ? "w-6 bg-[#173c2b]"
                            : "w-1.5 bg-[#b8ad9d]"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;