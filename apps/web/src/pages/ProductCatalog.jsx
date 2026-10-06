import React, {
  useState,
  useMemo,
  useEffect,
} from "react";

import { Helmet } from "react-helmet";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  ShoppingCart,
  Star,
  PackageX,
  Loader2,
} from "lucide-react";

import ReactGA from "react-ga4";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

import {
  Button,
} from "@/components/ui/button";

const API =
  import.meta.env.VITE_API_URL;

// ==========================================
// PRODUCT CATEGORIES
// ==========================================

const categories = [
  "All",
  "Oils",
  "Dry Fruits",
  "Spices",
  "Health Punch",
];

// ==========================================
// PRODUCT CATALOG
// ==========================================

const ProductCatalog = () => {
  const navigate = useNavigate();

  const {
    category,
    subCategory,
  } = useParams();

  const { addToCart } = useCart();
  const { toast } = useToast();

  // ==========================================
  // STATE
  // ==========================================

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [addedProductId, setAddedProductId] =
    useState(null);

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("All");

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API}/products`
        );

        if (!response.ok) {
          throw new Error(
            "Unable to fetch products."
          );
        }

        const data =
          await response.json();

        setProducts(
          data.products || []
        );
      } catch (error) {
        console.error(
          "FETCH PRODUCTS ERROR:",
          error
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ==========================================
  // ACTIVE CATEGORY FROM URL
  // ==========================================

  useEffect(() => {
    if (!category) {
      setActiveCategory("All");
      return;
    }

    const categoryMap = {
      oils: "Oils",
      "dry-fruits": "Dry Fruits",
      spices: "Spices",
      "health-punch":
        "Health Punch",
    };

    setActiveCategory(
      categoryMap[category] || "All"
    );
  }, [category]);

  // ==========================================
  // CATEGORY CLICK
  // ==========================================

  const handleCategoryClick = (
    selectedCategory
  ) => {
    setActiveCategory(
      selectedCategory
    );

    const routes = {
      All: "/products",
      Oils: "/products/oils",
      "Dry Fruits":
        "/products/dry-fruits",
      Spices:
        "/products/spices",
      "Health Punch":
        "/products/health-punch",
    };

    navigate(
      routes[selectedCategory] ||
        "/products"
    );
  };

  // ==========================================
  // NORMALIZE CATEGORY
  // ==========================================

  const normalize = (
    value = ""
  ) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");
  };

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts = useMemo(() => {
    let filtered = [
      ...products,
    ];

    // CATEGORY FROM URL

    if (category) {
      filtered = filtered.filter(
        (product) =>
          normalize(
            product.category
          ) ===
          normalize(category)
      );
    }

    // CATEGORY FROM BUTTON

    else if (
      activeCategory !== "All"
    ) {
      filtered = filtered.filter(
        (product) =>
          normalize(
            product.category
          ) ===
          normalize(activeCategory)
      );
    }

    // SUBCATEGORY

    if (subCategory) {
      filtered = filtered.filter(
        (product) =>
          normalize(
            product.subcategory
          ) ===
          normalize(subCategory)
      );
    }

    return filtered;
  }, [
    products,
    category,
    subCategory,
    activeCategory,
  ]);

  // ==========================================
  // COMING SOON CATEGORIES
  // ==========================================

  const comingSoonCategories = [
    "dry-fruits",
    "spices",
    "health-punch",
  ];

  const isComingSoon =
    category &&
    comingSoonCategories.includes(
      category
    ) &&
    filteredProducts.length === 0;

  // ==========================================
  // GET PRODUCT PRICE
  // ==========================================

  const getProductPrice = (
    product
  ) => {
    return (
      product.variants?.[0]?.price ||
      product.price ||
      0
    );
  };

  // ==========================================
  // GET PRODUCT SIZE
  // ==========================================

  const getProductSize = (
    product
  ) => {
    return (
      product.variants?.[0]?.size ||
      product.size ||
      ""
    );
  };

  // ==========================================
  // GET PRODUCT STOCK
  // ==========================================

  const getProductStock = (
    product
  ) => {
    return (
      product.variants?.[0]?.stock ??
      product.stock ??
      0
    );
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = async (
    event,
    product
  ) => {
    event.preventDefault();

    event.stopPropagation();

    try {
      const defaultVariant =
        product.variants?.[0];

      const stock =
        getProductStock(product);

      const price =
        getProductPrice(product);

      const formattedProduct = {
        _id: product._id,

        title:
          product.title,

        image:
          product.images?.[0] ||
          "/images/logo.png",

        price,

        variants: [
          {
            _id:
              defaultVariant?._id ||
              product._id,

            id:
              defaultVariant?._id ||
              product._id,

            title:
              defaultVariant?.size ||
              "Default",

            size:
              defaultVariant?.size ||
              "",

            price,

            price_formatted:
              `₹${price}`,

            inventory_quantity:
              stock,

            manage_inventory:
              true,
          },
        ],
      };

      await addToCart(
        formattedProduct,
        formattedProduct.variants[0],
        1,
        stock
      );

      ReactGA.event(
        "add_to_cart",
        {
          currency: "INR",

          value: price,

          items: [
            {
              item_id:
                product._id,

              item_name:
                product.title,

              item_variant:
                getProductSize(
                  product
                ),

              price,

              quantity: 1,
            },
          ],
        }
      );

      setAddedProductId(
        product._id
      );

      setTimeout(() => {
        setAddedProductId(null);
      }, 1800);

      toast({
        title:
          "Added to Cart! 🛒",

        description:
          `${product.title} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        variant:
          "destructive",

        title:
          "Failed",

        description:
          error.message ||
          "Unable to add product to cart.",
      });
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <>
      <Helmet>
        <title>
          Shop Premium Products |
          SattViva Naturals
        </title>

        <meta
          name="description"
          content="Explore our complete collection of premium natural products."
        />
      </Helmet>

      <div
        className="
          min-h-screen
          bg-background

          pb-28
          md:pb-12
        "
      >
        {/* ====================================== */}
        {/* PAGE HEADER */}
        {/* ====================================== */}

        <section
          className="
            px-4
            sm:px-6
            lg:px-8

            pt-5
            pb-4

            md:pt-10
            md:pb-8
          "
        >
          <div
            className="
              max-w-7xl
              mx-auto

              md:text-center
            "
          >
            <motion.h1
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                heading-font

                text-3xl
                sm:text-4xl
                md:text-6xl

                font-bold

                leading-tight

                text-foreground
              "
            >
              Premium Collections
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
              }}
              className="
                mt-2

                text-sm
                sm:text-base
                md:text-lg

                text-muted-foreground

                max-w-3xl
                mx-auto

                leading-relaxed
              "
            >
              Discover natural,
              traditionally processed
              staples for your everyday
              wellness.
            </motion.p>
          </div>
        </section>

        {/* ====================================== */}
        {/* CATEGORY FILTER */}
        {/* NORMAL FLOW - NO MOBILE OVERLAP */}
        {/* ====================================== */}

        <section
          className="
            relative
            z-10

            w-full

            bg-background

            border-y
            border-border/50

            mb-5

            md:border-0
          "
        >
          <div
            className="
              max-w-7xl
              mx-auto

              px-4
              sm:px-6
              lg:px-8

              py-3
              md:py-4
            "
          >
            <div
              className="
                overflow-x-auto

                hide-scrollbar

                -mx-4
                px-4

                sm:mx-0
                sm:px-0
              "
            >
              <div
                className="
                  flex
                  items-center

                  gap-2

                  w-max
                  min-w-max
                "
              >
                {categories.map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        handleCategoryClick(
                          cat
                        )
                      }
                      className={`
                        shrink-0

                        rounded-full

                        px-5
                        py-2.5

                        text-sm
                        font-semibold

                        transition-all
                        duration-200

                        ${
                          activeCategory ===
                          cat
                            ? `
                              bg-secondary
                              text-secondary-foreground
                              shadow-md
                            `
                            : `
                              bg-card

                              text-muted-foreground

                              border
                              border-border

                              hover:text-foreground
                              hover:border-primary/40
                            `
                        }
                      `}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ====================================== */}
        {/* PRODUCTS */}
        {/* ====================================== */}

        <section
          className="
            max-w-7xl
            mx-auto

            px-3
            sm:px-6
            lg:px-8
          "
        >
          {/* ==================================== */}
          {/* LOADING */}
          {/* ==================================== */}

          {loading && (
            <div
              className="
                flex
                flex-col
                items-center
                justify-center

                py-24

                text-muted-foreground
              "
            >
              <Loader2
                className="
                  w-8
                  h-8

                  animate-spin

                  mb-3

                  text-primary
                "
              />

              <p>
                Loading products...
              </p>
            </div>
          )}

          {/* ==================================== */}
          {/* COMING SOON */}
          {/* ==================================== */}

          {!loading &&
            isComingSoon && (
              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center

                  text-center

                  py-16
                  md:py-24
                "
              >
                <img
                  src="/images/coming-soon.png"
                  alt="Coming Soon"
                  className="
                    w-64
                    sm:w-80
                    md:w-[500px]

                    max-w-full
                  "
                />

                <h2
                  className="
                    mt-6

                    text-3xl
                    md:text-5xl

                    font-bold

                    text-primary
                  "
                >
                  Coming Soon
                </h2>

                <p
                  className="
                    mt-3

                    text-sm
                    md:text-lg

                    text-muted-foreground

                    max-w-xl
                  "
                >
                  We're working hard to
                  bring premium products
                  to this category.
                </p>
              </div>
            )}

          {/* ==================================== */}
          {/* PRODUCT GRID */}
          {/* ==================================== */}

          {!loading &&
            !isComingSoon &&
            filteredProducts.length > 0 && (
              <AnimatePresence
                mode="wait"
              >
                <motion.div
                  key={`${category}-${subCategory}-${activeCategory}`}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="
                    grid

                    grid-cols-2
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4

                    gap-3
                    sm:gap-5
                    lg:gap-6
                  "
                >
                  {filteredProducts.map(
                    (
                      product,
                      index
                    ) => {
                      const price =
                        getProductPrice(
                          product
                        );

                      const stock =
                        getProductStock(
                          product
                        );

                      const size =
                        getProductSize(
                          product
                        );

                      const isOutOfStock =
                        stock <= 0;

                      const isAdded =
                        addedProductId ===
                        product._id;

                      return (
                        <motion.article
                          key={
                            product._id
                          }
                          initial={{
                            opacity: 0,
                            y: 15,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay:
                              Math.min(
                                index * 0.03,
                                0.3
                              ),
                          }}
                          className="
                            group

                            bg-card

                            rounded-2xl

                            border
                            border-border

                            overflow-hidden

                            shadow-sm

                            hover:shadow-xl
                            hover:-translate-y-1

                            transition-all
                            duration-300

                            flex
                            flex-col
                          "
                        >
                          {/* PRODUCT IMAGE */}

                          <Link
                            to={`/product/${product._id}`}
                            className="
                              relative
                              block

                              aspect-square

                              overflow-hidden

                              bg-muted/30
                            "
                          >
                            <img
                              src={
                                product
                                  .images?.[0] ||
                                "/images/logo.png"
                              }
                              alt={
                                product.title
                              }
                              loading="lazy"
                              className="
                                w-full
                                h-full

                                object-cover

                                transition-transform
                                duration-500

                                group-hover:scale-105
                              "
                            />

                            {size && (
                              <span
                                className="
                                  absolute

                                  left-2
                                  bottom-2

                                  px-2
                                  py-1

                                  rounded-full

                                  bg-background/95

                                  backdrop-blur

                                  text-[10px]
                                  sm:text-xs

                                  font-semibold

                                  shadow-sm
                                "
                              >
                                {size}
                              </span>
                            )}

                            {isOutOfStock && (
                              <span
                                className="
                                  absolute

                                  top-2
                                  right-2

                                  px-2
                                  py-1

                                  rounded-full

                                  bg-red-100
                                  text-red-700

                                  text-[9px]
                                  sm:text-[10px]

                                  font-bold
                                "
                              >
                                Out of Stock
                              </span>
                            )}
                          </Link>

                          {/* PRODUCT INFO */}

                          <div
                            className="
                              p-3
                              sm:p-4

                              flex
                              flex-col

                              flex-1
                            "
                          >
                            {/* RATING */}

                            {product.reviews >
                              0 && (
                              <div
                                className="
                                  flex
                                  items-center
                                  gap-1

                                  mb-1.5

                                  text-secondary
                                "
                              >
                                <Star
                                  className="
                                    w-3.5
                                    h-3.5

                                    fill-current
                                  "
                                />

                                <span
                                  className="
                                    text-xs
                                    font-semibold

                                    text-foreground
                                  "
                                >
                                  {Number(
                                    product.rating ||
                                      0
                                  ).toFixed(
                                    1
                                  )}
                                </span>

                                <span
                                  className="
                                    hidden
                                    sm:inline

                                    text-xs

                                    text-muted-foreground
                                  "
                                >
                                  (
                                  {
                                    product.reviews
                                  }
                                  )
                                </span>
                              </div>
                            )}

                            {/* TITLE */}

                            <Link
                              to={`/product/${product._id}`}
                            >
                              <h3
                                className="
                                  font-bold

                                  text-sm
                                  sm:text-base
                                  md:text-lg

                                  leading-snug

                                  text-foreground

                                  line-clamp-2

                                  min-h-[40px]
                                  sm:min-h-[48px]

                                  hover:text-primary

                                  transition-colors
                                "
                              >
                                {
                                  product.title
                                }
                              </h3>
                            </Link>

                            {/* DESCRIPTION */}

                            <p
                              className="
                                hidden
                                md:block

                                mt-2

                                text-sm

                                text-muted-foreground

                                line-clamp-2
                              "
                            >
                              {
                                product.description
                              }
                            </p>

                            {/* PRICE + BUTTON */}

                            <div
                              className="
                                mt-auto

                                pt-3
                                sm:pt-4

                                flex
                                flex-col

                                gap-2
                              "
                            >
                              <div
                                className="
                                  flex
                                  items-center
                                  justify-between
                                "
                              >
                                <span
                                  className="
                                    text-base
                                    sm:text-xl

                                    font-bold

                                    text-primary
                                  "
                                >
                                  ₹{price}
                                </span>

                                {isOutOfStock && (
                                  <span
                                    className="
                                      hidden
                                      md:inline

                                      text-xs
                                      font-semibold

                                      text-red-600
                                    "
                                  >
                                    Unavailable
                                  </span>
                                )}
                              </div>

                              <Button
                                onClick={(
                                  event
                                ) =>
                                  handleAddToCart(
                                    event,
                                    product
                                  )
                                }
                                disabled={
                                  isAdded ||
                                  isOutOfStock
                                }
                                className={`
                                  w-full

                                  h-10
                                  sm:h-11

                                  rounded-xl

                                  text-[10px]
                                  sm:text-xs

                                  font-bold

                                  uppercase

                                  tracking-wide

                                  transition-all

                                  ${
                                    isOutOfStock
                                      ? `
                                        bg-muted

                                        text-muted-foreground
                                      `
                                      : isAdded
                                      ? `
                                        bg-green-600

                                        hover:bg-green-600

                                        text-white
                                      `
                                      : `
                                        bg-secondary

                                        hover:bg-secondary/90

                                        text-secondary-foreground
                                      `
                                  }
                                `}
                              >
                                {isOutOfStock ? (
                                  <>
                                    <PackageX
                                      className="
                                        w-3.5
                                        h-3.5

                                        sm:mr-2
                                      "
                                    />

                                    <span
                                      className="
                                        hidden
                                        sm:inline
                                      "
                                    >
                                      Out of Stock
                                    </span>
                                  </>
                                ) : isAdded ? (
                                  <>
                                    Added ✓
                                  </>
                                ) : (
                                  <>
                                    <ShoppingCart
                                      className="
                                        w-3.5
                                        h-3.5

                                        sm:mr-2
                                      "
                                    />

                                    <span
                                      className="
                                        hidden
                                        sm:inline
                                      "
                                    >
                                      Add to Cart
                                    </span>

                                    <span
                                      className="
                                        sm:hidden
                                      "
                                    >
                                      Add
                                    </span>
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </motion.article>
                      );
                    }
                  )}
                </motion.div>
              </AnimatePresence>
            )}

          {/* ==================================== */}
          {/* EMPTY STATE */}
          {/* ==================================== */}

          {!loading &&
            !isComingSoon &&
            filteredProducts.length ===
              0 && (
              <div
                className="
                  text-center

                  py-20
                  md:py-28
                "
              >
                <PackageX
                  className="
                    w-12
                    h-12

                    mx-auto
                    mb-4

                    text-muted-foreground
                  "
                />

                <h2
                  className="
                    text-xl
                    font-bold
                  "
                >
                  No products found
                </h2>

                <p
                  className="
                    mt-2

                    text-sm

                    text-muted-foreground
                  "
                >
                  No products are
                  available in this
                  category right now.
                </p>
              </div>
            )}
        </section>
      </div>
    </>
  );
};

export default ProductCatalog;